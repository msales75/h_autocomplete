describe('Autocomplete Directive', function () {

// This is NOT a complete set of tests!
//  but there's a handful to show that the overall testing-framework works,
//  and the autocomplete opens at appropriate times

// Helper functions for dealing with DOM manipulation
  var setCursor = function(e, position) {
    if (e.setSelectionRange) { e.focus(); e.setSelectionRange(position, position); } /* WebKit */
    else if (e.createTextRange) { var range = e.createTextRange(); range.collapse(true); range.moveEnd('character', position); range.moveStart('character', position); range.select(); } /* IE */
  };
  var typeKey = function (element, char) {
    var e = $.Event("keydown");
    e.which = char.charCodeAt(0);
    element.trigger(e);
    var oldVal = $(element).val();
    $(element).focus();
    $(element).val(oldVal+char);
    $(element).text(oldVal+char);
    setCursor($(element)[0], oldVal.length+1);
    var e2 = $.Event("keyup");
    e2.which = char.charCodeAt(0);
    element.trigger(e2);
  };
  var typeString = function(element, str, done) {
    $.each(str.split(''), function(i, c) {
      typeKey(element,c);
    });
  };
  // end of helper functions

  var doc, element, scope, listElement;
  beforeEach(module('h_autocomplete'));
  beforeEach(function(done) {
    inject(function ($compile, $rootScope, $httpBackend) {
      // get json-data for testing without using webserver
      $httpBackend.expectGET('/data.json').respond(readJSON('data.json'));

      scope = $rootScope.$new();
      scope.$on('autocompleteReady', function() {
        done(); // asynchronous wait for jquery to finish before testing
      });
      doc = $compile('<div><textarea ng-autocomplete></textarea></div>')(scope);

      // this is hacky but it allows easier DOM testing in karma,
      //   by using karma's own document context.
      $('body').append(doc);

      $httpBackend.flush();
    });
  });
  beforeEach(function() {
    // element is the main textarea
    element = doc.children(':first');
    // listElement is the <ul> list of users
    listElement = element.next('.textcomplete-dropdown');
  });

  it('should have a list of names in the DOM, after the textarea', function() {
    expect(listElement.length).toEqual(1);
  });
  it('should not be visible initially', function() {
    expect(listElement.css('display')).toEqual('none');
  });
  describe('behavior after typing "martin"', function() {
    beforeEach(function() {
      typeString(element, 'martin');
    });
    it('should now be visible', function() {
      expect(listElement.css('display')).toEqual('block');
    });
  });
  describe('behavior after typing @', function() {
    beforeEach(function() {
      typeString(element, '@');
    });
    it("should now be visible", function() {
      expect(listElement.css('display')).toEqual('block');
    });
  });
  afterEach(function() {
    element.parent().remove();
  });
});
