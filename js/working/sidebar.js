//(function(){
var app = angular.module('sidebarApp',[]);

app.controller('sidebarCtrl',function($scope,$cookies,$state){
	
	$scope.user_favs=false;
	$scope.openNav =function() {
		document.getElementById("mySidenav").style.width = "250px";
	}

	$scope.closeNav = function() {
		document.getElementById("mySidenav").style.width = "0";
	}
	
	$scope.userLoginType = function(type){
		if(type =='Sign up') $state.go('signUp');
		else if(type=='Profile') $state.go('myFav');
	};
	
	function load_bar(){
	if($cookies.get('user') != null){
		$scope.user_favs=true;
		$scope.valueType="Profile";
	}
	else{
		$scope.valueType="Sign up";
	}
	}
	load_bar();
});


//});