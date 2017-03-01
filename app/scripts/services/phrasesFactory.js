'use strict';

angular.module('booktitresApp')
        .constant("baseURL","http://localhost:3000/")
        .service('phrasesFactory', ['$resource', 'baseURL', function($resource, baseURL) {
            
            
            var phr = this
            
            this.phrases = [{timingStart: 0, timingEnd: 0, text: "", word0: 0, word1: 0}]
            
            //this.language = "English"
            this.language = "Unknown"
            this.currentPhrase = 0
            
            this.setPhrases = function(phrases_input){
                
                if(typeof phrases_input == "undefined")
                    this.phrases = [{timingStart: 0, timingEnd: 0, text: ""}]
                else this.phrases = phrases_input
                

            }
            
        this.getCurrentLanguage = function (){
            return this.language
        }
        
        this.setCurrentLanguage = function(lang){
            this.language = lang
        }

          this.setCurrentPhrase = function(phraseNum){
            this.currentPhrase = phraseNum
            //this.trigger('currentPhraseChanged', phraseNum)
          }

          this.getCurrentPhraseNum = function() {
            return this.currentPhrase
          }

          this.getPhrases = function() {
            return phr.phrases
          }

          this.getPhrase = function(i){
            return this.phrases[i]
          }

          this.updatePhrase = function(phraseNum, params) {
            //if phrase exist we update it
            try {
              var phrase = phr.getPhrase(phraseNum)
              for (var key in params) {
                  phrase[key] = params[key]
              }
            }
            //if not exist we push phrase
            catch(e) {
              phr.phrases.push(params)
            }
          }
          
          this.deletePhrase = function(phraseNum) {
              phr.phrases.splice(phraseNum,1)
          }

          this.length = function() {
            return this.phrases.length-1
          }

          this.saveToLocalStorage = function() {
            localStorage["PhraseByPhrase " + Media.getLink()] = JSON.stringify(this)
          }

          this.restoreFromLocalStorage = function(mediaLink) {
            try {
              var restoredPhrases = JSON.parse(localStorage["PhraseByPhrase " + mediaLink])
              for (key in restoredPhrases) {
                  this[key] = restoredPhrases[key]
              }
              phrasesFactory.setCurrentPhrase(0)
              //riot.update()
            }
            catch(e){console.log("No data for restore in localStorage")}

          }
          
          // inserts default blank phrase after selected , for further editing 
          this.insertPhrase = function (phraseNum){
              var currentPhrase = this.getPhrase(phraseNum)
              var defaultPhraseAfter = {timingStart: currentPhrase.timingEnd, timingEnd: 9999, text: ""}
              this.phrases.splice(phraseNum + 1, 0, defaultPhraseAfter)
              this.setCurrentPhrase(phraseNum + 1)
          }
          
          
          // merges two phrases to one with their timing and text 
          this.mergePhrases = function(i1, i2) {
              var ph1 = this.getPhrase(i1)
              var ph2 = this.getPhrase(i2)
              var mergedPhrase = {
                                    "timingStart": ph1.timingStart, 
                                    "timingEnd": ph2.timingEnd, 
                                    "text": ph1.text + " " + ph2.text, 
                                    "word0": ph1.word0, 
                                    "word1": ph2.word1
                                } 
              
              this.updatePhrase( i1, mergedPhrase )
              this.deletePhrase(i2)
              
              }
          
        }])


