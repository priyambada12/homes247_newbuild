//(function(){

var router= angular.module('routerApp',['ui.router']);
router.config(["$stateProvider", "$urlRouterProvider",
		function ($stateProvider, $urlRouterProvider, $locationProvider) {
			
			var header = {
					templateUrl: 'html/sidebar.html',
					controller: 'sidebarCtrl'
						
			}
  
			var footer = {
					templateUrl: 'html/footer.html',
					controller:'footerCtrl' 

			}
			
			$stateProvider.state('dashboard', {
				url: '/dashboard',
				views: {
                header: header,
                content: {
                    templateUrl: 'html/dashboard.html',
                    controller: 'dashboardCtrl',
                    resolve: {
                        
//            timing: function($timeout, $q) {
//                var defer = $q.defer();
//                $timeout(function() {
//                    defer.resolve();
//                }, 3500);
//                return defer.promise;
//            }
        }
                },
                footer: footer
            }	
			}).state('aboutUs', {
				url: '/aboutUs',
				
				views: {
				header: header,
                content: {
                    templateUrl: 'html/about-us.html',
					controller: 'aboutusCtrl'
                },
                footer: footer
				}
				
			}).state('cityInfo', {
				url: '/cityInfo',
				views: {
                header: header,
                content: {
                    templateUrl: 'html/bangalore-city-info.html',
					controller: 'cityInfoCtrl'
                },
                footer: footer
            }
			}).state('city', {
				url: '/city',
				//url: '/city/:cityname/:locality/:buliderId/:reraId',
				 params: {
					cityname: null,
					locality:null,
					buliderId:null,
					reraId:null,
					},
				views: {
                header: header,
                content: {
                    templateUrl: 'html/city.html',
					controller: 'cityCtrl',
					//params: {new_param: null}
                },
                footer: footer
            }
			}).state('map', {
				url: '/map',
				views: {
                header: header,
                content: {
                    templateUrl: 'html/map.html',
					controller: 'mapCtrl',
					//params: {new_param: null}
                },
                footer: footer
            }
			}).state('blogs', {
				url: '/blogs',
				views: {
				header: header,
                content: {
                    templateUrl: 'html/blogs.html',
					controller: 'blogsCtrl'
                },
                footer: footer
				}
				
			}).state('builderPage', {
				url: '/builderPage',
				views: {
                header: header,
                content: {
                   templateUrl: 'html/builderPage.html',
				   controller: 'builderPageCtrl'
                },
                footer: footer
            }
				
				
			}).state('careers', {
				url: '/careers',
				
				views: {
                header: header,
                content: {
                    templateUrl: 'html/careers.html',
                    controller: 'careersCtrl'
                },
                footer: footer
            }
				
				
			}).state('contactUs', {
				url: '/contactUs',
				views: {
                header: header,
                content: {
                    templateUrl: 'html/contact-us.html',
                    controller: 'contactUsCtrl'
                },
                footer: footer
            }
				
			}).state('calculator', {
				url: '/calculator',
				views: {
                header: header,
                content: {
                   templateUrl: 'html/emi-calculator.html',
					controller: 'calculatorCtrl'
                },
                footer: footer
            }
				
				
			}).state('homeloan', {
				url: '/homeloan',
				views: {
                header: header,
                content: {
                   templateUrl: 'html/homeloan.html',
					controller: 'calculatorCtrl'
                },
                footer: footer
            }
				
				
			}).state('vaastu', {
				url: '/vaastu',
				views: {
                header: header,
                content: {
                   templateUrl: 'html/vaastutips.html',
					controller: 'calculatorCtrl'
                },
                footer: footer
            }
				
				
			}).state('interior', {
				url: '/interior',
				views: {
                header: header,
                content: {
                   templateUrl: 'html/interior.html',
					controller: 'calculatorCtrl'
                },
                footer: footer
            }
				
				
			}).state('news', {
				url: '/news',
				views: {
                header: header,
                content: {
                   templateUrl: 'html/news.html',
					controller: 'calculatorCtrl'
                },
                footer: footer
            }
				
			}) .state('faq', {
				url: '/faq',
				views: {
                header: header,
                content: {
                    templateUrl: 'html/faq.html',
                    controller: 'faqCtrl'
                },
                footer: footer
            }
				
				
			}).state('login', {
				url: '/login',
				views: {
                header:{ 
                    template: '<div></div>'
                },
                content: {
                    templateUrl: 'html/login.html',
					controller: 'loginCtrl'
                },
                footer: { 
                    template: '<div></div>'
                }
            }
				
				
			}).state('myaccounts', {
				url: '/myaccounts',
				views: {
                header: header,
                content: {
                   templateUrl: 'html/my-accounts.html',
				   controller: 'myaccountsCtrl'
                },
                footer: footer
            }
				
				
			}).state('myFav', {
				url: '/myFav',
				views: {
                header: header,
                content: {
                   templateUrl: 'html/my_fav.html',
				   controller: 'favCtrl'
                },
                footer: footer
            }
				
				
			}).state('setting', {
				url: '/setting',
				views: {
                header: header,
                content: {
                   templateUrl: 'html/account_setting.html',
				   controller: 'settingCtrl'
                },
                footer: footer
            }
				
				
			}).state('recentlyView', {
				url: '/recentlyView',
				views: {
                header: header,
                content: {
                   templateUrl: 'html/recently_viewed.html',
				   controller: 'recentlyViewedCtrl'
                },
                footer: footer
            }
				
				
			}).state('referEarn', {
				url: '/referEarn',
				views: {
                header: header,
                content: {
                   templateUrl: 'html/refer_earn.html',
				   controller: 'referEarnCtrl'
                },
                footer: footer
            }
				
				
			}).state('services', {
				url: '/services',
				views: {
                header: header,
                content: {
                  templateUrl: 'html/nri-services.html',
				  controller: 'servicesCtrl'
                },
                footer: footer
				
				}
			}).state('offers', {
				url: '/offers',
				views: {
                header: header,
                content: {
                  templateUrl: 'html/offers.html',
				  controller: 'offersCtrl'
                },
                footer: footer
				
				}
				
				
			}).state('policy', {
				url: '/policy',
				views: {
                header: header,
                content: {
                    templateUrl: 'html/privacy-poilicy.html',
                    controller: 'policyCtrl'
                },
                footer: footer
            }
				
			}).state('property', {
				url: '/property',
				//url: '/property:param',
				 params: {
					param:null,
				}, 
				views: {
                header: header,
				content: {
                    templateUrl: 'html/property-details.html',
					controller: 'propertyCtrl'
                },
                footer: footer
            }
				
				
				
			}).state('similarprop', {
				url: '/similarproperty',
				//url: '/similarproperty:param',
				 params: {
					param:null,
				}, 
				views: {
                header: header,
				content: {
                    templateUrl: 'html/similar_property.html',
					controller: 'propertyCtrl'
                },
                footer: footer
            }
				
				
				
			}).state('enquiry', {
				url: '/enquiry',
				//url: '/enquiry:param',
				 params: {
					param:null,
				}, 
				views: {
                header: header,
				content: {
                    templateUrl: 'html/enquiry.html',
					controller: 'propertyCtrl'
                },
                footer: footer
            }
				
				
				
			}).state('signUp', {
				url: '/signUp',
				views: {
                header: {
					template:'<div></div>'
				},
				content: {
                    templateUrl: 'html/sign-up.html',
					controller: 'signUpCtrl'
                },
                footer: {
					template:'<div></div>'
				}
            }
				
				
			}).state('newStory', {
				url: '/newStory',
				//url: '/newStory/:param/:type',
				 params: {
					param:null,
					type:null,
				}, 
				views: {
                header: header,
				content: {
                    templateUrl: 'html/newStories.html',
					controller: 'storiesCtrl'
                },
                 footer: footer
            }
				
				
			}).state('forgotPassword', {
				url: '/forgotPassword?token',
				views: {
				 header: header,
				content: {
                    templateUrl: 'html/forgot-pwd.html',
					controller: 'fpwdCtrl'
                },
				footer: footer
               
            }
				
				
			}).state('rera', {
				url: '/rera',
				//url: '/newStory/:param/:type',
				 params: {
					param:null,
					type:null,
				}, 
				views: {
                header: header,
				content: {
                    templateUrl: 'html/rera.html',
					controller: 'reraCtrl'
                },
                 footer: footer
            }
				
				
			})
			
			
			$urlRouterProvider.otherwise('/dashboard');
//            $locationProvider.html5Mode(true);
		}]);

   

//});
