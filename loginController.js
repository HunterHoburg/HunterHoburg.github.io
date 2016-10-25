var app = angular.module('g4g');

app.controller('loginCtrl', ['$http', '$location', '$state', '$stateParams', loginCtrl]);

function loginCtrl($http, $location, $state, $stateParams) {
  var vm = this;

  vm.currentUser = 'testUser';

  vm.loginSubmit = function(user, pass) {
    $http({
      url: 'http://localhost:3000/login',
      method: 'GET',
      headers: {
          username: user,
          password: pass
      }
    }).then(function(res) {
      console.log(res.data);
      console.log('logging in');
      $('#loginModal').closeModal()
      $state.go('profile', {user: res.data})
    });
  }

  vm.registerSubmit = function(user, pass, first, last, date, email, country, zip, gender, agree) {
    console.log('registering');
    var month = date.toString().slice(4, 7);
    var day = date.toString().slice(8, 10);
    var year = date.toString().slice(11, 15);
    $http({
      url: 'http://localhost:3000/register',
      method: 'POST',
      data: {
        username: user,
        password: pass,
        firstname: first,
        lastname: last,
        birthday_month: month,
        birthday_day: day,
        birthday_year: year,
        email_address: email,
        country: country,
        zip: zip,
        user_agreement: true,
        gender: gender
      }
    }).then(function(res, err) {
      console.log('test');
      $('registerModal').closeModal();
      console.log(res);
      // Materialize.toast('Registration Successful! Logging in now.', 2000)
      vm.loginSubmit(user, pass);
    })
  }
}
