//(function(){
var app = angular.module('myAccountApp', ['ui.bootstrap','modalApp']);

app.factory('settingFactory',function(networking){
	var factory = {};

    factory.changePassword = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/update_password', requestData, callback);
    };
	
	factory.userFavourite = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/user_favourite',requestData,callback);
	};
	factory.userecentView = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/user_recentView',requestData,callback);
	};
	
	factory.userRefer = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/user_refer',requestData,callback);
	};
	factory.getUserReferal = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/get_refer_list',requestData,callback);
	};
	
	return factory;
});
app.controller('myaccountsCtrl', function() {

});

app.controller('favCtrl', function($scope,$cookies,settingFactory,urls,$state) {
	//$cookies.set('key','others');
	$scope.propertyimage=urls.imagesURL+"uploadPropertyImgs/";
	$scope.accounts =JSON.parse($cookies.get('user'));
	$scope.recentView=true;
	var userID = $scope.accounts[0].user_registration_IDPK;
	//var userID =11;
    settingFactory.userFavourite({userId:userID},function(success){
		console.log(success);
		if(success.data.status=='True'){
			if(success.data.hasOwnProperty('favourite_list')){
				console.log(success.data.favourite_list);
				$scope.user_Fav_list = success.data.favourite_list;
				$scope.recentView=true;
			}
		}else{
			$scope.recentView=false;
			console.log("Nothing to show");
		}
	},function(error){
		console.log(error);
	});
	
	$scope.getpropertydata = function(property){
		$state.go('property', {
                    param: property.propertyId
                });
	};
	
});

app.controller('settingCtrl', function($scope,$cookies,settingFactory,$modal, $log) {
	
	$scope.accounts =JSON.parse($cookies.get('user'));
	var userID = $scope.accounts[0].user_registration_IDPK;
	$scope.user = {
		newPwd:'',
		confPwd:''
	};
	$scope.changePwd = function(){
		
		if($scope.user.newPwd == $scope.user.confPwd){
		settingFactory.changePassword({newpassword:$scope.newPwd,userId:userID},function(success){
			if(success.data.status =="True"){
				$scope.msgs ="password updated successfully";
				angular.element("input[type='password']").val(null);
				$scope.open();
			}
			
		},function(error){
			console.log(error);
		});
		}else{
			$scope.msgs ="password doesn't match";
			$scope.open();
		}
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

app.controller('recentlyViewedCtrl', function($scope,$cookies,settingFactory,urls,$state) {
	$scope.propertyimage=urls.imagesURL+"uploadPropertyImgs/";
	$scope.recentView=true;
	$scope.accounts =JSON.parse($cookies.get('user'));
	var userID = $scope.accounts[0].user_registration_IDPK;
	//var userID =11;
	settingFactory.userecentView({userId:userID},function(success){
		var status =success.data.status;
		if(status=="True"){
			if(success.data.hasOwnProperty('recent_view')){
				$scope.viewedList = success.data.recent_view;
				$scope.recentView=true;
			}
			
			
		}else if(status=="False"){
			console.log("Don't have anything to show you");
			$scope.recentView=false;
		}
		
	},function(error){
		console.log(error);
	});
	
	
	$scope.getpropertydata = function(property){
		$state.go('property', {
                    param: property.propertyId
                });
	};

});

app.controller('referEarnCtrl', function($scope,$cookies,settingFactory,$modal, $log) {
    $scope.userRefer = {userID:'',name:'',number:'',msg:''}
	$scope.accounts =JSON.parse($cookies.get('user'));
	var user_id = $scope.accounts[0].user_registration_IDPK;
	$scope.getUserRefer = function(){
	settingFactory.getUserReferal({userId:user_id},function(success){
			$scope.userReferList = success.data.locations;
			console.log(success.data.locations);
		},function(error){
			console.log(error);
		});
	}
	$scope.getUserRefer();
	$scope.referFriends =function(userRefer){
		userRefer.userID = user_id;
		if(userRefer.name == ""){
			$scope.msgs = "Please provide Your referal name";
			$scope.open();
		}else if(userRefer.number == ""){
			$scope.msgs = "Please provide Your referal mobile number";
			$scope.open();
		}else if(userRefer.name != "" && userRefer.number != ""){
		
	settingFactory.userRefer($scope.userRefer,function(success){
		var status =success.data.status;
		if(status=="True"){
			$scope.msgs = "Your referal will call u soon";
			$scope.open();

		}else{
			$scope.msgs = "Unable to process your request. Please try again";
			$scope.open();
		}
		$scope.getUserRefer();
	},function(error){
		console.log(error);
	});
	}
	}
	
	
	
	
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