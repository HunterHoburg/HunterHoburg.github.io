var app = angular.module('g4g');

app.controller('friendCtrl', ['$http', '$state', '$stateParams', '$filter', 'reverseFilter', friendCtrl]);

function friendCtrl($http, $state, $stateParams, $filter, reverseFilter) {
  var vm = this;
  // console.log($stateParams);
  vm.userFriendData = $stateParams.data;
  vm.posts = [];
  vm.notFriends = true;
  vm.getFriendData = function(){
    console.log(vm.userFriendData);
    $http({
      method: 'GET',
      url: 'http://localhost:3000/friend/profile',
      headers: {
        friend_id: vm.userFriendData.friend_id,
        user_id: vm.userFriendData.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      if (res.data[0] === 'not friends') {
        Materialize.toast('You are not friends with this person. Add them if you know them!', 7000);
        vm.notFriends = true;
        res.data.shift();
        vm.friendData = res.data[0][0];
        vm.getFriendFriends();
        vm.getFriendSports();
        vm.getFriendHighlights();
      } else {
        vm.notFriends = false;
        vm.friendData = res.data[1][0];
        vm.getFriendFriends();
        vm.getFriendSports();
        vm.getFriendHighlights();
        vm.getFriendPosts();
      }
    })
  }
  vm.getFriendData();
  vm.getFriendFriends = function() {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/friends',
      headers: {
        user_id: vm.userFriendData.friend_id
      }
    }).then(function(res, err) {
      console.log(res);
      vm.friendFriends = res.data;
      vm.friendFriends.push(vm.friendData);
    })
  }
  vm.getFriendPosts = function() {
    console.log('getting friend posts', vm.friendData);
    $http({
      url:  'http://localhost:3000/profilePosts',
      method: 'GET',
      headers: {
        user_id: vm.friendData.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      vm.posts = res.data;
    })
  }
  vm.getFriendSports = function() {
    $http({
      url: 'http://localhost:3000/profileSports',
      method: 'GET',
      headers: {
        user_id: vm.friendData.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      vm.userSports = res.data;
      console.log(vm.userSports);
    })
  }
  vm.getFriendHighlights = function() {
    $http({
      url: 'http://localhost:3000/profileHighlights',
      method: 'GET',
      headers: {
        user_id: vm.friendData.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      vm.highlights = res.data;
      console.log(vm.highlights);
    })
  }

  vm.commentsExpanded = false;
  vm.currentPost = false;
  vm.hidePostComments = function() {
    vm.commentsExpanded = false;
    vm.currentPost = false;
  }
  vm.writingComment = false;
  vm.toggleWriteComment = function(post) {
    vm.getPostComments(post);
    vm.currentPost = post;
    vm.commentsExpanded = !vm.commentsExpanded;
    vm.writingComment = !vm.writingComment;
  }
  vm.getPostComments = function(post) {
    vm.commentsExpanded = true;
    vm.currentPost = post;
    $http({
      url: 'http://localhost:3000/comments',
      method: 'GET',
      headers: {
        post_id: post.post_id,
        user_id: vm.userFriendData.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      vm.posts[vm.posts.indexOf(post)].comments = res.data;
    })
  }
  vm.likePost = function(post) {
    $http({
      method: 'POST',
      url: 'http://localhost:3000/likes',
      data: {
        post_id: post.post_id,
        user_id: vm.userFriendData.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      // TODO: refactor this heinous shit
      if (res.data === 'unliked') {
        vm.posts[vm.posts.indexOf(post)].likes.splice(vm.posts[vm.posts.indexOf(post)].likes.indexOf(vm.userFriendData.user_id), 1);
      } else {
        vm.posts[vm.posts.indexOf(post)].likes.push(vm.userFriendData.user_id)
      }
    })
  }

  vm.getWorkouts = function(workout) {
    console.log(workout);
    $http({
      method: 'GET',
      url: 'http://localhost:3000/' + workout,
      headers: {
        user_id: vm.friendData.user_id,
        workout: workout
      }
    }).then(function(res, err) {
      console.log('workout info: ', res);
      if (res.data == 'none found') {
        Materialize.toast('No data found for this workout.', 2000);
      } else {
        vm.workoutMeta = res.data.shift();
        vm.workouts = res.data;
        if (vm.workoutMeta.type ==='pushups') {
          vm.pushupsChart();
        } else if (vm.workoutMeta.type === 'planks') {
          vm.planksChart();
        }
      }
    })
  }
  vm.pushupsChart = function() {
    var pushupsArr = [];
      console.log(vm.workoutMeta);
      for (var i = 0; i < vm.workouts.length; i++) {
        var tempArr = [];
        var date = new Date($filter('date')(vm.workouts[i].date, 'mediumDate'))
        tempArr.push(date)
        tempArr.push(vm.workouts[i].amount)
        tempArr.push(date);
        pushupsArr.push(tempArr);
      }
      console.log(pushupsArr);

      google.charts.load('current', {'packages':['controls', 'corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('date', 'Date');
        dataTable.addColumn('number', 'amount');
        dataTable.addColumn({type: 'date', role: 'tooltip'});
        dataTable.addRows(pushupsArr)
        var startDate = $filter('date')(vm.workoutMeta.startDate, 'mediumDate');
        var options = {
          backgroundColor: '#fafafa',
          title: 'Pushups Since ' + startDate,
          curveType: 'function',
          legend: {
            position: 'bottom'
          },
          animation: {startup: true, duration: 600, easing: 'out'},
          hAxis: {
            title: 'Date'
          },
          vAxis: {
            title: 'No. of Pushups',
            gridlines: {
              count: -1
            },
            maxValue: vm.workoutMeta.max.amount + Math.round(vm.workoutMeta.max.amount*.2),
            minValue: 0
          },
          pointSize: 4
        }
        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        chart.draw(dataTable, options);
      }
  }
  vm.planksChart = function() {
    var planksArr = [];
    console.log(vm.workoutMeta);
    for (var i = 0; i < vm.workouts.length; i++) {
      var tempArr = [];
      var date = new Date($filter('date')(vm.workouts[i].date, 'mediumDate'))
      tempArr.push(date)
      tempArr.push(vm.workouts[i].amount)
      tempArr.push(date);
      planksArr.push(tempArr);
    }
    console.log(planksArr);

    google.charts.load('current', {'packages':['controls', 'corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn('date', 'Date');
      dataTable.addColumn('number', 'amount');
      dataTable.addColumn({type: 'date', role: 'tooltip'});
      dataTable.addRows(planksArr)
      var startDate = $filter('date')(vm.workoutMeta.startDate, 'mediumDate')
      var options = {
        backgroundColor: '#fafafa',
        title: 'Planks Since ' + startDate,
        curveType: 'function',
        legend: {
          position: 'bottom'
        },
        animation: {startup: true, duration: 600, easing: 'out'},
        hAxis: {
          title: 'Date'
        },
        vAxis: {
          title: 'Plank Duration (milliseconds)',
          gridlines: {
            count: -1
          },
          maxValue: vm.workoutMeta.max.amount + Math.round(vm.workoutMeta.max.amount*.2),
          minValue: 0
        },
        pointSize: 4
      }
      var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
      chart.draw(dataTable, options);
    }
  }


  // TODO: FRIEND REQUESTS AND NOTIFICATIONS, and finish up permissions to view some information for people you aren't friends with and modal for unfriending

  vm.addFriend = function() {
    console.log(vm.friendData);
    $http({
      method: 'POST',
      url: 'http://localhost:3000/friend/request',
      data: {
        user_id: vm.userFriendData.user_id,
        friend_id: vm.friendData.user_id
      }
    })
  }


  vm.search = function(query) {
    console.log(query);
    var jsonObj = {
      user_id: vm.userFriendData.user_id,
      query: query,
      auth: true
    }
    $state.go('search', {data: jsonObj})
  }

  vm.friendPage = function(friend) {
    if (friend.user_id !== vm.userFriendData.user_id) {
      var jsonObj = {
        user_id: vm.userFriendData.user_id,
        friend_id: friend.user_id
      }
      $state.go('friend', {data: jsonObj})
    } else {
      var jsonObj = {
        user_id: vm.userFriendData.user_id,
        auth: true
      }
      $state.go('profile', {user: jsonObj})
    }
  }
  vm.switchNewsFeed = function() {
    console.log('going to news feed');
    var jsonObj = {
      user_id: vm.userFriendData.user_id,
      auth: true
    }
    $state.go('feed', {user: jsonObj})
  }
  vm.switchProfile = function() {
    console.log('going to profile');
    var jsonObj = {
      user_id: vm.userFriendData.user_id,
      auth: true
    }
    $state.go('profile', {user: jsonObj})
  }
}
