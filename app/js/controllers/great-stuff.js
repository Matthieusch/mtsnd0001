'use strict';

angular.module('app.controllers.greatstuff', [])

.controller('GreatStuffCtrl', ['$scope', '$http', function($scope, $http) {

  // Récupératon des marques
  $scope.brands = [];
  $http.get('/js/services/powered-brands.json').success(function(data){
    console.log('Success brands: ' + data);
    $scope.brands = shuffle(data);

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
