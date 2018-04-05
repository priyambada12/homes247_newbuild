var forgotPwdApp = angular.module('forgotpwdModule', ['ui.bootstrap','modalApp']);

forgotPwdApp.factory('forgotPwdFactory',function(networking){
	var factory = {};
	factory.getEmailAddessFromToken = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/forgotPasswordPage', requestData, callback);
	};
	
	factory.updatepassword= function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/userforgotPassword', requestData, callback);
	};
	
	return factory;
});


forgotPwdApp.controller('fpwdCtrl', function($scope,$modal,$log,$location,forgotPwdFactory,$state) {
	
	var token = $location.absUrl().split('?')[1];
	forgotPwdFactory.getEmailAddessFromToken({verfication_code:token},function(success){
		console.log(success);
		if(success.data.status=="True"){
			$scope.emilAddress = success.data.details[0].user_forgotpasseord_verfication_email;
			//updatePassword(emilAddress);
			
		}else{
			$scope.msgs ="Oops !! something went wrong";
			$scope.open();
		}
	},function(error){
		console.log(error);
	});
	
	
	$scope.updatePassword = function(){
		var newPassword = $scope.newPwd;
		var cnfPassword = $scope.cnfPwd;
		if(newPassword ==undefined){
			$scope.msgs ="Enter the password";
			$scope.open();
		}else if(cnfPassword==undefined){
			$scope.msgs ="confirm your password";
			$scope.open();
		}else if(newPassword!=cnfPassword){
			$scope.msgs ="confirm password doesn't match";
			$scope.open();
		}
		else if(newPassword==cnfPassword){
			forgotPwdFactory.updatepassword({emailAddress:$scope.emilAddress,password:newPassword},
			function(success){
				console.log(success);
				if(success.data.status=="True"){
				$scope.msgs ="Password updated successfully.";
				$scope.open();
				
				}else{
					$scope.msgs ="Oops! please try again";
					$scope.open();
				}
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
