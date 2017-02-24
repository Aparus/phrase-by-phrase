'use strict';

angular.module('booktitresApp')
        .constant("baseURL","http://localhost:3000/")
        .service('mediaFactory', ['$resource', 'baseURL', 'phrasesFactory', function($resource, baseURL, phrasesFactory) {
            
            
                var med = this

                  this.setMedia = function(mediaElement) {
                    this.media = mediaElement
                    this.play_mode = "stream"
                    var obj = this

/*                    this.media.ontimeupdate = function(e){
                      mediaOnTimeUpdate(e.target, obj.play_mode)
                    }
                    this.media.onpause = function(e){
                      mediaOnPause(e.target)
                    }*/
                    
                  }

                  this.getCurrentTime = function () {
                    return parseFloat(this.media.currentTime.toFixed(1))
                  }

                  this.setCurrentTime = function(time) {
                    this.media.currentTime = time
                  }

                  this.play = function() {
                    this.media.play()
                  }

                  this.pause = function() {
                    this.media.pause()
                  }

                  this.playPhrase = function(phraseNum){
                    this.play_mode = "phrase"
                    if(typeof phraseNum == "undefined") 
                        var phraseNum = phrasesFactory.getCurrentPhraseNum()
                    phrasesFactory.setCurrentPhrase(phraseNum)
                    var phrase = phrasesFactory.getPhrase(phraseNum)
                    this.media.currentTime = phrase.timingStart
                    this.media.play()
                  }
                  
                  this.playNextPhrase = function() {
                      var phraseNum = phrasesFactory.getCurrentPhraseNum() + 1
                      med.playPhrase(phraseNum)
                  }

                  this.playPreviousPhrase = function() {
                      var phraseNum = phrasesFactory.getCurrentPhraseNum() - 1
                      med.playPhrase(phraseNum)
                  }
                  
                  this.playEndOfPhrase = function(phraseNum, sec) {
                      this.play_mode = "phrase"
                      var phrase = phrasesFactory.getPhrase(phraseNum)
                      if (sec > 0) {
                          this.media.currentTime = phrase.timingEnd - sec
                      }
                      else {
                          this.media.currentTime = phrase.timingEnd + sec 
                          //this idea should be upgrage, because it's part of other phrase      
                      }
                      this.media.play()
                  }

                  this.type = function(link) {
                    if (/\.mp3$/.test(link)) return "audio"
                    else if (/\.mp4$/.test(link)) return "video"
                    else if (/youtu/.test(link)) return "youtube"
                    else return "unknown"
                  }

                  this.getLink = function() {
                    return this.media.src
                  }

                  this.setPlaybackRate = function(rate) {
                    this.media.playbackRate = rate
                  }


/*                  function mediaOnTimeUpdate(media, play_mode) {
                      
                      var currentPhraseNum = phrasesFactory.getCurrentPhraseNum()
                      var phrase = phrasesFactory.getPhrase(currentPhraseNum)
                      try {
                        if(media.currentTime >= phrase.timingEnd){

                            if(play_mode == "stream") {
                              phrasesFactory.setCurrentPhrase(currentPhraseNum + 1)
                            }
                            else if(play_mode == "phrase"){
                              media.pause()
                            }
                        }
                      }
                      catch(e){}

                        console.log(phrasesFactory.getCurrentPhraseNum())
                    }

                    function mediaOnPause(media) {
                      med.play_mode = "stream"
                    }*/
            
            
         this.setTimingLive = function() {
             
                var curPhraseNum = phrasesFactory.getCurrentPhraseNum()
                var prevPhrase = phrasesFactory.getPhrase(curPhraseNum - 1)

                    if(curPhraseNum > phrasesFactory.length()) {
                        //mediaFactory.pause()
                        phrasesFactory.updatePhrase(curPhraseNum, {
                                      timingStart:  prevPhrase.timingEnd,
                                      timingEnd: med.getCurrentTime(),
                                      text: "", 
                                      word0: 0, 
                                      word1: 0
                                      })
                    }

                    else {
                      phrasesFactory.updatePhrase(curPhraseNum, {
                                        timingStart: prevPhrase.timingEnd,
                                        timingEnd: med.getCurrentTime(), 
                                      })
                    }
             
        }           
           
        }])


