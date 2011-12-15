/*
Multiresolution Preview
Copyright (c) 2011 Jason Stehle

Permission is hereby granted, free of charge, to any person obtaining 
a copy of this software and associated documentation files (the 
"Software"), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to 
the following conditions:

The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

$(function() {
    var MultiRes = {
        template: null,
        resHtml: null,
        adjustHeight: false,
        
        resolutions: (function() {
            //Thanks to David Walsh: http://davidwalsh.name/detect-scrollbar-width
            var scrollbarWidth, scrollDiv = document.createElement("div");
            scrollDiv.className = "scrollbar-measure";
            document.body.appendChild(scrollDiv);
            scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);

            return {
                "iPhone P": {w:320, h: 480, wadjust: scrollbarWidth, withChromeHeight: 356},
                "iPhone L": {w:480, h: 320, wadjust: scrollbarWidth, withChromeHeight: 208},
                "Fire P": {w:600, h: 1024, wadjust: scrollbarWidth, withChromeHeight: 824}, //approximation
                "Fire L": {w:1024, h: 600, wadjust: scrollbarWidth, withChromeHeight: 400}, //approximation
                "iPad P": {w:768, h: 1024, wadjust: scrollbarWidth, withChromeHeight: 946},
                "iPad L": {w:1024, h: 768, wadjust: scrollbarWidth, withChromeHeight: 690},
                "1280 Desktop": {w:1280, h: 1024, wadjust: 0, withChromeHeight: 874},
                "1440 WS Laptop": {w:1440, h: 900, wadjust: 0, withChromeHeight: 750},
                "1920 WS Desktop": {w:1920, h: 1080, wadjust: 0, withChromeHeight: 930}
            };
        })(),
        
        getResolutionModels: function(rezs) {
            var rez, key, models = [];
            for (key in rezs) {
                if (rezs.hasOwnProperty(key)) {
                    rez = rezs[key];
                    models.push({key: key, w: rez.w, h: rez.h, id: rez.w + "x" + rez.h});
                }
            }
            return models;
        },
        
        setPreviewDimensions: function() {
            var w = this.res.w + this.res.wadjust, h = this.adjustHeight ? this.res.withChromeHeight : this.res.h;
            
            $("#preview-frame")
                .width(w)
                .height(h)
                .show();
            
            $("#resolution-indicator").text("" + this.res.w + "x" + h);
        },
        
        initElements: function() {
            $("#res-list").html(this.resHtml).buttonset(); //too drag-touchy to use, use buttons or tabs instead
            
            $(".resolution-radio").change($.proxy(function(ev) {
                this.res = this.resolutions[$(ev.currentTarget).val()];
                this.setPreviewDimensions();
            }, this));
            
            $("#adjust-height").button().change($.proxy(function(ev) {
                this.adjustHeight = !! $(ev.currentTarget).attr("checked");
                this.setPreviewDimensions();
            }, this));
    
            $("input:radio[name=resolution-radio]:first").click();
            
            $('.radio-label').click(function() {
                var rdo = $("#" + $(this).attr("for"));
                rdo[0].checked = true;
                rdo.button("refresh");
                rdo.change();
                return false;
            });
            
            $('.checkbox-label').click(function() {
                var cb = $("#" + $(this).attr("for"));
                cb[0].checked = !cb[0].checked;
                cb.button("refresh");
                cb.change();
                return false;
            });
            
            $("#adjust-height").change();
            
            $("#load-button").button().click(function() {
                $("#preview-frame").attr("src", $("#url").val());
            });
    
            $("#url").keypress(function(e) {
                if (e.which === 13) {
                    $("#preview-frame").attr("src", $("#url").val());
                    e.preventDefault();
                }
            });
        },
        
        init: function() {
            _.templateSettings = {
              evaluate : /\{@(.+?)@\}/g,
              interpolate : /\{\{(.+?)\}\}/g
            };
            this.template = _.template($("#radio-template").text());
            this.resHtml = this.template(this.getResolutionModels(this.resolutions));
            this.initElements();
        }
    };
    
    MultiRes.init();
    
});