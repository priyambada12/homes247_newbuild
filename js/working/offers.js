//function(){
var app = angular.module('offersApp',[]);
app.factory('offerFactory', function(networking) {
    var factory = {};

    factory.addCallbackDetails = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/callback', requestData, callback);
    };

    factory.getBedroomDetails = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_bedrooms', callback);
    };

    factory.getBudget = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_budget', callback);
    };

    factory.getPossission = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_possission', callback);
    };

	 factory.getProjectDetails = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/search/', callback);
    };
    factory.getProjectDetailsWithFilter = function(url, requestData, callback) {
        return networking.callServerForUrlEncondedGetWithRequestData('/search/' + url, requestData, callback);
    };

    factory.getUserrecentView = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/add_recent_view', requestData, callback);
    };

    factory.getUserFavourite = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/add_Favourite', requestData, callback);
    };


    return factory;
});
app.controller('offersCtrl',function($scope, offerFactory, $stateParams, 
$state, urls, $modal, $log, $cookies, $window, networkFactory){
	
	
	$window.scrollTo(0, 0);
	$('body').attr('id', '');
	
	$scope.sizeselect=[{value:5},{value:10}];
	$scope.sizevalue = $scope.sizeselect[0];
	$scope.itemsPerPage = $scope.sizevalue.value;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.properties = [];
	$scope.prop_val = true;
   
    //console.log($state.params);
    $scope.propertyimage = urls.imagesURL + "uploadPropertyImgs/";
    var clientData = $cookies.get('user');
    if (clientData != null) {
        var clients = JSON.parse(clientData);
        console.log(clients[0].user_registration_IDPK);
        var userID = clients[0].user_registration_IDPK;
    }
    //console.log($stateParams.cityname + " " + $stateParams.locality + " " + $stateParams.buliderId + " " + $stateParams.reraId);
    
    var locality = '';
    var builder = '';
    var reraid = '';
    //$scope.getProjects = function($stateParams.citynamecurrentcity){

    
        offerFactory.getProjectDetails(function(success) {
            console.log(success);
            var projectDetails = success.data.deatils;
			
            console.log(projectDetails);
			var properties =[];
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
				for(var index=0; index<projectDetails.length;index++){
					if(projectDetails[index].offerPrice != null){
						properties.push(projectDetails[index]);
					}
				}
                $scope.properties = properties;
				$window.sessionStorage.setItem('offers',JSON.stringify(properties));
				var cityname = $scope.properties[0].city_name;
				$scope.city_name = cityname;
                 $scope.currentPage = 0;
				  $scope.gap = Math.ceil(properties.length/$scope.itemsPerPage);
        		// now group by pages
       			 $scope.groupToPages();
            } else {
                $scope.prop_val = false;
            }
        }, function(error) {
            console.log(error);
        });
  
	
	
    //}

    /* $scope.properties = typeof $stateParams.param ==='object'?$stateParams.param:JSON.parse($stateParams.param);
    //$scope.properties = $stateParams.param;
    $scope.city_name = $scope.properties[0].city_name */
    ;


    $scope.user = {
        name: '',
        mobileno: ''
    }

    offerFactory.getBedroomDetails(function(success) {
        $scope.bedrooms = success.data.bedroom;

    });

    offerFactory.getBudget(function(success) {
        $scope.budgets = success.data.budget;

    });

    offerFactory.getPossission(function(success) {
        $scope.possissions = success.data.possission;
    });

    $scope.callBack = function(user) {
        console.log(user);
        if (user.name == "") {
            $scope.msgs = "please provide your name";
            $scope.open();
        } else if (user.mobileno == "") {
            $scope.msgs = "please provide your Mobile Number";
            $scope.open();

        } else if (user.name != "" && user.mobileno != "") {
            var requestParam = {
                name: user.name,
                number: user.mobileno
            };
            offerFactory.addCallbackDetails(requestParam, function(success) {
                var status = success.data.status;
                if (status == "True") {
                    $scope.msgs = "We will intimate you soon.";
                    $scope.open();
                }
            }, function(error) {

                $scope.msgs = "Sorry! we are unable to process your request";
                $scope.open();
            });
        }

    };
	
	$scope.changepageSize = function(size){
		$scope.itemsPerPage =size.value;
		$scope.currentPage = 0;
		$scope.gap = Math.ceil($scope.properties.length/$scope.itemsPerPage);
        $scope.groupToPages();
	};
	
    $scope.filterProperties = function() {
        var obj = {
            locality: locality,
            buliderId: builder,
            bedroom: '',
            budget: '',
            possission: '',
            reraid: reraid,
            userId: userID
        };

        obj.bedroom = $scope.bedroom != undefined ? $scope.bedroom.bhk_IDPK : '';
        obj.budget = $scope.budget != undefined ? $scope.budget.budget_IDPK : '';
        obj.possission = $scope.possission != undefined ? $scope.possission.possission_IDPK : '';

        offerFactory.getProjectDetailsWithFilter($scope.city_name, obj, function(success) {
            console.log(success);
            if (success.data.deatils.length > 0) {
                $scope.prop_val = true;
               
            } else {
                $scope.prop_val = false;
            }
			$window.sessionStorage.setItem('offers',JSON.stringify(success.data.deatils));
			  var projectDetails= success.data.deatils;
			  var properties=[];
			 for(var index=0; index<projectDetails.length;index++){
					if(projectDetails[index].offerPrice != null){
						properties.push(projectDetails[index]);
					}
				}
				$scope.properties =properties;
			  $scope.gap = Math.ceil(properties.length/$scope.itemsPerPage);
                 $scope.currentPage = 0;
                // now group by pages
                 $scope.groupToPages();

        });
    };

    $scope.getPropertyID = function(propertyID) {

        if (clientData == null) {
            //$cookies.put('recentView', propertyID);
            //$state.go('login');
			$state.go('property', {
                    param: propertyID
                });
        } else {
            var client_Data = JSON.parse(clientData);
            offerFactory.getUserrecentView({
                userId: client_Data[0].user_registration_IDPK,
                propId: propertyID
            }, function() {
                $state.go('property', {
                    param: propertyID
                });
            });
        }
    };

    $scope.userFavourite = function(prop, index) {
        //var clientData = $cookies.get('user');
        //var typs = $scope.property.user_fav;
        //$scope.property = {user_fav:''};
        if (clientData == null) {
            //$scope.msgs ="To make this as favourite property you need to login first";
            //$scope.open();
            console.log($scope.properties);
            $window.sessionStorage.setItem('cityname', cityname);
            $window.sessionStorage.setItem('locality', locality);
            $window.sessionStorage.setItem('builder', builder);
            $window.sessionStorage.setItem('reraid', reraid);
            $cookies.put('propertyID', prop.property_info_IDPK);
            $cookies.put('type', 'city');
            $state.go('login');
        } else {
            var clients = JSON.parse(clientData);
            console.log(clients[0].user_registration_IDPK);
            var requestData = {
                userId: clients[0].user_registration_IDPK,
                propId: prop.property_info_IDPK
            };
            offerFactory.getUserFavourite(requestData, function(success) {
                console.log(success.data);
                console.log(prop.user_fav);
                prop.user_fav ? $('#' + index).html('<img src="images/start_icon_2.png" alt=""/>') : $('#' + index).html('<img src="images/star_selected.png" alt=""/>');
                //$scope.property.user_fav = !prop.user_fav;
            }, function(error) {
                console.log(error);
            });
        }
    };


    $scope.resetDropDown = function() {
        if (angular.isDefined($scope.bedroom)) {
            delete $scope.bedroom;
        }
        if (angular.isDefined($scope.budget)) {
            delete $scope.budget;
        }
        if (angular.isDefined($scope.possission)) {
            delete $scope.possission;
        }
        $window.location.reload();
        //$scope.properties = JSON.parse($stateParams.param);

    };

    $scope.open = function(size) {
        var modalInstance;
        var modalScope = $scope.$new();
        modalScope.ok = function() {
            modalInstance.close(modalScope.selected);
        };
        modalScope.cancel = function() {
            modalInstance.dismiss('cancel');
        };

        modalInstance = $modal.open({
            template: '<my-modal></my-modal>',
            size: size,
            scope: modalScope
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

     $scope.range = function (size,start, end) {
        var ret = [];        
        console.log(size,start, end);
                      
        if (size < end) {
            end = size;
            start = size-$scope.gap;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }        
         console.log(ret);        
        return ret;
    };
    

    // calculate page in place
    $scope.groupToPages = function() {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.properties.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.properties[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.properties[i]);
            }
        }
    };


    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };

    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };

function loadCity(){
	networkFactory.getCityDetails(function(success) {
        console.log(success.data);
		$scope.cities = success.data.locations;
		$scope.selectCity = $scope.cities [0];
		//$scope.cityProperty = $scope.currentCity;
		$scope.getBuilders($scope.selectCity);
	});
}

	var map;
      function loadMap() {
		  var locations=JSON.parse($window.sessionStorage.getItem('offers'));
		  //alert("loaing");
        map = new google.maps.Map(document.getElementById('googleMap'), {
          center: {lat:12.972442, lng:77.580643},
          zoom: 10,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
        });
		loadmarker();
		 }
		function loadmarker(){
		var infowindow = new google.maps.InfoWindow();

  var marker, i;
	var locations=JSON.parse($window.sessionStorage.getItem('offers'));
	//alert(locations.length);
    for (i = 0; i < locations.length; i++) {  
	map.panTo(new google.maps.LatLng(locations[i].latitude, locations[i].longitude));
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
        map: map
      });
	
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i].address);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
		}

$scope.getBuilders = function(cities){

	 	 var ctrl = this;
         ctrl.client ={name:'', id:'',type:''};
	 	//var builder = $scope.currentCity;
		//alert(cities.city);
		networkFactory.getBuilderDetails({'city_id':cities.id},function(success){
			console.log(success.data.autolist);
			$scope.autolist = success.data.autolist;
		});

}
$scope.setClientData = function(item){
		
			 if (item){
                       console.log(item);
                       $scope.builderData =item;
                        // console.log(item);
                     }
		
	};
$scope.getProjects = function(cities){
	//alert(cities.city);
		var propData = $scope.builderData;
		var requests = {locality:'',buliderId:'',reraId:''};
		if(propData!= undefined && propData.hasOwnProperty('type')){
				if(propData.type=='bulider_name') {requests.buliderId=propData.id}
				if(propData.type=='city_name'){requests.locality=propData.id}
				if(propData.type=='reraId'){requests.reraId=propData.id}
		}
		offerFactory.getProjectDetailsWithFilter(cities.city, requests, function(success) {
            console.log(success);
			var projectDetails = success.data.deatils;
            var properties =[];
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
				for(var index=0; index<projectDetails.length;index++){
					if(projectDetails[index].offerPrice != null){
						properties.push(projectDetails[index]);
					}
				}
                $scope.properties = properties;
				$window.sessionStorage.setItem('offers',JSON.stringify(properties));
				
            } else {
                $scope.prop_val = false;
            }
			 //$scope.properties = success.data.deatils;
                 loadMap();
				

        });
		
		
		
	};
	
$scope.resetMapField = function(){
	 if (angular.isDefined($scope.bedtype)) {
            delete $scope.bedtype;
        }
        if (angular.isDefined($scope.budgettype)) {
            delete $scope.budgettype;
        }
        if (angular.isDefined($scope.possissiontype)) {
            delete $scope.possissiontype;
        }
	$scope.filtermapProperties();
};

$scope.filtermapProperties = function(){
 var obj = {
            locality: locality,
            buliderId: builder,
            bedroom: '',
            budget: '',
            possission: '',
            reraid: reraid,
            userId: userID
        };

        obj.bedroom = $scope.bedtype != undefined ? $scope.bedtype.bhk_IDPK : '';
        obj.budget = $scope.budgettype != undefined ? $scope.budgettype.budget_IDPK : '';
        obj.possission = $scope.possissiontype != undefined ? $scope.possissiontype.possission_IDPK : '';

        offerFactory.getProjectDetailsWithFilter($scope.selectCity.city, obj, function(success) {
            var projectDetails = success.data.deatils;
            var properties =[];
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
				for(var index=0; index<projectDetails.length;index++){
					if(projectDetails[index].offerPrice != null){
						properties.push(projectDetails[index]);
					}
				}
                $scope.properties = properties;
				$window.sessionStorage.setItem('offers',JSON.stringify(properties));
				
            } else {
                $scope.prop_val = false;
            }
			 //$scope.properties = success.data.deatils;
                 loadMap();
				

        });


}
	
     
	
	$(function() {
				 $('.open-popup').on('click',loadMap)
				$(".open-popup").fullScreenPopup({
					bgColor: '#fff'
				});
				loadCity();
				
			});

    
	

});
//});