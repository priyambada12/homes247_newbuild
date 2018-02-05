var app = angular.module('modalApp', []);

app.directive('myModal', function() {
    return {
        restrict: 'E',
        templateUrl: 'myModalContent.html',
        controller: function ($scope) {
          $scope.message = $scope.msgs;
        }
    };
});
  
  