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
        $scope.projects = data;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxX2FwcC5qcyIsIjAyX2ZhY3RvcnkuanMiLCIwM19kaXJlY3RpdmVzLzAxX2RpcmVjdGl2ZXMuanMiLCIwM19kaXJlY3RpdmVzLzAyX2hvbWUuanMiLCIwNF9jb250cm9sbGVycy8wMV9ob21lLmpzIiwiMDRfY29udHJvbGxlcnMvMDJfZ3JlYXQtc3R1ZmYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4vLyBEZWNsYXJlIGFwcCBsZXZlbCBtb2R1bGUgd2hpY2ggZGVwZW5kcyBvbiB2aWV3cywgYW5kIGNvbXBvbmVudHNcbmFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG4gICduZ1JvdXRlJyxcbiAgJ25nQW5pbWF0ZScsXG4gICdzbmFwJyxcbiAgJ2R1U2Nyb2xsJyxcbiAgJ2Vhc3lwaWVjaGFydCcsXG4gICdhcHAuZmFjdG9yeScsXG4gICdhcHAuY29udHJvbGxlcnMuaG9tZScsXG4gICdhcHAuZGlyZWN0aXZlJyxcbiAgJ2FwcC5jb250cm9sbGVycy5ncmVhdHN0dWZmJ1xuXSkuXG5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMsIHNuYXBSZW1vdGUpe1xuICAvL1NuYXAgRnVuY3Rpb25cbiAgc25hcFJlbW90ZS5nZXRTbmFwcGVyKCkudGhlbihmdW5jdGlvbihzbmFwcGVyKSB7XG4gICAgc25hcHBlci5vbignY2xvc2UnLCBmdW5jdGlvbigpe1xuICAgICAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbmFwLXRvZ2dsZScpKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgfSk7XG4gICAgc25hcHBlci5vbignb3BlbicsIGZ1bmN0aW9uKCl7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NuYXAtdG9nZ2xlJykpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICB9KTtcbiAgfSk7XG59KS5cbmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKS5oYXNoUHJlZml4KCchJyk7XG5cbiAgJHJvdXRlUHJvdmlkZXIud2hlbignLycsIHt0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9ob21lLmh0bWwnLCBjb250cm9sbGVyOiAnSG9tZUN0cmwnfSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9wYWdlL290aGVyLWdyZWF0LXN0dWZmJywge3RlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3BhZ2UuaHRtbCcsIGNvbnRyb2xsZXI6ICdHcmVhdFN0dWZmQ3RybCd9KTtcbiAgJHJvdXRlUHJvdmlkZXIub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOiAnLyd9KTtcbn1dKS5cbmNvbmZpZyhmdW5jdGlvbihzbmFwUmVtb3RlUHJvdmlkZXIpIHtcbiAgc25hcFJlbW90ZVByb3ZpZGVyLmdsb2JhbE9wdGlvbnMgPSB7XG4gICAgdG91Y2hUb0RyYWc6IGZhbHNlLFxuICAgIGRpc2FibGUgOiAncmlnaHQnLFxuICAgIG1heFBvc2l0aW9uOiAyNjUsXG4gICAgbWluUG9zaXRpb246IC0yNjVcbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmZhY3RvcnknLCBbJ2R1U2Nyb2xsJ10pXG5cbi5mYWN0b3J5KCdmdW5jdGlvbnMnLCBmdW5jdGlvbiBmdW5jdGlvbnNGYWN0b3J5KCkge1xuICByZXR1cm4ge1xuICAgIHNodWZmbGU6IGZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcbiAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleCA7XG5cbiAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XG5cbiAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG5cbiAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuICB9O1xufSlcbi5mYWN0b3J5KCdkdVNjcm9sbEVhc2luZycsIGZ1bmN0aW9uIGR1U2Nyb2xsRWFzaW5nRmFjdG9yeSgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gdDwwLjUgPyAxNip0KnQqdCp0KnQgOiAxKzE2KigtLXQpKnQqdCp0KnQ7XG4gIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmUnLCBbXSlcblxuLmRpcmVjdGl2ZSgnaGVhZGVyJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgLy8gcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiBcIi9wYXJ0aWFscy9oZWFkZXIuaHRtbFwiLFxuICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICAgICAgIC8vIFRvZG9cbiAgICAgIH1dXG4gICAgfTtcbn0pXG4uZGlyZWN0aXZlKCdmb290ZXInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6IFwiL3BhcnRpYWxzL2Zvb3Rlci5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAkc2NvcGUuZGF0ZSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgIH1dXG4gICAgfTtcbn0pXG4uZGlyZWN0aXZlKCdxdW90ZScsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9xdW90ZS5odG1sJyxcbiAgICBjb250cm9sbGVyOiBbJyRzY29wZScsICckaHR0cCcsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwKSB7XG4gICAgICAvLyBSw6ljdXDDqXJhdG9uIGRlcyBjaXRhdGlvbnNcbiAgICAgICRzY29wZS5xdW90ZXMgPSBbXTtcbiAgICAgICRodHRwLmdldCgnL2pzL3NlcnZpY2VzL3F1b3Rlcy5qc29uJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3MgUXVvdGVzOiAnICsgZGF0YSk7XG4gICAgICAgICRzY29wZS5xdW90ZXMgPSBkYXRhO1xuXG4gICAgICAgICRzY29wZS5xdW90ZSA9ICRzY29wZS5xdW90ZXNbTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqICRzY29wZS5xdW90ZXMubGVuZ3RoKSldO1xuICAgICAgfSkuXG4gICAgICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgUXVvdGVzOiAnICsgaGVhZGVycyk7XG4gICAgICB9KTtcbiAgICB9XVxuICB9O1xufSlcbi5kaXJlY3RpdmUoJ3Byb2plY3RzJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Byb2plY3RzLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRodHRwJywgJ2Z1bmN0aW9ucycsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCBmdW5jdGlvbnMpIHtcbiAgICAgIC8vIFLDqWN1cMOpcmF0b24gZGVzIGNpdGF0aW9uc1xuICAgICAgJHNjb3BlLnByb2plY3RzID0gW107XG4gICAgICAkaHR0cC5nZXQoJy9qcy9zZXJ2aWNlcy9wcm9qZWN0cy5qc29uJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3MgUXVvdGVzOiAnICsgZGF0YSk7XG4gICAgICAgICRzY29wZS5wcm9qZWN0cyA9IGRhdGE7XG4gICAgICB9KS5cbiAgICAgIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBRdW90ZXM6ICcgKyBoZWFkZXJzKTtcbiAgICAgIH0pO1xuICAgIH1dXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgnY29udGFjdCcsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9jb250YWN0Lmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRodHRwJywgJ2Z1bmN0aW9ucycsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCBmdW5jdGlvbnMpIHtcbiAgICAgIC8vIFLDqWN1cMOpcmF0b24gZGVzIGluZm9ybWF0aW9ucyBnw6luw6lyYWxlc1xuICAgICAgJHNjb3BlLnNldHRpbmdzID0gW107XG4gICAgICAkaHR0cC5nZXQoJy9qcy9zZXJ2aWNlcy9zZXR0aW5ncy5qc29uJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3MgU2V0dGluZ3M6ICcgKyBkYXRhKTtcbiAgICAgICAgJHNjb3BlLnNldHRpbmdzID0gZGF0YTtcblxuICAgICAgICAkc2NvcGUuc2V0dGluZ3MuaG9iYmllcyA9IGZ1bmN0aW9ucy5zaHVmZmxlKCRzY29wZS5zZXR0aW5ncy5ob2JiaWVzKTtcbiAgICAgIH0pLlxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIFNldHRpbmdzOiAnICsgZGF0YSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gR2VzdGlvbiBkdSBmb3JtdWxhaXJlXG4gICAgICAkc2NvcGUucmVzdWx0ID0gJ2hpZGRlbidcbiAgICAgICRzY29wZS5yZXN1bHRNZXNzYWdlO1xuICAgICAgJHNjb3BlLmZvcm1EYXRhOyAvL2Zvcm1EYXRhIGlzIGFuIG9iamVjdCBob2xkaW5nIHRoZSBuYW1lLCBlbWFpbCwgYW50aXNwYW0sIHN1YmplY3QsIGFuZCBtZXNzYWdlXG4gICAgICAkc2NvcGUuc3VibWl0QnV0dG9uRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICRzY29wZS5zdWJtaXR0ZWQgPSBmYWxzZTsgLy91c2VkIHNvIHRoYXQgZm9ybSBlcnJvcnMgYXJlIHNob3duIG9ubHkgYWZ0ZXIgdGhlIGZvcm0gaGFzIGJlZW4gc3VibWl0dGVkXG4gICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oY29udGFjdGZvcm0pIHtcbiAgICAgICAgJHNjb3BlLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgICRzY29wZS5zdWJtaXRCdXR0b25EaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIGlmIChjb250YWN0Zm9ybS4kdmFsaWQpIHtcbiAgICAgICAgICAkaHR0cCh7XG4gICAgICAgICAgICBtZXRob2QgIDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsICAgICA6ICcvcGhwL2NvbnRhY3QtZm9ybS5waHAnLFxuICAgICAgICAgICAgZGF0YSAgICA6ICQucGFyYW0oJHNjb3BlLmZvcm1EYXRhKSwgIC8vcGFyYW0gbWV0aG9kIGZyb20galF1ZXJ5XG4gICAgICAgICAgICBkYXRhVHlwZSA6ICd0ZXh0JyxcbiAgICAgICAgICAgIGhlYWRlcnMgOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9ICAvL3NldCB0aGUgaGVhZGVycyBzbyBhbmd1bGFyIHBhc3NpbmcgaW5mbyBhcyBmb3JtIGRhdGEgKG5vdCByZXF1ZXN0IHBheWxvYWQpXG4gICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MpIHsgLy9zdWNjZXNzIGNvbWVzIGZyb20gdGhlIHJldHVybiBqc29uIG9iamVjdFxuICAgICAgICAgICAgICAkc2NvcGUuc3VibWl0QnV0dG9uRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0TWVzc2FnZSA9IGRhdGEubWVzc2FnZTtcbiAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdD0nYmctc3VjY2Vzcyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkc2NvcGUuc3VibWl0QnV0dG9uRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdE1lc3NhZ2UgPSBkYXRhLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICRzY29wZS5yZXN1bHQ9J2JnLWRhbmdlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLnN1Ym1pdEJ1dHRvbkRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgJHNjb3BlLnJlc3VsdE1lc3NhZ2UgPSAnTWVyY2kgZGUgcmVtcGxpciB0b3VzIGxlcyBjaGFtcHMuJztcbiAgICAgICAgICAkc2NvcGUucmVzdWx0PSdiZy1kYW5nZXInO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfV1cbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCdtYXAnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9tYXAuaHRtbCcsXG4gICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGh0dHAnLCAnZnVuY3Rpb25zJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsIGZ1bmN0aW9ucykge1xuICAgICAgLy8gUmVuZGVyIGdvb2dsZSBjdXN0b20gbWFwc1xuICAgICAgdmFyIGhoTGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg0OC4xMTAyMjEsLTEuNjgzMzQ1KTtcbiAgICAgIHZhciBtYXBPcHRpb25zID0ge1xuICAgICAgICBjZW50ZXI6IGhoTGF0TG5nLFxuICAgICAgICB6b29tOiAxNCxcbiAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXG4gICAgICAgIHpvb21Db250cm9sOiB0cnVlLFxuICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgIGRpc2FibGVEZWZhdWx0VUk6IGZhbHNlLFxuICAgICAgICBkaXNhYmxlRG91YmxlQ2xpY2tab29tOiB0cnVlLFxuICAgICAgICBwYW5Db250cm9sOiBmYWxzZSxcbiAgICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICBzdHlsZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLFxuICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNDQ0NDQ0XCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmUubG9jYWxpdHlcIixcbiAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy5pY29uXCIsXG4gICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlXCIsXG4gICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiI2YyZjJmMlwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxuICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZFwiLFxuICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJzYXR1cmF0aW9uXCI6IC0xMDBcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJsaWdodG5lc3NcIjogNDVcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5oaWdod2F5XCIsXG4gICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxuICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLmljb25cIixcbiAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ0cmFuc2l0XCIsXG4gICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxuICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMxYWJjOWNcIlxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvblwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH07XG4gICAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLWNhbnZhcycpLCBtYXBPcHRpb25zKTtcblxuICAgICAgdmFyIGNvbnRlbnRTdHJpbmcgPSAnPGRpdiBpZD1cIm1hcC1jb250ZW50XCIgc3R5bGU9XCJvdmVyZmxvdzogaGlkZGVuOyB3aWR0aDogMjUwcHg7XCI+JytcbiAgICAgICc8aW1nIHNyYz1cIi9hc3NldHMvaW1nL2hhcHB5LWhvdXJzLmpwZ1wiIHN0eWxlPVwiZmxvYXQ6IGxlZnQ7IG1hcmdpbi1yaWdodDogMTVweDtcIiB3aWR0aD1cIjEwMFwiIHRpdGxlPVwiSGFwcHkgSG91cnMhXCIgLz4nK1xuICAgICAgJzxhZGRyZXNzIHN0eWxlPVwiY29sb3I6ICM3ZTg3OGY7IGxpbmUtaGVpZ2h0OiAxLjRlbTtcIj4nK1xuICAgICAgJzxhIGhyZWY9XCJodHRwOi8vaGFwcHloMHVycy5jb20vXCIgdGl0bGU9XCJBY2PDqWRlciBhdSBzaXRlIGludGVybmV0IGRcXCdIYXBweSBIMHVyc1wiIHN0eWxlPVwidGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgY29sb3I6ICMxYWJjOWM7IHRleHQtZGVjb3JhdGlvbjogbm9uZTtcIj48c3Ryb25nPkhhcHB5IEhvdXJzPC9zdHJvbmc+PC9hPjxiciAvPicrXG4gICAgICAnTWF0dGhpZXUgU2NobmVpZGVyPGJyIC8+JytcbiAgICAgICcyMiBRdWFpIER1Z3VheSBUcm91aW48YnIgLz4nK1xuICAgICAgJzM1MDAwIFJFTk5FUzxiciAvPicrXG4gICAgICAnPC9hZGRyZXNzPicrXG4gICAgICAnPC9kaXY+JztcblxuICAgICAgdmFyIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG4gICAgICAgICAgY29udGVudDogY29udGVudFN0cmluZ1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgcG9zaXRpb246IGhoTGF0TG5nLFxuICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcbiAgICAgICAgaWNvbjogJy9hc3NldHMvaW1nL3BpbnBvaW50LnBuZydcbiAgICAgIH0pO1xuXG4gICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpbmZvd2luZG93Lm9wZW4obWFwLG1hcmtlcik7XG4gICAgICB9KTtcbiAgICB9XVxuICB9O1xufSlcbi5kaXJlY3RpdmUoJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgIC8vIGpRdWVyeShlbGVtZW50KS5iaW5kKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgIC8vICAgIGlmICh0aGlzLnBhZ2VZT2Zmc2V0ID49IDEwMCkge1xuICAgIC8vICAgICAgICBzY29wZS5ib29sQ2hhbmdlQ2xhc3MgPSB0cnVlO1xuICAgIC8vICAgICAgICBjb25zb2xlLmxvZygnU2Nyb2xsZWQgYmVsb3cgaGVhZGVyLicpO1xuICAgIC8vICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgIHNjb3BlLmJvb2xDaGFuZ2VDbGFzcyA9IGZhbHNlO1xuICAgIC8vICAgICAgICBjb25zb2xlLmxvZygnSGVhZGVyIGlzIGluIHZpZXcuJyk7XG4gICAgLy8gICAgfVxuICAgIC8vICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgLy8gfSk7XG4gIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5ob21lLmhvbWUtZGlyZWN0aXZlJywgW10pXG5cbi5kaXJlY3RpdmUoJ2ludHJvZHVjdGlvbicsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2hvbWUtaW50cm9kdWN0aW9uLmh0bWwnXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgnYWJvdXQnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9ob21lLWFib3V0Lmh0bWwnXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgncmVzdW1lJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvaG9tZS1yZXN1bWUuaHRtbCdcbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCdyZWNvbW1hbmRhdGlvbnMnLCBbJyR0aW1lb3V0JywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9ob21lLXJlY29tbWFuZGF0aW9ucy5odG1sJ1xuICB9O1xufV0pXG4uZGlyZWN0aXZlKCdibGtyZWNvbW1hbmRhdGlvbnMnLCBbJyRwYXJzZScsICckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24oJHBhcnNlLCAkcm9vdFNjb3BlLCAkdGltZW91dCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0aWN0OiAnQUUnLFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHZhciBsb2FkQ291bnQgPSAwLFxuICAgICAgICAgICAgbGFzdEluZGV4ID0gMDtcblxuICAgICAgICBzY29wZS4kb24oJyRyZXBlYXRGaW5pc2hlZCcsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgICAgbGFzdEluZGV4ID0gZGF0YTtcbiAgICAgICAgICB2YXIgb3JpRG9taVBhcmFtcyA9IHtcbiAgICAgICAgICAgIGhQYW5lbHM6IDQsXG4gICAgICAgICAgICByaXBwbGU6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gdmFyICRmb2xkZWQgPSAkKCcuYmxvYycpLm9yaURvbWkob3JpRG9taVBhcmFtcyk7XG4gICAgICAgICAgICAvLyAkZm9sZGVkLm9yaURvbWkoJ2FjY29yZGlvbicsIDYwLCAndG9wJyk7XG4gICAgICAgICAgICAvLyB2YXIgZm9sZGVkID0gJGZvbGRlZC5vcmlEb21pKHRydWUpO1xuICAgICAgICAgICAgJCgnLmNsaWNrJykuYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnaW5maW5pdGUnKS5hZGRDbGFzcygnYm91bmNlT3V0Jykub25lKCd3ZWJraXRBbmltYXRpb25FbmQgbW96QW5pbWF0aW9uRW5kIE1TQW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQgYW5pbWF0aW9uZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5mYWRlT3V0KCk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5uZXh0KCkuZmluZCgnLnRleHQnKS5hZGRDbGFzcygnYW5pbWF0ZWQgZmFkZUluTGVmdCcpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbn1dKVxuLmRpcmVjdGl2ZSgnc2VydmljZXMnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9ob21lLXNlcnZpY2VzLmh0bWwnXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgnaGlyZW1lJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvaG9tZS1oaXJlbWUuaHRtbCdcbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCdza2lsbHMnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9ob21lLXNraWxscy5odG1sJ1xuICB9O1xufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy5ob21lJywgW1xuICAnYXBwLmhvbWUuaG9tZS1kaXJlY3RpdmUnXG5dKVxuXG4uY29udHJvbGxlcignSG9tZUN0cmwnLCBbJyRzY29wZScsICckaHR0cCcsICdmdW5jdGlvbnMnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCBmdW5jdGlvbnMpIHtcblxuICAvLyBSw6ljdXDDqXJhdG9uIGRlcyBpbmZvcm1hdGlvbnMgZ8OpbsOpcmFsZXNcbiAgJHNjb3BlLnNldHRpbmdzID0gW107XG4gICRodHRwLmdldCgnL2pzL3NlcnZpY2VzL3NldHRpbmdzLmpzb24nKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgIC8vIGNvbnNvbGUubG9nKCdTdWNjZXNzIFNldHRpbmdzOiAnICsgZGF0YSk7XG4gICAgJHNjb3BlLnNldHRpbmdzID0gZGF0YTtcblxuICAgICRzY29wZS5zZXR0aW5ncy5ob2JiaWVzID0gZnVuY3Rpb25zLnNodWZmbGUoJHNjb3BlLnNldHRpbmdzLmhvYmJpZXMpO1xuICB9KS5cbiAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICBjb25zb2xlLmxvZygnRXJyb3IgU2V0dGluZ3M6ICcgKyBkYXRhKTtcbiAgfSk7XG5cbiAgLy8gUsOpY3Vww6lyYXRvbiBkZXMgYmFja2dyb3VuZHNcbiAgJHNjb3BlLmJhY2tncm91bmRzID0gW107XG4gICRodHRwLmdldCgnL2pzL3NlcnZpY2VzL2JhY2tncm91bmRzLmpzb24nKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgIC8vIGNvbnNvbGUubG9nKCdTdWNjZXNzIEJhY2tncm91bmRzOiAnICsgZGF0YSk7XG4gICAgJHNjb3BlLmJhY2tncm91bmRzID0gZGF0YTtcblxuICAgICRzY29wZS5iYWNrZ3JvdW5kID0gJHNjb3BlLmJhY2tncm91bmRzLmltYWdlc1tNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogJHNjb3BlLmJhY2tncm91bmRzLmltYWdlcy5sZW5ndGgpKV07XG4gIH0pLlxuICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBCYWNrZ3JvdW5kczogJyArIGRhdGEpO1xuICB9KTtcblxuICAvLyBSw6ljdXDDqXJhdG9uIGRlcyBpbmZvcm1hdGlvbnMgZHUgQ1ZcbiAgJHNjb3BlLnJlc3VtZSA9IFtdO1xuICAkaHR0cC5nZXQoJy9qcy9zZXJ2aWNlcy9yZXN1bWUuanNvbicpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3MgUmVzdW1lOiAnICsgZGF0YSk7XG4gICAgJHNjb3BlLnJlc3VtZSA9IGRhdGE7XG4gIH0pLlxuICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBSZXN1bWU6ICcgKyBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgLy8gUsOpY3Vww6lyYXRvbiBkZXMgcmVjb21tYW5kYXRpb25zXG4gICRzY29wZS5yZWNvbW1hbmRhdGlvbnMgPSBbXTtcbiAgJGh0dHAuZ2V0KCcvanMvc2VydmljZXMvcmVjb21tYW5kYXRpb25zLmpzb24nKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgIC8vIGNvbnNvbGUubG9nKCdTdWNjZXNzIGJyYW5kczogJyArIGRhdGEpO1xuICAgICRzY29wZS5yZWNvbW1hbmRhdGlvbnMgPSBkYXRhO1xuXG4gIH0pLlxuICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBicmFuZHM6ICcgKyBkYXRhKTtcbiAgfSk7XG5cbiAgLy8gUsOpY3Vww6lyYXRvbiBkZXMgc2VydmljZXNcbiAgJHNjb3BlLnNlcnZpY2VzID0gW107XG4gICRodHRwLmdldCgnL2pzL3NlcnZpY2VzL215LXNlcnZpY2VzLmpzb24nKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgIC8vIGNvbnNvbGUubG9nKCdTdWNjZXNzIHNlcnZpY2VzOiAnICsgZGF0YSk7XG4gICAgJHNjb3BlLnNlcnZpY2VzID0gZGF0YTtcblxuICB9KS5cbiAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICBjb25zb2xlLmxvZygnRXJyb3Igc2VydmljZXM6ICcgKyBkYXRhKTtcbiAgfSk7XG5cbiAgLy8gUsOpY3Vww6lyYXRvbiBkZXMgc2tpbGxzXG4gICRzY29wZS5za2lsbHMgPSBbXTtcbiAgJGh0dHAuZ2V0KCcvanMvc2VydmljZXMvc2tpbGxzLmpzb24nKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgIC8vIGNvbnNvbGUubG9nKCdTdWNjZXNzIHNraWxsczogJyArIGRhdGEpO1xuICAgICRzY29wZS5za2lsbHMgPSBkYXRhO1xuICAgICRzY29wZS5za2lsbHMub3B0aW9ucyA9IHtcbiAgICAgIGFuaW1hdGU6IHtcbiAgICAgICAgZHVyYXRpb246IDE1MDAsXG4gICAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBiYXJDb2xvcjogJyNlNzRjM2MnLFxuICAgICAgc2NhbGVDb2xvcjogZmFsc2UsXG4gICAgICBsaW5lV2lkdGg6IDE1LFxuICAgICAgc2l6ZTogMTcwLFxuICAgICAgdHJhY2tDb2xvcjogJyNlNmU4ZWQnLFxuICAgICAgbGluZUNhcDogJ2NpcmNsZSdcbiAgICB9O1xuICB9KS5cbiAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICBjb25zb2xlLmxvZygnRXJyb3Igc2tpbGxzOiAnICsgZGF0YSk7XG4gIH0pO1xufV0pXG4uY29udHJvbGxlcignTG9vcFdhdGNoQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAkc2NvcGUuJHdhdGNoKCckbGFzdCcsIGZ1bmN0aW9uKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgbmV3VmFsICYmICRzY29wZS4kZW1pdCgnJHJlcGVhdEZpbmlzaGVkJywgJHNjb3BlLiRpbmRleCk7XG4gIH0pO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMuZ3JlYXRzdHVmZicsIFtdKVxuXG4uY29udHJvbGxlcignR3JlYXRTdHVmZkN0cmwnLCBbJyRzY29wZScsICckaHR0cCcsICdmdW5jdGlvbnMnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCBmdW5jdGlvbnMpIHtcblxuICAvLyBSw6ljdXDDqXJhdG9uIGRlcyBtYXJxdWVzXG4gICRzY29wZS5icmFuZHMgPSBbXTtcbiAgJGh0dHAuZ2V0KCcvanMvc2VydmljZXMvcG93ZXJlZC1icmFuZHMuanNvbicpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gY29uc29sZS5sb2coJ1N1Y2Nlc3MgYnJhbmRzOiAnICsgZGF0YSk7XG4gICAgJHNjb3BlLmJyYW5kcyA9IGZ1bmN0aW9ucy5zaHVmZmxlKGRhdGEpO1xuXG4gIH0pLlxuICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBicmFuZHM6ICcgKyBkYXRhKTtcbiAgfSk7XG5cbiAgLy8gUsOpY3Vww6lyYXRvbiBkZXMgYmFja2dyb3VuZHNcbiAgJHNjb3BlLmJhY2tncm91bmRzID0gW107XG4gICRodHRwLmdldCgnL2pzL3NlcnZpY2VzL2JhY2tncm91bmRzLmpzb24nKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgIC8vIGNvbnNvbGUubG9nKCdTdWNjZXNzIEJhY2tncm91bmRzOiAnICsgZGF0YSk7XG4gICAgJHNjb3BlLmJhY2tncm91bmRzID0gZGF0YTtcblxuICAgICRzY29wZS5iYWNrZ3JvdW5kID0gJHNjb3BlLmJhY2tncm91bmRzLmltYWdlc1tNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogJHNjb3BlLmJhY2tncm91bmRzLmltYWdlcy5sZW5ndGgpKV07XG4gIH0pLlxuICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBCYWNrZ3JvdW5kczogJyArIGRhdGEpO1xuICB9KTtcbiAgJHNjb3BlLnRpdGxlID0gJ0dyZWF0IHN0dWZmIGluIGhlcmUgISc7XG4gICRzY29wZS5jb250ZW50ID0gJy9wYXJ0aWFscy9ncmVhdC1zdHVmZi5odG1sJztcblxufV0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9