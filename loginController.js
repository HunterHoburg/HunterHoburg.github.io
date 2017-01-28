var app = angular.module('g4g');

app.controller('loginCtrl', ['$http', '$location', '$state', '$stateParams', '$cookies', loginCtrl]);

function loginCtrl($http, $location, $state, $stateParams, $cookies) {
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
      if (res.data) {
        $('#loginModal').closeModal()
        $state.go('profile', {user: res.data})
      } else {
        Materialize.toast('Invalid username or password', 3000);
      }
    });
  }

  vm.registerSubmit = function(user, pass, first, last, date, email, country, zip, gender, agree) {
    console.log('registering');
    if (!agree) {
      Materialize.toast('Please agree to the Terms of Use and Privacy Policy if you wish to continue.', 2000)
    } else {
      $('#registerModal').closeModal();
      if ((user == undefined || pass == undefined || first == undefined || last == undefined || date == undefined || email == undefined || country == undefined || zip == undefined || gender == undefined) ) {
        Materialize.toast("Whoops! Looks like you're missing some information.", 3000)
      } else {
        var month = date.toString().slice(4, 7);
        var day = date.toString().slice(8, 10);
        var year = date.toString().slice(11, 15);
        $http({
          url: 'http://localhost:3000/username',
          method: 'GET',
          headers: {
            username: user,
            email: email
          }
        }).then(function(res, err) {
          console.log(res.data);
          if (res.data === false) {
            Materialize.toast('That username or email is already taken. Please try a new one.', 4000);
          } else {
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
        })
      }
    }
  }

  vm.termsExpanded = false;
  vm.showTerms = function() {
    vm.termsExpanded = !vm.termsExpanded;
  }
}
