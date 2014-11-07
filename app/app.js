'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'snap',
  'app.home',
  'app.view2'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]).
config(function(snapRemoteProvider) {
  snapRemoteProvider.globalOptions.disable = 'right';
});
