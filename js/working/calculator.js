//(function(){
var calcapp = angular.module('calculatorApp',[]);
calcapp.factory('moreFactory', function(networking) {
    var factory = {};
    factory.addClientQuery = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/querysection', requestData, callback);
    };
	
    return factory;
});
calcapp.directive('validNumber', function() {
      return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
          if(!ngModelCtrl) {
            return; 
          }

          ngModelCtrl.$parsers.push(function(val) {
            if (angular.isUndefined(val)) {
                var val = '';
            }
            
            var clean = val.replace(/[^-0-9\.]/g, '');
            var negativeCheck = clean.split('-');
			var decimalCheck = clean.split('.');
            if(!angular.isUndefined(negativeCheck[1])) {
                negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                clean =negativeCheck[0] + '-' + negativeCheck[1];
                if(negativeCheck[0].length > 0) {
                	clean =negativeCheck[0];
                }
                
            }
              
            /*if(!angular.isUndefined(decimalCheck[1])) {
                decimalCheck[1] = decimalCheck[1].slice(0,2);
                clean =decimalCheck[0] + '.' + decimalCheck[1];
            }*/

            if (val !== clean) {
              ngModelCtrl.$setViewValue(clean);
              ngModelCtrl.$render();
            }
            return clean;
          });

          element.bind('keypress', function(event) {
            if(event.keyCode === 32) {
              event.preventDefault();
            }
          });
        }
      };
    });
	
	calcapp.directive('numbersOnly', function () {
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
calcapp.controller('calculatorCtrl',function($cookies,$scope,moreFactory,$modal, $log){
	
	
		$scope.emi ={amount:'',intrestrate:'',term:''};
		console.log($scope.emi);
	     $scope.getrate=function(emi){
			 if(emi.amount == ''){
				 $scope.msgs = "Enter the amount";
				 $scope.open();
			 }
			else if(emi.term == ''){
				$scope.msgs = "Enter the year";
				 $scope.open();
			}else if(emi.intrestrate == ''){$scope.msgs = "Enter the interest rate";
				 $scope.open();}
				 else if(emi.amount != '' && emi.intrestrate !='' && emi.term !='')	{ 
			 var interest_payable= emi.amount*(emi.intrestrate/100)*emi.term;
			 $scope.interestpayable = interest_payable;
               $scope.totalAmount = parseInt(interest_payable)+parseInt(emi.amount);
			   $scope.monthlyAmount=(parseInt(emi.amount)+parseInt(interest_payable))/(parseInt(emi.term)*12);
			}
        };
		
		
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
            moreFactory.addClientQuery(requestParam, function(success) {
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
            
//$cookies.set('key','others');

	 /* $('#horizontalTab').easyResponsiveTabs({
type: 'default', //Types: default, vertical, accordion           
width: 'auto', //auto or any width like 600px
fit: true,   // 100% fit in a container
closed: 'accordion', // Start closed if in accordion view
activate: function(event) { // Callback function if tab is switched
var $tab = $(this);
var $info = $('#tabInfo');
var $name = $('span', $info);
$name.text($tab.text());
$info.show();
}
});
$('#verticalTab').easyResponsiveTabs({
type: 'vertical',
width: 'auto',
fit: true
});  */

});
//});