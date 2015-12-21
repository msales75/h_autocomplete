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
          return (str.toUpperCase().replace('_',' ').
            indexOf(term.toUpperCase()) === 0);
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
            match: /((?:[^\w@]|^)(?:\w+ )?\w{3,}|@(?:\w+ )?\w*)$/,
            index: 1,
            template: function(record) {
              // each popup-line has thumbnail followed by the name & username
              return ['<img src="', record.avatar_url,'"></img>',
                record.name, '(', record.username, ')'
              ].join('');
            },
            search: function(term, callback) {
              callback($.map(users, function(record) {
                var matchterm, alwaysshow, returnrecord, firstnameLength;

                // return the user-record that matches, annotated with some
                //   contextual information about the match.
                returnrecord = $.extend({}, record,
                  {term: term, prefix: ''});

                matchterm = term;
                if (term.substr(0,1).match(/[^@\w]/)) {
                  returnrecord.prefix = term.substr(0,1);
                  matchterm = matchterm.substr(1);
                }
                if (matchterm.substr(0,1)==='@') {
                  alwaysshow = true;
                  matchterm = matchterm.substr(1);
                  if (!matchterm.length) {
                    return returnrecord;
                  }
                } else {
                  alwaysshow = false;
                }
                if (alwaysshow) {
                  if (startsWith(matchterm, record.username)) return returnrecord;
                  if (startsWith(matchterm, record.name)) return returnrecord;
                } else {
                  // username or firstname must match exactly if they aren't using '@'
                  if (record.username.toUpperCase() === matchterm.toUpperCase()) {return returnrecord;}
                  firstnameLength = (record.name.split(' '))[0].length;
                  if (matchterm.length>=firstnameLength) {
                    if (startsWith(matchterm, record.name)) {return returnrecord;}
                  }
                }
                // try matching second word only, if there are two
                var termwords = matchterm.split(' ');
                if (termwords.length>1) {
                  if (termwords[1].toUpperCase() === record.username.toUpperCase()) {
                    if (alwaysshow) {returnrecord.prefix += '@';}
                    returnrecord.prefix += termwords[0]+' ';
                    return returnrecord;
                  }
                  firstnameLength = (record.name.split(' '))[0].length;
                  if (termwords[1].length>=firstnameLength) {
                    if (startsWith(termwords[1], record.name)) {
                      if (alwaysshow) {returnrecord.prefix += '@';}
                      returnrecord.prefix += termwords[0]+' ';
                      return returnrecord;
                    }
                  }
                }
                return null;
              }));
            },
            replace: function(record) {
              return record.prefix + '@' +
                record.name.replace(' ','_') + ' ';
            }
          }],{
            appendTo: $(element).parent() // put new list in parent-div
          });
          scope.$broadcast('autocompleteReady');
        });
      }
    };
  }]);
