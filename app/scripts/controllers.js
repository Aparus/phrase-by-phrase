'use strict';
angular.module('booktitresApp')

        .controller('EditorController', ['$scope', 'mediaFactory', 'phrasesFactory', 'subsFactory', function($scope, mediaFactory, phrasesFactory, subsFactory) {
            
            
            $scope.page = {mediaLink:"http://ia801406.us.archive.org/13/items/alice_in_wonderland_librivox/wonderland_ch_01.mp3", mediaType:""} 
            
            $scope.isAudio = false
            $scope.tab = 1
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
            
            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
            
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                console.log($scope.tab)
            }
            
            $scope.fuck = function (){
                console.log("bbbbb")
            }

            $scope.readSubs = function(subs_text){

              var subs_type = subsFactory.type(subs_text)
              
              
                if( (subs_type == "srt" ) || (subs_type == "webvtt" ) )
                    phrasesFactory.setPhrases(subsFactory.parseWebvttSrt(subs_text));
                else if(subs_type == "ass")
                    phrasesFactory.setPhrases(subsFactory.parseAss(subs_text));
                else if(subs_type = "htmlAudioBook")
                        phrasesFactory.setPhrases(subsFactory.parseAudioBookHtml(subs_text));
                        $scope.page.phrases = phrasesFactory.getPhrases()
            }
            

            

        }])
