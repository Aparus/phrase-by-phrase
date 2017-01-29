'use strict';

angular.module('booktitresApp')
        .constant("baseURL","http://localhost:3000/")
        .service('wordsFactory', ['$resource', 'baseURL', 'phrasesFactory', function($resource, baseURL, phrasesFactory) {
 
  this.words = []

  this.setWords = function(words_array){
    this.words = words_array
    this.words.unshift("")
    //this.trigger('words_updated')
  }

  this.setLang = function(lang){
    this.lang = lang
    //this.trigger('words_updated')
  }

  this.getLang = function(){
    return this.lang
  }



  this.getWords = function(){
    return this.words
  }

  this.getWord = function(wordNum){
    return this.words[wordNum]
  }

  this.getPhraseFromWords = function(word0, word1) {
    return this.words.slice(word0,word1).join(" ")
  }
  //returns is the words[i] beginning or end of phrase
  this.getWordStatus = function(wordNum){

    if(phrasesFactory.getPhrases().filter(function(phrase) { return phrase.word1 == wordNum; }).length > 0) return "endOfPhrase";
    else if(phrasesFactory.getPhrases().filter(function(phrase) { return phrase.word0 == wordNum; }).length > 0) return "startOfPhrase";
    else return "middleOfPhrase"
  }
         
            
        }])