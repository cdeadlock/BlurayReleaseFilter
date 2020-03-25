// ==UserScript==
// @name         Hide old releases
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide movie entries that are not from the currently selected year
// @match        http://tampermonkey.net/index.php?version=4.1.10&ext=dhdg&updated=true
// @grant        none
// @include https://www.blu-ray.com/*
// ==/UserScript==

var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();

function $x() {
  var x='';
  var node=document;
  var type=0;
  var fix=true;
  var i=0;
  var cur;
  function toArray(xp) {
    var final=[], next;
    while (next=xp.iterateNext()) {
      final.push(next);
    }
    return final;
  }
  while (cur=arguments[i++]) {
    switch (typeof cur) {
      case "string": x+=(x=='') ? cur : " | " + cur; continue;
      case "number": type=cur; continue;
      case "object": node=cur; continue;
      case "boolean": fix=cur; continue;
    }
  }
  if (fix) {
    if (type==6) type=4;
    if (type==7) type=5;
  }
  // selection mistake helper
  if (!/^\//.test(x)) x="//"+x;

  // context mistake helper
  if (node!=document && !/^\./.test(x)) x="."+x;

  var result=document.evaluate(x, node, null, type, null);
  if (fix) {
    // automatically return special type
    switch (type) {
      case 1: return result.numberValue;
      case 2: return result.stringValue;
      case 3: return result.booleanValue;
      case 8:
      case 9: return result.singleNodeValue;
    }
  }

  return fix ? toArray(result) : result;
}


(function() {
    'use strict';

    window.addEventListener('load', function() {
        //Maybe this version of something doesnt have matches() ? contains() seems to work
        // //td//a[contains(@href,'www.blu-ray.com/movies/')]//div//font[matches(text(),'2019')]"
        var nodes = $x("//td//a[contains(@href,'www.blu-ray.com/movies/')]//div//font", XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
        nodes.forEach(function(n) {
            if (n.textContent.match("^[0-9-]*$")){
                if (!n.textContent.includes(QueryString.year)){
                    var par = n.parentNode;
                    while (par.nodeName != "TD"){
                        par = par.parentNode;
                    }
                    par.style.display = 'none';
                }
            }
        });
    }, false);
})();
