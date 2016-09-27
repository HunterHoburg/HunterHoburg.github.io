var app = angular.module('g4g', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
      .state('main', {
        url: '/',
        views: {
          '': {templateUrl: '/main.html'},
          'login@main': {templateUrl: './templates/login.html'
          }
        }
      })
      .state('profile', {
        url: '/profile{user: json}',
        views: {
          '': {templateUrl: 'templates/profile.html',
          params: {
            user: null
          }
        }
      }
    })
  }
])
