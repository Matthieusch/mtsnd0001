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
.directive('recommandations', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/home-recommandations.html',
    controller: ['$scope', '$http', function ($scope, $http) {
      // Récupératon des recommandations
      $scope.recommandations = [];
      $http.get('/js/services/recommandations.json').success(function(data){
        // console.log('Success brands: ' + data);
        $scope.recommandations = data;

      }).
      error(function(data, status, headers, config) {
        console.log('Error brands: ' + data);
      });
    }]
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
});

