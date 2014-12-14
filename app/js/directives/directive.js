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
