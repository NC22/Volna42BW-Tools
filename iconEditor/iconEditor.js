/*
   @encoding       utf-8
   @name           iconEditor
   @namespace      -
   @description    Editor for 1-bit icons. Converts small images to monochrome 1-bit format, compatible with KellyCanvas library (C++) image structures. Used for prepare icons and small images to display on E-INK and LED displays. 
   @author         Rubchuk Vladimir <torrenttvi@gmail.com> aka nradiowave
   @license        GPLv3
   @version        v 1.0.0 18.07.24
    
    Part of Volna 42 project  | Actual version of tool can be found here https://volna42.com/tools/fontconverter
    
    - Flexible canvas for manual edit small 1-bit icons
    - Converts & reads images to 1-bit binary format
    
    Input image size is limited by 
    
    imageConverter.hMax = 128;
    imageConverter.wMax = 128;
    
    its not recomended to use it with bigger images since edit field is not optimized for that, but can be overloaded
    
    Todo - animation - add as new frame - delay \ w x h \ data , save \ load, click + hover draw until onrelize mouse
    // вывод предыдущего кадра - полупрозрачно            
*/


var imageConverter = new Object();
    imageConverter.screen = document.getElementById('screen');
    imageConverter.notice = document.getElementById('notice');
    
    imageConverter.canvas = document.createElement('canvas');
    imageConverter.ctx = imageConverter.canvas.getContext('2d');
        
    imageConverter.hMax = 128;
    imageConverter.wMax = 128;
    
    imageConverter.screenBuffer = []; // array of bool [y][x] (true \ false) From 1....128
    // imageConverter.screenBuffer = [];
    // imageConverter.screenWidth = w;
    // imageConverter.screenHeight = h;
    
    imageConverter.pixelSize = 12;
    
    imageConverter.print = function(text) {
        this.notice.innerText = text;
    }
    
    imageConverter.bufferToText = function(buffer, width, height) {
         
        var bits = '';  
        var byteData = '';
        for(var y = 0; y < height; y++) {
                        
            for(var x = 0; x < width; x++) {
                
                var pixelShow = false;
                if (typeof buffer[y+1] != 'undefined' && typeof buffer[y+1][x+1] != 'undefined' && buffer[y+1][x+1]) {
                    pixelShow = true;
                }
                
                bits += pixelShow ? '1' : '0';
                if (bits.length == 8) {
                
                    byteData += '0x' + parseInt(bits, 2).toString(16).toUpperCase() + ', ';
                    bits = '';
                }                                                                 
            }    
        }
        
        if (bits.length) {                            
             for (var x = 8 - bits.length; x > 0; x--) bits += '0';                            
             byteData += '0x' + parseInt(bits, 2).toString(16).toUpperCase() + ', ';
        }
        
        return byteData;
    }
    
    imageConverter.onScreenBufferUpdate = function() {
    
        imageConverter.updateFrameData(imageConverter.currentFrame, {
            w : imageConverter.screenWidth,
            h : imageConverter.screenHeight,
            buffer : imageConverter.screenBuffer,
        });
        
        imageConverter.updateFramesList();            
    }
    
    imageConverter.updateFrameData = function(i, data) {
        
        if (typeof imageConverter.frames[i] == 'undefined') {
            imageConverter.frames[i] = [];
        }
        
        imageConverter.frames[i].w = data.w;
        imageConverter.frames[i].h = data.h;
        imageConverter.frames[i].d = imageConverter.bufferToText(data.buffer, data.w, data.h);
    }
    
    imageConverter.currentFrame = 0;        
    imageConverter.frames = [];
    
    imageConverter.selectFrame = function(n) {  
        
        imageConverter.oLock = true;
        imageConverter.currentFrame = parseInt(n);
                  
        imageConverter.renderFromText(imageConverter.frames[imageConverter.currentFrame].d, imageConverter.frames[imageConverter.currentFrame].w, imageConverter.frames[imageConverter.currentFrame].h);  
                     
        if (imageConverter.frames[imageConverter.currentFrame].ox) imageConverter.sliderX.setValue(imageConverter.frames[imageConverter.currentFrame].ox);
        if (imageConverter.frames[imageConverter.currentFrame].oy) imageConverter.sliderY.setValue(imageConverter.frames[imageConverter.currentFrame].oy); 
        
        imageConverter.oLock = false;
        
        console.log(imageConverter.frames[imageConverter.currentFrame]);            
    }
    
    imageConverter.updateFramesList = function() {
        
        var framesBlock = document.getElementById('screen-animation-frames');
        var html = '';
        for (var i = 0; i < imageConverter.frames.length; i++) {
            html += '<button class="frame-select ' + (imageConverter.currentFrame === i ? 'active' : '') + '" data-frame="' + i + '">' + (1 + i) + '</button>';
        }
        
        framesBlock.innerHTML = html;
        
        var bEvents = document.getElementsByClassName('frame-select');
        for (var i = 0; i < bEvents.length; i++) {
             bEvents[i].onclick = function() {
                imageConverter.selectFrame(this.getAttribute('data-frame'));
            }
        }
        
        var addFrameButton = document.getElementById('screen-animation-frames-add');
            addFrameButton.onclick = function() {
                
                if (!imageConverter.screenWidth) return;
                
                imageConverter.currentFrame = imageConverter.frames.length;
                
                imageConverter.initScreen(imageConverter.screenWidth, imageConverter.screenHeight);
                imageConverter.onScreenBufferUpdate();                    
                imageConverter.updateFramesList();
            }
            
    }
    
    // 0x0 0x0 0x0 0x0 0x20 0x20 0x0 0xE 0xA 0x0 0x1 0xE2 0x40 0x0 0x7C 0x44 0x0 0xF 0x50 0x80 0x2 0x4 0x8 0x0 0x5C 0x1D 0x0 0x14 0x44 0x50 0x2 0xA8 0xAA 0x0 0x51 0x11 0x40 0x5 0xC1 0xD0 0x71 0xE0 0xF 0x0 0xA 0x72 0x88 0x0 0x80 0x22 0x80 0x2C 0x1A 0x50 0x0 0x44 0xA 0x0 0x18 0x41 0x40 0x7 0x4 0x28 0x0 0xC1 0xC9 0x0 0x38 0x3F 0x40 0x4 0x23 0x88 0x1 0x84 0x32 0x0 0x28 0x86 0xC0 0x5 0x11 0x58 0x0 0x92 0x4E 0x0 0xF 0xBF 0x80 0x0 
    imageConverter.frames.push({
         w : 27, 
         h : 27, 
         d : '0x0 0x0 0x0 0x0 0x20 0x20 0x0 0xE 0xA 0x0 0x1 0xE2 0x40 0x0 0x7C 0x44 0x0 0xF 0x50 0x80 0x2 0xCE 0x8 0x0 0x40 0x1 0x0 0xB 0x83 0xA0 0x1 0x88 0x8C 0x0 0x20 0x0 0x80 0x4 0x0 0x10 0x1 0xF7 0xDF 0x0 0x8 0xF8 0x88 0x0 0x8E 0x22 0x80 0x2C 0x1A 0x50 0x0 0x44 0xA 0x0 0x18 0x41 0x40 0x7 0x4 0x28 0x0 0xC1 0xC9 0x0 0x38 0x3F 0x40 0x4 0x23 0x88 0x1 0x84 0x32 0x0 0x28 0x86 0xC0 0x5 0x11 0x58 0x0 0x92 0x4E 0x0 0xF 0xBF 0x80 0x0 ',
    });
    
    imageConverter.frames.push({
         w : 27, 
         h : 27, 
         d : '0x0 0x0 0x0 0x0 0x20 0x20 0x0 0xE 0xA 0x0 0x1 0xE2 0x40 0x0 0x7C 0x44 0x0 0xF 0x50 0x80 0x2 0xCE 0x8 0x0 0x40 0x1 0x0 0xB 0xC7 0xA0 0x1 0x30 0x64 0x0 0x20 0x0 0x80 0x4 0x0 0x10 0x1 0xF0 0x1F 0x0 0x8 0x70 0x80 0x0 0x80 0x2C 0x0 0x2C 0x1A 0x40 0x0 0x44 0x28 0x0 0x18 0x42 0x80 0x7 0x4 0x50 0x0 0xC1 0xCA 0x0 0x38 0x3F 0x40 0x4 0x23 0x88 0x1 0x84 0x32 0x0 0x28 0x86 0xC0 0x5 0x11 0x58 0x0 0x92 0x4E 0x0 0xF 0xBF 0x80 0x0',
    
    });
    
    // 
    /*
    imageConverter.testSprite = {
            w : 27, 
            h : 27, 
            d : '0x0 0x0 0x0 0x0 0x20 0x20 0x0 0xA 0xA 0x0 0x1 0x22 0x40 0x0 0x44 0x44 \
           0x0 0x8 0x50 0x80 0x2 0xE 0x8 0x0 0x40 0x1 0x0 0x8 0x82 0x20 0x1 0x10\
           0x44 0x0 0x22 0x8 0x80 0x4 0x0 0x10 0x0 0xB9 0x3A 0x0 0x8 0x0 0x80 0x0 \
           0x80 0x20 0x0 0xE 0x38 0x0 0x0 0x44 0x0 0x0 0x10 0x40 0x0 0x4 0x4 0x0 \
           0x1 0x0 0x40 0x1 0xA0 0xB 0x0 0x4C 0x21 0x90 0x10 0xC4 0x61 0x2 0x8 \
           0x88 0x20 0x71 0x11 0x1F 0xD8 0x27 0x20 0xC7 0xFF 0xBF 0xFF 0x0'
    };
    */
    
    imageConverter.validateFloatString = function(val) {

        if (typeof val == 'number') return val;
        if (!val) return 0.0;
        
        val = val.trim();
        val = val.replace(',', '.');
        val = parseFloat(val);
        
        if (!val) return 0.0;
        
        return val;    
    }
    
    imageConverter.rgbToHsv = function(r, g, b) {
    
        if (r && g === undefined && b === undefined) {
            g = r.g, b = r.b, r = r.r;
        }

        r = r / 255, g = g / 255, b = b / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return {h: h, s: s, v: v};
    }

    imageConverter.addCss = function(id, css, clean) {
          
        var style = document.getElementById(id), head = document.head || document.getElementsByTagName('head')[0];
        if (!style) {
            style = document.createElement('style');
            style.type = 'text/css';
            style.id = id;       
            head.appendChild(style);
        }    
        
        if (style.styleSheet){
            if (clean) style.styleSheet.cssText = '';
            style.styleSheet.cssText += css;
        } else {
            if (clean) style.innerHTML = '';
            style.appendChild(document.createTextNode(css));
        }
    }
    
    imageConverter.updateScreenInfo = function(pointer) {
        
        var text = "Экран : " + imageConverter.screen.getAttribute('data-width') + 'x' + imageConverter.screen.getAttribute('data-height');
        if (pointer) text += ' [пиксель - <b>' + pointer.getAttribute('data-x') + '</b>,<b>' + pointer.getAttribute('data-y') + '</b>]';
        
        document.getElementById('screen-info').innerHTML = text;
        
    }

    imageConverter.initScreen = function(w, h) {

        imageConverter.sliderX.updateConfig({from : w * -1, to : w, value : 0});
        imageConverter.sliderY.updateConfig({from : h * -1, to : h, value : 0});
        
        imageConverter.screenBuffer = [];
        imageConverter.screenWidth = w;
        imageConverter.screenHeight = h;
        
        imageConverter.screen.innerHTML = '';
        
        imageConverter.screen.setAttribute('data-width', w);
        imageConverter.screen.setAttribute('data-height', h);
        imageConverter.updateScreenInfo();
        
        var table = document.createElement('table');
        imageConverter.screen.appendChild(table);
        
        tableHTML = '';
        for (var y = 1; y <= h; y++) {
            
            imageConverter.screenBuffer[y] = [];
            tableHTML += '<tr>';
            
            for (var x = 1; x <= w; x++) {
                imageConverter.screenBuffer[y][x] = false;
                tableHTML += '<td id="screen-' + x + '-' + y + '" data-x="' + x + '" data-y="'  + y + '"></td>';
            }
            
            tableHTML += '</tr>';
        } 
           
        table.innerHTML = tableHTML;
        var pixels = table.querySelectorAll('td');
        
        var pixelDraw = function(target) {
        
            if (target.classList.contains('active')) {
                target.classList.remove('active');
            } else {                         
                target.classList.add('active');                            
            }
        
            imageConverter.collapseForms();
            var rX = parseInt(target.getAttribute('data-x')) - parseInt(document.getElementById('image-x').value);
            var rY = parseInt(target.getAttribute('data-y')) - parseInt(document.getElementById('image-y').value);
        
            if (typeof imageConverter.screenBuffer[rY] != 'undefined' &&  typeof imageConverter.screenBuffer[rY][rX] != 'undefined') {
                imageConverter.screenBuffer[rY][rX] = target.classList.contains('active');
            }
        
            imageConverter.onScreenBufferUpdate();
        }
        
        for (var x = 0; x < pixels.length; x++) {
            pixels[x].onclick = function() {
         
            }
            
            pixels[x].style = "user-drag: none;  user-select: none;";
            
            pixels[x].onmouseover = function() {
                if (imageConverter.screen.drawStart) {
                    pixelDraw(this);
                }
                
                imageConverter.updateScreenInfo(this);
            }
        }
        
        imageConverter.screen.onmousedown = function(e) {
            if (e.which == 2) return;
			imageConverter.screen.drawStart = true;
            
            if (e.target.tagName == "TD") pixelDraw(e.target);
        }
        
        imageConverter.screen.onmouseup = function() {
            imageConverter.screen.drawStart = false;
        }
        
        imageConverter.incPixelSize(false, true);
    }
    
    imageConverter.collapseForms = function() {

            var forms = document.getElementsByClassName('form-wrap');
            for (var i = 0; i < forms.length; i++) forms[i].classList.remove('form-active');
    }
    
    imageConverter.incPixelSize = function(inc, refresh) {
        
        if (refresh) {
        
        } else {
            imageConverter.pixelSize += inc ? 2 : -2;
            if (imageConverter.pixelSize <= 2) imageConverter.pixelSize = 2;
        }
        
        imageConverter.addCss('pixel-size', '#screen td {width: ' + imageConverter.pixelSize + 'px; height: ' + imageConverter.pixelSize + 'px; min-height: ' + imageConverter.pixelSize + 'px; min-width: ' + imageConverter.pixelSize + 'px;}', true);
    }
    
    imageConverter.setPixel = function(x, y, bitShow) {
        
            var pixel = document.getElementById('screen-' + x + '-' + y);
            if (!pixel) {
                console.log('x ' + x + ' y ' + y);
                return;
            } 
            
            if (bitShow) {
            
                pixel.classList.add('active');
                
            } else {
                pixel.classList.remove('active');
            }
    }
    
    imageConverter.renderBuffer = function() {
            
            if (!imageConverter.screenHeight) return;
            
            if (imageConverter.screenBuffer.length <= 0) return;
            
            var offsetY = parseInt(document.getElementById('image-y').value);
            var offsetX = parseInt(document.getElementById('image-x').value);
            
            console.log('buffer draw ' + offsetX + ' | ' + offsetY);
            
            for(var y = 1; y <= imageConverter.screenHeight; y++) {
                
                for(var x = 1; x <= imageConverter.screenWidth; x++) {
                    
                    imageConverter.setPixel(x, y, false);
                                                                                  
                }    
            }  
             
            for(var y = 1; y <= imageConverter.screenHeight; y++) {
                
                for(var x = 1; x <= imageConverter.screenWidth; x++) {
                    
                    var resultX = x+offsetX;
                    var resultY = y+offsetY;
                     
                 //    console.log(resultY + ' ' + resultX);
                     
                     
                    if (resultY < 1 || resultY > imageConverter.screenHeight) {
                        // skip
                    } else if (resultX < 1 || resultX > imageConverter.screenWidth) {
                        // skip
                    } else if (imageConverter.screenBuffer[y] && imageConverter.screenBuffer[y][x]) {
                       imageConverter.setPixel(resultX, resultY, imageConverter.screenBuffer[y][x]);
                    }                                                                 
                }    
            }  
             
    }
    
	imageConverter.initCopyright = function() {

		var block = document.createElement('div');
			block.innerHTML = '<a href="https://nradiowave.ru/dev/" target="_blank">nradiowave</a>&nbsp(проект - <a href="https://volna42.com/?kellyc=1" target="_blank">Волна 42</a>)&nbsp&nbsp©&nbsp&nbsp' + new Date().getFullYear();
			block.classList.add('copyright');
			document.body.appendChild(block);
	}
    
	
    imageConverter.renderFileInput = function() {
        
        console.log('render file');
        
        var file = document.getElementById('image');
        if (file.files.length <= 0) {
            return imageConverter.print('Файл не выбран');
        }
        
        var reader = new FileReader();
            reader.addEventListener("loadend", function(arg) {
            
                  var src = new Image();
                      src.onload = function() {
                        
                        if (src.height > imageConverter.hMax) {
                            return imageConverter.print('Высота картинки больше ' + imageConverter.hMax + 'px - ' + src.height + 'px');
                        }
                        
                        if (src.width > imageConverter.wMax) {
                            return imageConverter.print('Ширина картинки больше ' + imageConverter.wMax + 'px - ' + src.width + 'px');
                        }
						
						var newPixelSize = imageConverter.pixelSize;
						if (src.width > 64 && imageConverter.pixelSize > 6) newPixelSize = 6;
                        
                        var bgType = document.getElementById('image-bg-type').value;
                        var valueLimit = imageConverter.validateFloatString(document.getElementById('image-value').value);
                        
                        imageConverter.initScreen(src.width, src.height);
                        
                        imageConverter.canvas.width = src.width;                
                        imageConverter.canvas.height = src.height;
                        imageConverter.ctx.drawImage(src, 0, 0);               
                        
                        var pixels = imageConverter.ctx.getImageData(0, 0, imageConverter.canvas.width, imageConverter.canvas.height);                                        
                        var i = 0;
                    
                        for(var y = 0; y < imageConverter.canvas.height; y++) {
                            
                            for(var x = 0; x < imageConverter.canvas.width; x++) {
                                
                                var bitShow = true;
                                if (pixels.data[i + 3] <= 128) bitShow = false;
                                else {
                                    var hsv = imageConverter.rgbToHsv(pixels.data[i + 0], pixels.data[i + 1], pixels.data[i + 2]);
                                    
                                    if (bgType == 'black' && hsv.v < valueLimit) {
                                        bitShow = false;
                                    }
                                    
                                    if (bgType == 'white' && hsv.v > valueLimit) {
                                        bitShow = false;
                                    }
                                }
                                
                                imageConverter.screenBuffer[y+1][x+1] = bitShow;  
                                
                                i += 4;                                                                    
                            }    
                        }
                        
                        imageConverter.onScreenBufferUpdate();
                        imageConverter.renderBuffer();
                        
						if ( newPixelSize != imageConverter.pixelSize){
							imageConverter.pixelSize = newPixelSize
							imageConverter.incPixelSize(false, true);
						}
                      }
                        
                      src.src = this.result;
              
            });

            reader.readAsDataURL(file.files[0]);
    }
    
    imageConverter.getBit = function(byte, position) // position in range 0-7
    {
        return (byte >> (7 - position)) & 0x1;
    }
    
    imageConverter.renderFromText = function(data, width, height) {
        
            data = data.trim().replace(/(\r\n\t|\n|\r\t)/gm," "); // replace special symbols to space
            data = data.replace(new RegExp(',', 'g'), ' ');                    
            data = data.replace(/\s+/g, ' '); // remove more than 1 space                    
            data = data.split(' ');
        
            var dataNum = width * height;
            var logData = '';
            
            for (var i = 0; i < dataNum; i++) {
            
                if (i > data.length-1) {
                
                    data.push(0);
                    
                } else {
                
                    data[i] = data[i].trim();
                    var byteData = parseInt(data[i]);
                    
                    if (isNaN(byteData)) byteData = 0;
                    if (byteData > 255) byteData = 255; // max 0xFF
                    
                    data[i] = byteData;
                }
                
                // logData += data[i].toString(16).toUpperCase() + ' '; 
            }
            
            
            imageConverter.initScreen(width, height);                                        
            var bit = 0, bitCursor = 0;
            
            for(var y = 1; y <= height; y++) {
                    
                imageConverter.screenBuffer[y] = [];
                            
                for(var x = 1; x <= width; x++) {
                
                    //logData += imageConverter.getBit(data[bit], bitCursor);
                    
                    imageConverter.screenBuffer[y][x] = imageConverter.getBit(data[bit], bitCursor) ? true : false;                                
                    bitCursor++;
                    
                    if (bitCursor > 7) {
                    
                        //logData += " [" + data[bit].toString(16) + "] |||";                            
                        //console.log(logData);
                        //logData = '';
                        
                        bit++;
                        bitCursor = 0;
                        
                    }
                }    
            }
            
            imageConverter.onScreenBufferUpdate();
            imageConverter.renderBuffer();
    }
    
    imageConverter.init = function(env) {
     
        if (!env) env = {};
        
        if (env.name) {
            document.title = env.name + " v" + env.version;
        }
		
		if (document.getElementById('app-name')) document.getElementById('app-name').innerText = env.name;
		if (document.getElementById('app-version')) document.getElementById('app-version').innerText = env.version;
		
        var sliderDefault = function(self){
             
                if (imageConverter.renderTimer) clearTimeout(imageConverter.renderTimer);
                        
                if (imageConverter.sliderV == self) {
                
                    var file = document.getElementById('image');
                    if (file.files.length > 0) {
                        imageConverter.renderTimer = setTimeout(imageConverter.renderFileInput, 500);
                    }
                    
                } else {
                
                   if (!imageConverter.oLock && typeof imageConverter.frames[imageConverter.currentFrame] != 'undefined') {
                        imageConverter.frames[imageConverter.currentFrame][self.getInput().id == 'image-y' ? 'oy' : 'ox'] = self.getValue();
                   }
                   
                   imageConverter.renderTimer = setTimeout(imageConverter.renderBuffer, 500);
                }
                
                 // document.getElementById('display').innerHTML = self.getValue();
                // 
         }
            
         document.getElementById('image-bg-type').onchange = imageConverter.renderFileInput;
          
         // KellySimpleSlider.loadDefaultCss('slider');
          
         imageConverter.sliderV = new KellySimpleSlider({input : 'image-value', inputVisible : true, value: 0.85, from : 0.1, to : 0.99, step : 0.01, manualChangeTimeout : 1000, 
                events : {onChange : sliderDefault, }
            });
            
         imageConverter.sliderX = new KellySimpleSlider({input : 'image-x', inputVisible : true, value: 0, from : -128, to : 128,  step : 1, manualChangeTimeout : 1000, 
                    events : {onChange : sliderDefault, }
                });
                
         imageConverter.sliderY = new KellySimpleSlider({input : 'image-y', inputVisible : true, value: 0, from : -128, to : 128, step : 1, manualChangeTimeout : 1000, 
                    events : {onChange : sliderDefault, }
                });

          document.getElementById('image').onchange = imageConverter.renderFileInput;
          document.getElementById('image-refresh').onclick = imageConverter.renderFileInput;
          
          var onToggleForm = function() {
          
                var form = document.getElementById(this.getAttribute('data-target'));
                var active = form.classList.contains('form-active');
                
                imageConverter.collapseForms();
                
                if (active) form.classList.remove('form-active');
                else form.classList.add('form-active');
                
                setTimeout(function() {   
					imageConverter.sliderV.refresh(); 
                    imageConverter.sliderX.refresh(); 
                    imageConverter.sliderY.refresh(); 
                }, 12);
          }
          
          var formToggle = document.getElementsByClassName('form-toggle');
          for (var i = 0; i < formToggle.length; i++) {
                formToggle[i].onclick = onToggleForm;
          }
          
          document.getElementById('image-from-scratch').onclick = function() {
                                  
                var width = parseInt(document.getElementById('image-from-scratch-width').value);
                var height = parseInt(document.getElementById('image-from-scratch-height').value);
                
                if (isNaN(width)) width = 16;
                if (isNaN(height)) height = 16;
                
                var cutBuffer = [];                     
            
                if (document.getElementById('image-from-scratch-cut').checked) {
                    
                    for (var y = 1; y <= height; y++) {
                        cutBuffer[y] = [];
                        for (var x = 1; x <= width; x++) {
                            cutBuffer[y][x] = false;
                        }
                    } 
        
                    var cutStartX = parseInt(document.getElementById('image-from-scratch-offset-x').value);
                    var cutStartY = parseInt(document.getElementById('image-from-scratch-offset-y').value);
                    
                    var offsetY = parseInt(document.getElementById('image-y').value);
                    var offsetX = parseInt(document.getElementById('image-x').value);
                    
                    cutStartX--; 
                    cutStartY--;
                    
                    if (isNaN(cutStartX) || cutStartX < 0) cutStartX = 0;
                    if (isNaN(cutStartY) || cutStartY < 0) cutStartY = 0;
                    
                    for(var y = 1; y <= imageConverter.screenHeight; y++) {
                        
                        for(var x = 1; x <= imageConverter.screenWidth; x++) {
                        
                            var resultX = x-offsetX;
                            var resultY = y-offsetY;
                     
                            if (resultY < 1 || resultY > imageConverter.screenHeight) {
                                // skip
                            } else if (resultX < 1 || resultX > imageConverter.screenWidth) {
                                // skip
                            } else if (imageConverter.screenBuffer[resultY] && typeof imageConverter.screenBuffer[resultY][resultX] != 'undefined') {
                               
                                    if (resultX > cutStartX && resultY > cutStartY && cutBuffer[y - cutStartY] && typeof cutBuffer[y - cutStartY][x - cutStartX] != 'undefined') {
                                        
                                        cutBuffer[y - cutStartY][x - cutStartX] = imageConverter.screenBuffer[resultY][resultX];                                    
                                    }  
                            }                                                                                               
                        }    
                    }  
                    
                }
                
                imageConverter.initScreen(width, height);
                if (cutBuffer.length > 0) imageConverter.screenBuffer = cutBuffer;
                imageConverter.onScreenBufferUpdate();
                imageConverter.renderBuffer();
                
          }
                        
          document.getElementById('screen-plus').onclick = function() {
          
            imageConverter.incPixelSize(true);
            
          }
          
          document.getElementById('screen-minus').onclick = function() {
          
                imageConverter.incPixelSize(false);                
            
          }
		  
		  imageConverter.initCopyright();
		  
          var invertFrame = function() {
          
                if (!imageConverter.screen.getAttribute('data-width')) {
                    return false;
                }
                
                var width = parseInt(imageConverter.screen.getAttribute('data-width'));
                var height = parseInt(imageConverter.screen.getAttribute('data-height'));
                
                document.getElementById('image-from-data-width').value = width;
                document.getElementById('image-from-data-height').value = height;
                
                var bits = '';  
                var byteData = '';
                for(var y = 0; y < height; y++) {
                                
                    for(var x = 0; x < width; x++) {
                        
                        var bit = document.getElementById('screen-' + (x + 1) + '-' + (y + 1)).classList.contains('active') ? '0' : '1';
                        
                        bits += bit;
                        if (bits.length == 8) {
                        
                            byteData += '0x' + parseInt(bits, 2).toString(16).toUpperCase() + ', ';
                            bits = '';
                        }                                                                 
                    }    
                }
                
                if (bits.length) {                            
                     for (var x = 8 - bits.length; x > 0; x--) bits += '0';                            
                     byteData += '0x' + parseInt(bits, 2).toString(16).toUpperCase() + ' ';
                }
                
                imageConverter.frames[imageConverter.currentFrame].d = byteData;
                imageConverter.selectFrame(imageConverter.currentFrame);                        
          }
          
          document.getElementById('image-invert').onclick = invertFrame;
          
          var getCodeEv = function() {
          
                if (!imageConverter.screen.getAttribute('data-width')) {
                    return false;
                }
                
                var form = document.getElementById('image-from-data-form');
                    
                var forms = document.getElementsByClassName('form-wrap');
                for (var i = 0; i < forms.length; i++) {
                    forms[i].classList.remove('form-active');
                }
                
                form.classList.add('form-active');
                
                var width = parseInt(imageConverter.screen.getAttribute('data-width'));
                var height = parseInt(imageConverter.screen.getAttribute('data-height'));
                
                document.getElementById('image-from-data-width').value = width;
                document.getElementById('image-from-data-height').value = height;
                
                var bits = '';  
                var byteData = '';
                for(var y = 0; y < height; y++) {
                                
                    for(var x = 0; x < width; x++) {
                                                   
                        bits += document.getElementById('screen-' + (x + 1) + '-' + (y + 1)).classList.contains('active') ? '1' : '0';
                        if (bits.length == 8) {
                        
                            byteData += '0x' + parseInt(bits, 2).toString(16).toUpperCase() + ', ';
                            bits = '';
                        }                                                                 
                    }    
                }
                
                if (bits.length) {                            
                     for (var x = 8 - bits.length; x > 0; x--) bits += '0';                            
                     byteData += '0x' + parseInt(bits, 2).toString(16).toUpperCase() + ' ';
                }
                
                document.getElementById('image-from-data-code').value = byteData;
                                         
          }
          
          var getCode = document.getElementsByClassName('image-code');
          for (var i = 0; i < getCode.length; i++) {
                getCode[i].onclick = getCodeEv;
          }
          
          document.getElementById('image-from-data-show').onclick = function() {
            
            var width = parseInt(document.getElementById('image-from-data-width').value);
            var height = parseInt(document.getElementById('image-from-data-height').value);
            
            if (isNaN(width)) width = 0;
            if (isNaN(height)) height = 0;
            
            if (width <= 0 || height <= 0) {
                return imageConverter.print('Ширина или высота указаны не корректно');
            }
            
            imageConverter.renderFromText(document.getElementById('image-from-data-code').value, width, height);
            
          }
                        
          imageConverter.selectFrame(0);
            
    }