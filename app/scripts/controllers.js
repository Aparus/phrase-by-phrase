'use strict';
angular.module('booktitresApp')

        .controller('EditorController', ['$scope', 'mediaFactory', 'phrasesFactory', function($scope, mediaFactory, phrasesFactory) {
            
            
            $scope.page = {mediaLink:"http://ia801406.us.archive.org/13/items/alice_in_wonderland_librivox/wonderland_ch_01.mp3", mediaType:""} 
            $scope.media = {}
            $scope.isAudio = false
            $scope.mediaObject = {}
            
           phrasesFactory.setPhrases()
           $scope.phrases = phrasesFactory.get()
           
            $scope.$watch("page.mediaLink", function(value){
                
                if(mediaFactory.type(value) == "audio") 
                    {
                        $scope.isAudio = true                      
                        mediaFactory.setMedia(document.getElementById('media'))               
                    }
                else 
                    $scope.isAudio = false
            });            
 
            
            $scope.setTiming = function() {
                
                var curPhraseNum = phrasesFactory.getCurrentPhraseNum()
                    console.log('curPhraseNum', curPhraseNum)
                var prevPhrase = phrasesFactory.getPhrase(curPhraseNum - 1)

                    if(curPhraseNum > phrasesFactory.length()) {
                        //mediaFactory.pause()
                        phrasesFactory.updatePhrase(curPhraseNum, {
                                      timingStart:  prevPhrase.timingEnd,
                                      timingEnd: mediaFactory.getCurrentTime(),
                                      text: ""
                                      })
                    }

                    else {
                      phrasesFactory.updatePhrase(curPhraseNum, {
                                        "timingStart": prevPhrase.timingEnd,
                                        "timingEnd": mediaFactory.getCurrentTime()
                                      })
                    }
                //phrasesFactory.setCurrentPhrase(curPhraseNum +1)   
                  $scope.phrases = phrasesFactory.get()
                  console.log('$scope.phrases', $scope.phrases)
                  console.log('phrasesFactory', phrasesFactory.get())
              }
            
            $scope.playPhrase = function(phraseNum){
                mediaFactory.playPhrase(phraseNum)
            }
            
            $scope.timingStartChanged = function(phraseNum, $event){
                phrasesFactory.updatePhrase(phraseNum, {timingStart: $event.target.value} )
                console.log($scope.phrases[phraseNum])
            }
            
            $scope.timingEndChanged = function(phraseNum, $event){
                phrasesFactory.updatePhrase(phraseNum, {timingEnd: $event.target.value} )
                console.log($scope.phrases[phraseNum])
            }            
            //$scope.mediaType = $scope.mediaLink.$modelValue
        }])