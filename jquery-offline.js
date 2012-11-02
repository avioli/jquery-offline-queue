(function() {

  (function(window, undef) {
    var QueueObj, deQueue, doc, interval, jQ, lastInQueue, queue, timeout, _debug;
    doc = window.document;
    queue = [];
    lastInQueue = null;
    _debug = false;
    QueueObj = (function() {

      function QueueObj(args) {
        this.args = args;
        this.queueArgs = [];
      }

      QueueObj.prototype.fakeQueue = function(args) {
        if (_debug) console.log('=== queue');
        this.queueArgs.push(args);
        return this;
      };

      QueueObj.prototype.fakeDequeue = function() {
        var $jQ, $obj, fn, qa, _i, _j, _len, _len2, _ref, _ref2, _results;
        if (_debug) {
          console.log('=== dequeue');
          console.log('====== ', this.args);
          console.log('====== ', this.args.selector, this.args.context, this.args.rootjQuery);
          _ref = this.queueArgs;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            qa = _ref[_i];
            console.log(qa.name, qa.args);
          }
        }
        _ref2 = this.queueArgs;
        _results = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          qa = _ref2[_j];
          $jQ = window.jQuery;
          $obj = $jQ(this.args.selector, this.args.context, this.args.rootjQuery);
          fn = $obj[qa.name];
          _results.push(fn.apply($obj, qa.args));
        }
        return _results;
      };

      return QueueObj;

    })();
    jQ = (function() {
      var jQuery, method, methods, queueWrapper, rootjQuery, subMethods, subset, _i, _len;
      if (_debug) console.log('-- Generating jQuery-fake');
      rootjQuery = null;
      jQuery = function(selector, context) {
        if (_debug) console.log('-- Called jQuery');
        return new jQuery.fn.fakeInit(selector, context, rootjQuery);
      };
      jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        fakeInit: function(selector, context, rootjQuery) {
          lastInQueue = new QueueObj({
            selector: selector,
            context: context,
            rootjQuery: rootjQuery
          });
          queue.push(lastInQueue);
          return lastInQueue;
        }
      };
      jQuery.fn.fakeInit.prototype = jQuery.fn;
      jQuery.isFake = jQuery.fn.isFake = true;
      jQuery.fake = function() {
        return this;
      };
      jQuery.fake.queue = function() {
        return queue;
      };
      queueWrapper = function(method, subset) {
        var proxy;
        proxy = QueueObj.prototype[method] = function() {
          if (_debug) console.log(']] ', method, subset);
          lastInQueue.fakeQueue({
            args: arguments,
            subset: subset,
            name: method
          });
          if (_debug) console.log('------', lastInQueue);
          return lastInQueue;
        };
        if (subset !== '_base') {
          jQuery[subset][method] = proxy;
        } else {
          jQuery[method] = proxy;
        }
        return true;
      };
      methods = {
        _base: ['Callbacks', 'Deferred', 'Event', '_data', '_mark', '_unmark', 'acceptData', 'access', 'ajax', 'ajaxPrefilter', 'ajaxSetup', 'ajaxTransport', 'attr', 'bindReady', 'buildFragment', 'camelCase', 'clean', 'cleanData', 'clone', 'contains', 'css', 'curCSS', 'data', 'dequeue', 'dir', 'each', 'error', 'extend', 'filter', 'find', 'fx', 'get', 'getJSON', 'getScript', 'globalEval', 'grep', 'hasData', 'holdReady', 'inArray', 'isArray', 'isEmptyObject', 'isFunction', 'isNumeric', 'isPlainObject', 'isWindow', 'isXMLDoc', 'makeArray', 'map', 'merge', 'noConflict', 'nodeName', 'noop', 'now', 'nth', 'param', 'parseJSON', 'parseXML', 'post', 'prop', 'proxy', 'queue', 'ready', 'removeAttr', 'removeData', 'removeEvent', 'sibling', 'speed', 'style', 'sub', 'swap', 'text', 'trim', 'type', 'uaMatch', 'unique', 'when'],
        find: ['attr', 'contains', 'error', 'filter', 'find', 'getText', 'isXML', 'matches', 'matchesSelector', 'uniqueSort'],
        fx: ['stop', 'tick'],
        fn: ['_toggle', 'add', 'addClass', 'after', 'ajaxComplete', 'ajaxError', 'ajaxSend', 'ajaxStart', 'ajaxStop', 'ajaxSuccess', 'andSelf', 'animate', 'append', 'appendTo', 'attr', 'before', 'bind', 'blur', 'change', 'children', 'clearQueue', 'click', 'clone', 'closest', 'contents', 'contextmenu', 'css', 'data', 'dblclick', 'delay', 'delegate', 'dequeue', 'detach', 'die', 'domManip', 'each', 'empty', 'end', 'eq', 'error', 'extend', 'fadeIn', 'fadeOut', 'fadeTo', 'fadeToggle', 'filter', 'find', 'first', 'focus', 'focusin', 'focusout', 'get', 'has', 'hasClass', 'height', 'hide', 'hover', 'html', 'index', 'init', 'innerHeight', 'innerWidth', 'insertAfter', 'insertBefore', 'is', 'keydown', 'keypress', 'keyup', 'last', 'live', 'load', 'map', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'next', 'nextAll', 'nextUntil', 'not', 'off', 'offset', 'offsetParent', 'on', 'one', 'outerHeight', 'outerWidth', 'parent', 'parents', 'parentsUntil', 'position', 'prepend', 'prependTo', 'prev', 'prevAll', 'prevUntil', 'promise', 'prop', 'push', 'pushStack', 'queue', 'ready', 'remove', 'removeAttr', 'removeClass', 'removeData', 'removeProp', 'replaceAll', 'replaceWith', 'resize', 'scroll', 'scrollLeft', 'scrollTop', 'select', 'serialize', 'serializeArray', 'show', 'siblings', 'size', 'slice', 'slideDown', 'slideToggle', 'slideUp', 'sort', 'splice', 'stop', 'submit', 'text', 'toArray', 'toggle', 'toggleClass', 'trigger', 'triggerHandler', 'unbind', 'undelegate', 'unload', 'unwrap', 'val', 'width', 'wrap', 'wrapAll', 'wrapInner']
      };
      for (subset in methods) {
        subMethods = methods[subset];
        for (_i = 0, _len = subMethods.length; _i < _len; _i++) {
          method = subMethods[_i];
          queueWrapper(method, subset);
        }
      }
      return jQuery;
    })();
    if (_debug) console.log('-- jQuery-fake is ready');
    window.jQuery = window.$ = jQ;
    deQueue = function() {
      var obj, _i, _len;
      if (_debug) console.log('-- Dequeueing');
      if (_debug) console.log(queue);
      for (_i = 0, _len = queue.length; _i < _len; _i++) {
        obj = queue[_i];
        obj.fakeDequeue();
      }
      return true;
    };
    interval = setInterval(function() {
      if (window.jQuery !== jQ) {
        clearInterval(interval);
        clearTimeout(timeout);
        if (_debug) console.log('-- The REAL jQuery has been loaded');
        return deQueue();
      }
    }, 100);
    return timeout = setTimeout(function() {
      console.log('Timed out!');
      return clearInterval(interval);
    }, 10000);
  })(window);

}).call(this);
