'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'snap',
  'app.home',
  'app.view2'
]).
run(function($rootScope, $location, $anchorScroll, $routeParams, snapRemote){
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    $location.hash($routeParams.scrollTo);
    $anchorScroll();
  });
  snapRemote.getSnapper().then(function(snapper) {
    snapper.on('close', function(){
      angular.element(document.querySelector('#snap-toggle')).removeClass('active');
    });
    snapper.on('open', function(){
      angular.element(document.querySelector('#snap-toggle')).addClass('active');
    });
  });
}).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]).
config(function(snapRemoteProvider) {
  snapRemoteProvider.globalOptions = {
    touchToDrag: false,
    disable : 'right',
    maxPosition: 265,
    minPosition: -265
  };
});
