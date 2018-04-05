//(function(){
var propertyapp = angular.module('propertyApp', ['duScroll','slickCarousel','rzModule','ngDonut','ui.bootstrap','modalApp']);
propertyapp.factory('propertyFactory', function(networking) {
    var factory = {};
    factory.getPropretiesByID = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/get_propertyById', requestData, callback);
    };

    factory.addCallbackDetails = function(requestData, callback) {
        return networking.callServerForUrlEncondedPOSTRequest('/callback', requestData, callback);
    };
	factory.getCallBackBasedOnProperty = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/PropContactInfo', requestData, callback);
	};
	
	factory.getSimilarProperty = function(requestData,callback){
		return networking.callServerForUrlEncondedPOSTRequest('/get_similar_prop',requestData,callback);
	}
	
    return factory;
});


propertyapp.filter('unique', function() {
   // we will return a function which will take in a collection
   // and a keyname
   return function(collection, keyname) {
      // we define our output and keys array;
      var output = [], 
          keys = [];
      
      // we utilize angular's foreach function
      // this takes in our original collection and an iterator function
      angular.forEach(collection, function(item) {
          // we check to see whether our object exists
          var key = item[keyname];
          // if it's not already part of our keys array
          if(keys.indexOf(key) === -1) {
              // add it to our keys array
              keys.push(key); 
              // push this item to our final output array
              output.push(item);
          }
      });
      // return our array which should be devoid of
      // any duplicates
      return output;
   };
});

propertyapp.directive('myRepeatDirective', function() {
  return function(scope, element, attrs) {
    angular.element(element).css('color','blue');
	
    if (scope.$last){
	  var firstSlides = $("#slideshow-list li"),
			secondSlides = $("#image-list li"),
			nbSlides = firstSlides.length,
			slideTime = 3000,
			nextSlide = 0,
			timer;
			
			 function slideshow() {

     secondSlides.eq(nextSlide).addClass('active').siblings().removeClass('active');
     firstSlides.eq(nextSlide).fadeIn().delay(2000).fadeOut();
     nextSlide = (nextSlide + 1) % nbSlides;
     timer = setTimeout(slideshow, slideTime);
	
 }
 slideshow();
 
    }
  };
});
propertyapp.directive("preventTypingGreater", function() {
  return {
    link: function(scope, element, attributes) {
      var oldVal = null;
      element.on("keydown keyup", function(e) {
    if (Number(element.val()) > Number(attributes.max) &&
          e.keyCode != 46 // delete
          &&
          e.keyCode != 8 // backspace
        ) {
          e.preventDefault();
          element.val(oldVal);
        } else {
          oldVal = Number(element.val());
        }
      });
    }
  };
});
propertyapp.directive('validNumber', function() {
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
//propertyapp.filter('unique', function() {
//   return function(collection, keyname) {
//      var output = [], 
//          keys = [];
//
//      angular.forEach(collection, function(item) {
//          var key = item[keyname];
//          if(keys.indexOf(key) === -1) {
//              keys.push(key);
//              output.push(item);
//          }
//      });
//      return output;
//   };
//});
propertyapp.controller('propertyCtrl', function($scope, $rootScope, $timeout, $uibModal, propertyFactory, 
													$stateParams,urls,$modal, $log,networkFactory,$cookies) {
    
    
//    DO-NUT-CHART-STARTS
    
    $scope.selectedModel = {};
    $scope.setValues = function setValues() {
            $scope.emis = [
                { name: 'Interest Pay', value: 0 },
                { name: 'Total Capacity', value: 9999999 },
            ];
        };
    $scope.sorterFunc = function(property){
    return parseInt(property.BHK);
};
    $scope.emis = [];
    $timeout(function timeout() {
            $scope.setValues();
        }, 1000);
    $scope.openTooltip = function openTooltip(model) {
            $scope.selectedModel = model;
        };
    $scope.closeTooltip = function closeTooltip() {
            $scope.selectedModel = {};
        };
    $scope.donutColours = ['#0A3544', '#E4642D'];
    
//    DO-NUT-CHART-ENDS
    
    $scope.limit = 4;
   $scope.slider_ticks_values_at = {
    options: {
    ceil: 99999999,
//    step: 100000,
//    showTicks: true,
    },
  }
    $scope.customSlider = {
    term: 5,
    maxValue: 35,
    options: {
    floor: 5,
    ceil: 35,
    step: 5,
    showTicksValues: true,
    },
  }
    var formatToPercentage = function(value) {
          return value + '%'
        }
  $scope.percentages = {
      low: 0,
      options: {
        floor: 5,
        ceil: 15,
//        showTicksValues: true,
        translate: formatToPercentage,
        showSelectionBar: true,
  },
  }
    $(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $('.ui.dropdown').dropdown();
        $scope.selecteddata={
    'Type':{
      'MaxLength':8
    }
  }
        $scope.selecteddate={
    'Type':{
      'MaxLength':2
    }
  }
        $scope.selectedpercent={
            'Type':{
                'MaxLength':2
            }
        }
        });
	
//        SLICK-SIMILAR-PROJECT
        $scope.slickConfig1Loaded = true;
        $scope.slickConfig2Loaded = true;
        $scope.slickConfig3Loaded = true;
//        SLICK-SIMILAR-PROJECT
        
	//$cookies.set('key','others');
    
	$scope.ph_numbr = /^\+?\d{10}$/;
	$scope.propertyimage=urls.imagesURL+"uploadPropertyImgs/";
	$scope.uploadBHKImages = urls.imagesURL+"uploadBHKImgs/";
	$scope.amenitesImages = urls.imagesURL+"amenites/";
	$scope.bankImages = urls.imagesURL+"banks/";
    
	var property_id;
	if($stateParams.param != undefined){
		property_id = $stateParams.param;
		$cookies.put('propId',property_id);
	}else{
		property_id=$cookies.get('propId');
	}
	
	//var property_id=paramRequest.get();
    $scope.user = {
        name: '',
        mobileno: ''
    };

    
     $scope.enquiry = {
        name: '',
        mobileno: ''
    };
	
	
	
    propertyFactory.getPropretiesByID({
        propId: property_id
    }, function(success) {
		console.log(success.data);
        if (success.data.hasOwnProperty('deatils')) {
            $scope.propDetails = success.data.deatils;
			$scope.activeItem = $scope.propDetails[0].images[0].Id;
			console.log(success.data.deatils);
			$scope.image = $scope.propDetails[0].images[0].name;
			$scope.location = $scope.propDetails[0].locality_name;
			$scope.city_name=   $scope.propDetails[0].city_name;
			var localityId = $scope.propDetails[0].LoaclityId;
			$scope.tab =  $scope.propDetails[0].BHK_Deatils[0].BHK;
			$scope.getSimilarProjects(localityId);
      
      $scope.similar();
      $scope.gallery();
      $scope.gallery1();
			$scope.initMap();
			$scope.initMap2();
			$scope.initMap3();
        }
    }, function(error) {
        console.log(error);
    });
    
    $scope.slickConfig2 = {
        autoplay: true,
 	slidesToShow: 1,
 	slidesToScroll: 1,
 	arrows: false,
 	fade: true,
    infinite: true,
    cssEase: 'ease-out',
        asNavFor: '.slider-nav-thumbnails',
    method: {}
         };
    $scope.slickConfig3 = {
       slidesToShow: 3,
 	slidesToScroll: 1,
        arrows: false,
 	asNavFor: '.slider',
        vertical: true,
 	focusOnSelect: true,
    cssEase: 'ease-out',
    method: {}
         };

    //        SLICK-SIMILAR-PROJECT
		 $scope.slickConfig1 = {
             autoplay: true,
             infinite: true,
             slidesToShow: 4,
 	          slidesToScroll: 1,
 	          arrows: true,
 	          fade: false,
             cssEase: 'ease-out',
             method: {}
         };
	//        SLICK-SIMILAR-PROJECT
    
		$scope.$on('$viewContentLoaded', function(){
			var firstSlides = $("#slideshow-list li"),
			secondSlides = $("#image-list li"),
			nbSlides = firstSlides.length,
			slideTime = 3000,
			nextSlide = 0,
			timer;
			console.log(firstSlides);
			console.log(firstSlides.length);
			
  });
    $scope.gallery = function () {
      $scope.slickConfig2Loaded = false;
      $timeout(function () {
        $scope.slickConfig2Loaded = true;
      });
    };
    $scope.gallery1 = function () {
      $scope.slickConfig3Loaded = false;
      $timeout(function () {
        $scope.slickConfig3Loaded = true;
      });
    };
    //        SLICK-SIMILAR-PROJECT
    $scope.similar = function () {
      $scope.slickConfig1Loaded = false;
      $timeout(function () {
        $scope.slickConfig1Loaded = true;
      });
    };
    //        SLICK-SIMILAR-PROJECT
	

        $scope.setTab = function (tabId) {
			//alert(tabId);
            $scope.tab = tabId;
        };

        $scope.isSet = function (tabId) {
            return $scope.tab === tabId;
        };
	
		$scope.emi ={amount:'',intrestrate:'',term:''};
	     $scope.getrate=function(emi){
             $scope.selectedModel = {};
    $scope.setValues = function setValues() {
            $scope.emis = [
                { name: 'Interest Pay', value: interest_payable },
                { name: 'Total Capacity', value: emi.amount },
            ];
        };
    $scope.emis = [];
    $timeout(function timeout() {
            $scope.setValues();
        }, 1000);
    $scope.openTooltip = function openTooltip(model) {
            $scope.selectedModel = model;
        };
    $scope.closeTooltip = function closeTooltip() {
            $scope.selectedModel = {};
        };
    $scope.donutColours = ['#0A3544', '#E4642D'];
             
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
				 var roi = emi.intrestrate/(12*100);
				 //E = P × r × ( 1 + r )n / ( ( 1 + r )n - 1 )
				 var powval = Math.pow(1+roi,emi.term);
				 var interest_payable = emi.amount*roi*powval/(powval-1);
			 //var interest_payable= emi.amount*(emi.intrestrate/100)*emi.term;
			 $scope.interestpayable = interest_payable;
               $scope.totalAmount = parseInt(interest_payable)+parseInt(emi.amount);
			   $scope.monthlyAmount=(parseInt(emi.amount)+parseInt(interest_payable))/(parseInt(emi.term)*12);
			}
        };
            
       
        
	
	
	$scope.getcallBackForProperties = function(){
		if ($scope.enquiry.name == "") {
            $scope.msgs = "please provide your name";
			$scope.open();
        } else if ($scope.enquiry.mobileno == "") {
            $scope.msgs ="please provide your Mobile Number";
			$scope.open();
        } else if ($scope.enquiry.name != "" && $scope.enquiry.mobileno != "") {
		var propertyCallBack = {name:$scope.enquiry.name,number:$scope.enquiry.mobileno,propId:property_id};
		propertyFactory.getCallBackBasedOnProperty(propertyCallBack,function(success){
			var status = success.data.status;
                if (status == "True") {
                    $scope.msgs = "We will intimate you soon.";
					$scope.open();
                }
		},function(error){
			$scope.msgs = "Sorry! we are unable to process your request";
			$scope.open();
		});
		
		angular.element("input[type='text']").val(null);
			
		};
	};

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
					$scope.msgs = "We will intimate you soon.";
                    $scope.open();
                }
            }, function(error) {
                
				$scope.msgs = "Sorry! we are unable to process your request";
                    $scope.open();
            });
        }

    };
	
	$scope.getSimilarProjects= function(locality_id){
		propertyFactory.getSimilarProperty({'localityId':locality_id},function(success){
			if (success.data.hasOwnProperty('deatils')) {
            $scope.similarpropDetails = success.data.deatils;
			
        }
			//console.log(success.data.deatils);
		},function(error){
			console.log(error);
		});
	};
	
	function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if ((charCode < 48 || charCode > 57))
        return false;

    return true;
} 
  

  var map;
  var map2;
  var map3;
  var infowindow;

       var iconBase = 'map/';
        var icons = {
          atm: {
            icon: iconBase + 'atm.png'
          },
         hospital: {
            icon: iconBase + 'hospital.png'
          },school: {
            icon: iconBase + 'school.png'
          },restaurant: {
            icon: iconBase + 'restaurant.png'
          },shopping_mall: {
            icon: iconBase + 'mall.png'
          }
        };
    
        var myStyles =[
    {
        featureType: "poi",
//        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
    }
];
    
         var service ; 
//         var service2 ; 
//         var service3 ; 
      $scope.initMap =function() {
        var latitude =$scope.propDetails[0].latitude!= undefined?parseFloat($scope.propDetails[0].latitude):0.0;
        var longitude = $scope.propDetails[0].longitude != undefined?parseFloat($scope.propDetails[0].longitude):0.0;
        var pyrmont = {lat: latitude, lng: longitude};
        map = new google.maps.Map(document.getElementById('restaurant_map'), {
          center: pyrmont,
          zoom: 17,
//          styles: myStyles    
        });
          
        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);
          
        service.nearbySearch({
          location: pyrmont,
          radius: 100,
          type: ['restaurant']
        }, callback);
          
      }
      
          
          $scope.initMap2 =function() {
        var latitude =$scope.propDetails[0].latitude!= undefined?parseFloat($scope.propDetails[0].latitude):0.0;
        var longitude = $scope.propDetails[0].longitude != undefined?parseFloat($scope.propDetails[0].longitude):0.0;
        var pyrmont = {lat: latitude, lng: longitude};
        map = new google.maps.Map(document.getElementById('school_map'), {
          center: pyrmont,
          zoom: 17,
//        styles: myStyles  
        });

        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);
          
       service.nearbySearch({
          location: pyrmont,
          radius: 1000,
          type: ['school']
        }, callback);
              
          }
      
      
      $scope.initMap3 =function() {
        var latitude =$scope.propDetails[0].latitude!= undefined?parseFloat($scope.propDetails[0].latitude):0.0;
        var longitude = $scope.propDetails[0].longitude != undefined?parseFloat($scope.propDetails[0].longitude):0.0;
        var pyrmont = {lat: latitude, lng: longitude};
        
        map = new google.maps.Map(document.getElementById('hospital_map'), {
        center: pyrmont,
        zoom: 17,
//            styles: myStyles  
        });

        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);

        service.nearbySearch({
          location: pyrmont,
          radius: 1000,
          type: ['hospital']
        }, callback);

      }
      
      $scope.initMap4 =function() {
        var latitude =$scope.propDetails[0].latitude!= undefined?parseFloat($scope.propDetails[0].latitude):0.0;
        var longitude = $scope.propDetails[0].longitude != undefined?parseFloat($scope.propDetails[0].longitude):0.0;
        var pyrmont = {lat: latitude, lng: longitude};
        
        map = new google.maps.Map(document.getElementById('mall_map'), {
        center: pyrmont,
        zoom: 17,
//            styles: myStyles  
        });

        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);

          service.nearbySearch({
          location: pyrmont,
          radius: 1000,
          type: ['shopping_mall']
        }, callback);

      }
      
      $scope.initMap5 =function() {
        var latitude =$scope.propDetails[0].latitude!= undefined?parseFloat($scope.propDetails[0].latitude):0.0;
        var longitude = $scope.propDetails[0].longitude != undefined?parseFloat($scope.propDetails[0].longitude):0.0;
        var pyrmont = {lat: latitude, lng: longitude};
        
        map = new google.maps.Map(document.getElementById('atm_map'), {
        center: pyrmont,
        zoom: 17,
//            styles: myStyles  
        });

        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);

          service.nearbySearch({
          location: pyrmont,
          radius: 1000,
          type: ['atm']
        }, callback);

      }

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function createMarker(place) {
        //console.log(service);
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          icon: icons[place.types[0]].icon
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }
      

      $(document).ready(checkContainer);
      $(document).ready(checkContainer2);
      $(document).ready(checkContainer3);
      $(document).ready(checkContainer4);
      $(document).ready(checkContainer5);
      function checkContainer () {
     
  if($('#restaurant_map').is(':visible')){ //if the container is visible on the page
    $scope.initMap(); //Adds a grid to the html
  }  else {
      setTimeout(checkContainer, 100); //wait 50 ms, then try again
  }  
      }
    function checkContainer2 () {
          
              if($('#school_map').is(':visible')){ //if the container is visible on the page
    $scope.initMap2(); //Adds a grid to the html
  }  else {
      setTimeout(checkContainer2, 100); //wait 50 ms, then try again
  }
          
    }
          
    function checkContainer3 () {
     
  if($('#hospital_map').is(':visible')){ //if the container is visible on the page
    $scope.initMap3(); //Adds a grid to the html
  }  else {
      setTimeout(checkContainer3, 100); //wait 50 ms, then try again
  }
          
}
    function checkContainer4 () {
     
  if($('#mall_map').is(':visible')){ //if the container is visible on the page
    $scope.initMap4(); //Adds a grid to the html
  }  else {
      setTimeout(checkContainer4, 100); //wait 50 ms, then try again
  }
          
}
    function checkContainer5 () {
     
  if($('#atm_map').is(':visible')){ //if the container is visible on the page
    $scope.initMap5(); //Adds a grid to the html
  }  else {
      setTimeout(checkContainer5, 100); //wait 50 ms, then try again
  }
          
}
//google.maps.event.addDomListener(window, 'load', $scope.initMap); 
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
  
   $scope.hitimages =function() {
// alert("clicked");
//  var timer = setTimeout(slideshow, 100);
     clearTimeout(timer);
     var clickIndex = $(this).index()
     $('#slideshow-list li').eq(clickIndex).show().siblings().hide(); 
 };
  
	
});
//});