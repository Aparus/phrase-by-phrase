'use strict';

angular.module('booktitresApp', ['ui.router','ngResource'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                    },
                    'player-in-sidebar': {
                        templateUrl : 'views/player-in-sidebar.html',
                        controller  : 'EditorController'
                    },
                    'content': {
                        templateUrl : 'views/phrases-edit-mode.html',
                        controller  : 'EditorController'
                    }, 
                    
                    'footer' : {
                        templateUrl :  'views/footer.html'
                    }
                    
                }

            })
        
            // route for the aboutus page
            .state('app.texts-edit-mode', {
                url:'texts-edit-mode',
                views: {
                    'content@': {
                        templateUrl : 'views/texts-edit-mode.html',
                        controller: 'EditorController'                
                    }                    
                }
            })
            
            // route for the contactus page
            .state('app.words-mode', {
                url:'words-mode',
                views: {
                    'content@': {
                        templateUrl : 'views/words-mode.html',
                                         
                    }                    
                }
            })
            
            // route for the menu page
            .state('app.result', {
                url: 'result',
                views: {
                    'content@': {
                        templateUrl : 'views/result.html',
                        
                    }                    
                }
            })
            ;
    
        $urlRouterProvider.otherwise('/');
    })
;