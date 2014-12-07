'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'snap',
  'duScroll',
  'easypiechart',
  'app.factory',
  'app.controllers.home',
  'app.directive',
  'app.controllers.greatstuff'
]).
run(function($rootScope, $location, $routeParams, snapRemote){
  //Snap Function
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
