'use strict';

angular.module('booktitresApp')
        .service('subsFactory', ['$resource', 'baseURL', 'phrasesFactory', function($resource, baseURL, phrasesFactory) {
            
            
              this.subs = []
            
            // recognition of subs format by text patterns 
              this.type = function(text){
            
                var type = "unknown"
                if (/^WEBVTT/.test(text)) type = "webvtt"
                else if(/^\d\s+?\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d/m.test(text)) type = "srt"
                else if(/Dialogue: 0,\d:\d\d:\d\d.\d\d,\d:\d\d:\d\d.\d\d,Default,,0,0,0,,/.test(text)) type = "ass"
                else if(/<!--audio start="(.+?)" end="(.+?)"-->([\s\S]+?)<!--\/audio-->/.test(text)) type = "htmlAudioBook"
                else if(/talk-transcript__fragment/.test(text)) type = "ted"
                else type = "text_phrases"
                
                console.log(type)
                return type
                
              }

              this.push = function(phrase){
                this.subs.push(phrase)
              }

              //function the same for two formats : Webvtt and Srt 
              this.parseWebvttSrt = function(text){
                //text.replace(/WEBVTT\s+/, "")
                var subs_array = text.split("\n\n")
                var subs = [{timingStart: 0, timingEnd: 0, text: ""}]
                var sub = {}
                var srt_timing_array,  srt_timing_start_array, srt_timing_end_array, line_array = []

                if(subs_array[0] != "WEBVTT") subs_array.unshift("SRT")

                for (var i=1; i < subs_array.length; i++) {

                  var line_array = subs_array[i].split("\n")
                  //00:00:50.000 --> 00:00:52.780

                    var srt_timing_array = line_array[1].split(" --> ")

                        sub.timingStart = this.timeToSeconds(srt_timing_array[0])
                        sub.timingEnd = this.timeToSeconds(srt_timing_array[1])

                  sub.text = line_array.slice(2).join(" ")
                  subs.push(sub)
                  sub = {}

                }
                return subs

              }

              this.parseAss = function(text){
                var sub = {}
                var subs = [{timingStart: 0, timingEnd: 0, text: ""}]
                var subs_array = text.split('\n')
                subs_array.unshift("ASS")
                for (var i=1; i < subs_array.length; i++) {
                  var line_array = subs_array[i].split(",")
                  //Dialogue: 0,0:00:13.22,0:01:02.37,Default,,0,0,0,, There is text of phrase in media
                  sub.timingStart = this.timeToSeconds(line_array[1])
                  sub.timingEnd = this.timeToSeconds(line_array[2])
                  sub.text = line_array[9]
                  subs.push(sub)
                  sub = {}
                }

                return subs

              }

            //this function parse code of AudioBook to array of objects with the structure [{timingStart,timingEnd,text}] ; separates all code into the phrases objects
             this.parseAudioBookHtml = function(text){
                var phrases = [{timingStart: 0, timingEnd: 0, text: ""}]
                var template0 = /<!--audio start="(.+?)" end="(.+?)"-->([\s\S]+?)<!--\/audio-->/g
                var template = /<!--audio start="(.+?)" end="(.+?)"-->([\s\S]+?)<!--\/audio-->/
                var phrases0 = text.match(template0); // array with whole phrases 
                 var subs = this
                console.log(phrases0)
                phrases0.forEach(function(phrase0){
                    var phrase = phrase0.match(template)
                    var t0 = subs.timeToSeconds(phrase[1])
                    var t1 = subs.timeToSeconds(phrase[2])
                    phrases.push({timingStart: t0, timingEnd: t1, text: phrase[3].replace(/\n/g, " ")})
                })
                console.log(phrases)
                return phrases

            }
              
              //00:00:06.960 --> 6.96
              this.timeToSeconds = function(time){
                var time_array = time.replace(/,/g,'.').split(":")
                return parseFloat((parseFloat(time_array[2]) + parseFloat(time_array[1]*60) + parseFloat(time_array[0]*3600)).toFixed(1))
              }

              this.languageDetector = function(text) {
                if (/[ا-ي]/.test(text)) return "arabic"
                if (/[а-я]/.test(text)) return "cyrilic"
                if (/[a-z]/.test(text)) return "latin"
              }                                 
                                 
                                 

        }])