'use strict';

angular.module('app.directive', [])

.directive('header', function() {
  return {
      restrict: 'A',
      // replace: true,
      templateUrl: "/partials/header.html",
      controller: ['$scope', function ($scope) {
        // Todo
      }]
    };
})
.directive('footer', function() {
  return {
      restrict: 'A',
      replace: true,
      templateUrl: "/partials/footer.html",
      controller: ['$scope', function ($scope) {
        var date = new Date();
        $scope.date = date.getFullYear();
      }]
    };
})
.directive('quote', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: '/partials/quote.html',
    controller: ['$scope', '$http', function ($scope, $http) {
      // Récupératon des citations
      $scope.quotes = [];
      $http.get('/js/services/quotes.json').success(function(data){
        // console.log('Success Quotes: ' + data);
        $scope.quotes = data;

        $scope.quote = $scope.quotes[Math.floor((Math.random() * $scope.quotes.length))];
      }).
      error(function(data, status, headers, config) {
        console.log('Error Quotes: ' + headers);
      });
    }]
  };
})
.directive('projects', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: '/partials/projects.html',
    controller: ['$scope', '$http', 'functions', function ($scope, $http, functions) {
      // Récupératon des citations
      $scope.projects = [];
      $http.get('/js/services/projects.json').success(function(data){
        // console.log('Success Quotes: ' + data);
        $scope.projects = functions.shuffle(data);
      }).
      error(function(data, status, headers, config) {
        console.log('Error Quotes: ' + headers);
      });
    }]
  };
})
.directive('contact', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: '/partials/contact.html',
    controller: ['$scope', '$http', 'functions', function ($scope, $http, functions) {
      // Récupératon des informations générales
      $scope.settings = [];
      $http.get('/js/services/settings.json').success(function(data){
        // console.log('Success Settings: ' + data);
        $scope.settings = data;

        $scope.settings.hobbies = functions.shuffle($scope.settings.hobbies);
      }).
      error(function(data, status, headers, config) {
        console.log('Error Settings: ' + data);
      });

      // Gestion du formulaire
      $scope.result = 'hidden'
      $scope.resultMessage;
      $scope.formData; //formData is an object holding the name, email, antispam, subject, and message
      $scope.submitButtonDisabled = false;
      $scope.submitted = false; //used so that form errors are shown only after the form has been submitted
      $scope.submit = function(contactform) {
        $scope.submitted = true;
        $scope.submitButtonDisabled = true;
        if (contactform.$valid) {
          $http({
            method  : 'POST',
            url     : '/php/contact-form.php',
            data    : $.param($scope.formData),  //param method from jQuery
            dataType : 'text',
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  //set the headers so angular passing info as form data (not request payload)
          }).success(function(data){
            console.log(data);
            if (data.success) { //success comes from the return json object
              $scope.submitButtonDisabled = true;
              $scope.resultMessage = data.message;
              $scope.result='bg-success';
            } else {
              $scope.submitButtonDisabled = false;
              $scope.resultMessage = data.message;
              $scope.result='bg-danger';
            }
          });
        } else {
          $scope.submitButtonDisabled = false;
          $scope.resultMessage = 'Merci de remplir tous les champs.';
          $scope.result='bg-danger';
        }
      }
    }]
  };
})
.directive('map', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/map.html',
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
})
.directive('scroll', function () {
  return function(scope, element, attrs) {
    // jQuery(element).bind('scroll', function() {
    //   console.log(this);
    //    if (this.pageYOffset >= 100) {
    //        scope.boolChangeClass = true;
    //        console.log('Scrolled below header.');
    //    } else {
    //        scope.boolChangeClass = false;
    //        console.log('Header is in view.');
    //    }
    //   scope.$apply();
    // });
  };
});
