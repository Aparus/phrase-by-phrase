'use strict';
angular.module('booktitresApp')

        .controller('EditorController', ['$scope', 'mediaFactory', 'phrasesFactory', 'subsFactory', 'wordsFactory', 'translationsFactory', function($scope, mediaFactory, phrasesFactory, subsFactory, wordsFactory, translationsFactory) {
            
            
            $scope.page = {mediaLink:"http://ia801406.us.archive.org/13/items/alice_in_wonderland_librivox/wonderland_ch_01.mp3", mediaType:""} 
            
            $scope.isAudio = false
            $scope.tab = 1
            //$scope.page.phrases = phrasesFactory.getPhrases()

            $scope.mediaFactory = mediaFactory
            $scope.phrasesFactory = phrasesFactory
            $scope.subsFactory = subsFactory
            $scope.wordsFactory = wordsFactory
            $scope.translationsFactory = translationsFactory
            
            // when we input media link , if it's real resource, create an audio element in the page
            $scope.$watch("page.mediaLink", function(value){
                
                if(mediaFactory.type(value) == "audio") 
                    {
                        $scope.isAudio = true                      
                        mediaFactory.setMedia(document.getElementById('mediaElement')) 
                        
                            $scope.mediaFactory.media.ontimeupdate = function(e){
                              $scope.mediaOnTimeUpdate(e.target, $scope.mediaFactory.play_mode)
                            }
                            $scope.mediaFactory.media.onpause = function(e){
                              $scope.mediaOnPause(e.target)
                            }          
                    }
                else 
                    $scope.isAudio = false
            }); 
            
            
            $scope.wordClicked = function(index){
                  var prevPhrase = phrasesFactory.getPhrase(phrasesFactory.getCurrentPhraseNum() - 1)
                  var word0 = (wordsFactory.getWord(prevPhrase.word1 + 1).trim() != "") ? prevPhrase.word1 + 1 : prevPhrase.word1 + 2

                  phrasesFactory.updatePhrase(phrasesFactory.getCurrentPhraseNum(), {
                                word0: word0,
                                word1: index,
                                timingStart:  prevPhrase.timingEnd,
                                timingEnd: mediaFactory.getCurrentTime(),
                                text: wordsFactory.getPhraseFromWords(word0, index+1)
                                })  
                  console.log(phrasesFactory.getPhrases())
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
                        
                console.log(subs_type)
            }
            
            $scope.readWords = function(text){
                wordsFactory.setWords(text.split(/\s/))
                //console.log(wordsFactory.getWords())
            }
            

            

                  $scope.mediaOnTimeUpdate = function(media, play_mode) {
                      
                      var currentPhraseNum = phrasesFactory.getCurrentPhraseNum()
                      var phrase = phrasesFactory.getPhrase(currentPhraseNum)
                      try {
                        if(media.currentTime >= phrase.timingEnd){

                            if(play_mode == "stream") {
                              phrasesFactory.setCurrentPhrase(currentPhraseNum + 1)
                              $scope.$apply()
                            }
                            else if(play_mode == "phrase"){
                              media.pause()
                            }
                        }
                      }
                      catch(e){}

                        
                    }

                   $scope.mediaOnPause = function(media) {
                      $scope.mediaFactory.play_mode = "stream"
                    }            
            
                    $scope.translationLanguageSelected = function(lang) {
                        translationsFactory.setCurrentLanguage(lang)
                    }
                    
                    $scope.originalLanguageSelected = function(lang) {
                        phrasesFactory.setCurrentLanguage(lang)
                        console.log(phrasesFactory.getCurrentLanguage())
                    }                    
                    
                    
                    
                    $scope.langWithStatus = translationsFactory.getLanguagesCompleteStatusList()
                    
                    $scope.translations = translationsFactory.getTranslationsInLang(translationsFactory.getCurrentLanguage())
                    $scope.phrases = phrasesFactory.getPhrases()
                    console.log($scope.translations)
                    $scope.displayTranslations = function(){
                       console.log(translationsFactory.getAvailableTranslations())
                    }
                                

        }])
/*        .filter('onlyAvailableForReadingLanguages', function(){
              return function(avLangs) {

                var output = avLangs.map(function(elem){
                    return elem.status == "for reading"
                });

                return output;

          }    
        })*/
