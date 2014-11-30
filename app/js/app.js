'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'snap',
  'duScroll',
  'app.controllers.home',
  'app.directive',
  'app.controllers.greatstuff'
]).
value('duScrollEasing', invertedEasingFunction).
run(function($rootScope, $location, $routeParams, snapRemote){
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

// Functions
function invertedEasingFunction(t) {
  return t<0.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t;
}
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
