//(function(){
var app = angular.module('blogsApp',['blogstoriesApp']);
app.factory('blogsFactory', function(networking) {
    var factory = {};

    factory.storiesDetails = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/stories_deatail_page', requestData, callback);
    };

    factory.gettop_stories = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/top_stories', callback);
    };
	
	factory.getrecent_stories = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/recent_stories', callback);
    };
  


    return factory;
});

app.controller('blogsCtrl',function($scope,blogsFactory,urls,$cookies){
	//$cookies.set('key','others');
	$(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
    });
	//$scope.imagepath = urls.imagesURL + "stories/";
	$scope.imagepath = urls.imagesURL + "New%20folder/";
	blogsFactory.gettop_stories(function(success){
		console.log(success.data);
		$scope.topStories= success.data.locations;
	},function(error){
		console.log(error);
	});
	
	blogsFactory.getrecent_stories(function(success){
		$scope.recentStories= success.data.locations;
	},function(error){
		console.log(error);
	});
	
	
	/* $('.test_design').niceSelect();
	$('#first').carouseller({
					scrollSpeed: 850,
					autoScrollDelay: -1800,
					easing: 'easeOutBounce'
				});
	$('#third').carouseller({ 
					scrollSpeed: 800,
					autoScrollDelay: 1600,
					easing: 'linear'
				});
				
				
	$('#top-project').carouseller({ 
					scrollSpeed: 800,
					autoScrollDelay: 1600,
					easing: 'linear'
				}); */
	//$(fourd).carouseller();
	
	
	
	

});
//});