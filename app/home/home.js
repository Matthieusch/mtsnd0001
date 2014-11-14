'use strict';

angular.module('app.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', function($scope) {
  $scope.settings = {
    author: {
      name: 'Matthieu Schneider',
      job: 'Senior Front-End Web Developer',
      picture: 'files/matthieu-schneider_front-end-web-developer.jpg',
      resume: 'files/matthieu-schneider_front-end-web-developer.pdf',
      headline: 'Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non  mauris vitae erat consequat auctor eu in elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      description: 'Mauris in erat justo. Nullam ac urna eu felis dapibus condimentum sit amet a augue. Sed non neque elit. Sed ut imperdiet nisi. Proin condimentum fermentum nunc. Etiam pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque.',
      birthday: '27/02/1998',
      phone: '+33 6 45 79 09 99',
      email: 'matthieu.snd@gmail.com',
      address: 'Rennes - FRANCE'
    },
    profiles : [
      {
        link: 'https://twitter.com/Matthieusch',
        service: 'twitter'
      },
      {
        link: 'fr.linkedin.com/in/matthieusch/',
        service: 'linkedin'
      }
    ],
    hobbies : [
      {
        id: 'cycle',
        name: 'Pignon fixe'
      },
      {
        id: 'coffe',
        name: 'Café'
      },
      {
        id: 'gamepad',
        name: 'Jeux vidéos'
      },
      {
        id: 'facetime-video',
        name: 'Cinéma'
      },
      {
        id: 'headphones',
        name: 'Musique'
      },
      {
        id: 'apple',
        name: 'Mac OS'
      },
      {
        id: 'rocket',
        name: 'Astronomie'
      },
      {
        id: 'beer',
        name: 'Bière'
      }
    ]
  };

  $scope.settings.hobbies = shuffle($scope.settings.hobbies);

  $scope.backgrounds = [
    {src: 'files/backgrounds/background-1.jpg'},
    {src: 'files/backgrounds/background-2.jpg'}
  ];
  $scope.background = $scope.backgrounds[Math.floor((Math.random() * 2))];

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
