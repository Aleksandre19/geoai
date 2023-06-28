import logging

#from django.http import Http404
from django.core.cache import cache

#from django.utils.html import format_html, escape

from uuid import uuid4
import re
import ast

from pygments import highlight, lex, format
from pygments.lexers import guess_lexer, PythonLexer, CLexer
from pygments.formatters import HtmlFormatter
# from pygments.styles import get_style_by_name

import pprint

logger = logging.getLogger(__name__)


attached_comment_name = {} # Save a attached comment
test_attached_comment_name = {}
not_tokenized_snippet = {}
tokenized_snippet = {}


"""
This function receives a text, grabs code snippet,
wrappes rest of the text with <p> elements,
attaches comment dict(grabed from the code snippet) for translation
and returns the text.
"""
def exclude_code(text):
    # Text without code snippet. 
    result = re.sub(r'```(.*?)```', set_placeholder , text, flags=re.DOTALL)
    # Split the text by \n and wrappe them with the <p> element.
    wrapped = wrap_with_p(result)
    # Attache a comment to the text for translattion.
    attached_comment_name.clear()
    attached_comment_name['dict_name'] = generate_place_holder() # Attached dict name.
    comments = f'{attached_comment_name["dict_name"]} = {saved_comments}'  
    text = f'{wrapped} \n {comments}' # Combine a text and comment.
    return text


"""
This function saves matches, sets a place holder
and returns it. 
"""
def set_placeholder(snippet):
    snippet_with_placeholder = exclud_comments(snippet.group(1))
    place_holder = generate_place_holder()
    not_tokenized_snippet[place_holder] = snippet.group(1)
    tokenized_snippet[place_holder] = snippet_with_placeholder  
    return place_holder


"""
This function receives a code snippet as a parameter,
tokenizes it, grabs the comments, and stores them into a dictionary.
"""
saved_comments = {}
def exclud_comments(snippet):
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
This function uses the Pygments lex method to tokenize a text.
"""
def tokeneaze(snippet):
    tokens = list(lex(snippet, CLexer()))
    return tokens


"""
This function takes a text, breakes it into lines
and wrappes each line with the <p> element.
"""
def wrap_with_p(text):
    splited_value = text.splitlines()
    wrapped_by_p = []
    for item in splited_value:
        if item and item not in not_tokenized_snippet:
            wrapped_by_p.append(f'<p>{item}</p>')
        else:
            wrapped_by_p.append(f' {item} ')
            
    reconstructed_value = ''
    for item in wrapped_by_p:
        reconstructed_value += item
    return reconstructed_value


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
This function generates a unique place holder.
"""
def generate_place_holder():
    return str(uuid4().int)[-6:]


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
    not_tokenized_snippet.clear()
    saved_comments.clear()
    return text


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