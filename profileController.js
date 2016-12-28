var app = angular.module('g4g');

app.controller('profileCtrl', ['$http', '$state', '$stateParams', '$filter', 'formatTimeFilter', 'reverseFilter', profileCtrl]);

function profileCtrl($http, $state, $stateParams, $filter, formatTimeFilter, reverseFilter) {
  var vm = this;
  vm.user = $stateParams.user;
  vm.printStateParams = function() {
    console.log(vm.user);
  }
  vm.printStateParams();
  vm.userPosts = [];
  vm.userNotifications = [];

  vm.getUserData = function() {
    console.log('gettingUserData');
    $http({
      url: 'http://localhost:3000/profileData',
      method: 'GET',
      headers: {
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      vm.user = res.data[0];
      vm.notifications();
      vm.getUserHighlights();
      vm.getUserPosts();
      vm.getUserFriends();
      vm.getUserSports();
    })
  }
  vm.getUserData();

  // NOTIFICATIONS
  vm.notifications = function() {
    vm.responding = false;
    vm.userNotifications = [];
    $http({
      method: 'GET',
      url: 'http://localhost:3000/profile/notifications',
      headers: {
        user_id: vm.user.user_id
      }
    }).then(function(res) {
      console.log('notifications: ', res);
      // vm.notifications = res.data;
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].type === 'request') {
          var request = {
            first: res.data[i].first,
            last: res.data[i].last,
            id: res.data[i].id,
            user_id: res.data[i].user_id,
            date: res.data[i].date,
            type: res.data[i].type
          }
          vm.userNotifications.push(request);
        }
      }
    })
  }
  vm.responding = false;
  vm.requestResponse = function(bool, friend_id) {
    // vm.userNotifications.indexOf()
    $http({
      method: 'POST',
      url: 'http://localhost:3000/friend/response',
      data: {
        friend_id: friend_id,
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      if (res.data == 'success'){
        vm.getUserFriends();
        vm.responding = false;
        vm.notifications();
      }
    })
  }

  // POSTS
  vm.getUserPosts = function() {
    $http({
      url: 'http://localhost:3000/profilePosts',
      method: 'GET',
      headers: {
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      for (var i = 0; i < res.data.length; i++){
        res.data[i].comments = [];
      }
      vm.userPosts = res.data;
      console.log(vm.userPosts);
    })
  }
  vm.postWrite = false;
  vm.creatingPost = function() {
    vm.postWrite = !vm.postWrite;
  }
  vm.createPost = function(text) {
    $http({
      method: 'POST',
      url: 'http://localhost:3000/posts',
      data: {
        text: text,
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      if (res.data.length > 0) {
        vm.postWrite = false;
        vm.userPosts.push(res.data[0]);
      }
      $('#PCon_prefix2').val('')
    })
  }
  vm.likePost = function(post) {
    $http({
      method: 'POST',
      url: 'http://localhost:3000/likes',
      data: {
        post_id: post.post_id,
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      // TODO: refactor this heinous shit
      if (res.data === 'unliked') {
        vm.userPosts[vm.userPosts.indexOf(post)].likes.splice(vm.userPosts[vm.userPosts.indexOf(post)].likes.indexOf(vm.user.user_id), 1);
      } else {
        vm.userPosts[vm.userPosts.indexOf(post)].likes.push(vm.user.user_id)
      }
    })
  }
  vm.deletePost = function(post) {
    console.log(post);
    $http({
      method: 'DELETE',
      url: 'http://localhost:3000/posts',
      headers: {
        post_id: post.post_id,
        has_comments: post.has_comments,
        user_id: post.user_id
      }
    }).then(function(res, err) {
      console.log(res);
    })
  }

  vm.getUserSports = function() {
    $http({
      url: 'http://localhost:3000/profileSports',
      method: 'GET',
      headers: {
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      vm.userSports = res.data;
      console.log(vm.userSports);
    })
  }
  vm.getUserHighlights = function() {
    $http({
      url: 'http://localhost:3000/profileHighlights',
      method: 'GET',
      headers: {
        user_id: vm.user.user_id
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
  //TODO: refactor this into togglePostComments function where it checks to see if the post.has_comments is true and if the comments are on the post yet and makes the http request conditionally
  vm.getPostComments = function(post) {
    vm.commentsExpanded = true;
    vm.currentPost = post;
    $http({
      url: 'http://localhost:3000/comments',
      method: 'GET',
      headers: {
        post_id: post.post_id,
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      vm.userPosts[vm.userPosts.indexOf(post)].comments = res.data;
    })
  }

  // TODO: create filter to apply friend's name to comment or user's name if they wrote the comment
  vm.writingComment = false;
  vm.toggleWriteComment = function(post) {
    vm.getPostComments(post);
    vm.currentPost = post;
    // vm.commentsExpanded = !vm.commentsExpanded;
    vm.writingComment = !vm.writingComment;
  }
  vm.createComment = function(text, post) {
    console.log('creating comment: ', text, post.post_id);
    $http({
      method: 'POST',
      url: 'http://localhost:3000/comments',
      data: {
        text: text,
        post_id: post.post_id,
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      console.log(vm.userPosts[vm.userPosts.indexOf(post)]);
      vm.userPosts[vm.userPosts.indexOf(post)].comments.push(res.data[0])
      vm.writingComment = false;
      vm.commentsExpanded = true;
    })
  }
  vm.deleteComment = function(comment, post) {
    console.log('deleting comment: ', comment, vm.currentPost);
    $http({
      method: 'DELETE',
      url: 'http://localhost:3000/comments',
      headers: {
        comment_id: comment.id,
        post_id: comment.post_id,
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      for (var i = 0; i < vm.currentPost.comments.length; i++) {
        if (vm.currentPost.comments[i].id === comment.id) {
          vm.currentPost.comments.splice(i, 1);
        }
      }
      console.log(vm.currentPost);
      console.log(vm.userPosts);
    })
  }

  vm.friends = [];
  vm.getUserFriends = function() {
    console.log('vm.user: ', vm.user);
    $http({
      url: 'http://localhost:3000/friends',
      method: 'GET',
      headers: {
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res.data);
      vm.friends = res.data;
      vm.friends.push(vm.user);
    })
  }

  vm.getWorkouts = function(workout) {
    console.log(workout);
    $http({
      method: 'GET',
      url: 'http://localhost:3000/' + workout,
      headers: {
        user_id: vm.user.user_id,
        workout: workout
      }
    }).then(function(res, err) {
      console.log('workout info: ', res);
      if (res.data.length <= 0) {
        Materialize.toast('No Workout Data found. Enter some!', 2000);
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

  vm.addWorkout = function(workout, amount) {
    console.log(workout, amount);
    $http({
      method: 'POST',
      url: 'http://localhost:3000/' + workout,
      data: {
        amount: amount,
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      var newWorkout = res.data[0];
      delete newWorkout['min'];
      delete newWorkout['max'];
      vm.workouts.push(res.data[0]);
      if(vm.workoutMeta.type ==='pushups') {
        vm.pushupsChart()
      } else if (vm.workoutMeta.type === 'planks') {
        vm.planksChart();
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
  vm.addHighlight = function(highlight) {
    console.log(highlight);
    $http({
      method: 'POST',
      url: 'http://localhost:3000/profileHighlights',
      data: {
        text: highlight,
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      vm.highlights.unshift(res.data[0]);
    })
  }
//TODO: only make state change if search is valid
  vm.search = function(query) {
    console.log(query);
    var jsonObj = {
      user_id: vm.user.user_id,
      query: query,
      auth: true
    }
    $state.go('search', {data: jsonObj})
  }




  // The following function would require validation to see if changes are made, and then subsequent server calls to change that info
  // vm.changeInfo = function(newQuote, newSport) {
  //   if (vm.currentUser.quote !== newQuote) {
  //     vm.currentUser.quote = newQuote;
  //   }
  //   if (vm.currentUser.sport !== newSport) {
  //     vm.currentUser.sport = newSport;
  //   }
  // }
  vm.friendPage = function(friend) {
    var jsonObj = {
      user_id: vm.user.user_id,
      friend_id: friend.user_id
    }
    $state.go('friend', {data: jsonObj})
  }
  vm.switchNewsFeed = function() {
    console.log('going to news feed');
    var jsonObj = {
      user_id: vm.user.user_id,
      auth: true
    }
    $state.go('feed', {user: jsonObj})
  }
}
