window.clientSideScripts = {waitForAngular: function anonymous(
) {
function getNg1Hooks(selector, injectorPlease) {
  function tryEl(el) {
    try {
      if (!injectorPlease && angular.getTestability) {
        var $$testability = angular.getTestability(el);
        if ($$testability) {
          return {$$testability: $$testability};
        }
      } else {
        var $injector = angular.element(el).injector();
        if ($injector) {
          return {$injector: $injector};
        }
      }
    } catch(err) {}
  }
  function trySelector(selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var elHooks = tryEl(els[i]);
      if (elHooks) {
        return elHooks;
      }
    }
  }

  if (selector) {
    return trySelector(selector);
  } else if (window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__) {
    var $injector = window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__;
    var $$testability = null;
    try {
      $$testability = $injector.get('$$testability');
    } catch (e) {}
    return {$injector: $injector, $$testability: $$testability};
  } else {
    return tryEl(document.body) ||
        trySelector('[ng-app]') || trySelector('[ng\\:app]') ||
        trySelector('[ng-controller]') || trySelector('[ng\\:controller]');
  }
};  return (function(rootSelector, callback) {

  try {
    // Wait for both angular1 testability and angular2 testability.

    var testCallback = callback;

    // Wait for angular1 testability first and run waitForAngular2 as a callback
    var waitForAngular1 = function(callback) {

      if (window.angular) {
        var hooks = getNg1Hooks(rootSelector);
        if (!hooks){
          callback();  // not an angular1 app
        }
        else{
          if (hooks.$$testability) {
            hooks.$$testability.whenStable(callback);
          } else if (hooks.$injector) {
            hooks.$injector.get('$browser')
                .notifyWhenNoOutstandingRequests(callback);
          } else if (!rootSelector) {
            throw new Error(
                'Could not automatically find injector on page: "' +
                window.location.toString() + '".  Consider using config.rootEl');
          } else {
            throw new Error(
                'root element (' + rootSelector + ') has no injector.' +
                ' this may mean it is not inside ng-app.');
          }
        }
      }
      else {callback();}  // not an angular1 app
    };

    // Wait for Angular2 testability and then run test callback
    var waitForAngular2 = function() {
      if (window.getAngularTestability) {
        if (rootSelector) {
          var testability = null;
          var el = document.querySelector(rootSelector);
          try{
            testability = window.getAngularTestability(el);
          }
          catch(e){}
          if (testability) {
            testability.whenStable(testCallback);
            return;
          }
        }

        // Didn't specify root element or testability could not be found
        // by rootSelector. This may happen in a hybrid app, which could have
        // more than one root.
        var testabilities = window.getAllAngularTestabilities();
        var count = testabilities.length;

        // No angular2 testability, this happens when
        // going to a hybrid page and going back to a pure angular1 page
        if (count === 0) {
          testCallback();
          return;
        }

        var decrement = function() {
          count--;
          if (count === 0) {
            testCallback();
          }
        };
        testabilities.forEach(function(testability) {
          testability.whenStable(decrement);
        });

      }
      else {testCallback();}  // not an angular2 app
    };

    if (!(window.angular) && !(window.getAngularTestability)) {
      // no testability hook
      throw new Error(
          'both angularJS testability and angular testability are undefined.' +
          '  This could be either ' +
          'because this is a non-angular page or because your test involves ' +
          'client-side navigation, which can interfere with Protractor\'s ' +
          'bootstrapping.  See http://git.io/v4gXM for details');
    } else {waitForAngular1(waitForAngular2);}  // Wait for angular1 and angular2
                                                // Testability hooks sequentially

  } catch (err) {
    callback(err.message);
  }

}).apply(this, arguments);
}, findBindings: function anonymous(
) {
function getNg1Hooks(selector, injectorPlease) {
  function tryEl(el) {
    try {
      if (!injectorPlease && angular.getTestability) {
        var $$testability = angular.getTestability(el);
        if ($$testability) {
          return {$$testability: $$testability};
        }
      } else {
        var $injector = angular.element(el).injector();
        if ($injector) {
          return {$injector: $injector};
        }
      }
    } catch(err) {}
  }
  function trySelector(selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var elHooks = tryEl(els[i]);
      if (elHooks) {
        return elHooks;
      }
    }
  }

  if (selector) {
    return trySelector(selector);
  } else if (window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__) {
    var $injector = window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__;
    var $$testability = null;
    try {
      $$testability = $injector.get('$$testability');
    } catch (e) {}
    return {$injector: $injector, $$testability: $$testability};
  } else {
    return tryEl(document.body) ||
        trySelector('[ng-app]') || trySelector('[ng\\:app]') ||
        trySelector('[ng-controller]') || trySelector('[ng\\:controller]');
  }
};  return (function(binding, exactMatch, using, rootSelector) {
  using = using || document;
  if (angular.getTestability) {
    return getNg1Hooks(rootSelector).$$testability.
        findBindings(using, binding, exactMatch);
  }
  var bindings = using.getElementsByClassName('ng-binding');
  var matches = [];
  for (var i = 0; i < bindings.length; ++i) {
    var dataBinding = angular.element(bindings[i]).data('$binding');
    if (dataBinding) {
      var bindingName = dataBinding.exp || dataBinding[0].exp || dataBinding;
      if (exactMatch) {
        var matcher = new RegExp('({|\\s|^|\\|)' +
            /* See http://stackoverflow.com/q/3561711 */
            binding.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') +
            '(}|\\s|$|\\|)');
        if (matcher.test(bindingName)) {
          matches.push(bindings[i]);
        }
      } else {
        if (bindingName.indexOf(binding) != -1) {
          matches.push(bindings[i]);
        }
      }

    }
  }
  return matches; /* Return the whole array for webdriver.findElements. */
}).apply(this, arguments);
}, findRepeaterRows: function anonymous(
) {
function repeaterMatch(ngRepeat, repeater, exact) {
  if (exact) {
    return ngRepeat.split(' track by ')[0].split(' as ')[0].split('|')[0].
        split('=')[0].trim() == repeater;
  } else {
    return ngRepeat.indexOf(repeater) != -1;
  }
};  return (function findRepeaterRows(repeater, exact, index, using) {
  using = using || document;

  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  var rows = [];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        rows.push(repeatElems[i]);
      }
    }
  }
  /* multiRows is an array of arrays, where each inner array contains
     one row of elements. */
  var multiRows = [];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat-start';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        var elem = repeatElems[i];
        var row = [];
        while (elem.nodeType != 8 ||
            !repeaterMatch(elem.nodeValue, repeater)) {
          if (elem.nodeType == 1) {
            row.push(elem);
          }
          elem = elem.nextSibling;
        }
        multiRows.push(row);
      }
    }
  }
  var row = rows[index] || [], multiRow = multiRows[index] || [];
  return [].concat(row, multiRow);
}).apply(this, arguments);
}, findAllRepeaterRows: function anonymous(
) {
function repeaterMatch(ngRepeat, repeater, exact) {
  if (exact) {
    return ngRepeat.split(' track by ')[0].split(' as ')[0].split('|')[0].
        split('=')[0].trim() == repeater;
  } else {
    return ngRepeat.indexOf(repeater) != -1;
  }
};  return (function findAllRepeaterRows(repeater, exact, using) {
  using = using || document;

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        rows.push(repeatElems[i]);
      }
    }
  }
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat-start';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        var elem = repeatElems[i];
        while (elem.nodeType != 8 ||
            !repeaterMatch(elem.nodeValue, repeater)) {
          if (elem.nodeType == 1) {
            rows.push(elem);
          }
          elem = elem.nextSibling;
        }
      }
    }
  }
  return rows;
}).apply(this, arguments);
}, findRepeaterElement: function anonymous(
) {
function repeaterMatch(ngRepeat, repeater, exact) {
  if (exact) {
    return ngRepeat.split(' track by ')[0].split(' as ')[0].split('|')[0].
        split('=')[0].trim() == repeater;
  } else {
    return ngRepeat.indexOf(repeater) != -1;
  }
};function getNg1Hooks(selector, injectorPlease) {
  function tryEl(el) {
    try {
      if (!injectorPlease && angular.getTestability) {
        var $$testability = angular.getTestability(el);
        if ($$testability) {
          return {$$testability: $$testability};
        }
      } else {
        var $injector = angular.element(el).injector();
        if ($injector) {
          return {$injector: $injector};
        }
      }
    } catch(err) {}
  }
  function trySelector(selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var elHooks = tryEl(els[i]);
      if (elHooks) {
        return elHooks;
      }
    }
  }

  if (selector) {
    return trySelector(selector);
  } else if (window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__) {
    var $injector = window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__;
    var $$testability = null;
    try {
      $$testability = $injector.get('$$testability');
    } catch (e) {}
    return {$injector: $injector, $$testability: $$testability};
  } else {
    return tryEl(document.body) ||
        trySelector('[ng-app]') || trySelector('[ng\\:app]') ||
        trySelector('[ng-controller]') || trySelector('[ng\\:controller]');
  }
};  return (function findRepeaterElement(repeater, exact, index, binding, using, rootSelector) {
  var matches = [];
  using = using || document;

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        rows.push(repeatElems[i]);
      }
    }
  }
  /* multiRows is an array of arrays, where each inner array contains
     one row of elements. */
  var multiRows = [];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat-start';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        var elem = repeatElems[i];
        var row = [];
        while (elem.nodeType != 8 || (elem.nodeValue &&
            !repeaterMatch(elem.nodeValue, repeater))) {
          if (elem.nodeType == 1) {
            row.push(elem);
          }
          elem = elem.nextSibling;
        }
        multiRows.push(row);
      }
    }
  }
  var row = rows[index];
  var multiRow = multiRows[index];
  var bindings = [];
  if (row) {
    if (angular.getTestability) {
      matches.push.apply(
          matches,
          getNg1Hooks(rootSelector).$$testability.findBindings(row, binding));
    } else {
      if (row.className.indexOf('ng-binding') != -1) {
        bindings.push(row);
      }
      var childBindings = row.getElementsByClassName('ng-binding');
      for (var i = 0; i < childBindings.length; ++i) {
        bindings.push(childBindings[i]);
      }
    }
  }
  if (multiRow) {
    for (var i = 0; i < multiRow.length; ++i) {
      var rowElem = multiRow[i];
      if (angular.getTestability) {
        matches.push.apply(
            matches,
            getNg1Hooks(rootSelector).$$testability.findBindings(rowElem,
                binding));
      } else {
        if (rowElem.className.indexOf('ng-binding') != -1) {
          bindings.push(rowElem);
        }
        var childBindings = rowElem.getElementsByClassName('ng-binding');
        for (var j = 0; j < childBindings.length; ++j) {
          bindings.push(childBindings[j]);
        }
      }
    }
  }
  for (var i = 0; i < bindings.length; ++i) {
    var dataBinding = angular.element(bindings[i]).data('$binding');
    if (dataBinding) {
      var bindingName = dataBinding.exp || dataBinding[0].exp || dataBinding;
      if (bindingName.indexOf(binding) != -1) {
        matches.push(bindings[i]);
      }
    }
  }
  return matches;
}).apply(this, arguments);
}, findRepeaterColumn: function anonymous(
) {
function repeaterMatch(ngRepeat, repeater, exact) {
  if (exact) {
    return ngRepeat.split(' track by ')[0].split(' as ')[0].split('|')[0].
        split('=')[0].trim() == repeater;
  } else {
    return ngRepeat.indexOf(repeater) != -1;
  }
};function getNg1Hooks(selector, injectorPlease) {
  function tryEl(el) {
    try {
      if (!injectorPlease && angular.getTestability) {
        var $$testability = angular.getTestability(el);
        if ($$testability) {
          return {$$testability: $$testability};
        }
      } else {
        var $injector = angular.element(el).injector();
        if ($injector) {
          return {$injector: $injector};
        }
      }
    } catch(err) {}
  }
  function trySelector(selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var elHooks = tryEl(els[i]);
      if (elHooks) {
        return elHooks;
      }
    }
  }

  if (selector) {
    return trySelector(selector);
  } else if (window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__) {
    var $injector = window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__;
    var $$testability = null;
    try {
      $$testability = $injector.get('$$testability');
    } catch (e) {}
    return {$injector: $injector, $$testability: $$testability};
  } else {
    return tryEl(document.body) ||
        trySelector('[ng-app]') || trySelector('[ng\\:app]') ||
        trySelector('[ng-controller]') || trySelector('[ng\\:controller]');
  }
};  return (function findRepeaterColumn(repeater, exact, binding, using, rootSelector) {
  var matches = [];
  using = using || document;

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        rows.push(repeatElems[i]);
      }
    }
  }
  /* multiRows is an array of arrays, where each inner array contains
     one row of elements. */
  var multiRows = [];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat-start';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeaterMatch(repeatElems[i].getAttribute(attr), repeater, exact)) {
        var elem = repeatElems[i];
        var row = [];
        while (elem.nodeType != 8 || (elem.nodeValue &&
            !repeaterMatch(elem.nodeValue, repeater))) {
          if (elem.nodeType == 1) {
            row.push(elem);
          }
          elem = elem.nextSibling;
        }
        multiRows.push(row);
      }
    }
  }
  var bindings = [];
  for (var i = 0; i < rows.length; ++i) {
    if (angular.getTestability) {
      matches.push.apply(
          matches,
          getNg1Hooks(rootSelector).$$testability.findBindings(rows[i],
              binding));
    } else {
      if (rows[i].className.indexOf('ng-binding') != -1) {
        bindings.push(rows[i]);
      }
      var childBindings = rows[i].getElementsByClassName('ng-binding');
      for (var k = 0; k < childBindings.length; ++k) {
        bindings.push(childBindings[k]);
      }
    }
  }
  for (var i = 0; i < multiRows.length; ++i) {
    for (var j = 0; j < multiRows[i].length; ++j) {
      if (angular.getTestability) {
        matches.push.apply(
            matches,
            getNg1Hooks(rootSelector).$$testability.findBindings(
                multiRows[i][j], binding));
      } else {
        var elem = multiRows[i][j];
        if (elem.className.indexOf('ng-binding') != -1) {
          bindings.push(elem);
        }
        var childBindings = elem.getElementsByClassName('ng-binding');
        for (var k = 0; k < childBindings.length; ++k) {
          bindings.push(childBindings[k]);
        }
      }
    }
  }
  for (var j = 0; j < bindings.length; ++j) {
    var dataBinding = angular.element(bindings[j]).data('$binding');
    if (dataBinding) {
      var bindingName = dataBinding.exp || dataBinding[0].exp || dataBinding;
      if (bindingName.indexOf(binding) != -1) {
        matches.push(bindings[j]);
      }
    }
  }
  return matches;
}).apply(this, arguments);
}, findByModel: function anonymous(
) {
function getNg1Hooks(selector, injectorPlease) {
  function tryEl(el) {
    try {
      if (!injectorPlease && angular.getTestability) {
        var $$testability = angular.getTestability(el);
        if ($$testability) {
          return {$$testability: $$testability};
        }
      } else {
        var $injector = angular.element(el).injector();
        if ($injector) {
          return {$injector: $injector};
        }
      }
    } catch(err) {}
  }
  function trySelector(selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var elHooks = tryEl(els[i]);
      if (elHooks) {
        return elHooks;
      }
    }
  }

  if (selector) {
    return trySelector(selector);
  } else if (window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__) {
    var $injector = window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__;
    var $$testability = null;
    try {
      $$testability = $injector.get('$$testability');
    } catch (e) {}
    return {$injector: $injector, $$testability: $$testability};
  } else {
    return tryEl(document.body) ||
        trySelector('[ng-app]') || trySelector('[ng\\:app]') ||
        trySelector('[ng-controller]') || trySelector('[ng\\:controller]');
  }
};  return (function(model, using, rootSelector) {
  using = using || document;

  if (angular.getTestability) {
    return getNg1Hooks(rootSelector).$$testability.
        findModels(using, model, true);
  }
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var selector = '[' + prefixes[p] + 'model="' + model + '"]';
    var elements = using.querySelectorAll(selector);
    if (elements.length) {
      return elements;
    }
  }
}).apply(this, arguments);
}, findByOptions: function(optionsDescriptor, using) {
  using = using || document;

  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var selector = '[' + prefixes[p] + 'options="' + optionsDescriptor + '"] option';
    var elements = using.querySelectorAll(selector);
    if (elements.length) {
      return elements;
    }
  }
}, findByButtonText: function(searchText, using) {
  using = using || document;

  var elements = using.querySelectorAll('button, input[type="button"], input[type="submit"]');
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText;
    if (element.tagName.toLowerCase() == 'button') {
      elementText = element.textContent || element.innerText || '';
    } else {
      elementText = element.value;
    }
    if (elementText.trim() === searchText) {
      matches.push(element);
    }
  }

  return matches;
}, findByPartialButtonText: function(searchText, using) {
  using = using || document;

  var elements = using.querySelectorAll('button, input[type="button"], input[type="submit"]');
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText;
    if (element.tagName.toLowerCase() == 'button') {
      elementText = element.textContent || element.innerText || '';
    } else {
      elementText = element.value;
    }
    if (elementText.indexOf(searchText) > -1) {
      matches.push(element);
    }
  }

  return matches;
}, findByCssContainingText: function(cssSelector, searchText, using) {
  using = using || document;

  if (searchText.indexOf('__REGEXP__') === 0) {
    var match = searchText.split('__REGEXP__')[1].match(/\/(.*)\/(.*)?/);
    searchText = new RegExp(match[1], match[2] || '');
  }
  var elements = using.querySelectorAll(cssSelector);
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText = element.textContent || element.innerText || '';
    var elementMatches = searchText instanceof RegExp ?
        searchText.test(elementText) :
        elementText.indexOf(searchText) > -1;

    if (elementMatches) {
      matches.push(element);
    }
  }
  return matches;
}, testForAngular: function(attempts, ng12Hybrid, asyncCallback) {
  var callback = function(args) {
    setTimeout(function() {
      asyncCallback(args);
    }, 0);
  };
  var definitelyNg1 = !!ng12Hybrid;
  var definitelyNg2OrNewer = false;
  var check = function(n) {
    try {
      /* Figure out which version of angular we're waiting on */
      if (!definitelyNg1 && !definitelyNg2OrNewer) {
        if (window.angular && !(window.angular.version && window.angular.version.major > 1)) {
          definitelyNg1 = true;
        } else if (window.getAllAngularTestabilities) {
          definitelyNg2OrNewer = true;
        }
      }
      /* See if our version of angular is ready */
      if (definitelyNg1) {
        if (window.angular && window.angular.resumeBootstrap) {
          return callback({ver: 1});
        }
      } else if (definitelyNg2OrNewer) {
        if (true /* ng2 has no resumeBootstrap() */) {
          return callback({ver: 2});
        }
      }
      /* Try again (or fail) */
      if (n < 1) {
        if (definitelyNg1 && window.angular) {
          callback({message: 'angular never provided resumeBootstrap'});
        } else if (ng12Hybrid && !window.angular) {
          callback({message: 'angular 1 never loaded' +
              window.getAllAngularTestabilities ? ' (are you sure this app ' +
              'uses ngUpgrade?  Try un-setting ng12Hybrid)' : ''});
        } else {
          callback({message: 'retries looking for angular exceeded'});
        }
      } else {
        window.setTimeout(function() {check(n - 1);}, 1000);
      }
    } catch (e) {
      callback({message: e});
    }
  };
  check(attempts);
}, evaluate: function(element, expression) {
  return angular.element(element).scope().$eval(expression);
}, allowAnimations: function(element, value) {
  var ngElement = angular.element(element);
  if (ngElement.allowAnimations) {
    // AngularDart: $testability API.
    return ngElement.allowAnimations(value);
  } else {
    // AngularJS
    var enabledFn = ngElement.injector().get('$animate').enabled;
    return (value == null) ? enabledFn() : enabledFn(value);
  }
}, getLocationAbsUrl: function anonymous(
) {
function getNg1Hooks(selector, injectorPlease) {
  function tryEl(el) {
    try {
      if (!injectorPlease && angular.getTestability) {
        var $$testability = angular.getTestability(el);
        if ($$testability) {
          return {$$testability: $$testability};
        }
      } else {
        var $injector = angular.element(el).injector();
        if ($injector) {
          return {$injector: $injector};
        }
      }
    } catch(err) {}
  }
  function trySelector(selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var elHooks = tryEl(els[i]);
      if (elHooks) {
        return elHooks;
      }
    }
  }

  if (selector) {
    return trySelector(selector);
  } else if (window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__) {
    var $injector = window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__;
    var $$testability = null;
    try {
      $$testability = $injector.get('$$testability');
    } catch (e) {}
    return {$injector: $injector, $$testability: $$testability};
  } else {
    return tryEl(document.body) ||
        trySelector('[ng-app]') || trySelector('[ng\\:app]') ||
        trySelector('[ng-controller]') || trySelector('[ng\\:controller]');
  }
};  return (function(selector) {
  var hooks = getNg1Hooks(selector);
  if (angular.getTestability) {
    return hooks.$$testability.getLocation();
  }
  return hooks.$injector.get('$location').absUrl();
}).apply(this, arguments);
}, setLocation: function anonymous(
) {
function getNg1Hooks(selector, injectorPlease) {
  function tryEl(el) {
    try {
      if (!injectorPlease && angular.getTestability) {
        var $$testability = angular.getTestability(el);
        if ($$testability) {
          return {$$testability: $$testability};
        }
      } else {
        var $injector = angular.element(el).injector();
        if ($injector) {
          return {$injector: $injector};
        }
      }
    } catch(err) {}
  }
  function trySelector(selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var elHooks = tryEl(els[i]);
      if (elHooks) {
        return elHooks;
      }
    }
  }

  if (selector) {
    return trySelector(selector);
  } else if (window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__) {
    var $injector = window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__;
    var $$testability = null;
    try {
      $$testability = $injector.get('$$testability');
    } catch (e) {}
    return {$injector: $injector, $$testability: $$testability};
  } else {
    return tryEl(document.body) ||
        trySelector('[ng-app]') || trySelector('[ng\\:app]') ||
        trySelector('[ng-controller]') || trySelector('[ng\\:controller]');
  }
};  return (function(selector, url) {
  var hooks = getNg1Hooks(selector);
  if (angular.getTestability) {
    return hooks.$$testability.setLocation(url);
  }
  var $injector = hooks.$injector;
  var $location = $injector.get('$location');
  var $rootScope = $injector.get('$rootScope');

  if (url !== $location.url()) {
    $location.url(url);
    $rootScope.$digest();
  }
}).apply(this, arguments);
}, getPendingHttpRequests: function anonymous(
) {
function getNg1Hooks(selector, injectorPlease) {
  function tryEl(el) {
    try {
      if (!injectorPlease && angular.getTestability) {
        var $$testability = angular.getTestability(el);
        if ($$testability) {
          return {$$testability: $$testability};
        }
      } else {
        var $injector = angular.element(el).injector();
        if ($injector) {
          return {$injector: $injector};
        }
      }
    } catch(err) {}
  }
  function trySelector(selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var elHooks = tryEl(els[i]);
      if (elHooks) {
        return elHooks;
      }
    }
  }

  if (selector) {
    return trySelector(selector);
  } else if (window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__) {
    var $injector = window.__TESTABILITY__NG1_APP_ROOT_INJECTOR__;
    var $$testability = null;
    try {
      $$testability = $injector.get('$$testability');
    } catch (e) {}
    return {$injector: $injector, $$testability: $$testability};
  } else {
    return tryEl(document.body) ||
        trySelector('[ng-app]') || trySelector('[ng\\:app]') ||
        trySelector('[ng-controller]') || trySelector('[ng\\:controller]');
  }
};  return (function(selector) {
  var hooks = getNg1Hooks(selector, true);
  var $http = hooks.$injector.get('$http');
  return $http.pendingRequests;
}).apply(this, arguments);
}};