import logging
import importlib
import sys
import re
import ast
import pprint

from django.http import Http404
from django.core.cache import cache

from django.utils.html import format_html, escape

from uuid import uuid4

from .lexers import Lexers
from pygments import highlight, lex, format
from pygments.lexers import guess_lexer
from pygments.formatters import HtmlFormatter
# from pygments.styles import get_style_by_name

logger = logging.getLogger(__name__)


"""
This function receives a text, grabs code snippet,
wrappes rest of the text with <p> elements,
attaches comment dict(grabed from the code snippet) for translation
and returns the text.
"""
class MainHelper:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self.__dict__:
            self.cur_prog_lang = {} # Code snippet's programming language
            self.saved_org_comments = {} # Save a original comments from the code snippet
            self.attached_comment_name = {} # Save a attached comment
            self.tokinized_snippet = {} # Save a code snippet
            self.excluded_words = [] # Save a code snippet

    def generate_place_holder(self, length=6):
        return str(uuid4().int)[-length:]
    

class ExcludeCode(MainHelper):
    def __init__(self, text):
        super().__init__()
        self.text = text
        self.code = None    

    @classmethod
    def to(cls, text):
        instance = cls(text)
        return instance.process()
    
    def process(self):
        plain_text = ExtractCode.to(self.text)
        return plain_text
    


class ExtractCode(MainHelper):
    def __init__(self, text):
        super().__init__()
        self.text = text
        
    @classmethod
    def to(cls, text):
        instance = cls(text)
        return instance.extract()

    def extract(self):
        plain_text = re.sub(r'```(.*?)```', self.re_func , self.text, flags=re.DOTALL)
        return plain_text

    def re_func(self, snippet):
        code_snippet = snippet.group(1) # Grab a code snippet from Regex match.
        prog_lang_name = code_snippet.splitlines()[0] # Grab a programming language name.

        # Save programming language name.
        self.cur_prog_lang['name'] = prog_lang_name

        # Remove a language name from the beginning of the snippet.
        if code_snippet.startswith(self.cur_prog_lang['name']):
            code_snippet = code_snippet.replace(self.cur_prog_lang['name'], '', 1)

        # Tokenize the code snippet.
        tokenized = TokenizeText.to(code_snippet)

        # Replace the comments with the place holders.
        extracted = self.replace_comment_with_plcholder(tokenized) 

        return extracted

    # Replace the comments with the place holders and save them.
    def replace_comment_with_plcholder(self, tokenized):
        tokenized_with_placeholder = []
        for token_type, value in tokenized:
            if 'Comment' in str(token_type):
                place_holder = self.generate_place_holder(lenght=6)
                self.saved_org_comments[place_holder] = value
                value = place_holder
            tokenized_with_placeholder.append((token_type, value))
        return tokenized_with_placeholder
    
 
class TokenizeText(MainHelper):
    def __init__(self, code):
        super().__init__()
        self.code = code
        

    @classmethod
    def to(cls, code):
        instance = cls(code)
        return instance.tokenize()

    def tokenize(self):
        print('=========== self.cur_prog_lang in Tokinaizer')
        pprint.pprint(self.cur_prog_lang)
        lexer = self.identify_lexer(self.cur_prog_lang['name'])
        tokens = list(lex(self.code, lexer))
        return tokens  

    def identify_lexer(self, prog_lang):
        lexer_instance = self.import_lexer_module(prog_lang)()
        if lexer_instance is None:
            return guess_lexer(prog_lang)
        return lexer_instance
    
    # Import only lexer for the current programming language.
    def import_lexer_module(self, prog_lang):
        class_path = Lexers.lexer.get(prog_lang, None)
    
        if class_path:
            module_name, class_name = class_path.rsplit('.', 1)
            module = importlib.import_module(module_name)
            if not module:
                return lambda: None
            lexer_class = getattr(module, class_name)
            return lexer_class
        return lambda: None



attached_comment_name = {} # Save a attached comment
tokenized_snippet = {}
excluded_words = []
def exclude_code(text):
    # Text without code snippet. 
    result = re.sub(r'```(.*?)```', set_placeholder , text, flags=re.DOTALL)
    # Wrappe the backsticks into code snippet with the <span> element.
    backstciks = re.sub(r'`(.*?)`', wrap_backsticks , result, flags=re.DOTALL)
    # Split the text by \n and wrappe them with the <p> element.
    wrapped = wrap_with_p(backstciks)
    # Attache a comment to the text for translattion.
    attached_comment_name.clear()
    attached_comment_name['dict_name'] = generate_place_holder() # Attached dict name.
    comments = f'{attached_comment_name["dict_name"]} = {saved_comments}'  
    text = f'{wrapped} \n {comments}' # Combine a text and comment.
    # return text
    return {
        'text': text,
        'excluded_words': excluded_words,
    }


"""
This function saves matches, sets a place holder
and returns it. 
"""
def set_placeholder(snippet):
    snippet_with_placeholder = exclud_comments(snippet.group(1))
    place_holder = generate_place_holder()
    tokenized_snippet[place_holder] = snippet_with_placeholder  
    return place_holder



"""
This function receives a code snippet as a parameter,
tokenizes it, grabs the comments, and stores them into a dictionary.
"""
saved_comments = {}
current_pr_lang = {}
def exclud_comments(snippet):
    # Store programming language name.
    current_pr_lang['name'] = snippet.splitlines()[0] 
    # Remove a language name from the beginning of the snippet.
    if snippet.startswith(current_pr_lang['name']):
        snippet = snippet.replace(current_pr_lang['name'], '', 1)
        
    tokenized = tokeneaze(snippet)
    tokenized_with_placeholder = []
    for token_type, value in tokenized:
        if 'Comment' in str(token_type):
            place_holder = generate_place_holder()
            saved_comments[place_holder] = value
            value = place_holder
        tokenized_with_placeholder.append((token_type, value))
    return tokenized_with_placeholder


"""
This function generates a unique place holder.
"""
def generate_place_holder():
    return str(uuid4().int)[-6:]

"""
This function takes text without code snippet,
findes backsticks (`) into text and
wrappes them with <span> element.
"""
def wrap_backsticks(text):
    excluded_words.append(text.group(1))
    return f'<span class="bckstk-wrapper">{text.group(1)}</span>'


"""
This function takes a text, breakes it into lines
and wrappes each line with the <p> element.
"""
def wrap_with_p(text):
    splited_value = text.splitlines()
    wrapped_by_p = []
    for item in splited_value:
        if item and item not in tokenized_snippet:
            wrapped_by_p.append(f'<p>{item}</p>')
        else:
            wrapped_by_p.append(f' {item} ')
            
    reconstructed_value = ''
    for item in wrapped_by_p:
        reconstructed_value += item
    return reconstructed_value


# """
# This function receives a code snippet as a parameter,
# tokenizes it, grabs the comments, and stores them into a dictionary.
# """
# saved_comments = {}
# current_pr_lang = {}
# def exclud_comments(snippet):
#     # Store programming language name.
#     current_pr_lang['name'] = snippet.splitlines()[0] 
#     # Remove a language name from the beginning of the snippet.
#     if snippet.startswith(current_pr_lang['name']):
#         snippet = snippet.replace(current_pr_lang['name'], '', 1)
        
#     tokenized = tokeneaze(snippet)
#     tokenized_with_placeholder = []
#     for token_type, value in tokenized:
#         if 'Comment' in str(token_type):
#             place_holder = generate_place_holder()
#             saved_comments[place_holder] = value
#             value = place_holder
#         tokenized_with_placeholder.append((token_type, value))
#     return tokenized_with_placeholder


"""
This function uses the Pygments lex method to tokenize the text.
"""
def tokeneaze(snippet):
    lexer = identify_lexer(current_pr_lang['name'])
    tokens = list(lex(snippet, lexer))
    return tokens


"""
This function receives the current programming language name,
imports it's lexer and if the lexer has not been found,
it uses the guess_lexer().
"""
def identify_lexer(pr_lang):
    lexer_instance = import_lexer_module(pr_lang)()
    if lexer_instance is None:
        return guess_lexer(pr_lang)
    return lexer_instance


# """
# This function takes a text, breakes it into lines
# and wrappes each line with the <p> element.
# """
# def wrap_with_p(text):
#     splited_value = text.splitlines()
#     wrapped_by_p = []
#     for item in splited_value:
#         if item and item not in tokenized_snippet:
#             wrapped_by_p.append(f'<p>{item}</p>')
#         else:
#             wrapped_by_p.append(f' {item} ')
            
#     reconstructed_value = ''
#     for item in wrapped_by_p:
#         reconstructed_value += item
#     return reconstructed_value


"""
This function receives the current programming language name,
grabs it's path string from Lexers.lexer,
separates the module path and the class name
and imports them.
"""
def import_lexer_module(pr_lang):
    test_laxer_import() # This is just for testing purpose.
    # Grab the current laxer's path string.
    class_path = Lexers.lexer.get(pr_lang, None)
    
    if class_path:
        module_name, class_name = class_path.rsplit('.', 1)
        module = importlib.import_module(module_name)
        if not module:
            return lambda: None
        lexer_class = getattr(module, class_name)
        return lexer_class
    return lambda: None


"""
This function parses the lexer dictionary,
finds which modules cannnot be imported,
stores not imported modules in dictionary
and prints them in terminal.
"""
def test_laxer_import():
    not_imported = {}
    for key,value in Lexers.lexer.items():      
        module_name, class_name = value.rsplit('.', 1)
        if module_name not in sys.modules:
            try:
                importlib.import_module(module_name)
            except ImportError:
                not_imported[key] = value

    print('NOT IMPORTED ================')
    pprint.pprint(not_imported)


# """
# This function formates a code snippet from the text
# by using the Pygments python package.
# """
# def pygmentize_snippet(snippet):
#     formatter = HtmlFormatter(linenos=True) 
#     # this needs to me removed because snippet is already lexered in the begonnig. 
#     lexer = guess_lexer(snippet)
#     return highlight(snippet, lexer, formatter)


"""
This function takes a translated text as a parameter,
parsses it, finds the dictionary with comments (attached for the translation),
grabs it, eveluates it as a dictionary and finally returns it. 
"""
def translated_comment(text):
    pattern = f'{attached_comment_name["dict_name"]} = {{.*}}'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        # Extract the dictionary string
        dict_assignment = match.group()
        dict_string = dict_assignment.split('=', 1)[1].strip()  # remove the variable name
        cleaned_dict = dict_string.replace('\u200B', '')
        trs_comment = ast.literal_eval(cleaned_dict)
        return trs_comment
    else:
        logger.error("There is no match in the text.")


"""
This function receives the trasnlated and original comments
and replaces the original ones with the translated.
"""
def swapp_values(trs_comment, snippet):
    output = []
    for tkey,tvalue in snippet:
        if tvalue in trs_comment:
            tvalue = trs_comment[tvalue]
        output.append((tkey, tvalue))
    return output


"""
This function uses the Pygments format method to format a code snippet.
"""
def formate_snippet(snippet):
    output = ''
    formatter = HtmlFormatter(linenos=True)
    output = format(snippet, formatter)
    return output


"""
This function removes the dictionary of comments,
which was attached for translation,
from the already translated text.
"""
def remove_snippet_from_text(text):
    pattern = f'{attached_comment_name["dict_name"]} = {{.*}}'
    text = re.sub(pattern, '', text, flags=re.DOTALL)
    return text


"""
This function replace the place holder with the saved code snippet.
"""
def include_back_code(text):
    trs_comment = translated_comment(text)
    text = remove_snippet_from_text(text)
    for skey,svalue in tokenized_snippet.items():
        swapped = swapp_values(trs_comment, svalue)
        pigmentized = formate_snippet(swapped)
        text = text.replace(skey, pigmentized)
    tokenized_snippet.clear()
    saved_comments.clear()
    current_pr_lang.clear()
    return text


# """
# This function takes text without code snippet,
# findes backsticks (`) into text and
# wrappes them with <span> element.
# """
# def wrap_backsticks(text):
#     excluded_words.append(text.group(1))
#     return f'<span class="bckstk-wrapper">{text.group(1)}</span>'


"""
This function takes a text(Georgian), breakes it into letters
and replace them by English letters.
"""
def convertToEng(text):
    result = ''
    for char in text.lower():
        if char in georgianToEng:
            result += georgianToEng[char]
    return result


"""
This dictionary maps the Georgian alphabet to English alphabet.
"""
georgianToEng = {
    'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',
    'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',
    'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',
    'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh',
    'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',
    'ჯ': 'j', 'ჰ': 'h', ' ': ' '
}


"""
This function generates a key for the caching
and caches topics by the users.
"""
def add_to_cache(topic):
    topic_cache_key = f"topic_{topic.pk}"
    sentinel = object()
    get_cached_topics = cache.get("topics_by_user", sentinel, 1)
    # Initiate a new diictionary if the cache is empty.
    if get_cached_topics is sentinel:
        get_cached_topics = {}
    get_cached_topics[topic_cache_key] = topic
    cache.set("topics_by_user", get_cached_topics, 1)



