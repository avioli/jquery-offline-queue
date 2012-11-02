((window, undef) ->
  doc = window.document
  queue = []
  lastInQueue = null
  _debug = false

  class QueueObj
    constructor: (args) ->
      @args = args
      @queueArgs = []
    fakeQueue: (args) ->
      console.log '=== queue' if _debug
      @queueArgs.push args
      @
    fakeDequeue: ->
      if _debug
        console.log '=== dequeue'
        console.log '====== ', @args
        console.log '====== ', @args.selector, @args.context, @args.rootjQuery
        for qa in @queueArgs
          console.log qa.name, qa.args
      for qa in @queueArgs
        $jQ = window.jQuery#[qa.subset]
        $obj = $jQ(@args.selector, @args.context, @args.rootjQuery)
        fn = $obj[qa.name]
        fn.apply($obj, qa.args)

  jQ = (->
    console.log '-- Generating jQuery-fake' if _debug
    rootjQuery = null

    jQuery = (selector, context) ->
      console.log '-- Called jQuery' if _debug
      new jQuery.fn.fakeInit(selector, context, rootjQuery)

    jQuery.fn = jQuery.prototype =
      constructor: jQuery
      fakeInit: (selector, context, rootjQuery) ->
        lastInQueue = new QueueObj
          selector: selector
          context: context
          rootjQuery: rootjQuery

        queue.push lastInQueue

        lastInQueue

    jQuery.fn.fakeInit.prototype = jQuery.fn

    jQuery.isFake = jQuery.fn.isFake = true
    jQuery.fake = ->
      @
    jQuery.fake.queue = ->
      queue

    # proxy = {}

    # jQuery.fake.transferMethods = ->
    #   for method of jQuery.fn
    #     if jQuery.fn[method] != proxy
    #       console.log ']] ', method

    queueWrapper = (method, subset) ->
      proxy = QueueObj.prototype[method] = ->
        console.log ']] ', method, subset if _debug
        lastInQueue.fakeQueue
          args: arguments
          subset: subset
          name: method

        console.log '------', lastInQueue if _debug

        lastInQueue

      if subset != '_base'
        jQuery[subset][method] = proxy
      else
        jQuery[method] = proxy

      true

    methods =
      _base: ['Callbacks','Deferred','Event','_data','_mark','_unmark','acceptData','access','ajax','ajaxPrefilter','ajaxSetup','ajaxTransport','attr','bindReady','buildFragment','camelCase','clean','cleanData','clone','contains','css','curCSS','data','dequeue','dir','each','error','extend','filter','find','fx','get','getJSON','getScript','globalEval','grep','hasData','holdReady','inArray','isArray','isEmptyObject','isFunction','isNumeric','isPlainObject','isWindow','isXMLDoc','makeArray','map','merge','noConflict','nodeName','noop','now','nth','param','parseJSON','parseXML','post','prop','proxy','queue','ready','removeAttr','removeData','removeEvent','sibling','speed','style','sub','swap','text','trim','type','uaMatch','unique','when']
      find: ['attr','contains','error','filter','find','getText','isXML','matches','matchesSelector','uniqueSort']
      fx: ['stop','tick']
      fn: ['_toggle','add','addClass','after','ajaxComplete','ajaxError','ajaxSend','ajaxStart','ajaxStop','ajaxSuccess','andSelf','animate','append','appendTo','attr','before','bind','blur','change','children','clearQueue','click','clone','closest','contents','contextmenu','css','data','dblclick','delay','delegate','dequeue','detach','die','domManip','each','empty','end','eq','error','extend','fadeIn','fadeOut','fadeTo','fadeToggle','filter','find','first','focus','focusin','focusout','get','has','hasClass','height','hide','hover','html','index','init','innerHeight','innerWidth','insertAfter','insertBefore','is','keydown','keypress','keyup','last','live','load','map','mousedown','mouseenter','mouseleave','mousemove','mouseout','mouseover','mouseup','next','nextAll','nextUntil','not','off','offset','offsetParent','on','one','outerHeight','outerWidth','parent','parents','parentsUntil','position','prepend','prependTo','prev','prevAll','prevUntil','promise','prop','push','pushStack','queue','ready','remove','removeAttr','removeClass','removeData','removeProp','replaceAll','replaceWith','resize','scroll','scrollLeft','scrollTop','select','serialize','serializeArray','show','siblings','size','slice','slideDown','slideToggle','slideUp','sort','splice','stop','submit','text','toArray','toggle','toggleClass','trigger','triggerHandler','unbind','undelegate','unload','unwrap','val','width','wrap','wrapAll','wrapInner']

    for subset, subMethods of methods
      queueWrapper(method, subset) for method in subMethods

    # console.log QueueObj.prototype.ready()

    # rootjQuery = jQuery(doc)

    jQuery
  )()
  console.log '-- jQuery-fake is ready' if _debug

  window.jQuery = window.$ = jQ

  deQueue = ->
    console.log '-- Dequeueing' if _debug
    console.log queue if _debug
    obj.fakeDequeue() for obj in queue
    true

  interval = setInterval ->
    if window.jQuery != jQ
      clearInterval interval
      clearTimeout timeout
      console.log '-- The REAL jQuery has been loaded' if _debug
      # jQ.fake.transferMethods()
      deQueue()
  , 100

  timeout = setTimeout ->
    console.log 'Timed out!'
    clearInterval interval
  , 10000

)(window)
