'use strict';

angular.module('app.home.home-directive', [])

.directive('introduction', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/home-introduction.html'
  };
})
.directive('about', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/home-about.html'
  };
})
.directive('resume', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/home-resume.html'
  };
})
.directive('services', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/home-services.html'
  };
})
.directive('hireme', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/home-hireme.html'
  };
})
.directive('skills', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/home-skills.html'
  };
})
.directive('map', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/home-map.html',
    controller: ['$scope', '$http', 'functions', function ($scope, $http, functions) {
      // Render google custom maps
      var hhLatLng = new google.maps.LatLng(48.110221,-1.683345);
      var mapOptions = {
        center: hhLatLng,
        zoom: 14,
        scrollwheel: false,
        streetViewControl: false,
        zoomControl: true,
        draggable: true,
        disableDefaultUI: false,
        disableDoubleClickZoom: true,
        panControl: false,
        mapTypeControl: false,
        styles: [
          {
              "featureType": "administrative",
              "elementType": "labels.text.fill",
              "stylers": [
                  {
                      "color": "#444444"
                  }
              ]
          },
          {
              "featureType": "administrative.locality",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "landscape",
              "elementType": "all",
              "stylers": [
                  {
                      "color": "#f2f2f2"
                  }
              ]
          },
          {
              "featureType": "poi",
              "elementType": "all",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "road",
              "elementType": "all",
              "stylers": [
                  {
                      "saturation": -100
                  },
                  {
                      "lightness": 45
                  }
              ]
          },
          {
              "featureType": "road.highway",
              "elementType": "all",
              "stylers": [
                  {
                      "visibility": "simplified"
                  }
              ]
          },
          {
              "featureType": "road.arterial",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "transit",
              "elementType": "all",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "water",
              "elementType": "all",
              "stylers": [
                  {
                      "color": "#1abc9c"
                  },
                  {
                      "visibility": "on"
                  }
              ]
          }
        ]
      };
      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      var contentString = '<div id="map-content" style="overflow: hidden; width: 250px;">'+
      '<img src="/assets/img/happy-hours.jpg" style="float: left; margin-right: 15px;" width="100" title="Happy Hours!" />'+
      '<address style="color: #7e878f; line-height: 1.4em;">'+
      '<a href="http://happyh0urs.com/" title="Accéder au site internet d\'Happy H0urs" style="text-transform: uppercase; color: #1abc9c; text-decoration: none;"><strong>Happy Hours</strong></a><br />'+
      'Matthieu Schneider<br />'+
      '22 Quai Duguay Trouin<br />'+
      '35000 RENNES<br />'+
      '</address>'+
      '</div>';

      var infowindow = new google.maps.InfoWindow({
          content: contentString
      });

      var marker = new google.maps.Marker({
        position: hhLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: '/assets/img/pinpoint.png'
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });
    }]
  };
});
