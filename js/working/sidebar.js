//(function(){
var app = angular.module('sidebarApp',['calculatorApp','ngCookies']);

app.directive('clientAutoComplete',function($filter){
	return {
				
                restrict: 'A',       
                link: function (scope, elem, attrs) {
                    elem.autocomplete({
                        source: function (request, response) {

                            //term has the data typed by the user
                            var params = request.term;
                            
                            //simulates api call with odata $filter
                            var data = scope.autolist;
                            scope.$watch('autolist', function(newValue, oldValue) {
   										 console.log(newValue);
   										 console.log(oldValue);
  								  //var someVar = [Do something with someVar];

   		
									    // so it will not trigger another digest 
									  //  angular.copy(someVar, $scope.someVar);

									});                                     
                            if (data) { 
                                var result = $filter('filter')(data, {name:params});
                                angular.forEach(result, function (item) {
                                    item['value'] = item['name'];
                                });                       
                            }
                            response(result);

                        },
                        minLength: 1,                       
                        select: function (event, ui) {
                           //force a digest cycle to update the views
                           scope.$apply(function(){
                           	scope.setClientData(ui.item);
                           });                       
                        },
                       
                    });
                }

            };
});
app.controller('sidebarCtrl',function($scope,$cookies,$state,networkFactory,$location,$window){
	
	$scope.user_favs=false;
     $(function() {
         document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
//         $('.ui.dropdown').dropdown();
         });
	var url = $location.absUrl().split('#/')[1];
	//alert(url);
	if(url=='dashboard'){
		$scope.showSearchBar = false;
        $scope.showOffers = true;
        $scope.showNRI = true;
        $scope.showfav = true;
        $scope.showsignup = true;
	}else{
		$scope.showSearchBar = true;
        $scope.showOffers = false;
        $scope.showNRI = false;
        $scope.showfav = false;
        $scope.showsignup = false;
	}
	$scope.openNav =function() {
		document.getElementById("mySidenav").style.width = "250px";
	}

	$scope.closeNav = function() {
		document.getElementById("mySidenav").style.width = "0";
	}
	
	$scope.userLoginType = function(type){
		if(type =='Sign up') $state.go('login');
		else if(type=='Profile') $state.go('myFav');
	};
//    $scope.logout = function () {
//                localStorage.clearAll();
//                window.location = '/login';
//            };
	
	$scope.setClientData = function(item){
		
			 if (item){
                       
                       $scope.builderData =item;
                        // console.log(item);
                     }
		
	};
	networkFactory.getCityDetails(function(success) {
        console.log(success.data);
		$scope.cities = success.data.locations;
		var res =$cookies.getObject('data') != undefined?$cookies.getObject('data'):$scope.cities [0];
		console.log(res);
		$scope.currentCity =res;
		$cookies.putObject('data',$scope.currentCity);
		$scope.getBuilders($scope.currentCity);
	});
	
	
	 $scope.getBuilders = function(cities){
		 console.log(cities);
		 $cookies.putObject('data',cities);
	 	 var ctrl = this;
         ctrl.client ={name:'', id:'',type:''};
	 	//var builder = $scope.currentCity;
		//alert(cities.city);
		$cookies.put('city_id',cities.id);
		networkFactory.getBuilderDetails({'city_id':cities.id},function(success){
			console.log(success.data.autolist);
			$scope.autolist = success.data.autolist;
		});

}

$scope.getProjects = function(cities){
	//alert(cities.city);
	$cookies.putObject('data',cities);
		var propData = $scope.builderData;
		var requests = {locality:'',buliderId:'',reraId:''};
		if(propData!= undefined && propData.hasOwnProperty('type')){
		if(propData.type=='bulider_name') {requests.buliderId=propData.id}
		if(propData.type=='city_name'){requests.locality=propData.id}
		if(propData.type=='reraId'){requests.reraId=propData.id}
		
		}
		$state.go('city',
		{ cityname:cities.city,locality:requests.locality,buliderId:requests.buliderId,reraId:requests.reraId });
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