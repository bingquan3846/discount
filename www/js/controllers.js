angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    if($scope.loginData.username == 'admin' && $scope.loginData.password == 'admin'){
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    }else{
        $scope.modal.show();
        $scope.error = '用户名或者密码错误';
    }

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system


  };
})

.controller('ProductsCtrl', function($scope, Products, $ionicSideMenuDelegate) {
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.products = Products.all();
        $scope.deRefresh = function(){
            console.log('refresh');
            $newItem = Products.all();
            $scope.products = $scope.products.concat($newItem);
        }
})

.controller('ProductCtrl', function($scope, $stateParams, Products) {
    $scope.product = Products.get($stateParams.productId);
});
