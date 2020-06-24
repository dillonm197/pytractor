try { return (function(attempts, ng12Hybrid, asyncCallback) {
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
}).apply(this, arguments); }
catch(e) { throw (e instanceof Error) ? e : new Error(e); }