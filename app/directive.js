'use strict';

angular.module('app.directive', [])

.directive('header', function() {
  return {
      restrict: 'A',
      // replace: true,
      templateUrl: "partials/header.html",
      controller: ['$scope', function ($scope) {
        // Todo
      }]
    };
})
.directive('footer', function() {
  return {
      restrict: 'A',
      replace: true,
      templateUrl: "partials/footer.html",
      controller: ['$scope', function ($scope) {
        var date = new Date();
        $scope.date = date.getFullYear();
      }]
    };
});
