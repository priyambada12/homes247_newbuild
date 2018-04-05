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
	
	factory.uploadImage = function(requestData,callback){
		return networking.callServerForJsonmultipartRequest('/user_imgUpdate',requestData,callback);
	};
	
	
	factory.getUserPhoto = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/get_userDeatils',requestData,callback);
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
	
	$scope.logoutprofile = function(){
		$cookies.remove('user');
		$cookies.remove('propertyID');
		$cookies.remove('type');
		$cookies.remove("citydeta");
		$cookies.remove('recentView');
		$cookies.remove('data');
		$cookies.remove('propId');
		$cookies.remove('city_data');
        $cookies.remove('loc_data');
        $cookies.remove('builder_data');
        $cookies.remove('rera_data');
		$state.go('dashboard');
	}
	
});

app.controller('settingCtrl', function($scope,$cookies,settingFactory,$modal, $log,$state,urls) {
	
	$scope.accounts =JSON.parse($cookies.get('user'));
	
	var userID = $scope.accounts[0].user_registration_IDPK;
	function imageUpload(){
	
	settingFactory.getUserPhoto({userId:userID},function(success){
		console.log(success);
			if(success.data.status =="True"){
				var imgpath =success.data.details[0].user_registration_ImgPath;
				
				if(imgpath!=""){
					var imagepath =urls.imagesURL+"uploadUserProfileImgs/";
					$scope.user_imgpath =imagepath+imgpath;
				}else{
					$scope.user_imgpath ='images/profile.png';
				}
			}
			
		},function(error){
			console.log(error);
		});
	}
	imageUpload();
	$scope.user = {
		newPwd:'',
		confPwd:''
	};
	$scope.changePwd = function(){
		if($scope.user.newPwd ==""){
				$scope.msgs ="Please Enter new password";
				$scope.open();
		}
		else if($scope.user.confPwd==""){
			$scope.msgs ="Please Enter confirm password";
				$scope.open();
		}
		else if($scope.user.newPwd !="" && $scope.user.confPwd!=""){
		 if( $scope.user.newPwd == $scope.user.confPwd){
		
		settingFactory.changePassword({newpassword:$scope.user.newPwd,userId:userID},function(success){
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
		}
	};
	
	$scope.logoutprofile = function(){
		$cookies.remove('user');
		$cookies.remove('propertyID');
		$cookies.remove('type');
		$cookies.remove("citydeta");
		$cookies.remove('recentView');
		$cookies.remove('data');
		$cookies.remove('propId');
		$cookies.remove('city_data');
        $cookies.remove('loc_data');
        $cookies.remove('builder_data');
        $cookies.remove('rera_data');
		$state.go('dashboard');
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
    
	$scope.setFile = function(element) {
                    $scope.$apply(function($scope) {
                        $scope.theFile = element.files[0];
                        $scope.FileMessage = '';
						console.log($scope.theFile);
                        var filename = $scope.theFile.name;
                        console.log(filename.length)
                        var index = filename.lastIndexOf(".");
                        var strsubstring = filename.substring(index, filename.length);
                        if (strsubstring == '.png' || strsubstring == '.jpeg' || strsubstring == '.gif' || strsubstring == '.jpg' )
                        {
						
							 var formdata = new FormData();
							 formdata.append("file",$scope.theFile);
							 formdata.append("userId",userID);
							uploadUserImage(formdata);
                          //console.log('File Uploaded sucessfully');
						  
                        }
                        else {
                            $scope.theFile = '';
							$scope.msgs ="please upload correct File Name, File extension should be .png, .jpeg,.jpg or .gif";
							$scope.open();
                              //$scope.FileMessage = 'please upload correct File Name, File extension should be .png, .jpeg or .gif';
                        }

                    });
                };
	
	function uploadUserImage(formdata){
		settingFactory.uploadImage(formdata,function(success){
			console.log(success);
			if(success.data.status =="True"){
				imageUpload();
				$scope.msgs ="File Uploaded sucessfully";
				$scope.open();
			}else{
				$scope.msgs ="Unable to upload file.";
				$scope.open();
			}
			
		},function(error){
			console.log(error);
		});
	}
	
	$scope.removePic = function(){
		var formdata = new FormData();
		formdata.append("file",'');
		formdata.append("userId",userID);
		settingFactory.uploadImage(formdata,function(success){
			console.log(success);
			if(success.data.status =="True"){
				imageUpload();
				$scope.msgs ="File removed successfully.";
				$scope.open();
			}else{
				$scope.msgs ="Unable to process file.";
				$scope.open();
			}
			
		},function(error){
			console.log(error);
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
	
	$scope.logoutprofile = function(){
		$cookies.remove('user');
		$cookies.remove('propertyID');
		$cookies.remove('type');
		$cookies.remove("citydeta");
		$cookies.remove('recentView');
		$cookies.remove('data');
		$cookies.remove('propId');
		$cookies.remove('city_data');
        $cookies.remove('loc_data');
        $cookies.remove('builder_data');
        $cookies.remove('rera_data');
		$state.go('dashboard');
	}

});

app.controller('referEarnCtrl', function($scope,$cookies,settingFactory,$modal, $log,$state) {
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
	
	$scope.logoutprofile = function(){
		$cookies.remove('user');
		$cookies.remove('propertyID');
		$cookies.remove('type');
		$cookies.remove("citydeta");
		$cookies.remove('recentView');
		$cookies.remove('data');
		$cookies.remove('propId');
		$cookies.remove('city_data');
        $cookies.remove('loc_data');
        $cookies.remove('builder_data');
        $cookies.remove('rera_data');
		
		
		$state.go('dashboard');
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