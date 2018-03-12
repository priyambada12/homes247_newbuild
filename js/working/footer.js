//(function(){
var app = angular.module('footerApp',[]);

app.controller('footerCtrl',function($scope,networkFactory,$cookies){
	//$cookies.put('key','others');
	 networkFactory.getCityDetails(function(success) {
        console.log(success.data);
		 $scope.cities = success.data.locations;
	
    });

});


//});