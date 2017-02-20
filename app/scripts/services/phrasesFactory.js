'use strict';

angular.module('booktitresApp')
        .constant("baseURL","http://localhost:3000/")
        .service('phrasesFactory', ['$resource', 'baseURL', function($resource, baseURL) {
            
            
            var phr = this
            
            this.phrases = [{timingStart: 0, timingEnd: 0, text: "", word0: 0, word1: 0}]
            this.language = "unknown"
            this.currentPhrase = 0
            
            this.setPhrases = function(phrases_input){
                
                if(typeof phrases_input == "undefined")
                    this.phrases = [{timingStart: 0, timingEnd: 0, text: ""}]
                else this.phrases = phrases_input
                

            }
            
          this.setLanguage = function(lang){
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
            return this.phrases
          }

          this.getPhrase = function(i){
            return this.phrases[i]
          }

        /*
          this.push = function(phrase){
            this.phrases.push(phrase)
            this.trigger('updated')
          }
        */

          this.updatePhrase = function(phraseNum, params) {
            //if phrase exist we update it
            try {
              var phrase = this.getPhrase(phraseNum)
              for (key in params) phrase[key] = params[key]
            }
            //if not exist we push phrase
            catch(e) {
              this.phrases.push(params)
            }

            //this.trigger('updated')
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
          
          this.insertPhraseAfter = function (phraseNum){
              var currentPhrase = this.getPhrase(phraseNum)
              var defaultPhraseAfter = {timingStart: currentPhrase.timingEnd, timingEnd: 9999, text: "", word0: 0, word1: 0}
              this.phrases.splice(phraseNum + 1, 0, defaultPhraseAfter)
              this.setCurrentPhrase(phraseNum + 1)
          }
          
          this.insertPhraseBefore = function (phraseNum){
              var phraseBeforeCurrent = this.getPhrase(phraseNum-1)
              try{
                var defaultPhraseBefore = {timingStart: phraseBeforeCurrent.timingEnd, timingEnd: 9999, text: "", word0: 0, word1: 0}
              }
              catch(e){
                var defaultPhraseBefore = {timingStart: 0, timingEnd: 9999, text: "", word0: 0, word1: 0}                  
              }
              this.phrases.splice(phraseNum, 0, defaultPhraseBefore)
              this.setCurrentPhrase(phraseNum)
          }          

        }])


