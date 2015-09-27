'use strict';

// Ionic cnodejs App
angular.module('cnodejs', [
  'ionic',
  'angularMoment',
  'cnodejs.controllers',
  'cnodejs.filters',
  'cnodejs.directives',
  'cnodejs.config']
)

.run(function($ionicPlatform, $log, $timeout, $state, $rootScope, amMoment, ENV, Push, User) {

  // set moment locale
  amMoment.changeLocale('zh-cn');

  // notify
  if (!navigator.notification) {
    navigator.notification = {
      alert: function(message) {
        window.alert(message);
      }
    };
  }

  // push notification callback
  var notificationCallback = function(data, isActive) {
    var alertContent;
    if(device.platform == "Android"){
      alertContent   = window.plugins.jPushPlugin.openNotification;
    } else{
      alertContent   = event.aps;
    }
    //alert("open Notificaiton:"+alertContent);
    var notif = alertContent;
    console.log(notif);
    console.log(notif.extras);
    console.log(notif.extras['cn.jpush.android.EXTRA']);
    console.log(notif.extras['cn.jpush.android.EXTRA']._topic_id);
    console.log(JSON.stringify(notif));
    if (notif && notif.extras && notif.extras['cn.jpush.android.EXTRA'] && notif.extras['cn.jpush.android.EXTRA'].topic_id) {
      console.log("dump topic");
      $state.go('app.topic', {
        id: notif.extras['cn.jpush.android.EXTRA'].topic_id
      });
    } else {
      $state.go('app.messages');
    }
  };
  $ionicPlatform.ready(function() {
    if(window.cordova) {

      // setup google analytics
      if (window.analytics && ENV.name === 'production') {
        //window.analytics.startTrackerWithId('UA-57246029-1');
      }

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
    }

    // push handler
    Push.init(notificationCallback);

    // detect current user have not set alias of jpush
    var currentUser = User.getCurrentUser();
    if (currentUser.id) {
      Push.setAlias( "u_"+currentUser.id);
    }

    if (navigator.splashscreen) {
      $timeout(function() {
        navigator.splashscreen.hide();

        // check if have push after app launch
        Push.check();
      }, 100);
    } else {
      $log.debug('no splash screen plugin');
    }

  });

})
.config(function(ENV, $stateProvider, $urlRouterProvider, $logProvider) {

  $logProvider.debugEnabled(ENV.debug);
  $stateProvider
    .state('app', {
      url: '',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.user', {
      url: '/user/:loginname',
      views: {
        'menuContent': {
          templateUrl: 'templates/user.html',
          controller: 'UserCtrl'
        }
      }
    })
    .state('app.messages', {
      url: '/my/messages',
      views: {
        'menuContent': {
          templateUrl: 'templates/messages.html',
          controller: 'MessagesCtrl'
        }
      }
    })
    .state('app.topics', {
      url: '/topics/:tab',
      views: {
        'menuContent': {
          templateUrl: 'templates/topics.html',
          controller: 'TopicsCtrl'
        }
      }
    })
    .state('app.topic', {
      url: '/topic/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/topic.html',
          controller: 'TopicCtrl'
        }
      }
    })
    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    });
  $urlRouterProvider.otherwise('/topics/all');
});

angular.module('cnodejs.controllers', ['cnodejs.services']);

angular.module('cnodejs.services', ['ngResource', 'cnodejs.config']);

angular.module('cnodejs.filters', ['cnodejs.services']);

angular.module('cnodejs.directives', []);
