//(function(){
var app = angular.module('homesApp', ['duScroll','slickCarousel','angular-page-loader','routerApp', 'networkApp', 'sidebarApp',
    'footerApp', 'aboutUsApp', 'blogsApp',
    'careerApp', 'calculatorApp', 'faqApp',
    'servicesApp', 'offersApp', 'policyApp',
    'signupApp', 'contactUsApp', 'loginApp', 'myAccountApp',
	'propertyApp','cityApp','ui.bootstrap','modalApp','forgotpwdModule'
]);

app.config(function ($httpProvider) {
	
    $httpProvider.interceptors.push(function ($q, $rootScope) {
        return {
            'request': function (config) {
                $rootScope.$broadcast('loading-started');
                return config || $q.when(config);
            },
            'response': function (response) {
                $rootScope.$broadcast('loading-complete');
                return response || $q.when(response);
            },
             'responseError': function (rejection) {
                $rootScope.$broadcast('loading-complete');
                return $q.reject(rejection);
            }
        };
    });
});

app.factory('loadingCounts', function () {
	
    return {
        enable_count: 0,
        disable_count: 0
    }
});

app.directive("loadingIndicator", function (loadingCounts, $timeout) {
	
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            scope.$on("loading-started", function (e) {
                loadingCounts.enable_count++;
                console.log("displaying indicator " + loadingCounts.enable_count);
                //only show if longer than one sencond
                $timeout(function () {
                    if (loadingCounts.enable_count > loadingCounts.disable_count) {
                        element.css({ "display": "" });
                    }
                }, 1000);  
            });
            scope.$on("loading-complete", function (e) {
                loadingCounts.disable_count++;
                console.log("hiding indicator " + loadingCounts.disable_count);
                if (loadingCounts.enable_count == loadingCounts.disable_count) {
                    element.css({ "display": "none" });
                }
            });
        }
    };
});

app.factory('networkFactory', function(networking) {
    var factory = {};

    factory.getCityDetails = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_location', callback);
    };

    factory.getTopProperties = function(requestData,callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/get_topProperties',requestData,callback);
    };

    factory.getNewProperties = function(requestData,callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/get_newProperties',requestData,callback);
    };

    factory.addCallbackDetails = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/callback', requestData, callback);
    };
	
	factory.getBuilderDetails = function(requestData , callback){
		 return networking.callServerForUrlEncondedPOSTRequest('/autocomplete', requestData, callback);
	};
	
	factory.getProjectDetails = function(requestData,callback){
		 return networking.callServerForUrlEncondedGETRequest('/search/'+requestData, callback);
	};
	
	factory.getProjectDetailsWithFilter = function(url,requestData,callback){
		 return networking.callServerForUrlEncondedGetWithRequestData('/search/'+url, requestData,callback);
	};
	factory.getUserrecentView = function(requestData,callback){
		 return networking.callServerForUrlEncondedPOSTRequest('/add_recent_view', requestData,callback);
	};
    return factory;
});
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
app.controller('dashboardCtrl', function($scope,$timeout, networkFactory,$state,urls,$modal, $log,$cookies,cityFactory) {

    //$('.test_design').niceSelect();
	$('body').attr('id', '');

$(function() {
     document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	$(this).css('background-color', 'red');
	$scope.slickConfig3Loaded = true;
    $scope.slickConfig2Loaded = true;
	$scope.slickConfig4Loaded = true;
	$('.ui.dropdown').dropdown();
     $('#first').carouseller({
        //scrollSpeed: 850,
        //autoScrollDelay: -1800,
        //easing: 'easeOutBounce'
    });

    $('#third').carouseller({
       //scrollSpeed: 800,
        //autoScrollDelay: 1600,
        //easing: 'linear'
    });
    $('#top-project').carouseller({
       // scrollSpeed: 800,
        //autoScrollDelay: 1600,
        //easing: 'linear'
    });
    $('#fourd').carouseller();

     $('#fourd01').carouseller(); 
});
     $scope.sorterFunc = function(property){
    return parseInt(property.BHK);
};
//	$cookies.put('key','dashboard');
    $scope.user = {
        name: '',
        mobileno: ''
    }
	$scope.propertyimage=urls.imagesURL+"uploadPropertyImgs/";
	$scope.imagePath =urls.imagesURL+"cities/"; 
	var clientData = $cookies.get('user');
	if(clientData != null){
		var clients = JSON.parse(clientData);
			console.log(clients[0].user_registration_IDPK);
		var userID = clients[0].user_registration_IDPK;
	}
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
            networkFactory.addCallbackDetails(requestParam, function(success) {
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
	
	$scope.userFav = function(property,index){
		var clientData = $cookies.get('user');
		
		if(clientData == null){
		
		  
		 $cookies.put('propertyID',property.property_info_IDPK);
		  $cookies.put('type','dashboard');
		 $state.go('login');
		}
		else{
			var clients = JSON.parse(clientData);
			console.log(clients[0].user_registration_IDPK);
			var requestData = {userId:clients[0].user_registration_IDPK, propId:property.property_info_IDPK};
			cityFactory.getUserFavourite(requestData,function(success){
				console.log(success.data);
				property.user_fav?$('#'+index).html('<img src="images/start_icon.png" alt=""/>'):$('#'+index).html('<img src="images/selected_star.png" alt=""/>');
			},function(error){
				console.log(error);
			});
		}
	};

    networkFactory.getCityDetails(function(success) {
        console.log(success.data);
		 $scope.cities = success.data.locations;
		$scope.currentCity = $scope.cities [0];
		$scope.cityProperty = $scope.currentCity;
		$scope.getProperties($scope.currentCity);
		
		$scope.getBuilders();
		$scope.updateNumber();
		 $scope.slickConfig3 = {
      autoplay: false,
      infinite: true,
//      autoplaySpeed: 1000,
      slidesToShow: 4,
      slidesToScroll: 1,
//	  cssEase: 'ease-out',
      responsive: [
        {
          breakpoint: 995,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
		//$scope.slickConfig3();
		//customerSearchCtrl();
    });
	
	 $scope.updateNumber = function () {
      $scope.slickConfig3Loaded = false;
      $timeout(function () {
        $scope.slickConfig3Loaded = true;
      });
    };

   
	
	$scope.getProperties= function(){
	var id = $scope.cityProperty.id;
    networkFactory.getTopProperties({'cityId':id,'userId':userID},function(success) {
        console.log(success.data.deatils);
		
		$scope.topProperties =success.data.deatils; 
		$scope.updateNumber2();
		
    $scope.slickConfig2 = {
      autoplay: false,
      infinite: true,
//      autoplaySpeed: 1000,
      slidesToShow: 3,
      slidesToScroll: 1,
	  init: true,
      method: {}
    };
	
		
    });
	
	

    networkFactory.getNewProperties({'cityId':id,'userId':userID},function(success) {
        console.log(success.data.deatils);
		$scope.newProperties = success.data.deatils;
		 $scope.updateNumber3();
		 $scope.slickConfig4 = {
        autoplay: false,
        arrows : false,
        infinite: true,
        dots: true,
//      autoplaySpeed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        method: {}
    };
    });
	}
	
	 $scope.updateNumber2 = function () {
      $scope.slickConfig2Loaded = false;
      $timeout(function () {
        $scope.slickConfig2Loaded = true;
      });
    };

		
    $scope.updateNumber3 = function () {
      $scope.slickConfig4Loaded = false;
      $timeout(function () {
        $scope.slickConfig4Loaded = true;
      });
    };

   
	 $scope.getBuilders = function(){
	 	 var ctrl = this;
         ctrl.client ={name:'', id:'',type:''};
	 	var builder = $scope.currentCity;
		console.log(builder);
		$cookies.put('city_id',builder.id);
		networkFactory.getBuilderDetails({'city_id':builder.id},function(success){
			console.log(success.data.autolist);
			$scope.autolist = success.data.autolist;
		});

}
$scope.setClientData = function(item){
		
			 if (item){
                       
                       $scope.builderData =item;
                        // console.log(item);
                     }
		
	};

	$scope.getPropertyID = function(propertyID){
		var clientData = $cookies.get('user');
		
		if(clientData == null){
			/* $cookies.put('recentView',propertyID);
			$state.go('login'); */
			$state.go('property',{param:propertyID});
		}else{
			var client_Data = JSON.parse(clientData);
			networkFactory.getUserrecentView({userId:client_Data[0].user_registration_IDPK , propId:propertyID},function(success){
				console.log(success);
				$state.go('property',{param:propertyID});
			});
			
		}
	};
	
	$scope.getProjects = function(currentCity){
		//alert(currentCity.city);
		var propData = $scope.builderData;
		var requests = {locality:'',buliderId:'',reraId:''};
		if(propData!= undefined && propData.hasOwnProperty('type')){
		if(propData.type=='bulider_name') {requests.buliderId=propData.id}
		if(propData.type=='city_name'){requests.locality=propData.id}
		if(propData.type=='reraId'){requests.reraId=propData.id}
		
		}
		$state.go('city',
		{cityname:currentCity.city,locality:requests.locality,
		buliderId:requests.buliderId,reraId:requests.reraId });
	};
	

	

  $scope.open = function (size) {
    var modalInstance;
    var modalScope = $scope.$new();
    modalScope.ok = function () {
            modalInstance.close(modalScope.selected);
    };
    modalScope.cancel = function () {
            modalInstance.dismiss('cancel');
    };      
    
    modalInstance = $modal.open({
      template: '<my-modal></my-modal>',
      size: size,
      scope: modalScope
      }
    );

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };



});

//});