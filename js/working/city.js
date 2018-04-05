var cityapp = angular.module('cityApp', ['ui.bootstrap', 'modalApp', 'mapApp','propertyApp']);

cityapp.factory('cityFactory', function(networking) {
    var factory = {};
    factory.getPropretiesByID = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/get_propertyById', requestData, callback);
    };
    
    factory.addCallbackDetails = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/callback', requestData, callback);
    };

    factory.getBedroomDetails = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_bedrooms', callback);
    };

    factory.getBudget = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_budget', callback);
    };
	
	factory.getProjectDetails = function(requestData,callback){
		 return networking.callServerForUrlEncondedGETRequest('/search/'+requestData, callback);
	};
	
    factory.getlocality = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/get_locality_basedLocation', requestData, callback);
    };

    factory.getPossission = function(callback) {
        return networking.callServerForUrlEncondedGETRequest('/get_possission', callback);
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
cityapp.directive('clientAutoComplete', function($filter) {
    return {

        restrict: 'A',
        link: function(scope, elem, attrs) {
            elem.autocomplete({
                source: function(request, response) {

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
                        var result = $filter('filter')(data, {
                            name: params
                        });
                        angular.forEach(result, function(item) {
                            item['value'] = item['name'];
                        });
                    }
                    response(result);

                },
                minLength: 1,
                select: function(event, ui) {
                    //force a digest cycle to update the views
                    scope.$apply(function() {
                        scope.setClientData(ui.item);
                    });
                },

            });
        }

    };
});
cityapp.controller('cityCtrl', function($scope, cityFactory, propertyFactory, $stateParams, $state, urls,
    $modal, $log, $cookies, $window, networkFactory) {
    // $cookies.set('key','others');
    // loadMap();
    $('body').attr('id', '');
    $(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
    });
    $scope.sizeselect = [{
        value: 4
    }, {
        value: 8
    }];
    $scope.sizevalue = $scope.sizeselect[0];
    $scope.itemsPerPage = $scope.sizevalue.value;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.properties = [];
    $scope.prop_val = true;
    $scope.gap = 0;
    $scope.sorterFunc = function(property){
    return parseInt(property.BHK);
};
    $scope.sortorder = '';
//    BHK-FETCHING-STARTS
    
    var property_id;
	if($stateParams.param != undefined){
		property_id = $stateParams.param;
		$cookies.put('propId',property_id);
	}else{
		property_id=$cookies.get('propId');
	}
    
    propertyFactory.getPropretiesByID({
        propId: property_id
    }, function(success) {
		console.log(success.data);
        if (success.data.hasOwnProperty('deatils')) {
            $scope.propDetails = success.data.deatils;
			$scope.tab =  $scope.propDetails[0].BHK_Deatils[0].BHK;
      
        }
    }, function(error) {
        console.log(error);
    });
    
//    BHK-FETCHING-ENDS
    
    $scope.propertyimage = urls.imagesURL + "uploadPropertyImgs/";
    var clientData = $cookies.get('user');
    if (clientData != null) {
        var clients = JSON.parse(clientData);
        console.log(clients[0].user_registration_IDPK);
        var userID = clients[0].user_registration_IDPK;
    }
    var cityname, locality, builder, reraid;
    if ($stateParams.cityname != undefined || $stateParams.locality != undefined || $stateParams.buliderId != undefined || $stateParams.reraId != undefined) {
        cityname = $stateParams.cityname;
        locality = $stateParams.locality;
        builder = $stateParams.buliderId;
        reraid = $stateParams.reraId;
        $cookies.put('city_data', cityname);
        $cookies.put('loc_data', locality);
        $cookies.put('builder_data', builder);
        $cookies.put('rera_data', reraid);
    } else {
        cityname = $cookies.get('city_data');
        locality = $cookies.get('loc_data');
        builder = $cookies.get('builder_data');
        reraid = $cookies.get('rera_data');
    }

    /* var cityname= $stateParams.cityname==""?$cookies.get("citydeta"):$stateParams.cityname;
	$cookies.put("citydeta",$stateParams.cityname);
	//var cityname = $stateParams.cityname;
    $scope.city_name = cityname;
    var locality = $stateParams.locality;
    var builder = $stateParams.buliderId;
    var reraid = $stateParams.reraId;
	console.log($state.params); */
	cityname=cityname =='null'?'':cityname;	
	$scope.city_name = cityname;
    console.log(cityname + " " + locality + " " + builder + " " + reraid);
    $cookies.put("citydeta", cityname);
	
	if (locality != "null" || builder != "null" || reraid != "null") {
        var requests = {
            locality: locality,
            buliderId: builder,
            reraId: reraid,
			 userId: ''
           // userId: userID
        };
        networkFactory.getProjectDetailsWithFilter(cityname, requests, function(success) {
            console.log(success);
            var projectDetails = success.data.deatils;
          
            if (projectDetails != undefined)
			  $window.sessionStorage.setItem('properties', JSON.stringify(projectDetails));
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
                $scope.properties = projectDetails;

                $scope.currentPage = 0;
                $scope.gap = Math.ceil(projectDetails.length / $scope.itemsPerPage);
                // now group by pages
                $scope.groupToPages();
            } else {
                $scope.prop_val = false;
            }

        }, function(error) {
            console.log(error);
        });
    } else {
        networkFactory.getProjectDetailsWithFilter(cityname,  {
            userId: ''//userID
        },  function(success) {
            console.log(success);
            var projectDetails = success.data.deatils;
            $window.sessionStorage.setItem('properties', JSON.stringify(projectDetails));
            console.log(projectDetails);
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
                $scope.properties = projectDetails;
                $scope.currentPage = 0;
                $scope.gap = Math.ceil(projectDetails.length / $scope.itemsPerPage);
                // now group by pages
                $scope.groupToPages();
            } else {
                $scope.prop_val = false;
            }

        }, function(error) {
            console.log(error);
        });
    }
	
	
    //}

    /* $scope.properties = typeof $stateParams.param ==='object'?$stateParams.param:JSON.parse($stateParams.param);
    //$scope.properties = $stateParams.param;
    $scope.city_name = $scope.properties[0].city_name */
    ;

    $scope.user = {
        name: '',
        mobileno: ''
    }

    cityFactory.getBedroomDetails(function(success) {
        $scope.bedrooms = success.data.bedroom;

    });

    cityFactory.getBudget(function(success) {
        $scope.budgets = success.data.budget;

    });

    cityFactory.getPossission(function(success) {
        $scope.possissions = success.data.possission;
    });
	var cityLocality = $cookies.get('city_id')!= undefined?$cookies.get('city_id'):1;
	
    cityFactory.getlocality({
        cityId: cityLocality
    }, function(success) {

        $scope.localities = success.data.details;
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
        obj.locality = $scope.locality != undefined ? $scope.locality.locality_IDPK : locality;
        
        cityFactory.getProjectDetailsWithFilter($scope.city_name, obj, function(success) {
            console.log(success);
            if (success.data.deatils.length > 0) {
                $scope.prop_val = true;

            } else {
                $scope.prop_val = false;
            }
            $window.sessionStorage.setItem('properties', JSON.stringify(success.data.deatils));
            $scope.properties = success.data.deatils;
            $scope.currentPage = 0;
            $scope.gap = Math.ceil($scope.properties.length / $scope.itemsPerPage);
            // now group by pages
            $scope.groupToPages();

        });
    };

    $scope.changepageSize = function(size) {
        $scope.itemsPerPage = size.value;
        $scope.currentPage = 0;
        $scope.gap = Math.ceil($scope.properties.length / $scope.itemsPerPage);
        $scope.groupToPages();
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
            cityFactory.getUserrecentView({
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
            cityFactory.getUserFavourite(requestData, function(success) {
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
        if (angular.isDefined($scope.locality)) {
            delete $scope.locality;

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

    $scope.range = function(size, start, end) {
        var ret = [];
        //console.log(size,start, end);

        if (size < end) {
            end = size;
            start = size - $scope.gap;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        //console.log(ret);        
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

    /* $scope.mapview = function(){
    	$state.go('map');
    }; */
    function loadCity() {
        networkFactory.getCityDetails(function(success) {
            console.log(success.data);
            $scope.cities = success.data.locations;
            $scope.selectCity = $scope.cities[0];
            //$scope.cityProperty = $scope.currentCity;
            $scope.getBuilders($scope.selectCity);
        });
    }

    var map;

    function loadMap() {
        var locations = JSON.parse($window.sessionStorage.getItem('properties'));
        //alert("loaing");
        map = new google.maps.Map(document.getElementById('googleMap'), {
            center: {
                lat: 12.972442,
                lng: 77.580643
            },
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        loadmarker();
    }

    function loadmarker() {
        var infowindow = new google.maps.InfoWindow();

        var marker, i;
        var locations = JSON.parse($window.sessionStorage.getItem('properties'));
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

    $scope.getBuilders = function(cities) {

        var ctrl = this;
        ctrl.client = {
            name: '',
            id: '',
            type: ''
        };
        //var builder = $scope.currentCity;
        //alert(cities.city);
        networkFactory.getBuilderDetails({
            'city_id': cities.id
        }, function(success) {
            console.log(success.data.autolist);
            $scope.autolist = success.data.autolist;
        });

    }
    $scope.setClientData = function(item) {

        if (item) {
            console.log(item);
            $scope.builderData = item;
            // console.log(item);
        }

    };
    $scope.getProjects = function(cities) {
        //alert(cities.city);
        var propData = $scope.builderData;
        var requests = {
            locality: '',
            buliderId: '',
            reraId: ''
        };
        if (propData != undefined && propData.hasOwnProperty('type')) {
            if (propData.type == 'bulider_name') {
                requests.buliderId = propData.id
            }
            if (propData.type == 'city_name') {
                requests.locality = propData.id
            }
            if (propData.type == 'reraId') {
                requests.reraId = propData.id
            }
        }
        cityFactory.getProjectDetailsWithFilter(cities.city, requests, function(success) {
            console.log(success);
            if (success.data.deatils.length > 0) {
                $scope.prop_val = true;

            } else {
                $scope.prop_val = false;
            }
            $window.sessionStorage.setItem('properties', JSON.stringify(success.data.deatils));
            //$scope.properties = success.data.deatils;
            loadMap();

        });

    };

    $scope.resetMapField = function() {
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

    $scope.filtermapProperties = function() {
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

        cityFactory.getProjectDetailsWithFilter($scope.selectCity.city, obj, function(success) {
            console.log(success);
            if (success.data.deatils.length > 0) {
                $scope.prop_val = true;

            } else {
                $scope.prop_val = false;
            }
            $window.sessionStorage.setItem('properties', JSON.stringify(success.data.deatils));
            //$scope.properties = success.data.deatils;
            loadMap();

        });

    }

    $(function() {
        $('.open-popup').on('click', loadMap)
        $(".open-popup").fullScreenPopup({
            bgColor: '#fff'
        });
        loadCity();

    });

});