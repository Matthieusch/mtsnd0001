'use strict';

angular.module('app.controllers.home', [
  'app.home.home-directive'
])

.controller('HomeCtrl', ['$scope', '$document', '$http', function($scope, $document, $http) {

  // Récupératon des informations générales
  $scope.settings = [];
  $http.get('/js/services/settings.json').success(function(data){
    // console.log('Success Settings: ' + data);
    $scope.settings = data;

    $scope.settings.hobbies = shuffle($scope.settings.hobbies);
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

}]);
