'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'snap',
  'duScroll',
  'app.home',
  'app.directive',
  'app.view2'
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
  $routeProvider.otherwise({redirectTo: '/:anchor'});

  $locationProvider.html5Mode(true);
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
