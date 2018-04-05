//(function(){
var app = angular.module('footerApp',[]);
app.factory('footerFactory', function(networking) {
    var factory = {};
	
	factory.getBuilderDetails = function(callback){
		 return networking.callServerForUrlEncondedGETRequest('/get_bulidersInfo', callback);
	};


	 return factory;
});

app.controller('footerCtrl',function($scope,networkFactory,$cookies,footerFactory){
	//$cookies.put('key','others');
    $scope.quantity = 5;
	 networkFactory.getCityDetails(function(success) {
        console.log(success.data);
		 $scope.cities = success.data.locations;
	
    });
	footerFactory.getBuilderDetails(function(success) {
        console.log(success.data);
		 $scope.builders = success.data.details;
	
    },function(error){
		alert(error);
	});

});


//});