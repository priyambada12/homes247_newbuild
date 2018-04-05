//(function(){
var app = angular.module('faqApp',['ui.bootstrap','modalApp']);

app.factory('faqFactory', function(networking) {
    var factory = {};
    factory.addClientQuery = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/callback', requestData, callback);
    };
	
    return factory;
});
app.controller('faqCtrl',function(faqFactory, $scope,$modal, $log,$cookies){
        
    $(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
    });
	//$cookies.set('key','others');
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
        } else if(user.email ==""){
			$scope.msgs = "please provide your Email address";
			$scope.open();
		}else if(user.message ==""){
			$scope.msgs = "please provide message";
			$scope.open();
		} else if (user.name != "" && user.email != "" && user.message !="") {
            var requestParam = {
                name: user.name,
                number: '',
				email: user.email,
				msg:user.message
            };
            faqFactory.addClientQuery(requestParam, function(success) {
                var status = success.data.status;
                if (status == "True") {
					$scope.msgs = "We will intimate you soon.";
                    $scope.open();
					angular.element("input").val(null);
					angular.element("textarea").val(null);
                }
            }, function(error) {
                
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