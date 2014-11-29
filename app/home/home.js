'use strict';

angular.module('app.home', [
  'ngRoute',
  'app.home.home-directive'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$document', '$http', function($scope, $document, $http) {

  // Récupératon des informations générales
  $scope.settings = [];
  $http.get('services/settings.json').success(function(data){
    // console.log('Success Settings: ' + data);
    $scope.settings = data;

    $scope.settings.hobbies = shuffle($scope.settings.hobbies);
  }).
  error(function(data, status, headers, config) {
    console.log('Error Settings: ' + data);
  });

  // Récupératon des backgrounds
  $scope.backgrounds = [];
  $http.get('services/backgrounds.json').success(function(data){
    // console.log('Success Backgrounds: ' + data);
    $scope.backgrounds = data;

    $scope.background = $scope.backgrounds.images[Math.floor((Math.random() * $scope.backgrounds.images.length))];
  }).
  error(function(data, status, headers, config) {
    console.log('Error Backgrounds: ' + data);
  });

  // Récupératon des informations du CV
  $scope.resume = [];
  $http.get('services/resume.json').success(function(data){
    // console.log('Success Resume: ' + data);
    $scope.resume = data;
  }).
  error(function(data, status, headers, config) {
    console.log('Error Resume: ' + headers);
  });

  function shuffle(array) {
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

}]);
