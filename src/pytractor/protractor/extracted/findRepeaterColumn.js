try { return (function anonymous(
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
}).apply(this, arguments); }
catch(e) { throw (e instanceof Error) ? e : new Error(e); }