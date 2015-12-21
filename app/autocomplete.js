'use strict';

angular.module('h_autocomplete', [])
// a simple service that returns an asynchronous promise for the json object
  .factory('autocompleteUsers', ['$http', function($http) {
    return {get: function() {
      return $http.get('/data.json');
    }};
  }])
// the main directive for a textarea with autocomplete
  .directive('ngAutocomplete', ['autocompleteUsers', function(autocompleteUsers) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        function startsWith(term, str) {
          // helper function that tests if string str begins with term
          if (!term) return false;
          return (str.toUpperCase().indexOf(term.toUpperCase()) === 0);
        }
        // wait until user-list is available to initialize directive
        autocompleteUsers.get().then(function(userResponse) {
          var users = userResponse.data;
          /* Using JQuery here is a compromise to reduce coding time
          - but at the cost of clean integration & testing.
          This configuration opens the autocomplete popup for two types of patterns.
          One when the user starts with the '@' symbol,
          the second is when they type the first, last or username of a person.
          This minimizes unexpected popups while making the popup immediately
          available if the user types the @ symbol.
          */
          // Open autocomplete if cursor is clicked anywhere inside the name.
          $(element).textcomplete([
            {
            match: /\b(\w{3,})$/, // compare with names if we've typed 3 letters in the word
            index: 1,
            template: function(record) {
              // each popup-line has thumbnail followed by the name & username
              return ['<img src="', record.avatar_url,'"></img>',
                record.name, '(', record.username, ')'
              ].join('');
            },
            search: function(term, callback) {
              callback($.map(users, function(record) {
                if (startsWith(term, record.username)) return record;
                var names = record.name.split(' ');
                for (var i = 0; i < names.length; ++i) {
                  if (startsWith(term, names[i])) return record;
                }
                return null;
              }));
            },
            replace: function(record) {
              return record.name;
            }
          },{
            match: /\b\@([\w ]*)$/,
            index: 1,
            template: function(record) {
              return ['<img src="', record.avatar_url,
                '"></img>', record.name
              ].join('');
            },
            search: function(term, callback) {
              callback($.map(users, function(record) {
                if (startsWith(term, record.username)) return record;
                var names = record.name.split(' ');
                for (var i = 0; i < names.length; ++i) {
                  if (startsWith(term, names[i])) return record;
                }
                return null;
              }));
            },
            replace: function(record) {
              return record.name;
            }
          }],{
            appendTo: $(element).parent(), // put new list in parent-div
          });
          scope.$broadcast('autocompleteReady');
        });
      }
    };
  }]);
