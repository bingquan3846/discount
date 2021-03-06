// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
    .constant('ApiEndpoint', {
      url: 'http://192.168.103.6:8100/rest'
    })

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });


  })

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.userToken;
  $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
      .state('app.me', {
          cache: false,
          url: '/me',
          views: {
              'tab-me': {
                  templateUrl: 'templates/me.html',
                  controller:'MeCtrl'
              }
          }
      })
      .state('app.search', {
          cache: false,
          url: '/search',
          views: {
              'tab-search': {
                  templateUrl: 'templates/search.html',
                  controller:'SearchCtrl'
              }
          }
      })
    .state('app.products', {
      url: '/products',
      views: {
        'tab-products': {
          templateUrl: 'templates/products.html',
          controller: 'ProductsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/products/:productId',
    views: {
      'tab-product': {
        templateUrl: 'templates/product.html',
        controller: 'ProductCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/products');
});
