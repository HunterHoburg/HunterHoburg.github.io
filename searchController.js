var app = angular.module('g4g');

app.controller('searchCtrl', ['$http', '$location', '$state', '$stateParams', searchCtrl]);

function searchCtrl($http, $location, $state, $stateParams) {
  var vm = this;
  vm.searchData = $stateParams.data;
  vm.getUserData = function() {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/search/info',
      headers: {
        user_id: $stateParams.data.user_id,
        query: $stateParams.data.query
      }
    }).then(function(res, err) {
      console.log(res);
      vm.user = res.data[0];
      vm.search(vm.searchData.query, 10, vm.user.zip)
    })
  }
  vm.getUserData();

  vm.search = function(query, radius, zip) {
    console.log(query, radius, zip);
    if(query.length < 1 || radius == undefined || zip == undefined) {
      Materialize.toast('Please select valid search parameters!', 2000)
    } else {
      $http({
        method: 'GET',
        url: 'http://localhost:3000/search/query',
        headers: {
          user_id: vm.user.user_id,
          query: query,
          radius: radius,
          zip: zip
        }
      }).then(function(res, err) {
        console.log(res);
        vm.friends = res.data.shift();
        vm.searchResults = res.data;
      })
    }
  }

  vm.friendPage = function(friend) {
    var jsonObj = {
      user_id: vm.user.user_id,
      friend_id: friend.user_id
    }
    $state.go('friend', {data: jsonObj})
  }
}
