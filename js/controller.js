var app = angular.module('hunterPage');

app.controller('MainController', ['$http', MainController]);

function MainController($http) {
  var vm = this;
  vm.postExpanded = false;
  vm.expandPost = function() {
    vm.postExpanded = !vm.postExpanded;
  };
}
