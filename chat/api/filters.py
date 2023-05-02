from django_filters import rest_framework as filters
from chat.models import Question

class QuestionFiltering(filters.FilterSet):
    created_from = filters.DateFilter(
        field_name='created_at',
        lookup_expr='gte',
        label='Questions Date From'
    )

    created_to = filters.DateFilter(
        field_name='created_to',
        lookup_expr='lte',
        label='Questions Date To'
    )

    tags = filters.CharFilter(
        field_name='tags__value',
        lookup_expr='icontains',
        label='Tags Contain'
    )

    class Meta:
        model = Question
        fields = ['user']