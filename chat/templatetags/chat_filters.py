from django import template
# from django.utils.safestring import mark_safe
# from django.utils.html import format_html, escape
# import re

register = template.Library()


@register.filter
def add_ellipsis(text):
    if len(text) >= 15:
        text = text + '...'
    return text


@register.filter
def current_page(url):
    splite_url = url.split('/')
    pages = [item for item in splite_url if item]
    if not pages:
        return
    return pages[-1]



# # Replace the ' ``` ' with a <code> and the \n with the <p>
# @register.filter
# def text_format(value):
#    # Wrapping with the <code>.
#    value = escape(value)
#    codePrefix = format_html('<code class="answer-code-block">')
#    codeSuffix = format_html('</code>')
#    formatted_value = format_html('{}', value)
#    finall_resul = wrap_with_p(formatted_value)
#    content = re.sub(r'<p>```(.*?)```</p>', f'{codePrefix}\\1{codeSuffix}', finall_resul, flags=re.DOTALL)
#    return mark_safe(content)


# # Wrapping with the <p>.
# def wrap_with_p(text):
#    splited_value = text.split('\n')
#    wrapped_by_p = [f"<p>{item}</p>" for item in splited_value]
#    reconstructed_value = ''
#    for item in wrapped_by_p:
#       reconstructed_value += item
#    return reconstructed_value

