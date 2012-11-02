console.log 'fake plugin is loaded'
(($) ->
  fakePlugin = ->
    console.log 'fake plugin is called'
  $.fn.fakePlugin = fakePlugin
)(jQuery)
