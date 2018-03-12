var app = angular.module('mapApp', []);

app.controller('mapCtrl',function($scope,$cookies,$window){
	
	var map;
      function loadMap() {
		  //alert("loaing");
        map = new google.maps.Map(document.getElementById('googleMap'), {
          center: {lat:12.972442, lng:77.580643},
          zoom: 10,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
        });
		loadmarker();
		 }
		 
		 loadMap();
		function loadmarker(){
		var infowindow = new google.maps.InfoWindow();

  var marker, i;
	var locations=JSON.parse($window.sessionStorage.getItem('properties'));
	//alert(locations.length);
    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i].address);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
		}

});