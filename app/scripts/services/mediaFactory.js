'use strict';

angular.module('booktitresApp')
        .constant("baseURL","http://localhost:3000/")
        .factory('mediaFactory', ['$resource', 'baseURL', 'phrasesFactory', function($resource, baseURL, phrasesFactory) {
            
            
                var med = this

                  this.setMedia = function(mediaElement) {
                    this.media = mediaElement
                    this.play_mode = "stream"
                    var obj = this

                    this.media.ontimeupdate = function(e){
                      mediaOnTimeUpdate(e.target, obj.play_mode)
                    }
                    this.media.onpause = function(e){
                      mediaOnPause(e.target)
                    }
                    return med
                  }

                  this.getCurrentTime = function () {
                    return parseFloat(this.media.currentTime.toFixed(2))
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
                    phrasesFactory.setCurrentPhrase(phraseNum)
                    var phrase = phrasesFactory.getPhrase(phraseNum)
                    this.media.currentTime = phrase.timingStart
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


                  function mediaOnTimeUpdate(media, play_mode) {
                      
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

                        
                    }

                    function mediaOnPause(media) {
                      med.play_mode = "stream"
                    }
            
            return med

        }])


