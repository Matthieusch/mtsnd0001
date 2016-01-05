'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'snap',
  'duScroll',
  'easypiechart',
  'app.factory',
  'app.controllers.home',
  'app.directive',
  'app.controllers.greatstuff'
]).
run(function($rootScope, $location, $routeParams, snapRemote){
  //Snap Function
  snapRemote.getSnapper().then(function(snapper) {
    snapper.on('close', function(){
      angular.element(document.querySelector('#snap-toggle')).removeClass('active');
    });
    snapper.on('open', function(){
      angular.element(document.querySelector('#snap-toggle')).addClass('active');
    });
  });
}).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/', {templateUrl: '/partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/page/other-great-stuff', {templateUrl: '/partials/page.html', controller: 'GreatStuffCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
}]).
config(function(snapRemoteProvider) {
  snapRemoteProvider.globalOptions = {
    touchToDrag: false,
    disable : 'right',
    maxPosition: 265,
    minPosition: -265
  };
});

'use strict';

angular.module('app.factory', ['duScroll'])

.factory('functions', function functionsFactory() {
  return {
    shuffle: function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
  };
})
.factory('duScrollEasing', function duScrollEasingFactory() {
  return function(t) {
    return t<0.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t;
  };
});

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
.directive('recommandations', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/home-recommandations.html'
  };
}])
.directive('blkrecommandations', ['$parse', '$rootScope', '$timeout', function($parse, $rootScope, $timeout) {
    return {
      restict: 'AE',
      link: function(scope, element, attrs) {
        var loadCount = 0,
            lastIndex = 0;

        scope.$on('$repeatFinished', function(event, data) {
          lastIndex = data;
          var oriDomiParams = {
            hPanels: 4,
            ripple: true
          };
          $timeout(function() {
            // var $folded = $('.bloc').oriDomi(oriDomiParams);
            // $folded.oriDomi('accordion', 60, 'top');
            // var folded = $folded.oriDomi(true);
            $('.click').bind('click', function() {
              $(this).removeClass('infinite').addClass('bounceOut').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).fadeOut();
                $(this).next().find('.text').addClass('animated fadeInLeft');
              })
            });
          });
        });
      }
    }
}])
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
});


'use strict';

angular.module('app.controllers.home', [
  'app.home.home-directive'
])

.controller('HomeCtrl', ['$scope', '$http', 'functions', function($scope, $http, functions) {

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

  // Récupératon des backgrounds
  $scope.backgrounds = [];
  $http.get('/js/services/backgrounds.json').success(function(data){
    // console.log('Success Backgrounds: ' + data);
    $scope.backgrounds = data;

    $scope.background = $scope.backgrounds.images[Math.floor((Math.random() * $scope.backgrounds.images.length))];
  }).
  error(function(data, status, headers, config) {
    console.log('Error Backgrounds: ' + data);
  });

  // Récupératon des informations du CV
  $scope.resume = [];
  $http.get('/js/services/resume.json').success(function(data){
    // console.log('Success Resume: ' + data);
    $scope.resume = data;
  }).
  error(function(data, status, headers, config) {
    console.log('Error Resume: ' + headers);
  });

  // Récupératon des recommandations
  $scope.recommandations = [];
  $http.get('/js/services/recommandations.json').success(function(data){
    // console.log('Success brands: ' + data);
    $scope.recommandations = data;

  }).
  error(function(data, status, headers, config) {
    console.log('Error brands: ' + data);
  });

  // Récupératon des services
  $scope.services = [];
  $http.get('/js/services/my-services.json').success(function(data){
    // console.log('Success services: ' + data);
    $scope.services = data;

  }).
  error(function(data, status, headers, config) {
    console.log('Error services: ' + data);
  });

  // Récupératon des skills
  $scope.skills = [];
  $http.get('/js/services/skills.json').success(function(data){
    // console.log('Success skills: ' + data);
    $scope.skills = data;
    $scope.skills.options = {
      animate: {
        duration: 1500,
        enabled: true
      },
      barColor: '#e74c3c',
      scaleColor: false,
      lineWidth: 15,
      size: 170,
      trackColor: '#e6e8ed',
      lineCap: 'circle'
    };
  }).
  error(function(data, status, headers, config) {
    console.log('Error skills: ' + data);
  });
}])
.controller('LoopWatchCtrl', function($scope) {
  $scope.$watch('$last', function(newVal, oldVal) {
    newVal && $scope.$emit('$repeatFinished', $scope.$index);
  });
});

'use strict';

angular.module('app.controllers.greatstuff', [])

.controller('GreatStuffCtrl', ['$scope', '$http', 'functions', function($scope, $http, functions) {

  // Récupératon des marques
  $scope.brands = [];
  $http.get('/js/services/powered-brands.json').success(function(data){
    // console.log('Success brands: ' + data);
    $scope.brands = functions.shuffle(data);

  }).
  error(function(data, status, headers, config) {
    console.log('Error brands: ' + data);
  });

  // Récupératon des backgrounds
  $scope.backgrounds = [];
  $http.get('/js/services/backgrounds.json').success(function(data){
    // console.log('Success Backgrounds: ' + data);
    $scope.backgrounds = data;

    $scope.background = $scope.backgrounds.images[Math.floor((Math.random() * $scope.backgrounds.images.length))];
  }).
  error(function(data, status, headers, config) {
    console.log('Error Backgrounds: ' + data);
  });
  $scope.title = 'Great stuff in here !';
  $scope.content = '/partials/great-stuff.html';

}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxX2FwcC5qcyIsIjAyX2ZhY3RvcnkuanMiLCIwM19kaXJlY3RpdmVzLzAxX2RpcmVjdGl2ZXMuanMiLCIwM19kaXJlY3RpdmVzLzAyX2hvbWUuanMiLCIwNF9jb250cm9sbGVycy8wMV9ob21lLmpzIiwiMDRfY29udHJvbGxlcnMvMDJfZ3JlYXQtc3R1ZmYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8vIERlY2xhcmUgYXBwIGxldmVsIG1vZHVsZSB3aGljaCBkZXBlbmRzIG9uIHZpZXdzLCBhbmQgY29tcG9uZW50c1xuYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcbiAgJ25nUm91dGUnLFxuICAnbmdBbmltYXRlJyxcbiAgJ3NuYXAnLFxuICAnZHVTY3JvbGwnLFxuICAnZWFzeXBpZWNoYXJ0JyxcbiAgJ2FwcC5mYWN0b3J5JyxcbiAgJ2FwcC5jb250cm9sbGVycy5ob21lJyxcbiAgJ2FwcC5kaXJlY3RpdmUnLFxuICAnYXBwLmNvbnRyb2xsZXJzLmdyZWF0c3R1ZmYnXG5dKS5cbnJ1bihmdW5jdGlvbigkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgc25hcFJlbW90ZSl7XG4gIC8vU25hcCBGdW5jdGlvblxuICBzbmFwUmVtb3RlLmdldFNuYXBwZXIoKS50aGVuKGZ1bmN0aW9uKHNuYXBwZXIpIHtcbiAgICBzbmFwcGVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uKCl7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NuYXAtdG9nZ2xlJykpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB9KTtcbiAgICBzbmFwcGVyLm9uKCdvcGVuJywgZnVuY3Rpb24oKXtcbiAgICAgIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc25hcC10b2dnbGUnKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuICB9KTtcbn0pLlxuY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCBmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpLmhhc2hQcmVmaXgoJyEnKTtcblxuICAkcm91dGVQcm92aWRlci53aGVuKCcvJywge3RlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL2hvbWUuaHRtbCcsIGNvbnRyb2xsZXI6ICdIb21lQ3RybCd9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL3BhZ2Uvb3RoZXItZ3JlYXQtc3R1ZmYnLCB7dGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvcGFnZS5odG1sJywgY29udHJvbGxlcjogJ0dyZWF0U3R1ZmZDdHJsJ30pO1xuICAkcm91dGVQcm92aWRlci5vdGhlcndpc2Uoe3JlZGlyZWN0VG86ICcvJ30pO1xufV0pLlxuY29uZmlnKGZ1bmN0aW9uKHNuYXBSZW1vdGVQcm92aWRlcikge1xuICBzbmFwUmVtb3RlUHJvdmlkZXIuZ2xvYmFsT3B0aW9ucyA9IHtcbiAgICB0b3VjaFRvRHJhZzogZmFsc2UsXG4gICAgZGlzYWJsZSA6ICdyaWdodCcsXG4gICAgbWF4UG9zaXRpb246IDI2NSxcbiAgICBtaW5Qb3NpdGlvbjogLTI2NVxuICB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuZmFjdG9yeScsIFsnZHVTY3JvbGwnXSlcblxuLmZhY3RvcnkoJ2Z1bmN0aW9ucycsIGZ1bmN0aW9uIGZ1bmN0aW9uc0ZhY3RvcnkoKSB7XG4gIHJldHVybiB7XG4gICAgc2h1ZmZsZTogZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xuICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4IDtcblxuICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcblxuICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cbiAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG4gIH07XG59KVxuLmZhY3RvcnkoJ2R1U2Nyb2xsRWFzaW5nJywgZnVuY3Rpb24gZHVTY3JvbGxFYXNpbmdGYWN0b3J5KCkge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiB0PDAuNSA/IDE2KnQqdCp0KnQqdCA6IDErMTYqKC0tdCkqdCp0KnQqdDtcbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZScsIFtdKVxuXG4uZGlyZWN0aXZlKCdoZWFkZXInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAvLyByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6IFwiL3BhcnRpYWxzL2hlYWRlci5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgICAgICAgLy8gVG9kb1xuICAgICAgfV1cbiAgICB9O1xufSlcbi5kaXJlY3RpdmUoJ2Zvb3RlcicsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogXCIvcGFydGlhbHMvZm9vdGVyLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICRzY29wZS5kYXRlID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgfV1cbiAgICB9O1xufSlcbi5kaXJlY3RpdmUoJ3F1b3RlJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3F1b3RlLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRodHRwJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHApIHtcbiAgICAgIC8vIFLDqWN1cMOpcmF0b24gZGVzIGNpdGF0aW9uc1xuICAgICAgJHNjb3BlLnF1b3RlcyA9IFtdO1xuICAgICAgJGh0dHAuZ2V0KCcvanMvc2VydmljZXMvcXVvdGVzLmpzb24nKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnU3VjY2VzcyBRdW90ZXM6ICcgKyBkYXRhKTtcbiAgICAgICAgJHNjb3BlLnF1b3RlcyA9IGRhdGE7XG5cbiAgICAgICAgJHNjb3BlLnF1b3RlID0gJHNjb3BlLnF1b3Rlc1tNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogJHNjb3BlLnF1b3Rlcy5sZW5ndGgpKV07XG4gICAgICB9KS5cbiAgICAgIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBRdW90ZXM6ICcgKyBoZWFkZXJzKTtcbiAgICAgIH0pO1xuICAgIH1dXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgncHJvamVjdHMnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvcHJvamVjdHMuaHRtbCcsXG4gICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGh0dHAnLCAnZnVuY3Rpb25zJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsIGZ1bmN0aW9ucykge1xuICAgICAgLy8gUsOpY3Vww6lyYXRvbiBkZXMgY2l0YXRpb25zXG4gICAgICAkc2NvcGUucHJvamVjdHMgPSBbXTtcbiAgICAgICRodHRwLmdldCgnL2pzL3NlcnZpY2VzL3Byb2plY3RzLmpzb24nKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnU3VjY2VzcyBRdW90ZXM6ICcgKyBkYXRhKTtcbiAgICAgICAgJHNjb3BlLnByb2plY3RzID0gZnVuY3Rpb25zLnNodWZmbGUoZGF0YSk7XG4gICAgICB9KS5cbiAgICAgIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBRdW90ZXM6ICcgKyBoZWFkZXJzKTtcbiAgICAgIH0pO1xuICAgIH1dXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgnY29udGFjdCcsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9jb250YWN0Lmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRodHRwJywgJ2Z1bmN0aW9ucycsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCBmdW5jdGlvbnMpIHtcbiAgICAgIC8vIFLDqWN1cMOpcmF0b24gZGVzIGluZm9ybWF0aW9ucyBnw6luw6lyYWxlc1xuICAgICAgJHNjb3BlLnNldHRpbmdzID0gW107XG4gICAgICAkaHR0cC5nZXQoJy9qcy9zZXJ2aWNlcy9zZXR0aW5ncy5qc29uJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3MgU2V0dGluZ3M6ICcgKyBkYXRhKTtcbiAgICAgICAgJHNjb3BlLnNldHRpbmdzID0gZGF0YTtcblxuICAgICAgICAkc2NvcGUuc2V0dGluZ3MuaG9iYmllcyA9IGZ1bmN0aW9ucy5zaHVmZmxlKCRzY29wZS5zZXR0aW5ncy5ob2JiaWVzKTtcbiAgICAgIH0pLlxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIFNldHRpbmdzOiAnICsgZGF0YSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gR2VzdGlvbiBkdSBmb3JtdWxhaXJlXG4gICAgICAkc2NvcGUucmVzdWx0ID0gJ2hpZGRlbidcbiAgICAgICRzY29wZS5yZXN1bHRNZXNzYWdlO1xuICAgICAgJHNjb3BlLmZvcm1EYXRhOyAvL2Zvcm1EYXRhIGlzIGFuIG9iamVjdCBob2xkaW5nIHRoZSBuYW1lLCBlbWFpbCwgYW50aXNwYW0sIHN1YmplY3QsIGFuZCBtZXNzYWdlXG4gICAgICAkc2NvcGUuc3VibWl0QnV0dG9uRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICRzY29wZS5zdWJtaXR0ZWQgPSBmYWxzZTsgLy91c2VkIHNvIHRoYXQgZm9ybSBlcnJvcnMgYXJlIHNob3duIG9ubHkgYWZ0ZXIgdGhlIGZvcm0gaGFzIGJlZW4gc3VibWl0dGVkXG4gICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oY29udGFjdGZvcm0pIHtcbiAgICAgICAgJHNjb3BlLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgICRzY29wZS5zdWJtaXRCdXR0b25EaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIGlmIChjb250YWN0Zm9ybS4kdmFsaWQpIHtcbiAgICAgICAgICAkaHR0cCh7XG4gICAgICAgICAgICBtZXRob2QgIDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsICAgICA6ICcvcGhwL2NvbnRhY3QtZm9ybS5waHAnLFxuICAgICAgICAgICAgZGF0YSAgICA6ICQucGFyYW0oJHNjb3BlLmZvcm1EYXRhKSwgIC8vcGFyYW0gbWV0aG9kIGZyb20galF1ZXJ5XG4gICAgICAgICAgICBkYXRhVHlwZSA6ICd0ZXh0JyxcbiAgICAgICAgICAgIGhlYWRlcnMgOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9ICAvL3NldCB0aGUgaGVhZGVycyBzbyBhbmd1bGFyIHBhc3NpbmcgaW5mbyBhcyBmb3JtIGRhdGEgKG5vdCByZXF1ZXN0IHBheWxvYWQpXG4gICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcykgeyAvL3N1Y2Nlc3MgY29tZXMgZnJvbSB0aGUgcmV0dXJuIGpzb24gb2JqZWN0XG4gICAgICAgICAgICAgICRzY29wZS5zdWJtaXRCdXR0b25EaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICRzY29wZS5yZXN1bHRNZXNzYWdlID0gZGF0YS5tZXNzYWdlO1xuICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0PSdiZy1zdWNjZXNzJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICRzY29wZS5zdWJtaXRCdXR0b25EaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0TWVzc2FnZSA9IGRhdGEubWVzc2FnZTtcbiAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdD0nYmctZGFuZ2VyJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUuc3VibWl0QnV0dG9uRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAkc2NvcGUucmVzdWx0TWVzc2FnZSA9ICdNZXJjaSBkZSByZW1wbGlyIHRvdXMgbGVzIGNoYW1wcy4nO1xuICAgICAgICAgICRzY29wZS5yZXN1bHQ9J2JnLWRhbmdlcic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XVxuICB9O1xufSlcbi5kaXJlY3RpdmUoJ21hcCcsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL21hcC5odG1sJyxcbiAgICBjb250cm9sbGVyOiBbJyRzY29wZScsICckaHR0cCcsICdmdW5jdGlvbnMnLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgZnVuY3Rpb25zKSB7XG4gICAgICAvLyBSZW5kZXIgZ29vZ2xlIGN1c3RvbSBtYXBzXG4gICAgICB2YXIgaGhMYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDQ4LjExMDIyMSwtMS42ODMzNDUpO1xuICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XG4gICAgICAgIGNlbnRlcjogaGhMYXRMbmcsXG4gICAgICAgIHpvb206IDE0LFxuICAgICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcbiAgICAgICAgem9vbUNvbnRyb2w6IHRydWUsXG4gICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgZGlzYWJsZURlZmF1bHRVSTogZmFsc2UsXG4gICAgICAgIGRpc2FibGVEb3VibGVDbGlja1pvb206IHRydWUsXG4gICAgICAgIHBhbkNvbnRyb2w6IGZhbHNlLFxuICAgICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2UsXG4gICAgICAgIHN0eWxlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsXG4gICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXG4gICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM0NDQ0NDRcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5sb2NhbGl0eVwiLFxuICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLmljb25cIixcbiAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJsYW5kc2NhcGVcIixcbiAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjZjJmMmYyXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pXCIsXG4gICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkXCIsXG4gICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInNhdHVyYXRpb25cIjogLTEwMFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcImxpZ2h0bmVzc1wiOiA0NVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXlcIixcbiAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmFydGVyaWFsXCIsXG4gICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMuaWNvblwiLFxuICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInRyYW5zaXRcIixcbiAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXG4gICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzFhYmM5Y1wiXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9uXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfTtcbiAgICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtY2FudmFzJyksIG1hcE9wdGlvbnMpO1xuXG4gICAgICB2YXIgY29udGVudFN0cmluZyA9ICc8ZGl2IGlkPVwibWFwLWNvbnRlbnRcIiBzdHlsZT1cIm92ZXJmbG93OiBoaWRkZW47IHdpZHRoOiAyNTBweDtcIj4nK1xuICAgICAgJzxpbWcgc3JjPVwiL2Fzc2V0cy9pbWcvaGFwcHktaG91cnMuanBnXCIgc3R5bGU9XCJmbG9hdDogbGVmdDsgbWFyZ2luLXJpZ2h0OiAxNXB4O1wiIHdpZHRoPVwiMTAwXCIgdGl0bGU9XCJIYXBweSBIb3VycyFcIiAvPicrXG4gICAgICAnPGFkZHJlc3Mgc3R5bGU9XCJjb2xvcjogIzdlODc4ZjsgbGluZS1oZWlnaHQ6IDEuNGVtO1wiPicrXG4gICAgICAnPGEgaHJlZj1cImh0dHA6Ly9oYXBweWgwdXJzLmNvbS9cIiB0aXRsZT1cIkFjY8OpZGVyIGF1IHNpdGUgaW50ZXJuZXQgZFxcJ0hhcHB5IEgwdXJzXCIgc3R5bGU9XCJ0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyBjb2xvcjogIzFhYmM5YzsgdGV4dC1kZWNvcmF0aW9uOiBub25lO1wiPjxzdHJvbmc+SGFwcHkgSG91cnM8L3N0cm9uZz48L2E+PGJyIC8+JytcbiAgICAgICdNYXR0aGlldSBTY2huZWlkZXI8YnIgLz4nK1xuICAgICAgJzIyIFF1YWkgRHVndWF5IFRyb3VpbjxiciAvPicrXG4gICAgICAnMzUwMDAgUkVOTkVTPGJyIC8+JytcbiAgICAgICc8L2FkZHJlc3M+JytcbiAgICAgICc8L2Rpdj4nO1xuXG4gICAgICB2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcbiAgICAgICAgICBjb250ZW50OiBjb250ZW50U3RyaW5nXG4gICAgICB9KTtcblxuICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICBwb3NpdGlvbjogaGhMYXRMbmcsXG4gICAgICAgIG1hcDogbWFwLFxuICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICBpY29uOiAnL2Fzc2V0cy9pbWcvcGlucG9pbnQucG5nJ1xuICAgICAgfSk7XG5cbiAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsbWFya2VyKTtcbiAgICAgIH0pO1xuICAgIH1dXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgnc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgLy8galF1ZXJ5KGVsZW1lbnQpLmJpbmQoJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgY29uc29sZS5sb2codGhpcyk7XG4gICAgLy8gICAgaWYgKHRoaXMucGFnZVlPZmZzZXQgPj0gMTAwKSB7XG4gICAgLy8gICAgICAgIHNjb3BlLmJvb2xDaGFuZ2VDbGFzcyA9IHRydWU7XG4gICAgLy8gICAgICAgIGNvbnNvbGUubG9nKCdTY3JvbGxlZCBiZWxvdyBoZWFkZXIuJyk7XG4gICAgLy8gICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgc2NvcGUuYm9vbENoYW5nZUNsYXNzID0gZmFsc2U7XG4gICAgLy8gICAgICAgIGNvbnNvbGUubG9nKCdIZWFkZXIgaXMgaW4gdmlldy4nKTtcbiAgICAvLyAgICB9XG4gICAgLy8gICBzY29wZS4kYXBwbHkoKTtcbiAgICAvLyB9KTtcbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmhvbWUuaG9tZS1kaXJlY3RpdmUnLCBbXSlcblxuLmRpcmVjdGl2ZSgnaW50cm9kdWN0aW9uJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvaG9tZS1pbnRyb2R1Y3Rpb24uaHRtbCdcbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCdhYm91dCcsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2hvbWUtYWJvdXQuaHRtbCdcbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCdyZXN1bWUnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9ob21lLXJlc3VtZS5odG1sJ1xuICB9O1xufSlcbi5kaXJlY3RpdmUoJ3JlY29tbWFuZGF0aW9ucycsIFsnJHRpbWVvdXQnLCBmdW5jdGlvbigkdGltZW91dCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2hvbWUtcmVjb21tYW5kYXRpb25zLmh0bWwnXG4gIH07XG59XSlcbi5kaXJlY3RpdmUoJ2Jsa3JlY29tbWFuZGF0aW9ucycsIFsnJHBhcnNlJywgJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbigkcGFyc2UsICRyb290U2NvcGUsICR0aW1lb3V0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RpY3Q6ICdBRScsXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgdmFyIGxvYWRDb3VudCA9IDAsXG4gICAgICAgICAgICBsYXN0SW5kZXggPSAwO1xuXG4gICAgICAgIHNjb3BlLiRvbignJHJlcGVhdEZpbmlzaGVkJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgICBsYXN0SW5kZXggPSBkYXRhO1xuICAgICAgICAgIHZhciBvcmlEb21pUGFyYW1zID0ge1xuICAgICAgICAgICAgaFBhbmVsczogNCxcbiAgICAgICAgICAgIHJpcHBsZTogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyB2YXIgJGZvbGRlZCA9ICQoJy5ibG9jJykub3JpRG9taShvcmlEb21pUGFyYW1zKTtcbiAgICAgICAgICAgIC8vICRmb2xkZWQub3JpRG9taSgnYWNjb3JkaW9uJywgNjAsICd0b3AnKTtcbiAgICAgICAgICAgIC8vIHZhciBmb2xkZWQgPSAkZm9sZGVkLm9yaURvbWkodHJ1ZSk7XG4gICAgICAgICAgICAkKCcuY2xpY2snKS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdpbmZpbml0ZScpLmFkZENsYXNzKCdib3VuY2VPdXQnKS5vbmUoJ3dlYmtpdEFuaW1hdGlvbkVuZCBtb3pBbmltYXRpb25FbmQgTVNBbmltYXRpb25FbmQgb2FuaW1hdGlvbmVuZCBhbmltYXRpb25lbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZhZGVPdXQoKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLm5leHQoKS5maW5kKCcudGV4dCcpLmFkZENsYXNzKCdhbmltYXRlZCBmYWRlSW5MZWZ0Jyk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxufV0pXG4uZGlyZWN0aXZlKCdzZXJ2aWNlcycsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2hvbWUtc2VydmljZXMuaHRtbCdcbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCdoaXJlbWUnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9ob21lLWhpcmVtZS5odG1sJ1xuICB9O1xufSlcbi5kaXJlY3RpdmUoJ3NraWxscycsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2hvbWUtc2tpbGxzLmh0bWwnXG4gIH07XG59KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLmhvbWUnLCBbXG4gICdhcHAuaG9tZS5ob21lLWRpcmVjdGl2ZSdcbl0pXG5cbi5jb250cm9sbGVyKCdIb21lQ3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJ2Z1bmN0aW9ucycsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIGZ1bmN0aW9ucykge1xuXG4gIC8vIFLDqWN1cMOpcmF0b24gZGVzIGluZm9ybWF0aW9ucyBnw6luw6lyYWxlc1xuICAkc2NvcGUuc2V0dGluZ3MgPSBbXTtcbiAgJGh0dHAuZ2V0KCcvanMvc2VydmljZXMvc2V0dGluZ3MuanNvbicpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3MgU2V0dGluZ3M6ICcgKyBkYXRhKTtcbiAgICAkc2NvcGUuc2V0dGluZ3MgPSBkYXRhO1xuXG4gICAgJHNjb3BlLnNldHRpbmdzLmhvYmJpZXMgPSBmdW5jdGlvbnMuc2h1ZmZsZSgkc2NvcGUuc2V0dGluZ3MuaG9iYmllcyk7XG4gIH0pLlxuICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBTZXR0aW5nczogJyArIGRhdGEpO1xuICB9KTtcblxuICAvLyBSw6ljdXDDqXJhdG9uIGRlcyBiYWNrZ3JvdW5kc1xuICAkc2NvcGUuYmFja2dyb3VuZHMgPSBbXTtcbiAgJGh0dHAuZ2V0KCcvanMvc2VydmljZXMvYmFja2dyb3VuZHMuanNvbicpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3MgQmFja2dyb3VuZHM6ICcgKyBkYXRhKTtcbiAgICAkc2NvcGUuYmFja2dyb3VuZHMgPSBkYXRhO1xuXG4gICAgJHNjb3BlLmJhY2tncm91bmQgPSAkc2NvcGUuYmFja2dyb3VuZHMuaW1hZ2VzW01hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAkc2NvcGUuYmFja2dyb3VuZHMuaW1hZ2VzLmxlbmd0aCkpXTtcbiAgfSkuXG4gIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgY29uc29sZS5sb2coJ0Vycm9yIEJhY2tncm91bmRzOiAnICsgZGF0YSk7XG4gIH0pO1xuXG4gIC8vIFLDqWN1cMOpcmF0b24gZGVzIGluZm9ybWF0aW9ucyBkdSBDVlxuICAkc2NvcGUucmVzdW1lID0gW107XG4gICRodHRwLmdldCgnL2pzL3NlcnZpY2VzL3Jlc3VtZS5qc29uJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAvLyBjb25zb2xlLmxvZygnU3VjY2VzcyBSZXN1bWU6ICcgKyBkYXRhKTtcbiAgICAkc2NvcGUucmVzdW1lID0gZGF0YTtcbiAgfSkuXG4gIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgY29uc29sZS5sb2coJ0Vycm9yIFJlc3VtZTogJyArIGhlYWRlcnMpO1xuICB9KTtcblxuICAvLyBSw6ljdXDDqXJhdG9uIGRlcyByZWNvbW1hbmRhdGlvbnNcbiAgJHNjb3BlLnJlY29tbWFuZGF0aW9ucyA9IFtdO1xuICAkaHR0cC5nZXQoJy9qcy9zZXJ2aWNlcy9yZWNvbW1hbmRhdGlvbnMuanNvbicpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3MgYnJhbmRzOiAnICsgZGF0YSk7XG4gICAgJHNjb3BlLnJlY29tbWFuZGF0aW9ucyA9IGRhdGE7XG5cbiAgfSkuXG4gIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgY29uc29sZS5sb2coJ0Vycm9yIGJyYW5kczogJyArIGRhdGEpO1xuICB9KTtcblxuICAvLyBSw6ljdXDDqXJhdG9uIGRlcyBzZXJ2aWNlc1xuICAkc2NvcGUuc2VydmljZXMgPSBbXTtcbiAgJGh0dHAuZ2V0KCcvanMvc2VydmljZXMvbXktc2VydmljZXMuanNvbicpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3Mgc2VydmljZXM6ICcgKyBkYXRhKTtcbiAgICAkc2NvcGUuc2VydmljZXMgPSBkYXRhO1xuXG4gIH0pLlxuICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBzZXJ2aWNlczogJyArIGRhdGEpO1xuICB9KTtcblxuICAvLyBSw6ljdXDDqXJhdG9uIGRlcyBza2lsbHNcbiAgJHNjb3BlLnNraWxscyA9IFtdO1xuICAkaHR0cC5nZXQoJy9qcy9zZXJ2aWNlcy9za2lsbHMuanNvbicpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3Mgc2tpbGxzOiAnICsgZGF0YSk7XG4gICAgJHNjb3BlLnNraWxscyA9IGRhdGE7XG4gICAgJHNjb3BlLnNraWxscy5vcHRpb25zID0ge1xuICAgICAgYW5pbWF0ZToge1xuICAgICAgICBkdXJhdGlvbjogMTUwMCxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGJhckNvbG9yOiAnI2U3NGMzYycsXG4gICAgICBzY2FsZUNvbG9yOiBmYWxzZSxcbiAgICAgIGxpbmVXaWR0aDogMTUsXG4gICAgICBzaXplOiAxNzAsXG4gICAgICB0cmFja0NvbG9yOiAnI2U2ZThlZCcsXG4gICAgICBsaW5lQ2FwOiAnY2lyY2xlJ1xuICAgIH07XG4gIH0pLlxuICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBza2lsbHM6ICcgKyBkYXRhKTtcbiAgfSk7XG59XSlcbi5jb250cm9sbGVyKCdMb29wV2F0Y2hDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICRzY29wZS4kd2F0Y2goJyRsYXN0JywgZnVuY3Rpb24obmV3VmFsLCBvbGRWYWwpIHtcbiAgICBuZXdWYWwgJiYgJHNjb3BlLiRlbWl0KCckcmVwZWF0RmluaXNoZWQnLCAkc2NvcGUuJGluZGV4KTtcbiAgfSk7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy5ncmVhdHN0dWZmJywgW10pXG5cbi5jb250cm9sbGVyKCdHcmVhdFN0dWZmQ3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJ2Z1bmN0aW9ucycsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIGZ1bmN0aW9ucykge1xuXG4gIC8vIFLDqWN1cMOpcmF0b24gZGVzIG1hcnF1ZXNcbiAgJHNjb3BlLmJyYW5kcyA9IFtdO1xuICAkaHR0cC5nZXQoJy9qcy9zZXJ2aWNlcy9wb3dlcmVkLWJyYW5kcy5qc29uJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAvLyBjb25zb2xlLmxvZygnU3VjY2VzcyBicmFuZHM6ICcgKyBkYXRhKTtcbiAgICAkc2NvcGUuYnJhbmRzID0gZnVuY3Rpb25zLnNodWZmbGUoZGF0YSk7XG5cbiAgfSkuXG4gIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgY29uc29sZS5sb2coJ0Vycm9yIGJyYW5kczogJyArIGRhdGEpO1xuICB9KTtcblxuICAvLyBSw6ljdXDDqXJhdG9uIGRlcyBiYWNrZ3JvdW5kc1xuICAkc2NvcGUuYmFja2dyb3VuZHMgPSBbXTtcbiAgJGh0dHAuZ2V0KCcvanMvc2VydmljZXMvYmFja2dyb3VuZHMuanNvbicpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3MgQmFja2dyb3VuZHM6ICcgKyBkYXRhKTtcbiAgICAkc2NvcGUuYmFja2dyb3VuZHMgPSBkYXRhO1xuXG4gICAgJHNjb3BlLmJhY2tncm91bmQgPSAkc2NvcGUuYmFja2dyb3VuZHMuaW1hZ2VzW01hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAkc2NvcGUuYmFja2dyb3VuZHMuaW1hZ2VzLmxlbmd0aCkpXTtcbiAgfSkuXG4gIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgY29uc29sZS5sb2coJ0Vycm9yIEJhY2tncm91bmRzOiAnICsgZGF0YSk7XG4gIH0pO1xuICAkc2NvcGUudGl0bGUgPSAnR3JlYXQgc3R1ZmYgaW4gaGVyZSAhJztcbiAgJHNjb3BlLmNvbnRlbnQgPSAnL3BhcnRpYWxzL2dyZWF0LXN0dWZmLmh0bWwnO1xuXG59XSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=