//(function(){
var app = angular.module('signupApp',['ui.bootstrap','modalApp']);

app.factory ('signupFactory',function(networking){
	var factory = {};
	factory.signUpWithHomes247 = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/user_registration', requestData, callback);
	}
	factory.signinWithHomes247 = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/user_login', requestData, callback);
	}
	return factory;
});

/* app.directive('googlePlusSignin', function ($window, $rootScope,signupFactory,$state,loginFactory) {
      var ending = /\.apps\.googleusercontent\.com$/;

      return {
          restrict: 'E',
          transclude: true,
          template: '<span></span>',
          replace: true,
          link: function (scope, element, attrs, ctrl, linker) {
              attrs.clientid += (ending.test(attrs.clientid) ? '' : '.apps.googleusercontent.com');
              attrs.$set('data-clientid', attrs.clientid);
              var defaults = {
                  onsuccess: onSignIn,
                  cookiepolicy: 'single_host_origin',
                  onfailure: onSignInFailure,
                  scope: 'profile email',
                  longtitle: false,
                  theme: 'dark',
                  autorender: true,
                  //access_type : online,
                  customtargetid: 'googlebutton'
              };

              defaults.clientid = attrs.clientid;

              // Overwrite default values if explicitly set
              angular.forEach(Object.getOwnPropertyNames(defaults), function (propName) {
                  if (attrs.hasOwnProperty(propName)) {
                      defaults[propName] = attrs[propName];
                  }
              });
              var isAutoRendering = (defaults.autorender !== undefined && (defaults.autorender === 'true' || defaults.autorender === true));
              if (!isAutoRendering && defaults.customtargetid === "googlebutton") {
                  console.log("element", element);
                  element[0].innerHTML =
                  '<div id="googlebutton">' +
                  ' <img src="images/login_with_gplus_btn.png" alt="" />'+
                  '</div>';
              }

              // Default language
              // Supported languages: https://developers.google.com/+/web/api/supported-languages
              attrs.$observe('language', function (value) {
                  $window.___gcfg = {
                      lang: value ? value : 'en'
                  };
              });

              // Some default values, based on prior versions of this directive
              function onSignIn(authResult) {
				  console.log(authResult);
				  if(authResult != null){
				  console.log(authResult.WE);
				  var signup = {name:authResult.w3.ig,number:'',password:'',
								email:authResult.w3.U3,
								source:3,
								uniqueId:authResult.w3.Eea};
                  
				  signupFactory.signUpWithHomes247(signup,function(success){
					  console.log("Registered successfully.....");
						console.log(success);
						if(success.data.status=="True"){
							loginWithGoogle(signup);
						}
						
				  });
				  }
              };
			  
			  function loginWithGoogle(signUp){
				  var user = {email:signUp.email,password:'',source:3};
				  loginFactory.signinWithHomes247(user,function(success){
		if(success.data.status=="True"){
			var userDetails = JSON.stringify(success.data.details);
			$cookies.put('user', userDetails);
			$state.go('myFav');
		}else{
			angular.element("input[type='text']").val(null);
			angular.element("input[type='password']").val(null);
			alert("Invalid username and password");
		}
		
	},function(error){
		alert("unable to connect to server");
	});
			  }
			  
              function onSignInFailure() {
                  console.log("signup failed");
              };

              // Asynchronously load the G+ SDK.
              var po = document.createElement('script');
              po.type = 'text/javascript';
              po.async = true;
              po.src = 'https://apis.google.com/js/client:platform.js';
              var s = document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(po, s);

              linker(function (el, tScope) {
                  po.onload = function () {
                      if (el.length) {
                          element.append(el);
                      }
                      //Initialize Auth2 with our clientId
                      gapi.load('auth2', function () {
                          var googleAuthObj =
                          gapi.auth2.init({
                              client_id: defaults.clientid,
                              cookie_policy: defaults.cookiepolicy
                          });

                          if (isAutoRendering) {
                              gapi.signin2.render(element[0], defaults);
                          } else {
                              googleAuthObj.attachClickHandler(defaults.customtargetid, {}, defaults.onsuccess, defaults.onfailure);
                          }
                      });
                  };
              });

          }
      }
  }); */
  
  
  app.config(function(socialProvider){
	socialProvider.setGoogleKey("939204790309-ipeio986co1f35sc6b0vd9mnfuvh6rll.apps.googleusercontent.com");

  socialProvider.setFbKey({appId: "2135655260052112", apiVersion: "v2.11"});
});
  app.provider("social", function(){
	var fbKey, fbApiV, googleKey;
	return {
		setFbKey: function(obj){
			fbKey = obj.appId;
			fbApiV = obj.apiVersion;
			var d = document, fbJs, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			fbJs = d.createElement('script'); 
			fbJs.id = id; 
			fbJs.async = true;
			fbJs.src = "http://connect.facebook.net/en_US/sdk.js";

			fbJs.onload = function() {
				FB.init({ 
					appId: fbKey,
					status: true, 
					cookie: true, 
					xfbml: true,
					version: fbApiV,
					frictionlessRequests: true,
					channelUrl: 'http://website.dev/channel.html'
				});
	        };

			ref.parentNode.insertBefore(fbJs, ref);
		},
		setGoogleKey: function(value){
			googleKey = value;
			var d = document, gJs, ref = d.getElementsByTagName('script')[0];
			gJs = d.createElement('script');
			gJs.async = true;
			gJs.src = "http://apis.google.com/js/platform.js"

			gJs.onload = function() {
				var params ={
					client_id: value,
					scope: 'email'
				}
				gapi.load('auth2', function() {
        			gapi.auth2.init(params);
      			});
		    };

		    ref.parentNode.insertBefore(gJs, ref);
		},
		$get: function(){
			return{
				fbKey: fbKey,
				googleKey: googleKey,
				fbApiV: fbApiV
			}
		}
	}
});

app.factory("socialLoginService",function($window, $rootScope){
	return {
		logout: function(){
			var provider = $window.localStorage.getItem('_login_provider');
			switch(provider) {
				case "google":
					//its a hack need to find better solution.
					var gElement = document.getElementById("gSignout");
					if (typeof(gElement) != 'undefined' && gElement != null)
					{
					  gElement.remove();
					}
					var d = document, gSignout, ref = d.getElementsByTagName('script')[0];
					gSignout = d.createElement('script');
					gSignout.src = "https://accounts.google.com/Logout";
					gSignout.type = "text/html";
					gSignout.id = "gSignout";
					$window.localStorage.removeItem('_login_provider');
					$rootScope.$broadcast('event:social-sign-out-success', "success");
					ref.parentNode.insertBefore(gSignout, ref);
			        break;
				
				case "facebook":
					FB.logout(function(res){
						$window.localStorage.removeItem('_login_provider');
					 	$rootScope.$broadcast('event:social-sign-out-success', "success");
					});
					break;
			}
		},
		setProvider: function(provider){
			$window.localStorage.setItem('_login_provider', provider);
		}
	}
});


app.directive("gLogin",
	function($rootScope, social, socialLoginService){
	return {
		restrict: 'EA',
		scope: {},
		replace: true,
		link: function(scope, ele, attr){
			ele.on('click', function(){
				var fetchUserDetails = function(){
					var currentUser = scope.gauth.currentUser.get();
					var profile = currentUser.getBasicProfile();
					var idToken = currentUser.getAuthResponse().id_token;
					var accessToken = currentUser.getAuthResponse().access_token;

					return {
						token: accessToken,
						idToken: idToken, 
						name: profile.getName(), 
						email: profile.getEmail(), 
						uid: profile.getId(), 
						provider: "google", 
						imageUrl: profile.getImageUrl()
					}
					
				}
		    	if(typeof(scope.gauth) == "undefined")
		    		scope.gauth = gapi.auth2.getAuthInstance();
				if(!scope.gauth.isSignedIn.get()){
					scope.gauth.signIn().then(function(googleUser){
						socialLoginService.setProvider("google");
						$rootScope.$broadcast('event:social-sign-in-success', fetchUserDetails());
					}, function(err){
						console.log(err);
					});
				}else{
					socialLoginService.setProvider("google");
					$rootScope.$broadcast('event:social-sign-in-success', fetchUserDetails());
				}
	        	
	        });
		}
	}
});

 app.directive("fbLogin",
 function($rootScope, social, socialLoginService, $q){
	return {
		restrict: 'EA',
		scope: {},
		replace: true,
		link: function(scope, ele, attr){
			ele.on('click', function(){
				var fetchUserDetails = function(){
					var deferred = $q.defer();
					FB.api('/me?fields=name,email,picture', function(res){
						if(!res || res.error){
							deferred.reject('Error occured while fetching user details.');
						}else{
							deferred.resolve({
								name: res.name, 
								email: res.email, 
								uid: res.id, 
								provider: "facebook", 
								imageUrl: res.picture.data.url
							});
						}
					});
					return deferred.promise;
				}
				FB.getLoginStatus(function(response) {
					if(response.status === "connected"){
						fetchUserDetails().then(function(userDetails){
							userDetails["token"] = response.authResponse.accessToken;
							socialLoginService.setProvider("facebook");
							$rootScope.$broadcast('event:social-sign-in-success', userDetails);
						});
					}else{
						FB.login(function(response) {
							if(response.status === "connected"){
								fetchUserDetails().then(function(userDetails){
									userDetails["token"] = response.authResponse.accessToken;
									socialLoginService.setProvider("facebook");
									$rootScope.$broadcast('event:social-sign-in-success', userDetails);
								});
							}
						}, {scope: 'email', auth_type: 'rerequest'});
					}
				});
			});
		}
	}
}); 

app.controller('signUpCtrl',function($scope,signupFactory,$state,$modal, $log,$rootScope,$cookies){
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
	alert("clicked");
	signupFactory.signUpWithHomes247(signUp,function(success){
		if(success.data.status == "True"){
			if($scope.signup.source==1){
			$scope.msgs ="Registered successfully";
			$scope.open();
			
			
			}else{
				$scope.login();
			}
		}
	},function(error){
		alert("server is not running");
	});
}



	
	$scope.login = function(){
		var socialUser = {
			uniqueId :$scope.signup.uniqueId,
			source:$scope.signup.source
		};
		console.log(socialUser);
		signupFactory.signinWithHomes247(socialUser,function(success){
		if(success.data.status=="True"){
			console.log(success.data);
			var userDetails = JSON.stringify(success.data.details);
			$cookies.put('user', userDetails);
			$state.go('myFav');
		}else{
			//angular.element("input[type='text']").val(null);
			//angular.element("input[type='password']").val(null);
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
			$state.go('login');
    };
    modalScope.cancel = function () {
            modalInstance.dismiss('cancel');
			$state.go('login');
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