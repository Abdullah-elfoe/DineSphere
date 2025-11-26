from django import template
register = template.Library()

@register.filter
def range_num(n):
    return range(int(n))
