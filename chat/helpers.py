from django.http import Http404
from django.core.cache import cache

from django.utils.html import format_html, escape

from uuid import uuid4
import re

from pygments import highlight
from pygments.lexers import guess_lexer
from pygments.formatters import HtmlFormatter
# from pygments.styles import get_style_by_name

# import pprint

"""
This function takes text, finds piece of text surounded by the ```
and replace it with <code> element.
"""
# def text_format(value):
#    # Wrapping with the <code>.
#    value = escape(value)
#    codePrefix = format_html('<code class="answer-code-block">')
#    codeSuffix = format_html('</code>')
#    formatted_value = format_html('{}', value)
#    finall_resul = wrap_with_p(formatted_value)
#    content = re.sub(r'<p>```(.*?)```</p>', f'{codePrefix}\\1{codeSuffix}', finall_resul, flags=re.DOTALL)
#    return content


"""
This function finds a ``` in the text and
at the each match calls the function set_placeholder.
"""
def exclude_code(text):
    result = re.sub(r'```(.*?)```', set_placeholder , text, flags=re.DOTALL)
    wrapped = wrap_with_p(result)
    return wrapped


"""
This function saves matches, sets a place holder
and returns it. 
"""
save_code_snippet = {}
def set_placeholder(snippet):  
    pygmentized = pygmentize_snippet(snippet.group(1))
    place_holder = generate_place_holder()
    save_code_snippet[place_holder] = pygmentized
    return place_holder


"""
This function takes a text, breakes it into lines
and wrappes each line with the <p> element.
"""
def wrap_with_p(text):
    splited_value = text.splitlines()
    wrapped_by_p = []
    for item in splited_value:
        if item and item not in save_code_snippet:
            wrapped_by_p.append(f'<p>{item}</p>')
        else:
            wrapped_by_p.append(f' {item} ')
            
    reconstructed_value = ''
    for item in wrapped_by_p:
        reconstructed_value += item
    return reconstructed_value


"""
This function formates a code snippet from the text
by using the Pygments python package.
"""
def pygmentize_snippet(snippet):
    formatter = HtmlFormatter(linenos=True)  
    lexer = guess_lexer(snippet)
    return highlight(snippet, lexer, formatter)


"""
This function generates a unique place holder.
"""
def generate_place_holder():
    return str(uuid4())


"""
This function replace the place holder with the saved code snippet.
"""
def include_back_code(text):
    for key,value in save_code_snippet.items():
        text = text.replace(key, value)
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