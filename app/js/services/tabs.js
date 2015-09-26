'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:TabsService
 * @description
 * # TabsService
 * Tabs Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Tabs', function() {
  return [
    {
      value: 'ask',
      label: '问答'
    },
    {
      value: 'share',
      label: '分享'
    },
    {
      value: 'news',
      label: '新闻'
    },
    {
      value: 'job',
      label: '招聘'
    },
    {
      value: "nb",
      label: '其他'
    },
    {
      value: 'shortit',
      label: '短点'
    }
  ];
});
