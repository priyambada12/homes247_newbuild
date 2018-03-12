//(function(){
var app = angular.module('loginApp',['ngCookies','ui.bootstrap','modalApp','signupApp']);
app.factory('loginFactory',function(networking){
		var factory = {};
	factory.signinWithHomes247 = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/user_login', requestData, callback);
	};
	
	return factory;
});


app.controller('loginCtrl',function($scope,loginFactory,$state,$cookies,$modal, $log,
		cityFactory,$window,$rootScope,signupFactory){
			//$cookies.set('key','others');
	$('body').attr('id', 'signup_bg');
	$scope.user = {
	email:'',
	password:'',
	source:''
	};
	
	
	$scope.signup = {
	name:'',
	number:'',
	password:'',
	email:'',
	source:1,
	uniqueId:''
}
$rootScope.$on('event:social-sign-in-success',function(event, obj){
	console.log(event);
	console.log(obj.name);
	$scope.signup.name=obj.name;
	$scope.signup.email = obj.email;
	$scope.signup.source =3;
	$scope.signup.uniqueId=obj.uid;
	$scope.doRegistration($scope.signup);
});


$scope.doRegistration = function(signUp){
	//signUp.source=1;
	var socialUser = {
			uniqueId :$scope.signup.uniqueId,
			source:$scope.signup.source
		};
	signupFactory.signUpWithHomes247(signUp,function(success){
		if(success.data.status == "True"){
			
				$scope.login(socialUser,$scope.signup.source);
			
		}
	},function(error){
		alert("server is not running");
	});
}



	
	//$scope.login = function(){
		
	
	
	
	
	
	$scope.login = function(user,sourceId){
		user.source = sourceId;
		console.log(user);
		loginFactory.signinWithHomes247(user,function(success){
		if(success.data.status=="True"){

			var userDetails = success.data.details;
			console.log(userDetails);
			$cookies.put('user', JSON.stringify(userDetails));
			var type=  $cookies.get('type');
			var propertyId = $cookies.get('recentView');
			if(type == null && propertyId== null){
				$state.go('myFav');
			}
			else if (type != null){
				;
				var propID = $cookies.get('propertyID');
				console.log(userDetails[0].user_registration_IDPK);
				var requestData = {userId:userDetails[0].user_registration_IDPK, propId:propID};
				cityFactory.getUserFavourite(requestData,function(success){
				console.log(success.data);
					if(success.data.status=="True"){
						if(type=='city'){
							var cityname=$window.sessionStorage.getItem('cityname');
							var locality = $window.sessionStorage.getItem('locality');
							var bilder = $window.sessionStorage.getItem('builder');
							var reraid = $window.sessionStorage.getItem('reraid');
								$state.go('city',
							{ cityname:cityname,locality:locality,buliderId:bilder,reraId:reraid });
						}else{
							$state.go('dashboard');
						}
					}
				},function(error){
				console.log(error);
				});
				
			}
			else if(propertyId != null){
				var user_id = userDetails[0].user_registration_IDPK;
				cityFactory.getUserrecentView({userId: user_id, propId:propertyId},
				function(success){
						$state.go('property',{param:propertyId});
				},function(eror){
					console.log(error);
				});
			}
		}else{
			angular.element("input[type='text']").val(null);
			angular.element("input[type='password']").val(null);
			$scope.msgs ="Invalid username and password";
			$scope.open();
		}
		
	},function(error){
		console.log(error);
		$scope.msgs ="Please try again !!";
		$scope.open();
	});
	
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