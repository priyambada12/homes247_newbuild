var app = angular.module('blogstoriesApp',[]);
app.controller('storiesCtrl',function($scope,blogsFactory,urls,$stateParams,$cookies,$window){
	
	
	$window.scrollTo(0, 0);
	$('body').attr('id', '');
	
	var id = $stateParams.param;
	var type = $stateParams.type;
	$scope.imagepath = urls.imagesURL + "stories/";
	
		
		blogsFactory.storiesDetails({'id':id,'type':type},function(success){
			$scope.stories= success.data.locations;
		},function(error){
			console.log(error);
		});
	
});