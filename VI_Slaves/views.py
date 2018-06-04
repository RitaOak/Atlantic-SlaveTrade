from django.shortcuts import render
from django.template import loader
from django.http.response import JsonResponse, HttpResponse
import json
from datetime import datetime
import dateutil.parser as dateparser
from VI_Slaves.common import csv_to_dictlist
from VI_Slaves.models import *


# Create your views here.

def index_slave(request):
    context = {}
    return render(request, "index.html", context)


def list_nations(request):
    nation_map = Nation.objects.all()
    nation_list = []
    for nation in nation_map:
        nation_list.append(
            {
                "id": nation.id,
                "name": nation.name,
                "latitude": nation.latitude,
                "longitude": nation.longitude,
            }
        )
    return JsonResponse({"nations": nation_list})


def list_regions(request):
    region_map = Region.objects.all()
    region_list = []
    for region in region_map:
        region_list.append(
            {
                "id": region.id,
                "name": region.name,
                "latitude": region.latitude,
                "longitude": region.longitude,
            }
        )
    return JsonResponse({"regions": region_list})


def get_routes(request):
    """
    Return routes based on filters sent in POST Request Body.

    POST fields are:
        countries: List of countries to search for
        year_min: Filter for voyage starting year
        year_max: Filter for voyage end year
        region_embark: Filter for embark region
        region_disembark: Filter for disembark region

    :param request:
    :return:
    """

    # Create result stub
    result_data = {
        "voyages": {
            "total": 0,
            "with duration": 0,
            "max": 0
        },
        "duration": {
            "total": 0,
            "average": 0,
            "max": 0
        },
        "slaves": {
            "embarked": 0,
            "disembarked": 0,
            "total": 0,
            "casualties": 0
        },
        "routes": []
    }
    # Start with ample queryset
    end_queryset = Voyage.objects.all()

    filters = json.loads(request.POST.get("json"))
    # Filter by list of Countries
    # countries = ["Portugal / Brazil", "Portugal"]
    countries = filters.get("countries", None)
    print(request.POST)
    print(countries)
    if countries and len(countries):
        end_queryset = end_queryset.filter(nation__name__in=countries)
    else:
        countries = None
    # Filter by date of departure
    year_min = filters.get("date_min", None)
    if year_min:
        date_min = datetime(year=int(year_min), month=1, day=1)
        end_queryset = end_queryset.filter(date_start__gte=date_min)
    # Filter by date of arrival
    year_max = filters.get("date_max", None)
    if year_max:
        date_max = datetime(year=int(year_max), month=12, day=31)
        end_queryset = end_queryset.filter(date_end__lte=date_max)
    # Filter by embark region
    region_embark = filters.get("region_embark", None)
    if region_embark:
        end_queryset = end_queryset.filter(region_embark__name=region_embark)
    # Filter by disembark region
    region_disembark = filters.get("region_disembark", None)
    if region_disembark:
        end_queryset = end_queryset.filter(region_disembark__name=region_disembark)

    # Handle data
    routes = {}
    for voyage in end_queryset:
        voyage_sort_regions = [voyage.region_embark.name, voyage.region_disembark.name]
        voyage_sort_regions.sort()
        voyage_region_list = (voyage_sort_regions[0], voyage_sort_regions[1])
        route_dict = routes.get(
            voyage_region_list,
            {
                "voyages": {
                    "total": 0,
                    "with duration": 0,
                    "max": 0
                },
                "duration": {
                    "total": 0,
                    "average": 0,
                    "max": 0
                },
                "slaves": {
                    "embarked": 0,
                    "disembarked": 0,
                    "total": 0,
                    "casualties": 0
                },
                "regions": voyage_region_list,
                "countries": []
            })
        if countries and voyage.nation.name not in route_dict["countries"]:
            route_dict["countries"].append(voyage.nation.name)
        result_data["voyages"]["total"] = result_data["voyages"]["total"] + 1
        route_dict["voyages"]["total"] = route_dict["voyages"]["total"] + 1
        if voyage.duration:
            result_data["voyages"]["with duration"] = result_data["voyages"]["with duration"] + 1
            result_data["duration"]["total"] = result_data["duration"]["total"] + voyage.duration
            if countries:
                route_dict["voyages"]["with duration"] = route_dict["voyages"]["with duration"] + 1
                route_dict["duration"]["total"] = route_dict["duration"]["total"] + voyage.duration
            if voyage.duration > route_dict["duration"]["max"]:
                if countries:
                    route_dict["duration"]["max"] = voyage.duration
                if voyage.duration > result_data["duration"]["max"]:
                    result_data["duration"]["max"] = voyage.duration
        if voyage.slaves_embarked:
            result_data["slaves"]["embarked"] = result_data["slaves"]["embarked"] + voyage.slaves_embarked
            result_data["slaves"]["total"] = result_data["slaves"]["total"] + voyage.slaves_embarked
            if countries:
                route_dict["slaves"]["embarked"] = route_dict["slaves"]["embarked"] + voyage.slaves_embarked
                route_dict["slaves"]["total"] = route_dict["slaves"]["total"] + voyage.slaves_embarked
        if voyage.slaves_disembarked:
            result_data["slaves"]["disembarked"] = result_data["slaves"]["disembarked"] + voyage.slaves_disembarked
            if countries:
                route_dict["slaves"]["disembarked"] = route_dict["slaves"]["disembarked"] + voyage.slaves_disembarked
            if not voyage.slaves_embarked:
                result_data["slaves"]["total"] = result_data["slaves"]["total"] + voyage.slaves_disembarked
                if countries:
                    route_dict["slaves"]["total"] = route_dict["slaves"]["total"] + voyage.slaves_disembarked
        if countries:
            routes[voyage_region_list] = route_dict
    # Assemble final statistics
    if result_data["voyages"]["with duration"] > 0:
        result_data["duration"]["average"] = float(result_data["duration"]["total"]) / float(result_data["voyages"]["with duration"])
    result_data["slaves"]["casualties"] = result_data["slaves"]["embarked"] - result_data["slaves"]["disembarked"]
    for route in routes.values():
        if route["voyages"]["total"] > result_data["voyages"]["max"]:
            result_data["voyages"]["max"] = route["voyages"]["total"]
        if route["voyages"]["with duration"] > 0:
            route["duration"]["average"] = float(route["duration"]["total"]) / float(route["voyages"]["with duration"])
        route["slaves"]["casualties"] = route["slaves"]["embarked"] - route["slaves"]["disembarked"]
        result_data["routes"].append(route)
    return JsonResponse(result_data)


def restart_data(request):
    Region.objects.all().delete()
    Nation.objects.all().delete()
    Voyage.objects.all().delete()

    # Read the Region CSV File
    region_list = csv_to_dictlist("csv_data/regions.csv")
    # Create Region Objects from region_list
    # Iterate over the list of Regions just read from the CSV file
    i = 0
    for region_line in region_list:
        # Create a new Region DjangoModel object
        region = Region()
        # Fill the Model's attributes
        region.name = region_line["name"]
        region.latitude = region_line["latitude"]
        region.longitude = region_line["longitude"]
        # Validate that the Object complies with the Field constraints set in the models file, for this Model
        region.full_clean()
        # Save the Object into the Database
        region.save()

    # Read the Nations CSV File
    nation_list = csv_to_dictlist("csv_data/nations.csv")
    # Create Nation Objects from nation_list
    # Iterate over the list of Nations just read from the CSV file
    for nation_line in nation_list:
        # Create a new Nation DjangoModel object
        nation = Nation()
        # Fill the Model's attributes
        nation.name = nation_line["name"]
        nation.latitude = nation_line["latitude"]
        nation.longitude = nation_line["longitude"]
        # Validate that the Object complies with the Field constraints set in the models file, for this Model
        nation.full_clean()
        # Save the Object into the Database
        nation.save()

    # Read the main Voyage data
    voyage_list = csv_to_dictlist("csv_data/data.csv")
    # TODO: Turn voyage_list lines into Voyage objects
    for voyage_line in voyage_list:
        i += 1
        if i % 1000 == 0:
            print(str(datetime.now()) + ":" + str(i))
        # Create a new Voyage DjangoModel object
        voyage = Voyage()
        # Fill the Model's attributes
        # Assign Region object to region entries (foreign keys)
        if voyage_line["embark_region"] and voyage_line["disembark_region"]:
            voyage.region_embark = Region.objects.get(name=voyage_line["embark_region"])
            voyage.region_disembark = Region.objects.get(name=voyage_line["disembark_region"])
        else:
            continue
        # Assign Nation object to region entries (foreign keys)
        if voyage_line["natinimp"] or voyage_line["national"]:
            voyage.nation = Nation.objects.get(
                name=(voyage_line["natinimp"] if voyage_line["natinimp"] else voyage_line["national"]))
        else:
            continue
        voyage.id = voyage_line["voyageid"]
        voyage.date_start = voyage_line["date_dep"].replace("-??", "-01") if voyage_line["date_dep"] else None
        voyage.date_end = voyage_line["date_end"].replace("-??", "-01") if voyage_line["date_end"] else None
        voyage.place_embark = voyage_line["embark_place"]
        voyage.place_disembark = voyage_line["disembark_place"]
        if voyage_line["days"]:
            voyage.duration = voyage_line["days"]
        if voyage_line["slaves_embark"]:
            voyage.slaves_embarked = voyage_line["slaves_embark"]
        if voyage_line["slaves_disembarked"]:
            voyage.slaves_disembarked = voyage_line["slaves_disembarked"]
        if voyage_line["ratio_men"]:
            voyage.ratio_men = voyage_line["ratio_men"].replace("%", "").replace(",", ".")
        if voyage_line["ratio_women"]:
            voyage.ratio_women = voyage_line["ratio_women"].replace("%", "").replace(",", ".")
        if voyage_line["ratio_children"]:
            voyage.ratio_children = voyage_line["ratio_children"].replace("%", "").replace(",", ".")
        if voyage_line["death_ratio"]:
            voyage.death_ratio = voyage_line["death_ratio"].replace("%", "").replace(",", ".")
        # TODO: death_ratio_confirmed to confirm if the input is in the file or if we needed to determine it programatically
        # Validate that the Object complies with the Field constraints set in the models file, for this Model
        voyage.full_clean()
        # Save the Object into the Database
        voyage.save()

    return JsonResponse({"max_slaves is this much": "cenas"})
