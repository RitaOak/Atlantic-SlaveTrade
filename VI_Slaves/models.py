from django.db import models


# Create your models here.

class Nation(models.Model):
    name = models.CharField(max_length=64, null=False, blank=False, unique=True)
    latitude = models.FloatField(null=False, blank=False)
    longitude = models.FloatField(null=False, blank=False)


class Region(models.Model):
    name = models.CharField(max_length=64, null=False, blank=False, unique=True)
    latitude = models.FloatField(null=False, blank=False)
    longitude = models.FloatField(null=False, blank=False)


class Voyage(models.Model):
    nation = models.ForeignKey('Nation', on_delete=models.CASCADE, null=False, blank=True)
    date_start = models.DateField(null=True, blank=True, default=None)
    place_embark = models.CharField(max_length=128, null=True, blank=True, default=None)
    region_embark = models.ForeignKey('Region', on_delete=models.CASCADE, related_name="voyage_embark", null=False, blank=True)
    date_end = models.DateField(null=True, blank=True, default=None)
    place_disembark = models.CharField(max_length=128, null=True, blank=True, default=None)
    region_disembark = models.ForeignKey('Region', on_delete=models.CASCADE, related_name="voyage_disembark", null=False, blank=True)
    duration = models.PositiveSmallIntegerField(null=True, blank=True, default=None)
    slaves_embarked = models.PositiveIntegerField(null=True, blank=True, default=None)
    slaves_disembarked = models.PositiveIntegerField(null=True, blank=True, default=None)
    ratio_men = models.FloatField(null=True, blank=True, default=None)
    ratio_women = models.FloatField(null=True, blank=True, default=None)
    ratio_children = models.FloatField(null=True, blank=True, default=None)
    death_ratio = models.FloatField(null=True, blank=True, default=None)
    death_ratio_confirmed = models.NullBooleanField(null=True, blank=True, default=None)
