var app = angular.module('goalsMaterial', []);

app.controller('indexCtrl', [indexCtrl]);
app.controller('loginCtrl', [loginCtrl]);

function indexCtrl() {
  var vm = this;

  vm.currentUser = {
    name: 'Hunter Hoburg',
    age: 23,
    quote: "'You miss 100% of the shots you don't take'. - Michael Scott",
    sport: 'Lacrosse',
    favoriteAthlete: 'Aaron Ralston',
    otherSports: ['Soccer', 'Endurance Races', 'Baseball'],
    recentPosts: [
      {time: '07/30/16',
      text: 'Something about sports! Cant believe they got that last goal on the final buzzer! #wowee', likes: ['Hunter Hoburg', 'Michelle Leonard', 'Josh Swanson']},
      {time: '07/25/16', text: 'Something about how swoll I am! #GainTrain #SwollToll', likes: []},
      {time: '07/20/16', text: 'Joined G4G today!', likes: []}
    ],
    highlights: [
      'Scored a 7 point basket against the Lions',
      'Bench pressed 1000 stones',
      'Ran a marathon while doing a handstand',
      'Slam dunked a 3-pointer',
      '10 touchdowns in one game',
      'Laxed super hard'
    ]
  }
}

function loginCtrl() {
  var vm = this;

  vm.currentUser = 'testUser'
}
