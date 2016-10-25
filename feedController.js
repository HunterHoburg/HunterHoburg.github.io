var app = angular.module('g4g');

app.controller('feedCtrl', ['$http', '$state', '$stateParams', feedCtrl]);


function feedCtrl($http, $state, $stateParams) {
  var vm = this;
  vm.user = $stateParams.user;
  vm.getUserData = function() {
    console.log('gettingUserData', vm.user);
    $http({
      url: 'http://localhost:3000/profileData',
      method: 'GET',
      headers: {
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      vm.user = res.data[0];
      // vm.getUserPosts();
      vm.getUserFriends();
    })
  }
  vm.getUserData();

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
      vm.getFriendPosts();
    })
  }

  vm.getFriendPosts = function() {
    console.log('getting friend posts');
    var friendsArr = [];
    for (var i = 0; i < vm.friends.length; i++) {
      friendsArr.push(vm.friends[i].user_id)
    }
    $http({
      url:  'http://localhost:3000/feedPosts',
      method: 'GET',
      headers: {
        friendids: friendsArr,
        number: 10,
        user_id: vm.user.user_id
      }
    }).then(function(res, err) {
      console.log(res);
      vm.posts = res.data;
      vm.friends.push(vm.user);
    })
  }
  vm.writingComment = false;
  vm.toggleWriteComment = function(post) {
    vm.getPostComments(post);
    vm.currentPost = post;
    vm.commentsExpanded = !vm.commentsExpanded;
    vm.writingComment = !vm.writingComment;
  }
  vm.commentsExpanded = false;
  vm.currentPost = false;
  vm.hidePostComments = function() {
    vm.commentsExpanded = false;
    vm.currentPost = false;
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
      console.log(vm.posts[vm.posts.indexOf(post)]);
      vm.posts[vm.posts.indexOf(post)].comments.push(res.data[0])
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
      //TODO: refactor this heinous query
      vm.posts[vm.posts.indexOf(post)].comments.splice(vm.posts[vm.posts.indexOf(post)].comments.indexOf(comment), 1);
      vm.currentPost.comments.splice(vm.currentPost.comments.indexOf(comment), 1);
      console.log(vm.currentPost);
      console.log(vm.posts);
    })
  }
  vm.getPostComments = function(post) {
    vm.commentsExpanded = true;
    vm.currentPost = post;
    $http({
      url: 'http://localhost:3000/comments',
      method: 'GET',
      headers: {
        post_id: post.post_id
      }
    }).then(function(res, err) {
      console.log(res);
      // console.log('currentPost: ', vm.currentPost);
      vm.posts[vm.posts.indexOf(post)].comments = res.data;
      console.log(vm.posts[vm.posts.indexOf(post)]);
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
        vm.posts[vm.posts.indexOf(post)].likes.splice(vm.posts[vm.posts.indexOf(post)].likes.indexOf(vm.user.user_id), 1);
      } else {
        vm.posts[vm.posts.indexOf(post)].likes.push(vm.user.user_id)
      }
    })
  }

  vm.friendPage = function(friend) {
    var jsonObj = {
      user_id: vm.user.user_id,
      friend_id: friend.user_id
    }
    $state.go('friend', {data: jsonObj})
  }







  vm.switchProfile = function() {
    console.log('going to profile');
    var jsonObj = {
      user_id: vm.user.user_id,
      auth: true
    }
    $state.go('profile', {user: jsonObj})
  }

}
