'use strict';

angular.module('Contextcomplete', [])
.controller('ContextcompleteCtrl', ['$scope', function($scope) {

  $scope.users = {}; 
  // todo: move user-list into scope or service

}]).directive('ngContextcomplete', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
     function startsWith(term, str) {
       if (!term) return false;
       return (str.toUpperCase().indexOf(term.toUpperCase())===0)
     }
     $.getJSON("data.json", function (data) {
      $(element).textcomplete([{
        match: /\b(\w{3,})$/,
        index: 1,
	template: function (record) {
	  return ['<img src="', record.avatar_url,
                  '"></img>', record.name].join('');
	},
        search: function (term, callback) {
            callback($.map(data, function (record) {
                if (startsWith(term, record.username)) return record;
                var names = record.name.split(' ');
		for (var i=0; i<names.length; ++i) {
		  if (startsWith(term, names[i])) return record;
		}
		return null;
            }));
        },
        replace: function (record) {
            return record.name;
        }
      }]);
     });
    }
  }
});

