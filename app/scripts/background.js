'use strict';
/*global $:false */

var getCurrentTabUrl = function (callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;

    console.assert(typeof url === 'string', 'tab.url should be a string');

    console.log(url);
    callback(url);
  });
};

chrome.runtime.onInstalled.addListener(function () {
  var dataUrl = 'https://cdn.rawgit.com/AthensWorks/unofficial-bcorp-community-api/master/data.json';

  $.get(dataUrl, function( data ) {
    var urls = $.map(data, function(bCorp) {
      return bCorp.website;
    });

    chrome.storage.local.set({'matchingUrls': urls.join('|')});
  });

});

chrome.tabs.onUpdated.addListener(function (tabId) {

  chrome.storage.local.get('matchingUrls', function (result) {
    var matchingUrlRegExp = new RegExp(result.matchingUrls);
    console.log(result.matchingUrls);

    getCurrentTabUrl(function(url){
      if (matchingUrlRegExp.exec(url) ) {
        console.log(matchingUrlRegExp.exec(url));
        chrome.pageAction.show(tabId);
      }
    });
  });

});
