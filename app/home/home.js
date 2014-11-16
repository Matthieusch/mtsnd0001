'use strict';

angular.module('app.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/accueil', {
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

  $scope.resume = {
    experiences : [
      {
        name: 'Front-End Web Developper',
        employer: 'Yellowcake',
        dates: '2012 - Aujourd\'hui',
        functions: [
          'Développements et intégration de sites web : desktop, mobile ou responsive',
          'Développements d’applications web pour terminaux mobiles',
          'Responsable du logiciel de gestion de versions décentralisé'
        ]
      },
      {
        name: 'Front-End Web Developper',
        employer: 'nouvelle MARQUE',
        dates: '2010 - 2012',
        functions: [
          'Développements et intégration de sites web desktop sur les CMS : Liferay, Roller, Posterous ou WordPress',
          'Responsable R&D des plateformes sociales'
        ]
      },
      {
        name: 'Intégrateur / Concepteur e-learning',
        employer: 'NetOpen',
        dates: '2009 - 2009',
        functions: [
          'Intégration de contenus e-learning sur une plateforme propriétaire'
        ]
      },
      {
        name: 'Enseignant vacataire',
        employer: 'UTT',
        dates: '2009 - 2009',
        functions: [
          'Formation des étudiants à l’UV : multimédia, du projet à la réalisation'
        ]
      },
    ],
    educations: [
      {
        name: 'Licence Professionelle',
        school: 'IUT de Troyes',
        dates: '2008 - 2009',
        functions: [
          'Ingénierie de l\'internet et du multimédia',
          'Création de solutions web pour l’entreprise : conception de sites, marketing pour le web et système d’information',
          'Ingénierie du projet multimédia : gestion de projet web, management d’équipe et documentation pour le projet'
        ]
      },
      {
        name: 'Diplôme Universitaire de Technologie',
        school: 'IUT de Haguenau',
        dates: '2006 - 2009',
        functions: [
          'Services et Réseaux de Communication',
          'Communication et élaboration de services sur le web',
          'Développement et mise en oeuvre des technologies informatiques et des réseaux',
          'Vice-président de l\'association étudiante'
        ]
      },
      {
        name: 'Baccalauréat STI',
        school: 'Lycée Théodore Deck Guebwiller',
        dates: '2004 - 2006',
        functions: [
          'Génie électronique',
          'Représentant des étudiants au Conseil d\'Administration de l\'établissement'
        ]
      }
    ]
  };

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
