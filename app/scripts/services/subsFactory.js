'use strict';

angular.module('booktitresApp')
        .service('subsFactory', ['$resource', 'baseURL', 'phrasesFactory', function($resource, baseURL, phrasesFactory) {

              this.subs = []
            
            // recognition of subs format by text patterns 
              this.type = function(text){
                if (/^WEBVTT/.test(text)) return "webvtt"
                else if(/^\d\s+?\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d/m.test(text)) return "srt"
                else if(/Dialogue: 0,\d:\d\d:\d\d.\d\d,\d:\d\d:\d\d.\d\d,Default,,0,0,0,,/.test(text)) return "ass"
                else if(/<!--audio start="(.+?)" end="(.+?)"-->([\s\S]+?)<!--\/audio-->/.test(text)) return "HtmlAudioBook"
                else if(/talk-transcript__fragment/.test(text)) return "ted"
                else return "unknown"
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

                  line_array = subs_array[i].split("\n")
                  //00:00:50.000 --> 00:00:52.780

                    srt_timing_array = line_array[1].split(" --> ")

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
                  line_array = subs_array[i].split(",")
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
                var phrases = []
                var template0 = /<!--audio start="(.+?)" end="(.+?)"-->([\s\S]+?)<!--\/audio-->/g
                var template = /<!--audio start="(.+?)" end="(.+?)"-->([\s\S]+?)<!--\/audio-->/
                var phrases0 = text.match(template0); // array with whole phrases 
                phrases0.forEach(function(phrase0){
                    var phrase = phrase0.match(template)
                    phrases.push({timingStart: phrase[1], timingEnd: phrase[2], text: phrase[3].replace(/\n/g, " ")})
                })
                return phrases

            }
              
              //00:00:06.960 --> 6.96
              this.timeToSeconds = function(time){
                var time_array = time.replace(/,/g,'.').split(":")
                return (parseFloat(time_array[2]) + parseFloat(time_array[1]*60) + parseFloat(time_array[0]*3600)).toFixed(2)
              }

              this.languageDetector = function(text) {
                if (/[ا-ي]/.test(text)) return "arabic"
                if (/[а-я]/.test(text)) return "cyrilic"
                if (/[a-z]/.test(text)) return "latin"
              }                                 
                                 
                                 

        }])