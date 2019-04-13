from rest_framework import generics

from leads.models import Lead
from leads.serializers import LeadSerializer

class LeadListCreate(generics.ListCreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

