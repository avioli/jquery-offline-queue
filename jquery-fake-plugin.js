(function() {

  console.log('fake plugin is loaded');

  (function($) {
    var fakePlugin;
    fakePlugin = function() {
      return console.log('fake plugin is called');
    };
    return $.fn.fakePlugin = fakePlugin;
  })(jQuery);

}).call(this);
