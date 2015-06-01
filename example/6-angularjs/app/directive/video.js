rootApp.directive('video', function() {
	return {
		restrict: 'E',
		link: function(scope, element) {
			scope.$on('$destroy', function() {
				element.prop('src', '');
			});
		}
	};
})
