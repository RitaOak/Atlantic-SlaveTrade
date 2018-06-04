regions = [];
nations = [];
nation_filter_list = [];
dataset = [];
map = null;
infowindow = null;

function setMarker(name, latitude, longitude, region = false) {
    var myLatLng = {lat: latitude, lng: longitude};
    var color;
    if (region) {
        // Change the icon to the region icon
        color = "#ff3d29";
    } else {
        // Change the icon to the nation icon
        color = "#faffa1";
    }
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
        title: name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8.5,
            fillColor: color,
            fillOpacity: 0.4,
            strokeWeight: 0.4
        }
    });
    marker.addListener("click", toggleBounce);

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    marker.addListener("click", function () {
        document.getElementById("region").innerHTML = "Region: " + name;
    });
    return marker;
}

function initMap() {
    var uluru = {
        lat: 14.7806094,
        lng: -10.3132599
    };

    infoWindow = new google.maps.InfoWindow({
        content: 'This is an info window'
    });

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2.8,
        center: uluru,
        styles: [{
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#ffffff"
            }]
        },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#000000"
                },
                    {
                        "lightness": 13
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#000000"
                }]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#144b53"
                },
                    {
                        "lightness": 14
                    },
                    {
                        "weight": 1.4
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{
                    "color": "#08304b"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#0c4152"
                },
                    {
                        "lightness": 5
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#000000"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#0b434f"
                },
                    {
                        "lightness": 25
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#000000"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#0b3d51"
                },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#000000"
                }]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{
                    "color": "#146474"
                }]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{
                    "color": "#021019"
                }]
            }
        ],
        gestureHandling: 'none',
        disableDefaultUI: true
    });
    var myoverlay = new google.maps.OverlayView();
    myoverlay.draw = function () {
        //this assigns an id to the markerlayer Pane, so it can be referenced by CSS
        this.getPanes().markerLayer.id = 'markerLayer';

    };
    myoverlay.setMap(map);

    for (i = 0; i < nations.length; i++) {
        console.log("forloop");
        nations[i]["marker"] = setMarker(nations[i].name, nations[i].latitude, nations[i].longitude)
    }
    for (i = 0; i < regions.length; i++) {
        regions[i]["marker"] = setMarker(regions[i].name, regions[i].latitude, regions[i].longitude, true)
    }
}

function setSideInfo(){
    document.getElementById("label_option2").innerHTML = dataset.slaves.embarked;
    document.getElementById("label_option3").innerHTML = dataset.slaves.disembarked;
    if(dataset.slaves.embarked > 0) {
        document.getElementById("label_option4").innerHTML = ((dataset.slaves.casualties / dataset.slaves.embarked) * 100).toFixed(2)+"%";
    } else {
        document.getElementById("label_option4").innerHTML = "Data Unavailable";
    }
    document.getElementById("label_option5").innerHTML = dataset.slaves.casualties;
}

function draw_routes() {
    /* Example code for Polylines
    var flightPlanCoordinates = [
      {lat: 37.772, lng: -122.214},
      {lat: 21.291, lng: -157.821},
      {lat: -18.142, lng: 178.431},
      {lat: -27.467, lng: 153.027}
    ];

    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(map);*/

    var routes = dataset.routes;
    for (i = 0; i < routes.length; i++) {
        var route_coordinates = [];
        for (k = 0; k < regions.length; k++) {
            if ($.inArray(regions[k].name, routes[i].regions) >= 0) {
                console.log("Regions: " + regions[k].name + "/ Route: " + routes[i].regions);
                route_coordinates.push({lat: regions[k].latitude, lng: regions[k].longitude});
            }
        }
        var max_stroke = 10;
        var min_stroke = 1;
        var stroke_weight = max_stroke * routes[i].voyages.total / dataset.voyages.max;
        if(min_stroke > stroke_weight){
            stroke_weight = min_stroke;
        }
        var routePath = new google.maps.Polyline({
            path: route_coordinates,
            geodesic: true,
            strokeColor: '#ff3d29',
            strokeOpacity: 0.6,
            strokeWeight: stroke_weight
        });
        routePath.setMap(map);
        routes[i]["routePath"] = routePath;
        addToolTip(routePath, routes[i]);
    }
}

function addToolTip(maps_object, data_object) {
    // Assemble the Tooltip content string
    var countries_str = "<p>Countries: "+data_object.countries[0];
    var route_str = "<p>Route: "+data_object.regions[0]+" - "+data_object.regions[1]+"</p>";
    for(var i=1; i<data_object.countries.length; i++){
        countries_str += ", "+data_object.countries[i];
    }
    countries_str += "</p>";
    var death_ratio = "Not Available";
    if(data_object.slaves.embarked > 0){
        death_ratio = ((data_object.slaves.casualties/data_object.slaves.embarked) * 100).toFixed(2) + "%";
    }
    var slaves_str = "<p>Slaves Embarked: "+data_object.slaves.embarked+"</p>"+
        "<p>Slaves Disembarked: "+data_object.slaves.disembarked+"</p>"+
        "<p>Death Ratio: "+death_ratio+"</p>";
    maps_object.tooltipContent = route_str + "\n" + countries_str + "\n" + slaves_str;
    google.maps.event.addListener(maps_object, 'click', function () {
        infoWindow.open(map, maps_object);
    });

    google.maps.event.addListener(maps_object, 'mouseover', function () {
        $('#tooltip-div').html(maps_object.tooltipContent).show();
    });

    google.maps.event.addListener(maps_object, 'mouseout', function () {
        $('#tooltip-div').hide();
    });

}

function filter_data() {
    // TODO: Disable Filter button
    // Delete already existing polylines
    if (dataset.routes !== undefined) {
        for (i = 0; i < dataset.routes.length; i++) {
            var path = dataset.routes[i].routePath;
            path.setMap(null);
            path.setPath([]);
            path.setVisible(false);
            dataset.routes[i].routePath = undefined;
        }
    }
    var filters = {};

    // Get the current years in the timeline to filter
    var timeline_element = document.getElementById("ex2");
    var years = timeline_element.getAttribute("value");
    years = years.split(",");
    if(years[0] > timeline_element.getAttribute("data-slider-min")){
        filters["date_min"] = years[0];
    }
    if(years[1] < timeline_element.getAttribute("data-slider-max")){
            filters["date_max"] = years[1];
    }

    // Get the list of selected countries
    nation_filter_list = [];
    for(var i = 0; i < nations.length; i++){
        el = document.getElementById("nation_check"+nations[i].id);
        if(el.checked){
            nation_filter_list.push(nations[i].name);
        }
    }
    filters["countries"] = nation_filter_list;

    // TODO: Get the filter for embark zone, if any
    // filters["embark_region"] =

    // TODO: Get the filter for disembark zone, if any
    // filters["disembark_region"] =
    $.ajax({
        type: "POST",
        url: "routes/",
        data: {"json": JSON.stringify(filters)},
        dataType: "json"
    }).success(function (result, status) {
        dataset = result;
        setSideInfo();
        draw_routes();
    }).fail(function (result, status) {
        console.log("Request broke, go fix.");
        // TODO: Show an information window saying it broke
    }).always(function (result, status) {
        console.log("Getting filter returned " + status);
        // TODO: Reenable Filter button
    });
}

function init_page() {
    /*var requestURL = 'regions/';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.onload = function () {
        console.log(response);
        regions = request.response;
    };
    request.send();
    */

    // Hide the country list div at start
    //$("#country_list_div").hide();
    $.get("nations/", function (result, status) {
        nations = result["nations"];
        // Fill Nation list through Javascript and the nations variable
        var nation_list = $("#country_check_list");
        nation_list.html("");
        for(var i = 0; i < nations.length; i++){
            nation_list.append("<input class=\"form-check-input\" type=\"checkbox\" value=\""+nations[i].name+"\" id=\"nation_check"+nations[i].id+"\">" +
                "<label class=\"form-check-label\" for=\"nation_check"+nations[i].id+"\">\n"+nations[i].name+"</label><br>")
        }
        $.get("regions/", function (result, status) {
            regions = result["regions"];
            $.ajax({
                type: "POST",
                url: "routes/",
                data: {"json": JSON.stringify({})},
                dataType: "json"
            }).success(function (result, status) {
                dataset = result;
                $("#filter_byCountryButtonFilter").click(filter_data);
                setSideInfo();
            }).fail(function (result, status) {
                console.log("Request broke, go fix.");
                // TODO: Show an information window saying it broke
            }).always(function (result, status) {
                console.log("Getting filter returned " + status);
            });
            initMap();
        });
    });
}

/*function toggleFiltersCountries(){
    var country_list_div = $("#country_list_div");
    country_list_div.toggle();
}*/