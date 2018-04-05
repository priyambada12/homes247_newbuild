//(function(){
var aboutapp = angular.module('aboutUsApp', ['ui.bootstrap','modalApp']);


aboutapp.controller('aboutusCtrl', function($scope, networkFactory,$modal, $log,$cookies) {
	//$cookies.put('key','others');
    $(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
        });
    $scope.user = {
        name: '',
        mobileno: ''
    }
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
					$scope.msgs = "we will intimate you soon.";
                    $scope.open();
                }
            }, function(error) {
                
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
        }

    };
    //$('.test_design').niceSelect();
	/* 
    $('#first').carouseller({
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