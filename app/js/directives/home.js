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

