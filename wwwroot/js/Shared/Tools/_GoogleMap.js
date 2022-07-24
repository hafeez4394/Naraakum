NK.GoogleMap = {
    map: null,
    geocoder: null,
    zoomVal: 0,
    marker: null,
    markers: [],
    KnowYourLocationAllowed: false,
    SearchText: "",
    onSuucessEvent: {},

    //$(function () {
    //    zoomVal = 15;
    //    getLSRadious();
    //    Initialize();
    //})

    Initialize_Map: function (_onSuccessEvent) {
        NK.GoogleMap.zoomVal = 15;
        NK.GoogleMap.getLSRadious();
        NK.GoogleMap.Initialize();
        NK.GoogleMap.onSuucessEvent = _onSuccessEvent;
    },

    Initialize: function () {

        //var lastSearchText = NK.GoogleMap.getLSSearchText();
        //if (lastSearchText == '') {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(NK.GoogleMap.success, NK.GoogleMap.block);  //, onBlockClick
            return false;
        }
        else
            alert("Google Map is not supported on your current browser!");
        //}

        //if (lastSearchText != '' && NK.GoogleMap.KnowYourLocationAllowed) {
        //    //var myLatlng = new google.maps.LatLng(lat, lng);
        //    var myOptions = {
        //        /*center: myLatlng,*/
        //        zoom: NK.GoogleMap.zoomVal,
        //        mapTypeId: google.maps.MapTypeId.ROADMAP
        //    };
        //    geocoder = new google.maps.Geocoder();
        //    NK.GoogleMap.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        //    geocoder.geocode({ 'address': lastSearchText }, function (results, status) {
        //        if (status == google.maps.GeocoderStatus.OK) {

        //            NK.GoogleMap.map.setCenter(results[0].geometry.location);
        //            NK.GoogleMap.marker = new google.maps.Marker({
        //                //position: myLatlng,
        //                map: NK.GoogleMap.map,
        //            });
        //            marker.setPosition(results[0].geometry.location);
        //            var lat = marker.getPosition().lat();
        //            var long = marker.getPosition().lng();
        //            //var myLatlng = new google.maps.LatLng(lat, long);

        //            // remove all old markers from map first
        //            NK.GoogleMap.deleteMarkers();

        //            NK.GoogleMap.loadLocationMarkers(lat, long)
        //        } else {
        //            alert("Geocode was not successful for the following reason: " + status);
        //        }
        //    });
        //}
    },

    success: function (position) {

        NK.GoogleMap.KnowYourLocationAllowed = true;
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        /*var city = position.coords.locality;*/
        NK.GoogleMap.saveCurrentLocation(lat, long);
        NK.GoogleMap.maploader(lat, long);

    },
    block: function () {
        NK.GoogleMap.KnowYourLocationAllowed = false;
    },
    onBlockClick: function () {
        var lat = "31.5204";
        var long = "74.3587";

        NK.GoogleMap.maploader(lat, long);
    },
    maploader: function (lat, long) {
        NK.GoogleMap.loadLocationMarkers(lat, long)
        NK.GoogleMap.map.addListener("click", (mapsMouseEvent) => {
            //mapsMouseEvent.infowindow.close();
            //console.log('click with mouse (map)');
            NK.GoogleMap.fill_MarkedLocations(mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng());
        });
        google.maps.event.addListener(marker, 'click', (function () //Adding Click Function
        {
            return function () {
                //console.log(location);
                //console.log('click on marker');
                NK.GoogleMap.fill_MarkedLocations(NK.GoogleMap.marker.map.center.lat(), NK.GoogleMap.marker.map.center.lng())
            }
        })(marker));
    },
    loadLocationMarkers: function (lat, lng) {
        var foundLocations = [];
        var radious = NK.GoogleMap.getLSRadious(); //parseFloat($('#txtRadious').val());
        var locations = NK.GoogleMap.getLocation();

        myLocation = { lat: lat, lng: lng, IsMyLocation: true };
        foundLocations.push(myLocation);

        var myLatlng = new google.maps.LatLng(lat, lng);

        var mapTypeId = NK.GoogleMap.map == undefined || NK.GoogleMap.map.getMapTypeId() == 'roadmap' ?
            google.maps.MapTypeId.ROADMAP :
            google.maps.MapTypeId.SATELLITE;

        var myOptions = {
            center: myLatlng,
            zoom: NK.GoogleMap.zoomVal,
            mapTypeId: mapTypeId //google.maps.MapTypeId.ROADMAP//ROADMAP  -- SATELLITE
        };
        geocoder = new google.maps.Geocoder();
        NK.GoogleMap.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        if (locations && locations.length > 0) {
            $.each(locations, function (idx, location) {
                var disRadious = NK.GoogleMap.distance(lat, location.lat, lng, location.lng);

                if (disRadious <= radious) {
                    foundLocations.push(location);
                    //console.log(location.LocationTitle + " disRadious:" + disRadious);
                }
            })
        }
        var i;
        var infowindow = new google.maps.InfoWindow();
        for (i = 0; i < foundLocations.length; i++) {
            var data = foundLocations[i]
            //set lat long of current marker
            var myLatlng = new google.maps.LatLng(data.lat, data.lng);

            if (!data.IsMyLocation) {
                marker = new google.maps.Marker({
                    position: myLatlng,
                    map: NK.GoogleMap.map,
                    icon: {
                        url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                    }
                    /*title: data.title*/
                });
            }
            else {
                marker = new google.maps.Marker({
                    position: myLatlng,
                    map: NK.GoogleMap.map,
                });
            }
            NK.GoogleMap.markers.push(marker);
            (function (marker, data) {
                // add a on marker click event
                google.maps.event.addListener(marker, "click", function (e) {
                    if (data.LocationTitle)
                        return alert(data.LocationTitle);
                    return alert("Selected Location (Current)");
                    //show description
                    //infoWindow.setContent(data.LocationTitle);
                    //infoWindow.open(map, marker);
                });
            })(marker, data);
        }

        marker.setMap(NK.GoogleMap.map);

        if ($("#txtSearchLocation").length == 0) {

            var address = NK.GoogleMap.getLSSearchText();

            if (address != '')
                address = "Value='" + address + "'";

            $('.modal_body_map').append('<input id="txtSearchLocation" type="text" placeholder="Search Place...." ' + address + ' style="display:none;">');
            setTimeout(NK.GoogleMap.attachKeyPress, 200);
        }

        var dvRadious = /** @@type {!HTMLInputElement} */ (
            document.getElementById('dvRadious'));

        var input = /** @@type {!HTMLInputElement} */ (
            document.getElementById('txtSearchLocation'));

        setTimeout(function () {
            input.style.display = "";
            //dvRadious.style.display = "";
            NK.GoogleMap.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', NK.GoogleMap.map);
        }, 500);
    },

    distance: function (lat1, lat2, lon1, lon2) {

        // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 = lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;

        // Haversine formula
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2), 2);

        let c = 2 * Math.asin(Math.sqrt(a));

        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371;

        // calculate the result
        return (c * r);
    },
    getLocation: function () {
        return [];
        //var locations = [
        //    { LocationTitle: "Latif Children", lat: 31.467627038010487, lng: 74.29287672042847 },
        //    { LocationTitle: "Time Square", lat: 31.466893802802467, lng: 74.2916777753937 },
        //    { LocationTitle: "School of Enablers", lat: 31.46605076457006, lng: 74.29320126771927 },
        //    { LocationTitle: "NavTTC, Regional Office (Punjab)", lat: 31.468580057249152, lng: 74.29403502034305 },
        //    { LocationTitle: "National officers Academy (NCT CSS)", lat: 31.46510361507953, lng: 74.29139345884323 },
        //    { LocationTitle: "Al_Jannet Hotel for Boys KIPS College", lat: 31.467482909611103, lng: 74.2891377210617 },
        //    { LocationTitle: "Doce Bakeries", lat: 31.475761925690573, lng: 74.2892074584961 },
        //    { LocationTitle: "Alvira Park", lat: 31.470152680613886, lng: 74.28823113441467 },
        //    { LocationTitle: "NAB Court Complex", lat: 31.482953712161965, lng: 74.29193258285522 },
        //]
        //return locations;
    },

    //* start LocalStorage Radious
    saveRadious: function () {
        NK.GoogleMap.setLSRadious($('#txtRadious').val())
    },
    setLSRadious: function (val) {
        val = val == '' || val == null ? 4 : val;
        localStorage.setItem("LSRadious", val);

        var SearchText = NK.GoogleMap.getLSSearchText();
        var location = NK.GoogleMap.getLSCurrentLocation();

        if (SearchText != '')
            NK.GoogleMap.getGeoLocation(SearchText);

        if (location != null)
            NK.GoogleMap.loadLocationMarkers(location.lat, location.lng);
    },
    getLSRadious: function () {
        var val = localStorage.getItem("LSRadious");
        val = val == '' || val == null ? 4 : val;
        $('#txtRadious').val(val);
        return parseFloat(val);
    },

    saveSearchText: function (address) {
        NK.GoogleMap.setLSSearchText(address)
    },
    setLSSearchText: function (address) {
        address == null ? '' : address
        /* localStorage.setItem("SearchText", address);*/
    },
    getLSSearchText: function () {
        var address = localStorage.getItem("SearchText");
        $('#txtSearchLocation').val(address);
        return address == null ? '' : address;
    },

    saveCurrentLocation: function (lat, lng) {
        NK.GoogleMap.setLSCurrentLocation(lat, lng)
    },
    setLSCurrentLocation: function (lat, lng) {
        myLang = lat + "," + lng;
        localStorage.setItem("CurrentLocation", myLang);
    },
    getLSCurrentLocation: function () {
        var myLang = localStorage.getItem("CurrentLocation");
        if (myLang != '') {
            MyLocation = myLang.split(',');
            myLang = { lat: MyLocation[0], lng: MyLocation[1] }
        }
        return myLang;
    },

    //* end LocalStorage Radious

    //* start Marked
    count: 0,
    fill_MarkedLocations: function (lat, lng) {
        //count++;
        //$('#div_MarkedLocations').append('<input type="button" class="Marked_Location" onclick="open_MarkedLocations(' + lat + ',' + lng + ')" value="Marked Location' + count + '"></input>')
        //console.log('lat:' + lat + ', lang: ' + lng);
    },
    open_MarkedLocations: function (lat, lng) {
        //$('#txtSearchLocation').remove();
        //$('body').append('<input id="txtSearchLocation" type="text" placeholder="Search Place....">');
        //maploader(lat, lng);
    },
    //* end Marked

    // Sets the map on all markers in the array.
    setMapOnAll: function (map) {

        for (var i = 0; i < NK.GoogleMap.markers.length; i++) {
            NK.GoogleMap.markers[i].setMap(map);
        }
    },
    // Removes the markers from the map, but keeps them in the array.
    clearMarkers: function () {
        NK.GoogleMap.setMapOnAll(null);
    },

    // Deletes all markers in the array by removing references to them.
    deleteMarkers: function () {
        NK.GoogleMap.clearMarkers();
    },
    getGeoLocation: function (address) {
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                NK.GoogleMap.map.setCenter(results[0].geometry.location);
                marker.setPosition(results[0].geometry.location);
                var lat = marker.getPosition().lat();
                var long = marker.getPosition().lng();
                //var myLatlng = new google.maps.LatLng(lat, long);

                // remove all old markers from map first
                NK.GoogleMap.deleteMarkers();

                NK.GoogleMap.loadLocationMarkers(lat, long)

                //marker = new google.maps.Marker({
                //    position: myLatlng,
                //    map: map,
                //});
                //marker.setMap(map);

                //maploader(lat, long);
                //map.setCenter(results[0].geometry.location);
                //marker.setPosition(results[0].geometry.location);
                //$('.search_addr').val(results[0].formatted_address);
                //$('.search_latitude').val(marker.getPosition().lat());
                //$('.search_longitude').val(marker.getPosition().lng());
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    },
    attachKeyPress: function () {
        var PostCodeid = '#txtSearchLocation';

        $(PostCodeid).keypress(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == 13) {

                var address = $(PostCodeid).val();
                NK.GoogleMap.setLSSearchText(address);
                if (address == '') {
                    var location = NK.GoogleMap.getLSCurrentLocation();
                    NK.GoogleMap.loadLocationMarkers(location.lat, location.lng);
                    event.preventDefault();
                    return;
                }
                NK.GoogleMap.getGeoLocation(address);
                event.preventDefault();
            }
        });

    },
    onSubmit_GoogleMap: function () {
        NK.GoogleMap.onSuucessEvent();
    },

}