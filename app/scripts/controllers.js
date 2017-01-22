'use strict';
angular.module('booktitresApp')

        .controller('EditorController', ['$scope', 'mediaFactory', 'phrasesFactory', 'subsFactory', function($scope, mediaFactory, phrasesFactory, subsFactory) {
            
            
            $scope.page = {mediaLink:"http://ia801406.us.archive.org/13/items/alice_in_wonderland_librivox/wonderland_ch_01.mp3", mediaType:""} 
            
            $scope.isAudio = false
            
            $scope.page.phrases = phrasesFactory.getPhrases()
           
           //phrasesFactory.setPhrases()
           //console.log('$scope.phrases', $scope.phrases.get())
           
           // when we input media link , if it's real resource, create an audio element in the page
            $scope.$watch("page.mediaLink", function(value){
                
                if(mediaFactory.type(value) == "audio") 
                    {
                        $scope.isAudio = true                      
                        mediaFactory.setMedia(document.getElementById('mediaElement'))               
                    }
                else 
                    $scope.isAudio = false
            });     
            
            $scope.mediaFactory = mediaFactory
            $scope.phrasesFactory = phrasesFactory
            $scope.subsFactory = subsFactory
            

            

        }])
