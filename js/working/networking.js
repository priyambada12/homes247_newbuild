var network = angular.module('networkApp',[]);
 network.constant('domain', 'http://homes247.in/cms/backend');
 network.constant('images_url','http://homes247.in/cms/images/'); 
 network.service('urls', function(domain,images_url) {
    this.apiUrl = domain;
	this.imagesURL = images_url;
 });
 
 network.factory('networking',function($http,urls){
	 
	 var factory={};
	 
	 factory.urlencodedRequest = function(serviceUrl,requestData){
		 
		 var req = {
			 method:'POST',
			 url:serviceUrl,
			 transformRequest: function(obj) {
                       var str = [];
                       for(var p in obj)
                       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                       return str.join("&");
                   },
			 data:requestData,
			 headers:{
				 "Content-Type": "application/x-www-form-urlencoded"
			 }
		 }
		 return req;
	 };
	 
	 
	 factory.urlencodedRequestForGet = function(serviceUrl){
		 
		 var req = {
			 method:'GET',
			 url:serviceUrl,
			 transformRequest: function(obj) {
                       var str = [];
                       for(var p in obj)
                       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                       return str.join("&");
                   },
			 headers:{
				 "Content-Type": "application/x-www-form-urlencoded"
			 }
		 }
		 return req;
	 };
	 
	 
	  factory.urlencodedRequestForGetWithParam = function(serviceUrl,requestData){
		 
		 var req = {
			 method:'GET',
			 url:serviceUrl,
			 transformRequest: function(obj) {
                       var str = [];
                       for(var p in obj)
                       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                       return str.join("&");
                   },
			params:requestData,
			 headers:{
				 "Content-Type": "application/x-www-form-urlencoded"
			 }
		 }
		 return req;
	 };
	 
	 factory.jsonPostRequest = function(serviceUrl,requestData){
		 
		 var req = {
			 method:'POST',
			 url: serviceUrl,
		     data: requestdata,
             headers : {       
                "Content-Type": "application/json"
            }
		 } 
		 return req;
		 
	 };
	 
	  factory.jsonmultipartfileRequest = function(serviceUrl,formdata){
		 
		 var req = {
			 method:'POST',
			 url: serviceUrl,
		     data: formdata,
			 transformRequest: angular.identity,
             headers: {
                   'Content-Type': undefined
             }
		 } 
		 return req;
		 
	 };
	 
	 
	 factory.callServerForUrlEncondedPOSTRequest = function(serverUrl,requestData,callback){
		 var requestForUrlEncoded = factory.urlencodedRequest(urls.apiUrl+serverUrl,requestData);
		 return $http(requestForUrlEncoded).then(callback,function(error){
			 console.log(error);
		 })
	 };
	 
	 factory.callServerForUrlEncondedGetWithRequestData = function(serverUrl,requestData,callback){
		 var requestForUrlEncoded = factory.urlencodedRequestForGetWithParam(urls.apiUrl+serverUrl,requestData);
		 return $http(requestForUrlEncoded).then(callback,function(error){
			 console.log(error);
		 })
	 };
	 
	 factory.callServerForUrlEncondedGETRequest = function(serverUrl,callback){
		 var requestForUrlEncoded = factory.urlencodedRequestForGet(urls.apiUrl+serverUrl);
		 return $http(requestForUrlEncoded).then(callback,function(error){
			 console.log(error);
		 })
	 };
	 
	 factory.callServerForJsonPOSTRequest = function(serverUrl,requestData,callback){
		 var requestForJson = factory.jsonPostRequest(urls.apiUrl+serverUrl,requestData);
		 return $http(requestForJson).then(callback,function(error){
			 console.log(error);
		 })
	 };
	 
	 factory.callServerForJsonmultipartRequest = function(serverUrl,requestData,callback){
		 var requestForJson = factory.jsonmultipartfileRequest(urls.apiUrl+serverUrl,requestData);
		 return $http(requestForJson).then(callback,function(error){
			 console.log(error);
		 })
	 };
	 

	 return factory;
	 
 });

