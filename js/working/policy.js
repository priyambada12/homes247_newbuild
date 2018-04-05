//(function(){
var app = angular.module('policyApp', ['ui.bootstrap','modalApp']);

  

app.factory('policyFactory', function(networking) {
    var factory = {};
    factory.addClientQuery = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/querysection', requestData, callback);
    };
	
    return factory;
});

app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.controller('policyCtrl',function(policyFactory, $scope,$modal, $log,$cookies){

    $(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
    });
	
	//$('.test_design').niceSelect();
	/* $('#first').carouseller({
					scrollSpeed: 850,
					autoScrollDelay: -1800,
					easing: 'easeOutBounce'
				});
	$('#third').carouseller({ 
					scrollSpeed: 800,
					autoScrollDelay: 1600,
					easing: 'linear'
				});
	$('#top-project').carouseller({ 
					scrollSpeed: 800,
					autoScrollDelay: 1600,
					easing: 'linear'
				}); */
	//$(fourd).carouseller();
	
	
	//$cookies.set('key','others');
	   $scope.user = {
        name: '',
        mobileno: '',
		email:'',
		msg:''
    }
 $scope.userQuery = function(user) {
        console.log(user);
        if (user.name == "") {
			$scope.msgs = "please provide your name";
			$scope.open();
        } else if (user.mobileno == "") {
			$scope.msgs = "please provide your Mobile Number";
			$scope.open();
          
        }else if(user.email ==""){
			$scope.msgs = "please provide your Email address";
			$scope.open();
		}else if(user.msg ==""){
			$scope.msgs = "please provide message";
			$scope.open();
		} else if (user.name != "" && user.mobileno != "" && user.email != "" && user.msg !="") {
            var requestParam = {
                name: user.name,
                number: user.mobileno,
				email: user.email,
				msg:user.msg
            };
            policyFactory.addClientQuery(requestParam, function(success) {
                var status = success.data.status;
                if (status == "True") {
					$scope.msgs = "We will intimate you soon.";
					angular.element("input").val(null);
					angular.element("textarea").val(null);
                    $scope.open();
                }
            }, function(error) {	
                conole.log(error);
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
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