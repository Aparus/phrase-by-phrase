'use strict';
angular.module('booktitresApp')

        .controller('EditorController', ['$scope', 'mediaFactory', 'phrasesFactory', function($scope, mediaFactory, phrasesFactory) {
            
            
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
                   
                  //$scope.page.phrases = phrasesFactory.getPhrases()
                  //phrasesFactory.setCurrentPhrase(curPhraseNum +1)
                  //console.log('$scope.phrases', $scope.page.phrases)
                  console.log('phrasesFactory', phrasesFactory.getPhrases())
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

        .controller('TableTestController', ['$scope', function($scope) {
                
                $scope.table = [{col1: 11, col2: 12, col3:13}, {col1: 21, col2: 22, col3:23}, {col1: 31, col2: 32, col3:33}]
                
                $scope.readTable = function(){
                    
                    console.log($scope.table)
                }
        }])