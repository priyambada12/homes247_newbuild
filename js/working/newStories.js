var app = angular.module('blogstoriesApp',[]);
app.controller('storiesCtrl',function($scope,blogsFactory,urls,$stateParams,$cookies){
	$(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
    });
	var id ;
	var type ;
	if($stateParams.param != undefined && $stateParams.type != undefined){
		id =$stateParams.param;
		type =$stateParams.type;
		$cookies.put('id',id);
		$cookies.put('type',type);
		
	}else{
		id =$cookies.get('id');
		type = $cookies.get('type');	
	}
	$scope.imagepath = urls.imagesURL + "stories/";
	
		
		blogsFactory.storiesDetails({'id':id,'type':type},function(success){
			$scope.stories= success.data.locations;
		},function(error){
			console.log(error);
		});
	
});