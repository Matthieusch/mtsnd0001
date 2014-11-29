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
.directive('map', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/home-map.html'
  };
});
