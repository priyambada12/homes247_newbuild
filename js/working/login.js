//(function(){
var app = angular.module('loginApp',['ngCookies','ui.bootstrap','modalApp']);
app.factory('loginFactory',function(networking){
		var factory = {};
	factory.signinWithHomes247 = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/user_login', requestData, callback);
	};

	factory.forgotPassword = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/UserForgetPass', requestData, callback);
	};
	
	return factory;
});

app.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });

app.controller('loginCtrl',function($scope,loginFactory,$state,$cookies,$modal, $log,
		cityFactory,$window,$rootScope,signupFactory){
			//$cookies.set('key','others');
//	$('body').attr('id', 'signup_bg');
     $(function() {
         document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	   $('a.panel').click(function () {

		$('a.panel').removeClass('selected');
		$(this).addClass('selected');
		
		current = $(this);
		
		$('#wrapper').scrollTo($(this).attr('href'), 500);		
		
		return false;
	});
           });
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
			if($scope.signup.source==1){
			$scope.msgs ="Registered successfully";
			$scope.open();
			angular.element("input[type='text']").val(null);
			angular.element("input[type='password']").val(null);
			angular.element("input[type='tel']").val(null);
			angular.element("input[type='email']").val(null);
			
			}else{
				$scope.login();
			}
		}else {
			$scope.msgs =success.data.message;
			$scope.open();
		}
	},function(error){
		alert("server is not running");
	});
}


	
	$scope.login = function(user,sourceId){
		user.source = sourceId;
		console.log(user);
		if(user.email==""){
			$scope.msgs ="Enter email address";
			$scope.open();
		}else if(user.password==""){
			$scope.msgs ="Enter password";
			$scope.open();
		}else if(user.email !="" && user.password!="" ){
		console.log(user);	
		loginFactory.signinWithHomes247(user,function(success){
			console.log(success);
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
			$scope.user.email='';
			$scope.user.password='';
			$scope.user.source='';
			$scope.msgs ="Invalid username and password";
			$scope.open();
		}
		
	},function(error){
		console.log(error);
		$scope.msgs ="Please try again !!";
		$scope.open();
	});
	}else{
		console.log("check the user object");
	}
	
	}
	$scope.forgotpassword = function(){
        $('.ui.modal')
    .modal({
      blurring: true,
      closable: true,
      observeChanges: false,
      onApprove : function() {
        swal({
          title: 'Enquiry Details Created Succefully',
          type: 'success',
          confirmButtonText: 'ok'
          // timer: 1500
        })
      }
    })
    .modal('show')
    };
//	$scope.showModal = false;
//    $scope.forgotpassword = function(){
//
//       $scope.showModal = !$scope.showModal;
//        
//    };
	
	$scope.sendEmail = function(emailId){
		
        console.log(emailId);

        if(emailId != undefined){
        	loginFactory.forgotPassword({userEmailId:emailId},function(success){
        		console.log(success);
				var statusMsg = success.data.status;
				if(statusMsg=="True"){
					$scope.showModal = !$scope.showModal;
					$scope.msgs ="Mail has sent to your registered email address. Please check your inbox.";
					$scope.open();
				}else{
					$scope.showModal = !$scope.showModal;
					$scope.msgs =success.data.message;
					$scope.open();
				}
				angular.element("input[type='email']").val(null);
        		 	
        	},function(error){
        		console.log(error);
        	});	
        		 
        }else{
        	$scope.errormsg ="Please provide email address";
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

//});