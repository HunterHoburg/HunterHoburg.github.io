var app = angular.module('g4g', ['ui.router', 'ngCookies'])

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
        url: '/profile/{user: json}',
        views: {
          '': {templateUrl: 'templates/profile.html',
          params: {
            user: null
          }
        }
      }
    })
      .state('feed', {
        url: '/feed/{user: json}',
        views: {
          '': {templateUrl: 'templates/feed.html',
          params: {
            user: null
          }
        }
      }
    })
      .state('friend', {
        url: '/friend/{data: json}',
        views: {
          '': {templateUrl: 'templates/friend.html',
          params: {
            data: null
          }
        }
      }
    })
      .state('search', {
        url: '/search/{data: json}',
        views: {
          '': {templateUrl: 'templates/search.html',
          params: {
            data: null
          }
        }
      }
    })
  }
])
