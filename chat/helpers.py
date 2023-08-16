import ast
import importlib
import logging
import pprint
import re
import sys

from django.http import Http404
from django.core.cache import cache
from django.utils.html import format_html, escape

from pygments import highlight, lex, format
from pygments.lexers import guess_lexer
from pygments.styles import get_style_by_name
from pygments.formatters import HtmlFormatter
from uuid import uuid4

from .lexers import Lexers



logger = logging.getLogger(__name__)


"""
This function receives a text, grabs code snippet,
wrappes rest of the text with <p> elements,
attaches comment dict(grabed from the code snippet) for translation
and returns the text.
"""

class Store:
    cur_prog_lang = {} # Code snippet's programming language.
    saved_org_comments = {} # Save a original comments from the code snippet.
    tokenized_snippet = {} # Save a tokenized code snippet with placeholder of comments.
    attached_comment = {} # Save a attached comment.
    excluded_words = [] # Save a code snippet.
    current_lexer = None # Save a current lexer.

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

        # Save the current lexer.
        Store.current_lexer = lexer_instance

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
    """
    This class takes a translated text, extracts the translated comments from it,
    evaluates it as a dictionary, extracts the plain text from the translated text,
    and embeds the translated comments into the plain text and returns it.
    """
    def __init__(self, text):
        self.text = text

    @classmethod
    def to(cls, text):
        isinstance = cls(text)
        return isinstance.process()
    
    def process(self):
        # Extract the comment from the trasnlated text.
        comment = ExtractComment.to(self.text)

        """
        !!! Eveluating the dictionary here is not robust,
        brcause sometimes the Google Translator API changes the format
        and the ast.literal_eval(cleaned_dict) can not evaluate it. !!!
        """
        # Evaluate the comment as a dictionary.
        evaluated = EvaluateDict.to(comment)

        # Extract the plain text from the translated text.
        plain_text = PlainText.to(self.text)

        # Embed the comment into the plain text.
        result = EmbedComment.to(plain_text, evaluated)

        return result


class ExtractComment:
    """
    This class takes a translated text and extracts
    the translated comment from it.
    """
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
    """
    This class takes a dictionary as a string and evaluates it.
    """
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
    """
    This class takes a translated text, extracts the plain text from it.
    """
    def __init__(self, text):
        self.text = text

    @classmethod
    def to(cls, text):
        isinstance = cls(text)
        return isinstance.extract()
    
    # Find a plain text.
    def extract(self):
        pattern = f'{Store.attached_comment["dict_name"]} = {{.*}}'
        text = re.sub(pattern, '', self.text, flags=re.DOTALL)
        return text


class EmbedComment:
    """
    This class takes translated comments, swaps place holeders with them in
    the saved code snippet and finally in the plain text replaces
    the place holders with the this updated code snippet.
    """
    def __init__(self, text, comment):
        self.text = text
        self.comment = comment

    @classmethod
    def to(cls, text, comment):
        isinstance = cls(text, comment)
        return isinstance.embed()
    
    # Grab saved code snippet, replace palce holder with
    # the translated comments and format the code snippet.
    def embed(self):
        for key, snippet in Store.tokenized_snippet.items():
            swapped = self.swapp_values(self.comment, snippet)
            pigmentized = self.formate_snippet(swapped)
            self.text = self.text.replace(key, pigmentized)
        
        self.clean_dict()
        return self.text

    # Replace the place holder with the translated
    # comments in the saved code snippet.
    def swapp_values(self, comment, snippet):
        output = []
        for token,value in snippet:
            if value in comment:
                value = comment[value]
            output.append((token, value))
        return output
    
    # Format the code snippet by Pygments formater.
    def formate_snippet(self, snippet):
        # Convert to string.
        detokenized = ''.join(value for token, value in snippet)

        # Get the Pygments formater.
        formatter = HtmlFormatter(linenos=True)

        # Format the code snippet.
        output = highlight(detokenized, Store.current_lexer, formatter)
        
        return output
    
        # Print the PyGments formatters style in terminal.
        # style = get_style_by_name('solarized-dark')
        # styel_form = HtmlFormatter(style=style, linenos=True)
        # print('Formatter Style ============ ')
        # pprint.pprint(styel_form.get_style_defs('.highlight'))
    
    # Clear the dictionaries.
    def clean_dict(self):
        Store.cur_prog_lang.clear()
        Store.saved_org_comments.clear()
        Store.tokenized_snippet.clear()



class ConvertText:
    """
    This class takes a text(Georgian), breakes it into letters
    and swaps them by English letters.
    """
    def __init__(self, text):
        self.text = text
        self.letters = self.geo_eng_map()

    @classmethod
    def to_eng(cls, text):
        isinstance = cls(text)
        return isinstance.convert()

    def convert(self):
        result = ''
        for char in self.text.lower():
            if char in self.letters:
                result += self.letters[char]
        return result

    def geo_eng_map(self):
        return {
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
