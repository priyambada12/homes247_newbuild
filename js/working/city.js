var app = angular.module('cityApp', ['ui.bootstrap', 'modalApp']);
app.factory('cityFactory', function(networking) {
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
app.controller('cityCtrl', function($scope, cityFactory, $stateParams, $state, urls, $modal, $log, $cookies, $window, networkFactory) {
    
    $scope.itemsPerPage = 2;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.properties = [];
    $scope.gap = 2;
    //console.log($state.params);
    $scope.propertyimage = urls.imagesURL + "uploadPropertyImgs/";
    var clientData = $cookies.get('user');
    if (clientData != null) {
        var clients = JSON.parse(clientData);
        console.log(clients[0].user_registration_IDPK);
        var userID = clients[0].user_registration_IDPK;
    }
    console.log($stateParams.cityname + " " + $stateParams.locality + " " + $stateParams.buliderId + " " + $stateParams.reraId);
    var cityname = $stateParams.cityname;
    $scope.city_name = cityname;
    var locality = $stateParams.locality;
    var builder = $stateParams.buliderId;
    var reraid = $stateParams.reraId;
    //$scope.getProjects = function($stateParams.citynamecurrentcity){

    if (locality != '' || builder != '' || reraid != '') {
        var requests = {
            locality: locality,
            buliderId: builder,
            reraId: reraid,
            userId: userID
        };
        networkFactory.getProjectDetailsWithFilter(cityname, requests, function(success) {
            console.log(success);
            var projectDetails = success.data.deatils;
            if (projectDetails != undefined)
                console.log(projectDetails);
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
                $scope.properties = projectDetails;
                $scope.currentPage = 0;
                // now group by pages
                 $scope.groupToPages();
            } else {
                $scope.prop_val = false;
            }

        }, function(error) {
            console.log(error);
        });
    } else {
        networkFactory.getProjectDetailsWithFilter(cityname, {
            userId: userID
        }, function(success) {
            console.log(success);
            var projectDetails = success.data.deatils;
            console.log(projectDetails);
            if (projectDetails.length > 0) {
                $scope.prop_val = true;
                $scope.properties = projectDetails;
                 $scope.currentPage = 0;
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
                    $scope.msgs = "You will intimate you soon";
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

        cityFactory.getProjectDetailsWithFilter($scope.city_name, obj, function(success) {
            console.log(success);
            if (success.data.deatils.length > 0) {
                $scope.prop_val = true;
                $scope.properties = success.data.deatils;
                 $scope.currentPage = 0;
                // now group by pages
                 $scope.groupToPages();
            } else {
                $scope.prop_val = false;
            }


        });
    };

    $scope.getPropertyID = function(propertyID) {

        if (clientData == null) {
            $cookies.put('recentView', propertyID);
            $state.go('login');
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


    $(".open-popup").fullScreenPopup({
        bgColor: '#fff'
    });

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-36251023-1']);
    _gaq.push(['_setDomainName', 'jqueryscript.net']);
    _gaq.push(['_trackPageview']);

    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);

});