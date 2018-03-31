

angular.module('pollApp', ['ui.router', 'chart.js', 'ngDialog', 'ngStorage', '720kb.socialshare'])
    .constant("baseURL","http://localhost:8080/")
    

   .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
           
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'public/view/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl: 'public/view/home.html',
                        controller  : 'MenuController'
                    },
                    'footer': {
                        templateUrl : 'public/view/footer.html'
                    }
                }
            })
            
            .state('app.poll', {
                url: 'poll/:id',
                views: {
                    'content@': {
                        templateUrl : 'public/view/poll.html',
                        controller  : 'PollController'
                   }
                }
            })
            
            .state('app.newpoll', {
                url: 'newpoll',
                views: {
                    'content@': {
                        templateUrl : 'public/view/newpoll.html',
                        controller  : 'NewpollController'
                   }
                }
            })
            
            .state('app.addnewpoll', {
                url: 'addnewpoll/:id',
                views: {
                    'content@': {
                        templateUrl : 'public/view/poll.html',
                        controller  : 'PollController'
                   }
                }
            })
            
            .state('app.mypolls', {
                url: 'mypolls',
                views: {
                    'content@': {
                        templateUrl: 'public/view/mypolls.html',
                        controller  : 'MyPollsController'
                   }
                }
            });
            
          
            
            

            $urlRouterProvider.otherwise('/');
    })
    

                     
                     
                     
                     
                     
                     
                     
                     
    
    
    
    
    
    
    
    
    
    
