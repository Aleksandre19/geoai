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

class Store:
    cur_prog_lang = {} # Code snippet's programming language
    saved_org_comments = {} # Save a original comments from the code snippet
    tokenized_snippet = {} # Save a tokenized code snippet with placeholder of comments.
    attached_comment = {} # Save a attached comment
    excluded_words = [] # Save a code snippet 

    def generate_place_holder(length=6):
        return str(uuid4().int)[-length:] 


class ExcludeCode:
    """
    This class takes a text, extracts a code snippet from it,
    tokenizes it, extracts comments from the tokinezed code snippet
    and replaice them the with the place holders, 
    wrapps hilighted text with the <span> element,
    wrapps the text with the paragraphs with the <p> element 
    and attache a comment to the text for translattion.
    
    """
    def __init__(self, text):
        self.text = text
        self.code = None
    
    @classmethod
    def to(cls, text):
        isinstance = cls(text)
        return isinstance.process()

    def process(self):
        # Exclude a code snippet from the text if it exists and grab a plain text.
        plain_text = ExtractCode.to(self.text)

        # Wrappe the snippets in the text with the <span> element and hilight them.
        highlighted = Highlight.to(plain_text)

        # Wrappe the text with the paragraphs with the <p> element.
        wrapped = WrapWithP.to(highlighted)

        # Attache a comment to the text for translattion.
        ready_for_translation = AttacheComment.to(wrapped)

        return ready_for_translation
    

class ExtractCode:
    """
    This class takes a text, extracts a code snippet from it,
    tokenizes it, extracts comments from the tokinezed code snippet 
    and replaice them the with the place holders.
    """
    def __init__(self, text):
        self.text = text

    @classmethod
    def to(cls, text):
        isinstance = cls(text)
        return isinstance.extract()

    # Extract a code snippet from the text.
    def extract(self):
        # Exclude a code snippet from the text if it exists and grab a plain text.
        plain_text = re.sub(r'```(.*?)```', self.re_func , self.text, flags=re.DOTALL)
        return plain_text

    # The functionn wich is being called by the re.sub() method each time it finds a match.
    def re_func(self, snippet):
        # Grab a code snippet from Regex match.
        code_snippet = snippet.group(1) 

        # Grab a programming language name.
        prog_lang_name = code_snippet.splitlines()[0] 

        # Save programming language name.
        Store.cur_prog_lang['name'] = prog_lang_name

        # Remove a language name from the beginning of the snippet.
        if code_snippet.startswith(Store.cur_prog_lang['name']):
            code_snippet = code_snippet.replace(Store.cur_prog_lang['name'], '', 1)

        # Tokenize the code snippet.
        tokenized = TokenizeText.to(code_snippet)

        # Replace the comments with the place holders.
        extracted = self.replace_comment_with_plcholder(tokenized)

        # Generate a place holder for the comments in the code snippet.
        placeholder = Store.generate_place_holder()

        # Save the code snippet with the place holder of the comments.
        Store.tokenized_snippet[placeholder] = extracted
   
        return placeholder

    # Loop through the tokenized code snippet and replace the comments with the place holders.
    def replace_comment_with_plcholder(self, tokenized):
        tokenized_with_placeholder = []
        for token_type, value in tokenized:
            if 'Comment' in str(token_type):
                place_holder = Store.generate_place_holder(length=10)
                Store.saved_org_comments[place_holder] = value
                value = place_holder
            tokenized_with_placeholder.append((token_type, value))
        return tokenized_with_placeholder
    
 
class TokenizeText:
    """"
    This class takes a code snippet, tokenizes it with PyGments lex method to be 
    posible to exclude comments from the code snippet for translation.
    """
    def __init__(self, code):
        self.code = code

    @classmethod
    def to(cls, code):
        isinstance = cls(code)
        return isinstance.tokenize()
    
    # Identify the lexer and tokenize the code snippet.
    def tokenize(self):
        # Identify the lexer for the current programming language.
        lexer = self.identify_lexer(Store.cur_prog_lang['name'])

        # Tokenize the code snippet.
        tokens = list(lex(self.code, lexer))
        return tokens  

    # Identify the lexer for the current programming language.
    def identify_lexer(self, prog_lang):
        # Dinamically import the lexer for the current programming language.
        lexer_instance = self.import_lexer_module(prog_lang)()

        # If not found, use the default guess_lexer().
        if lexer_instance is None:
            return guess_lexer(prog_lang)
        
        return lexer_instance
    
    # Import only lexer for the current programming language.
    def import_lexer_module(self, prog_lang):
        # Grab the current laxer's path string from lexers.py.
        class_path = Lexers.lexer.get(prog_lang, None)

        # Split the path string into module path and class name and import them.
        if class_path:
            module_name, class_name = class_path.rsplit('.', 1)
            module = importlib.import_module(module_name)
            if not module:
                return lambda: None
            lexer_class = getattr(module, class_name)
            return lexer_class
        
        # If not found, return empty function.
        return lambda: None


class Highlight:
    """
    This class takes a plain text, finds the words which are wrapped with the backsticks,
    and wraps them with the <span> element to highlight them.
    """
    def __init__(self, plain_text):
        self.plain_text = plain_text

    @classmethod
    def to(cls,plain_text):
        isinstance = cls(plain_text)
        return isinstance.wrap()

    # Find thw words which are wrapped with the backsticks.
    def wrap(self):
        return re.sub(r'`(.*?)`', self.wrap_func , self.plain_text, flags=re.DOTALL)
    
    # Wrappe the backsticks into text snippet with the <span> element.
    def wrap_func(self, text):
        Store.excluded_words.append(text.group(1))
        return f'<span class="bckstk-wrapper">{text.group(1)}</span>'


class WrapWithP:
    """
    This class takes a plain text and wraps it with the <p> element.
    """
    def __init__(self, plain_text):
        self.plain_text = plain_text

    @classmethod
    def to(cls, plain_text):
        isinstance = cls(plain_text)
        return isinstance.wrap()
    
    # Split the text by \n and wrappe them with the <p> element.
    def wrap(self):
        # Split the text by \n.
        splited_value = self.plain_text.splitlines()
        wrapped_by_p = []

        # Wrappe each line with the <p> element.
        for item in splited_value:
            if item and item not in Store.tokenized_snippet:
                wrapped_by_p.append(f'<p>{item}</p>')
            else:
                wrapped_by_p.append(f' {item} ') 

        # Reconstruct the text.                  
        reconstructed_value = ''
        for item in wrapped_by_p:
            reconstructed_value += item
        return reconstructed_value


class AttacheComment:
    """
    This class takes comments excluded from the code snippet,
    and attaches them to the text to be translated both at same time.
    """
    def __init__(self, wrapped):
        self.wrapped = wrapped

    @classmethod
    def to(cls, wrapped):
        isinstance = cls(wrapped)
        return isinstance.attache()
    
    # Save comment and combine it with the text.
    def attache(self):
       # Save original comments.
       comments = self.save_comment()

       # Combine a text and comment. 
       combined = f'{self.wrapped} \n {comments}' # Combine a text and comment.
       return combined 
    
    # Save original comments.
    def save_comment(self):
        Store.attached_comment.clear()
        Store.attached_comment['dict_name'] = Store.generate_place_holder(length=10) # Attached dict name.
        comments = f'{Store.attached_comment["dict_name"]} = {Store.saved_org_comments}'
        return comments



class IncludeCode:
    def __init__(self, text):
        self.text = text

    @classmethod
    def to(cls, text):
        isinstance = cls(text)
        return isinstance.process()
    
    def process(self):
        # Extract the comment from the trasnlated text.
        comment = ExtractComment.to(self.text)
        print('COMMENT ================')
        pprint.pprint(comment)


        """
        !!! Eveluating the dictionary here is not robust,
        brcause sometimes the Google Translator API changes the format
        and the ast.literal_eval(cleaned_dict) can not evaluate it. !!!
        """
        # Evaluate the comment as a dictionary.
        evaluated = EvaluateDict.to(comment)
        print('EVALUATED ================')
        pprint.pprint(evaluated)

        plain_text = PlainText.to(self.text)
        print('Plain Text ================')
        pprint.pprint(plain_text)

        result = EmbedComment.to(plain_text, evaluated)
        print('EMBEDDED ================')
        pprint.pprint(result)

        return result


class ExtractComment:
    def __init__(self, text):
        self.text = text

    @classmethod
    def to(cls, text):
        isinstance = cls(text)
        return isinstance.extract()
    
    def extract(self):
        pattern = f'{Store.attached_comment["dict_name"]} = {{.*}}'
        match = re.search(pattern, self.text, re.DOTALL)
        if match:
            # Extract the dictionary string
            comment_dict = match.group()

            # Grab grab the comment's dictionary. 
            comment_value = comment_dict.split('=', 1)[1].strip()
            return comment_value


class EvaluateDict:
    def __init__(self, comment):
        self.comment = comment

    @classmethod
    def to(cls, comment):
        isinstance = cls(comment)
        return isinstance.evaluate()
    
    def evaluate(self):
        cleaned_dict = self.comment.replace('\u200B', '')
        evaluated = ast.literal_eval(cleaned_dict)
        return evaluated


class PlainText:
    def __init__(self, text):
        self.text = text

    @classmethod
    def to(cls, text):
        isinstance = cls(text)
        return isinstance.extract()
    
    def extract(self):
        pattern = f'{Store.attached_comment["dict_name"]} = {{.*}}'
        text = re.sub(pattern, '', self.text, flags=re.DOTALL)
        return text


class EmbedComment:
    def __init__(self, text, comment):
        self.text = text
        self.comment = comment

    @classmethod
    def to(cls, text, comment):
        isinstance = cls(text, comment)
        return isinstance.embed()
    
    def embed(self):
        for key, snippet in Store.tokenized_snippet.items():
            swapped = self.swapp_values(self.comment, snippet)
            pigmentized = self.formate_snippet(swapped)
            self.text = self.text.replace(key, pigmentized)
        
        self.clean_dict()
        return self.text

    def swapp_values(self, comment, snippet):
        output = []
        for token,value in snippet:
            if value in comment:
                value = comment[value]
            output.append((token, value))
        return output
    
    def formate_snippet(self, snippet):
        output = ''
        formatter = HtmlFormatter(linenos=True)
        output = format(snippet, formatter)
        return output
    
    def clean_dict(self):
        Store.cur_prog_lang = {} # Code snippet's programming language
        Store.saved_org_comments = {} # Save a original comments from the code snippet
        Store.tokenized_snippet = {} # Save a tokenized code snippet with placeholder of comments.



# attached_comment_name = {} # Save a attached comment
# tokenized_snippet = {}
# excluded_words = []
# def exclude_code(text):
#     pprint.pprint(text)
#     # Text without code snippet. 
#     result = re.sub(r'```(.*?)```', set_placeholder , text, flags=re.DOTALL)
#     # Wrappe the backsticks into code snippet with the <span> element.
#     backstciks = re.sub(r'`(.*?)`', wrap_backsticks , result, flags=re.DOTALL)
#     # Split the text by \n and wrappe them with the <p> element.
#     wrapped = wrap_with_p(backstciks)
#     # Attache a comment to the text for translattion.
#     attached_comment_name.clear()
#     attached_comment_name['dict_name'] = generate_place_holder() # Attached dict name.
#     comments = f'{attached_comment_name["dict_name"]} = {saved_comments}'  
#     text = f'{wrapped} \n {comments}' # Combine a text and comment.
#     # return text
#     return {
#         'text': text,
#         'excluded_words': excluded_words,
#     }


# """
# This function saves matches, sets a place holder
# and returns it. 
# """
# def set_placeholder(snippet):
#     snippet_with_placeholder = exclud_comments(snippet.group(1))
#     place_holder = generate_place_holder()
#     tokenized_snippet[place_holder] = snippet_with_placeholder  
#     return place_holder



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


# """
# This function generates a unique place holder.
# """
# def generate_place_holder():
#     return str(uuid4().int)[-6:]

# """
# This function takes text without code snippet,
# findes backsticks (`) into text and
# wrappes them with <span> element.
# """
# def wrap_backsticks(text):
#     excluded_words.append(text.group(1))
#     return f'<span class="bckstk-wrapper">{text.group(1)}</span>'


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


# """
# This function uses the Pygments lex method to tokenize the text.
# """
# def tokeneaze(snippet):
#     lexer = identify_lexer(current_pr_lang['name'])
#     tokens = list(lex(snippet, lexer))
#     return tokens


# """
# This function receives the current programming language name,
# imports it's lexer and if the lexer has not been found,
# it uses the guess_lexer().
# """
# def identify_lexer(pr_lang):
#     lexer_instance = import_lexer_module(pr_lang)()
#     if lexer_instance is None:
#         return guess_lexer(pr_lang)
#     return lexer_instance


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


# """
# This function receives the current programming language name,
# grabs it's path string from Lexers.lexer,
# separates the module path and the class name
# and imports them.
# """
# def import_lexer_module(pr_lang):
#     test_laxer_import() # This is just for testing purpose.
#     # Grab the current laxer's path string.
#     class_path = Lexers.lexer.get(pr_lang, None)
    
#     if class_path:
#         module_name, class_name = class_path.rsplit('.', 1)
#         module = importlib.import_module(module_name)
#         if not module:
#             return lambda: None
#         lexer_class = getattr(module, class_name)
#         return lexer_class
#     return lambda: None


# """
# This function parses the lexer dictionary,
# finds which modules cannnot be imported,
# stores not imported modules in dictionary
# and prints them in terminal.
# """
# def test_laxer_import():
#     not_imported = {}
#     for key,value in Lexers.lexer.items():      
#         module_name, class_name = value.rsplit('.', 1)
#         if module_name not in sys.modules:
#             try:
#                 importlib.import_module(module_name)
#             except ImportError:
#                 not_imported[key] = value

#     print('NOT IMPORTED ================')
#     pprint.pprint(not_imported)


# """
# This function formates a code snippet from the text
# by using the Pygments python package.
# """
# def pygmentize_snippet(snippet):
#     formatter = HtmlFormatter(linenos=True) 
#     # this needs to me removed because snippet is already lexered in the begonnig. 
#     lexer = guess_lexer(snippet)
#     return highlight(snippet, lexer, formatter)


# """
# This function takes a translated text as a parameter,
# parsses it, finds the dictionary with comments (attached for the translation),
# grabs it, eveluates it as a dictionary and finally returns it. 
# """
# def translated_comment(text):
#     pattern = f'{attached_comment_name["dict_name"]} = {{.*}}'
#     match = re.search(pattern, text, re.DOTALL)
#     if match:
#         # Extract the dictionary string
#         dict_assignment = match.group()
#         dict_string = dict_assignment.split('=', 1)[1].strip()  # remove the variable name
#         cleaned_dict = dict_string.replace('\u200B', '')
#         trs_comment = ast.literal_eval(cleaned_dict)
#         return trs_comment
#     else:
#         logger.error("There is no match in the text.")


# """
# This function receives the trasnlated and original comments
# and replaces the original ones with the translated.
# """
# def swapp_values(trs_comment, snippet):
#     output = []
#     for tkey,tvalue in snippet:
#         if tvalue in trs_comment:
#             tvalue = trs_comment[tvalue]
#         output.append((tkey, tvalue))
#     return output


# """
# This function uses the Pygments format method to format a code snippet.
# """
# def formate_snippet(snippet):
#     output = ''
#     formatter = HtmlFormatter(linenos=True)
#     output = format(snippet, formatter)
#     return output


# """
# This function removes the dictionary of comments,
# which was attached for translation,
# from the already translated text.
# """
# def remove_snippet_from_text(text):
#     pattern = f'{attached_comment_name["dict_name"]} = {{.*}}'
#     text = re.sub(pattern, '', text, flags=re.DOTALL)
#     return text


# """
# This function replace the place holder with the saved code snippet.
# """
# def include_back_code(text):
#     trs_comment = translated_comment(text)
#     text = remove_snippet_from_text(text)
#     for skey,svalue in tokenized_snippet.items():
#         swapped = swapp_values(trs_comment, svalue)
#         pigmentized = formate_snippet(swapped)
#         text = text.replace(skey, pigmentized)
#     tokenized_snippet.clear()
#     saved_comments.clear()
#     current_pr_lang.clear()
#     return text


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



