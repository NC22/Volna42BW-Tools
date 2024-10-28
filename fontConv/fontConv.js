/*
   @encoding       utf-8
   @name           KellyEInkConverter
   @namespace      Kelly
   @description    Tool for convert fonts to format, compatible with KellyCanvas library font structures. Used for prepare fonts and test binary output in my ESP8266 \ ESP32 projects
   @author         Rubchuk Vladimir <torrenttvi@gmail.com> aka nradiowave
   @license        GPLv3
   @version        v 0.82 11.08.24
	
	Part of Volna 42 project  | Actual version of tool can be found here https://volna42.com/tools/fontconverter
	
	- Converts fonts (ttf, woff, woff2, ...) to tiny C++ binary structures (optimized for ESP8266 tiny storage size) 
	- "Emulates" buffer of monochrome EInk display, for test proper output, can use 1-bit \ 2-bit binary data or images as initial input 
	
	Can be used together with glyph & icon editor (https://volna42.com/tools/glypheditor), to additianaly edit \ tune autoconverted icons and characters.
	
	Listed fonts used just as example. Please check actual license of each font before use in commercial projects 
	
	Todo : 

		Функции drawPixel, drawImage, imageToCpp можно вынести отдельным классом в зависимости от битности (сейчас частичная поддержка 2-битных дисплеев с четыремя цветами вынесена в функции с постфиксом "Merged")
		скорее всего это реализовывать не нужно, здесь упор на корректное преобразование и конвертацию шрифтов, а преобразование картинок будет встроено в UI самих устройств на ESP	
		Функции добавления \ удаления глифов помимо модификации, редактирование кода-символа для существующих элементов
        Доработать glypheditor, чтобы были методы вызова и можно было использовать прямо здесь погружая блок редактирования глифа вместо прямой вставки бинарного текста
*/

function KellyEInkConverter() {
	
	var fontsUrl = "fontConv/fonts/";
    var handler = this;
    
    var defaultLetterSet = "";
    
    var screen; 
    var screenCtx;   
    
    var screenBuffer = [[], []]; // contains all current screen buffer (one for black pixels (or for all colors for merged store format), second for yellow \ red)
    var imageData = [{}, {}]; // contains settings of rendered image by function renderImageArrayToBuffer \ renderImageElToBuffer
    
    handler.rotate = 0;
    
    handler.screenBuffer = screenBuffer;
    handler.imageData = imageData;
    
    var loc;    
    
    var xbKeys = {'xBefore' : 0, 'xAfter' : 1, 'yBefore' : 2, 'aWidth' : 3, 'aHeight' : 4, 'pByte' : 5, 'pBit' : 6};
    var mergedColorBitMask = {WHITE : [1, 0], BLACK : [1, 1], ALT1 : [0, 0], ALT2 : [0, 1]};
    
    var monitors = [];
    var monitor;

    handler.colorMode;
    
    // todo - хранение буфера для 4 - цветных мониторов (2in36) - 2 бита - 1 пиксель (11 - выкл \ белый, 01 - желтый, 11 - черный, 10 - красный - НЕ точно, уточнить формат хранения ), общий буфер на оба цвета
    // todo - frontColor = .BLACK | .ALT1 | .ALT2, разные мониторы хранят буффер цветов по разному, чтобы не влиять на функцию bufferSetPixel, определяем цвет глобально, а способ помеещения в буфер будет
    // определять на низком уровне исходя из цвета + типа монитора

    handler.scale = 1;
    
    handler.fonts = [];
    handler.fontsLoaded = [];
	handler.fontDataModified = false;
	handler.fontData = false;
    
	function lloc(n) {
        return typeof loc[n] == 'undefined' ? n : loc[n];
    }   
    
    function download(txt, fname) {
        
        var mime = "application/octet-stream";
        
             if (fname.indexOf('.json') != -1) mime = "application/json";
        else if (fname.indexOf('.txt') != -1) mime = "text/plain";
        
        
        var link = document.createElement("A");
            link.style.display = 'none';
            link.onclick = function() {
            
                var url = window.URL.createObjectURL(new Blob([txt], {type: mime}));
                
                this.href = url;
                this.download = fname;
                
                setTimeout(function() { 
                    window.URL.revokeObjectURL(url);
                    link.parentElement.removeChild(link); 
                }, 4000);            
            }
            
        document.body.appendChild(link);    
        link.click();
    }

    function showFontGlyphEditor(show, charIndex) {
        
        showResultBlock(false);
        
        var editor = document.getElementById('font-editor-glyph-edit');
        
        if (show === false) {
            editor.innerHTML = "";
            return;
        }
        
        if (!handler.fontData) return;
        
        if (charIndex === false) {
            
             var xb = [];   
             var charCode = 0;
            // new add
            
        } else {
            
            var xb = handler.fontData.settings.xb[charIndex];   
            var charCode = handler.fontData.settings.map[charIndex];
            
            if (typeof handler.fontData.settings.map[charIndex] == 'undefined') {
                console.log('no symbol ' + c);
                return;
            }
        }
             
        
        console.log(xb);
        var html = '';
        for (var xbKey in xbKeys) {
            if (charIndex === false) xb[xbKeys[xbKey]] = 0;
            
            if (xbKey == 'xBefore' || xbKey == 'xAfter' || xbKey == 'yBefore' || xbKey == 'aWidth' || xbKey == 'aHeight') {
                html += '<div class="font-editor-glyph-setting"><label>' + lloc("xbKeys_" + xbKey) + '</label><input id="glyph-setting-' + xbKey + '" type="text" value="' + xb[xbKeys[xbKey]] + '"></div>';
            } else {
                html += '<div class="font-editor-glyph-setting font-editor-glyph-settingread-only"><label>' + lloc("xbKeys_" + xbKey) + '</label>' + xb[xbKeys[xbKey]] + '</div>';
            }
        }
        
        html += '<div class="font-gliph-replace-form">';        
        html += '<div class="font-editor-glyph-setting"><label>' + lloc("glypheditor_g_char_code") + '</label> <input id="font-gliph-replace-char-code" type="text" value="' + charCode + '"></div>';
        html += '<div class="font-editor-glyph-setting"><label>Буфер (<a href="iconEditor.html" target="_blank">редактор</a>)</label><textarea id="font-gliph-replace-data">';
            
        // Gliph to hex string
        
        var readBit = function(newValue) {
            glyphBits += newValue ? "1" : "0";
            if (glyphBits.length == 8) {
                resultHex += formatHex(parseInt(glyphBits, 2)) + ",";                        
                glyphBits = '';
            } 
            
            oldBitN++;                
            if (oldBitN > 7) {
                oldByteN++; oldBitN = 0;                            
            }  
        }
        
        var oldByteN = xb[xbKeys['pByte']];
        var oldBitN = xb[xbKeys['pBit']];
        var glyphBits = "";
        var resultHex = "";
        
        for (var glyphY = 1; glyphY <= xb[xbKeys['aHeight']]; glyphY++) {        
            for (var glyphX = 1; glyphX <= xb[xbKeys['aWidth']]; glyphX++) {
                readBit(getBit(handler.fontData.font[oldByteN], oldBitN));
            }
        }
        
        if (glyphBits.length) {
            for (var x = 8 - glyphBits.length; x > 0; x--) readBit(false);
        }
        
        html += resultHex;
        
        html += '</textarea></div>';
        html += '<button id="font-gliph-replace-confirm" class="action">' + (charIndex === false ? lloc('glypheditor_add') : lloc('glypheditor_replace')) + '</button>';
        
        if (charIndex !== false) {
            html += '<button id="font-gliph-delete-confirm" class="action action-delete">' + lloc('glypheditor_delete') + '</button>';
        } else {
            html += '<div class="font-editor-glyph-setting"><label>Добавить перед (код символа)</label> <input id="font-gliph-add-after-char-code" type="text" value=""></div>';
        }
        
        html += '</div>';
        editor.innerHTML = html;
        
        var updateView = function(selectIndex) {
            
            handler.showFontDrawGlyphButtons(true);
            handler.fontDataModified = true;
            if (selectIndex) document.getElementById('screen-glyphs-glyph-' + selectIndex).click();
            else showFontGlyphEditor(false);
            document.getElementById('font-generator-text').onchange();
        }
        
        if (charIndex !== false) {
            document.getElementById('font-gliph-delete-confirm').onclick = function() {
            
                handler.fontRemoveGlyph(charIndex);
                updateView(false);
                handler.print("Символ удален");
            };
        }
        
        document.getElementById('font-gliph-replace-confirm').onclick = function() {
            
            var newItemAdd = charIndex === false;
            
            var charCode = parseInt(document.getElementById('font-gliph-replace-char-code').value);
            var height = parseInt(document.getElementById('glyph-setting-aHeight').value);
            var width = parseInt(document.getElementById('glyph-setting-aWidth').value);
            
            var xBefore = parseInt(document.getElementById('glyph-setting-xBefore').value);
            var xAfter = parseInt(document.getElementById('glyph-setting-xAfter').value);
            var yBefore = parseInt(document.getElementById('glyph-setting-yBefore').value);
                        
            if (isNaN(width)) width = 0;
            if (isNaN(height)) height = 0;
            
            if (width <= 0 || height <= 0) {
                handler.print("Не корректные пропорции картинки (длинна или ширина)", true);
                return;
            }
            
            if (isNaN(charCode)) { 
                handler.print("Не корректный код символа", true);
                return;
            }
            
            if (charCode < 0) {
                handler.print("Укажите код символа", true);
                return;
            }
            
            var charExistIndex = handler.fontData.settings.map.indexOf(charCode);            
            if (charExistIndex != -1) {                
                if (newItemAdd || charExistIndex != charIndex) {
                    
                    handler.print("Код символа уже присвоен другой картинке-символу", true);
                    return;
                } 
            }
            
            if (newItemAdd) {
                
                var addAfterCharCode = parseInt(document.getElementById('font-gliph-add-after-char-code').value);
                if (isNaN(addAfterCharCode)) addAfterCharCode = -1;
                
                var newXb = [];
                for (var xbKey in xbKeys) {
                    newXb[xbKeys[xbKey]] = 0;
                }
                
                if (addAfterCharCode > -1) {
                        
                    var addAfterIndex = handler.fontData.settings.map.indexOf(addAfterCharCode);
                    if (addAfterIndex == -1) {
                            
                        handler.print("Код символа перед которым надо добавить элемент не найден", true);
                        return;
                    }

                    handler.fontData.settings.xb.splice(addAfterIndex, 0, newXb);
                    handler.fontData.settings.map.splice(addAfterIndex, 0, charCode);
                    charIndex = handler.fontData.settings.map.indexOf(charCode);
                    
                } else {
                    
                    handler.fontData.settings.xb.push(newXb);                
                    handler.fontData.settings.map.push(charCode);
                
                    charIndex = handler.fontData.settings.map.length-1;   
                }
                
            } else {
                handler.fontData.settings.map[charIndex] = charCode;
            }            
            
            var data = document.getElementById('font-gliph-replace-data').value;
                data = data.split(',');
            
            var binData = [];
            var requiredLength = Math.ceil((width * height) / 8);
            
            for (var i = 0; i < requiredLength; i++) {
            
                if (i > data.length-1) {                
                    binData.push(0);                    
                } else {                
                    var byteData = parseInt(data[i].trim());                    
                    if (isNaN(byteData)) byteData = 0;
                    if (byteData > 255) byteData = 255;     
                    
                    binData[i] = byteData;
                }
            }        
            
            // console.log(data);
            // console.log(binData);
            // console.log(requiredLength);
            
            handler.fontUpdateGlyph(charIndex, width, height, binData, xBefore, xAfter, yBefore);
            updateView(charIndex);
            handler.print("Шрифт обновлен. Измените тестовый текст для проверки");
        };
    }
    
    function showResultBlock(result, fname) {

        var textBlock = document.getElementById('screen-output-result-data');  
        if (!textBlock) return;
        
        var downloadEl = document.getElementById('screen-output-result-download');
        if (downloadEl) {
            if (fname) {
                downloadEl.style.display = '';
                downloadEl.onclick = function() {
                    download(result, fname);
                }
            } else {
                downloadEl.style.display = 'none';
            }
        }
        
        if (result) {
            textBlock.classList.add('show');
            textBlock.value = result;
        } else textBlock.classList.remove('show');
        
        updateCppButtons();
    }
    
    handler.setMonitors = function(list) { monitors = list;  monitor = list[0]; }
    handler.setLocale = function(locData) { loc = locData; if (locData['default_letters']) defaultLetterSet = locData['default_letters']; }
	
    function pushBitFontUpdater(cursorScroller, newValue) {
        
        cursorScroller.glyphBits += newValue ? "1" : "0";
        if (cursorScroller.glyphBits.length == 8) {
                        
            var glyphByte = parseInt(cursorScroller.glyphBits, 2);
            cursorScroller.newBin.push(glyphByte);                            
            cursorScroller.glyphBits = '';
        }  
    
        cursorScroller.newBitN++; cursorScroller.oldBitN++;
        
        if (cursorScroller.oldBitN > 7) {
            cursorScroller.oldByteN++;
            cursorScroller.oldBitN = 0;                            
        }  
        
        if (cursorScroller.newBitN > 7) {
            cursorScroller.newByteN++;
            cursorScroller.newBitN = 0;                            
        }
    };
    
    // used only in JS version, for output charlist, all charcodes placed in handler.fontData.settings.map
    
    function updateFontTextMap() {        
        var textMap = "";        
        for (var i = 0; i < handler.fontData.settings.map.length; i++) {
            textMap += String.fromCharCode(handler.fontData.settings.map[i]);
        }
        
        handler.fontData.settings.textMap = textMap;
    }
    
    handler.fontRemoveGlyph = function(removeCharIndex) {
        
        var cursorScroller = {
            
            // double cursor scroller for old buffer position and new
            newByteN : 0,
            newBitN : 0,

            oldByteN : -1, // reseted every next glyph in .map
            oldBitN : -1,  // reseted every next glyph in .map
            
            // filled array
            glyphBits : '',            
            newBin : [],
        };
        
        for (var i = 0; i < handler.fontData.settings.map.length; i++) {
            
            if (i == removeCharIndex) continue;
            
            var xb = handler.fontData.settings.xb[i];
            
            cursorScroller.oldByteN = xb[xbKeys['pByte']];
            cursorScroller.oldBitN = xb[xbKeys['pBit']];
            
            xb[xbKeys['pByte']] = cursorScroller.newByteN;
            xb[xbKeys['pBit']] = cursorScroller.newBitN;
            
            var width = xb[xbKeys['aWidth']];
            var height = xb[xbKeys['aHeight']];
            
            for (var glyphY = 1; glyphY <= height; glyphY++) {        
                for (var glyphX = 1; glyphX <= width; glyphX++) {                    
                    pushBitFontUpdater(cursorScroller, getBit(handler.fontData.font[cursorScroller.oldByteN], cursorScroller.oldBitN));                    
                }
            }
        }
        
        if (cursorScroller.glyphBits.length) {
            for (var x = 8 - cursorScroller.glyphBits.length; x > 0; x--) pushBitFontUpdater(cursorScroller, false);
        }
        
        handler.fontData.font = cursorScroller.newBin;
        handler.fontData.settings.map.splice(removeCharIndex, 1);
        handler.fontData.settings.xb.splice(removeCharIndex, 1);
        updateFontTextMap();
        
        return true;
    }
    
    /*
        update glyph item in current font, handler.fontData - must be created \ loaded before execute
        
        newWidth - binary array width
        newHeight - binary array height
        newData - glyph icon binary array 
    */
    handler.fontUpdateGlyph = function(updCharIndex, newWidth, newHeight, newData, xBefore, xAfter, yBefore) {
        
     
        if (newWidth <= 0 || newHeight <= 0) return false;
        if (!newData || newData.length <= 0) newData = []; 
        
        var cursorScroller = {
            
            // double cursor scroller for old buffer position and new
            newByteN : 0,
            newBitN : 0,

            oldByteN : -1, // reseted every next glyph in .map
            oldBitN : -1,  // reseted every next glyph in .map
            
            // filled array
            glyphBits : '',            
            newBin : [],
        };
        
        for (var i = 0; i < handler.fontData.settings.map.length; i++) {
            
            var xb = handler.fontData.settings.xb[i];
            
            cursorScroller.oldByteN = i != updCharIndex ? xb[xbKeys['pByte']] : 0;
            cursorScroller.oldBitN = i != updCharIndex ? xb[xbKeys['pBit']] : 0;
            
                xb[xbKeys['pByte']] = cursorScroller.newByteN;
                xb[xbKeys['pBit']] = cursorScroller.newBitN;
                
            var width = i != updCharIndex ? xb[xbKeys['aWidth']] : newWidth;
            var height = i != updCharIndex ? xb[xbKeys['aHeight']] : newHeight;
            
            if (i == updCharIndex) {
                xb[xbKeys['aWidth']] = newWidth;
                xb[xbKeys['aHeight']] = newHeight;
                xb[xbKeys['xBefore']] = xBefore;
                xb[xbKeys['xAfter']] = xAfter;
                xb[xbKeys['yBefore']] = yBefore;
            }
            for (var glyphY = 1; glyphY <= height; glyphY++) {
        
                for (var glyphX = 1; glyphX <= width; glyphX++) {
                    if (i == updCharIndex) {
                        if (newData.length-1 < cursorScroller.oldByteN) pushBitFontUpdater(cursorScroller, false);
                        else pushBitFontUpdater(cursorScroller, getBit(newData[cursorScroller.oldByteN], cursorScroller.oldBitN));
                    } else {
                        pushBitFontUpdater(cursorScroller, getBit(handler.fontData.font[cursorScroller.oldByteN], cursorScroller.oldBitN));
                    }
                    
                }
            }
        }
        
        if (cursorScroller.glyphBits.length) {
            for (var x = 8 - cursorScroller.glyphBits.length; x > 0; x--) pushBitFontUpdater(cursorScroller, false);
        }
        
        handler.fontData.font = cursorScroller.newBin;
        updateFontTextMap();
        
        return true;
    }
    
    // tools 
    
    function hexToRgb(hex) {
    
        if (typeof hex == 'string') {
            var dec = parseInt(hex.charAt(0) == '#' ? hex.slice(1) : hex, 16);
            return {r: dec >> 16, g: dec >> 8 & 255, b: dec & 255};
        } else {
            return hex;
        }
        
    } 
         
    function formatHex(c) {
    
        var h = c.toString(16);
        if (h.length < 2) {
            h = '0' + h;
        }
        
        h = '0x' + h.toUpperCase();
        return h;
    }
    
    function getBit(byte, position) {
    
        return (byte >> (7 - position)) & 0x1;
    }
    
    function setBit(number, position, state){
        
        position = (7 - position);
        
        if (!state) {
            var mask = ~(1 << position);
            return number & mask;
        } else {
            return number | (1 << position) ;
        }
        
    }
    
    function validateFloatString(val) {

        if (typeof val == 'number') return val;
        if (!val) return 0.0;
        
        val = val.trim();
        val = val.replace(',', '.');
        val = parseFloat(val);
        
        if (!val) return 0.0;
        
        return val;    
    }
    
    // tools-end
   
    function updateCppButtons() {
        
        
        document.getElementById('font-glyph-editor-display').style.display = document.getElementById('screen-output-result-data').classList.contains('show') && handler.fontData ? '' : 'none';
        document.getElementById('font-to-cpp').style.display = handler.fontData ? '' : 'none';
        document.getElementById('font-to-js').style.display = handler.fontData ? '' : 'none';
        document.getElementById('screen-to-cpp').style.display = screen.width > 1 ? '' : 'none';
        
        console.log(imageData);
        if ((imageData[1] && imageData[1].settings && imageData[1].settings.w > 0) || (imageData[0] && imageData[0].settings && imageData[0].settings.w > 0)) {
        
            document.getElementById('image-to-cpp').style.display = '';
            document.getElementById('image-to-bin').style.display = '';
        } else {
        
            document.getElementById('image-to-bin').style.display = 'none';
            document.getElementById('image-to-cpp').style.display = 'none';
        }    
        
    }
    
    function loadFonts(onReady) {
  
        var loaded = 0; var total = 0;
        var addFRequest = function(i, fitem, onLoad) {
            
            if (fitem[5] !== true && (window.location.host.indexOf('42volna') != -1 || window.location.host.indexOf('volna42') != -1)) return;
            
            total++;
            
            const oxygenFontFace = new FontFace(
              fitem[1],
              "url(" + fontsUrl + fitem[2] + ")",
            );
            
            document.fonts.add(oxygenFontFace);
            document.fonts.load(fitem[0]).then(
              function(fonts){
                loaded++;
                onLoad(i, fitem, true);
              },
              function(err){
                console.error(err);
                loaded++;
                onLoad(i, fitem, false);
              },
            );
            
        }
        
        var onFLoad = function(i, fitem, result) {
                 
            if (result) handler.fontsLoaded.push(i);
            
            console.log('[' + loaded + '/' + total + '] ID : ' + i + ' | font ' + fitem[2] + ' --- READY [' + (result ? 'OK' : 'FAIL') + ']');
            if (loaded >= total) {
                onReady(); 
            }
        }
        
        for (var i = 0; i < handler.fonts.length; i++) {
           if (handler.fontsLoaded.indexOf(i) == -1) addFRequest(i, handler.fonts[i], onFLoad);
        }
        
        if (!total) onReady();
    }
    
    function updateCustomMonitorCfg(nW, nH) {
        
        var cHel = document.getElementById('monitor-type-custom-height');
        var cWel = document.getElementById('monitor-type-custom-width');
        if (!cHel || !cWel) return;
		
        if (typeof nW != 'undefined' && typeof nH != 'undefined') {
            cWel.value = nW;
            cHel.value = nH;
        }
        
        var customH = parseInt(cHel.value);
        var customW = parseInt(cWel.value);
        
        if (isNaN(customW)) {
            cWel.value = "168";
            customW = 168;
        }
        
        if (isNaN(customH)) {
            cHel.value = "168";
            customH = 168;
        }
        
        
        for (var i = 0; i < monitors.length; i++) {
            if (monitors[i].key == 'custom') {
                
                monitors[i].width = customW;
                monitors[i].height = customH;
                monitors[i].fitToImage = false;
                
                if (document.getElementsByClassName('monitor-type-custom-auto').checked) {
                    monitors[i].fitToImage = true;
                }
                
                return;
            }
        }
    }
    
    function initMonitorSelect() {
        
        var html = '';

        for (var i = 0; i < monitors.length; i++) {
            var title = monitors[i].key + ' [' + monitors[i].width + 'x' + monitors[i].height + ']';
            if (monitors[i].key == 'custom') {
                title = 'Свои настройки';                
            }
            
            html += '<option value="' + i + '" ' + (i == 0 ? 'selected' : '') + '>' + title + '</option>';
        }
        
        html += '</select>';
        
        updateCustomMonitorCfg();
        document.getElementsByClassName('monitor-type-custom-height').onchange = updateCustomMonitorCfg;
        document.getElementsByClassName('monitor-type-custom-width').onchange = updateCustomMonitorCfg;
        
        var mselector = document.getElementsByClassName('monitor-type-widget');
		if (mselector.length > 0) {
			mselector[0].innerHTML = 'Тип экрана : <select class="monitor-type" id="' + mselector[0].getAttribute('data-id') + '">' + html;
			
			document.getElementById(mselector[0].getAttribute('data-id')).onchange = function() {
				monitor = monitors[this.value];
			}
		}
    }
    
    function getConversionSettings(id) {
        return {
            mode : document.querySelector('input[name=' + id + '-dithering]:checked').value, 
            threshhold : validateFloatString(document.getElementById(id + '-value').value),
            bgType : document.getElementById(id + '-invert-color').checked ? 'black' : 'white', 
            fit : document.getElementById('image-common-fit-mode').value,
       };
    }
    
    function initConversionSettings() {
                
        var mselectors = document.getElementsByClassName('conversion-settings');        
        for (var i = 0; i < mselectors.length; i++) {
            
            var id = mselectors[i].getAttribute('data-id');
            var html = '<p><label><input type="radio" id="' + id + '-threshhold" name="' + id + '-dithering" value="threshhold" checked/> Пороговое значение <input type="text" id="' + id + '-value" value="0.5">';
                html +='</label></p>';
                html += '<p><label><input type="radio" id="' + id + '-atkinson" name="' + id + '-dithering" value="atkinson" /> Алгоритм Аткинсона (дизеринг)</label></p>';
                html += '<p><label><input type="checkbox" id="' + id + '-invert-color"> Инвертировать цвет</label></p>';

            mselectors[i].innerHTML = html;
        }
    }
      
    function textToByteData(data, requiredLength) {

        data = data.trim().replace(/(\r\n\t|\n|\r\t)/gm," ");
        data = data.replace(new RegExp(',', 'g'), ' ');                    
        data = data.replace(/\s+/g, ' ');              
        data = data.split(' ');
        
        if (!requiredLength) requiredLength = data.length;
        
        var imageData = [];
        for (var i = 0; i < requiredLength; i++) {
        
            if (i > data.length-1) {
            
                imageData.push(0);
                
            } else {
            
                imageData[i] = data[i].trim();
                var byteData = parseInt(data[i]);
                
                if (isNaN(byteData)) byteData = 0;
                if (byteData > 255) byteData = 255; // max 0xFF
                
                imageData[i] = byteData;
            }
        }
        
        return imageData;
    }
    
    /* not implemented for merged mode, and not planned, all 2-bit edits will be nativly supported in Volna web-panel */
    
    function resetImageBuffer(sX, sY, fw, fh) {
        
        var bufferN = handler.colorMode == monitor.colors.ALT1 ? 1 : 0;         
        imageData[bufferN] = {settings : {sX : sX ? sX : 0, sY : sY ? sY : 0, w : 0, h : 0, fullW : fw ? fw : 0, fullH : fh ? fh : 0}};
    }
    
    function updateImageBuffer(x, y, frontColor) {
    
        var bufferN = handler.colorMode == monitor.colors.ALT1 ? 1 : 0; 
        var w = x+1;
        var h = y+1;
        
        if (frontColor && imageData[bufferN].settings.w < w) imageData[bufferN].settings.w = w;
        if (frontColor && imageData[bufferN].settings.h < h) imageData[bufferN].settings.h = h;
    }
    
    function renderImageElToBuffer(imageEl, settings) {

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');  

        if (settings.fit == 'fitImage') {
        
            fitToScreen(canvas, imageEl);
            
        } else {
            
            if (settings.fit == 'fitScreen') {
                updateCustomMonitorCfg(imageEl.width, imageEl.height);
                screenInit(imageEl.width, imageEl.height);                
            }
            
            canvas.width = imageEl.width;                
            canvas.height = imageEl.height;
            ctx.drawImage(imageEl, 0, 0);
            
        }
        
        var pixelsImgEl = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = screenCtx.getImageData(0, 0, screen.width, screen.height);
        
        resetImageBuffer(0, 0, canvas.width, canvas.height);
        console.log(settings);
        
        if (settings.mode == 'atkinson') {
        
            settings.threshhold = 0.5;
            
            greyscaleLuminance(pixelsImgEl);
            ditherAtkinson(pixelsImgEl, canvas.width);                    
        }
        
        for(var y = 1; y <= canvas.height; y++) {
            
            for(var x = 1; x <= canvas.width; x++) {
                 
                //if (x >= screen.width || y >= screen.height) continue;
                
                var bitShow = true;
                var i = getCanvasCursor(x, y, canvas);

                if (pixelsImgEl.data[i + 3] <= 128) { // alpha opacity
                   // console.log(pixelsImgEl.data[i + 3]);
                   
                    if (settings.bgType == 'white') {
                        bitShow = false;
                    }
                    
                } else {
                    
                    var hsv = rgbToHsv(pixelsImgEl.data[i + 0], pixelsImgEl.data[i + 1], pixelsImgEl.data[i + 2]);
                   
                    if (settings.bgType == 'black' && hsv.v < settings.threshhold) {
                        bitShow = false;
                    }
                    
                    if (settings.bgType == 'white' && hsv.v > settings.threshhold) {
                        bitShow = false;
                    }
               }

               if (bitShow) bufferSetPixel(x-1, y-1, bitShow);
               updateImageBuffer(x-1, y-1, bitShow);
            }    
        }        
    }
    
    function getMergedColor(bits) {
        var colorName = false;
        
        var colors = ['WHITE', 'ALT1', 'ALT2', 'BLACK'];
        for (var i = 0; i < colors.length; i++ ) {
            if (mergedColorBitMask[colors[i]][0] == bits[0] && mergedColorBitMask[colors[i]][1] == bits[1]) return colors[i];
        }
        
        return colorName;
    }
    
    function renderImageArrayToBufferMerged(imageData, sX, sY, w, h) {
        
        var rotate = 90;
        var bit = 0, bitCursor = 0;
        for(var y = 0; y < h; y++) {
                    
            for(var x = 0; x < w; x++) {
            
                var resultX = sX + x;
                var resultY = sY + y;
                
                if (rotate == 90) { // в примере Display_part при отрисовке частичный буфер переворачивается на 90 градусов без спец преобразований, хотя при обычной отрисовке не повернут, мало тестов
                    var tmpY = resultY;
                    resultY = resultX + 1;
                    resultX = (tmpY * -1);
                }
                
                var colorName = getMergedColor([!getBit(imageData[bit], bitCursor), !getBit(imageData[bit], bitCursor+1)]);
                if (colorName == 'WHITE') bufferSetPixel(resultX, resultY, false);
                else {
                    handler.colorMode = monitor.colors[colorName];
                    bufferSetPixel(resultX, resultY, true);
                }       
                
                bitCursor += 2;
                if (bitCursor > 7) {                    
                    bit++;
                    bitCursor = 0;                        
                }
            }    
        }
        
    }
	
	function initCopyright() {

		var block = document.createElement('div');
			block.innerHTML = '<a href="https://nradiowave.ru/dev/" target="_blank">nradiowave</a>&nbsp(проект - <a href="https://volna42.com/?kellyc=1" target="_blank">Волна 42</a>)&nbsp&nbsp©&nbsp&nbsp' + new Date().getFullYear();
			block.classList.add('copyright');
			document.body.appendChild(block);
	}
    
    function renderImageArrayToBufferCpp(imageData, sX, sY, w, h) {
        
        resetImageBuffer(0, 0, w, h);
        if (monitor.bufferType == 'merged') {
            return renderImageArrayToBufferMerged(imageData, sX, sY, w, h);
        }
        
        var bit = 0, bitCursor = 0;
        for(var y = 0; y < h; y++) {
                    
            for(var x = 0; x < w; x++) {

                var rx = sX + x;
                var ry = sY + y;
                var draw = getBit(imageData[bit], bitCursor) ? false : true;

                if (draw) {
                    bufferSetPixel(rx, ry, true);               
                    updateImageBuffer(x, y, true);
                }
                
                bitCursor++;                
                if (bitCursor > 7) {                    
                    bit++;
                    bitCursor = 0;                        
                }
            }    
        }
        
    }
    
    function renderImageArrayToBuffer(imageData, sX, sY, w, h, flipByX, flipByY, frontColor, invert, fromX, toX, fromY, toY, circle) {
        
        resetImageBuffer(0, 0, w, h);
        if (typeof frontColor == 'undefined') frontColor = true;
        
        if (monitor.bufferType == 'merged') {
            return renderImageArrayToBufferMerged(imageData, sX, sY, w, h);
        }
        
        var bit = 0, bitCursor = 0;
        for(var y = 0; y < h; y++) {
                    
            for(var x = 0; x < w; x++) {
                
                     if (fromY && y < fromY || toY && y > toY) {
                        
                       
                     
                     }
                else if (fromX && x < fromX || toX && x > toX) {} 
                else {
                    
                    var rx = sX + x;
                    var ry = sY + y;
                    if (flipByX) {
                        rx = sX + (w - x);
                    } 
                    if (flipByY) {
                        ry = sY + (h - y);
                    } 
                        
                    
                    
                    var draw = getBit(imageData[bit], bitCursor) ? false : true;
                    if (invert) draw = !draw;
                    
                    if (draw) {
                    
                        var r = w/2;
                        if((circle && ((x-r)*(x-r)+(y-r)*(y-r) < r*r + r)) || !circle) {
                            bufferSetPixel(rx, ry, frontColor ? true : false);               
                            updateImageBuffer(x, y, frontColor ? true : false);
                        } 
                       
                    }
                }
                
                bitCursor++;                
                if (bitCursor > 7) {                    
                    bit++;
                    bitCursor = 0;                        
                }
            }    
        }
        
    }
        
    handler.renderImageArrayToBuffer = function(imageData, sX, sY, w, h, flipByX, flipByY, frontColor, invert, fromX, toX, fromY, toY, circle) {
        renderImageArrayToBuffer(imageData, sX, sY, w, h, flipByX, flipByY, frontColor, invert, fromX, toX, fromY, toY, circle);
    }
    
    handler.setMonitor = function(n) {
        monitor = monitors[n];
        return monitor;
    }
    
    function bufferFillRect(sX, sY, w, h, colorFront) {
                
        for(var y = 0; y < h; y++) {                    
            for(var x = 0; x < w; x++) {               
                bufferSetPixel(x + sX, y + sY, colorFront);
            }    
        }
    }
    
    handler.bufferFillRect = function(sX, sY, w, h, colorFront) {
        bufferFillRect(sX, sY, w, h, colorFront);
    }
     
     function bufferDrawCircle(sX, sY, radius, color) {
        for(var y=-radius; y<=radius; y++)
        for(var x=-radius; x<=radius; x++)
            // if(x*x+y*y > radius*radius - radius && x*x+y*y < radius*radius + radius)
            if(x*x+y*y < radius*radius + radius)
                bufferSetPixel(sX+x, sY+y, color);
     }
     
     function bufferDrawCircle1(x, y, r, color){
        
        var a = r; var b = r;
        var wx, wy;
        var thresh;
        var asq = a * a;
        var bsq = b * b;
        var xa, ya;
        bufferSetPixel(x, y+b, color);
        bufferSetPixel(x, y-b, color);
        wx = 0;
        wy = b;
        xa = 0;
        ya = asq * 2 * b;
        thresh = asq / 4 - asq * b;
        for (;;) {
            thresh += xa + bsq;
            if (thresh >= 0) {
                ya -= asq * 2;
                thresh -= ya;
                wy--;
            }
            xa += bsq * 2;
            wx++;
            if (xa >= ya)
              break;
            bufferSetPixel(x+wx, y-wy, color);
            bufferSetPixel(x-wx, y-wy, color);
            bufferSetPixel(x+wx, y+wy, color);
            bufferSetPixel(x-wx, y+wy, color);
        }
        bufferSetPixel(x+a, y, color);
        bufferSetPixel(x-a, y, color);
        wx = a;
        wy = 0;
        xa = bsq * 2 * a;
        ya = 0;
        thresh = bsq / 4 - bsq * a;
        for (;;) {
            thresh += ya + asq;
            if (thresh >= 0) {
                xa -= bsq * 2;
                thresh = thresh - xa;
                wx--;
            }
            ya += asq * 2;
            wy++;
            if (ya > xa)
              break;
            bufferSetPixel(x+wx, y-wy, color);
            bufferSetPixel(x-wx, y-wy, color);
            bufferSetPixel(x+wx, y+wy, color);
            bufferSetPixel(x-wx, y+wy, color);
        }
    }
    
    function bufferSetPixelMerged(x, y, frontColor) {
        
        if (x >= screen.width || y >= screen.height) return;
        
        var bpos = bufferGetCursor(x, y);
        var byteV = screenBuffer[0][bpos.byteN];
        
        var bitMask = mergedColorBitMask['WHITE'];
        if (frontColor) {        
            bitMask = mergedColorBitMask['BLACK'];
            
            if (handler.colorMode == monitor.colors.ALT2) {
                bitMask = mergedColorBitMask['ALT2'];
            } else if (handler.colorMode == monitor.colors.ALT1) {
                bitMask = mergedColorBitMask['ALT1'];
            }  
        }
        
        byteV = setBit(byteV, bpos.bitN, bitMask[0]);
        byteV = setBit(byteV, bpos.bitN+1, bitMask[1]); 
        screenBuffer[0][bpos.byteN] = byteV;
    }
    
    function bufferSetPixel(x, y, frontColor) {
        
        if (monitor.bufferType == 'merged') return bufferSetPixelMerged(x, y, frontColor);
        
        var tmp = 0;
        if (handler.rotate == 90) {
            tmp = x;
            x = screen.width - y;
            y = tmp;
        } else if (handler.rotate == 180) {
            x = screen.width - x;
            y = screen.height - y;
        } else if (handler.rotate == 270) {
            tmp = y;
            y = screen.height - x;
            x = tmp;
        }
        
        if (x >= screen.width || y >= screen.height) return;
        
        var bpos = bufferGetCursor(x, y);        
        bufferN = handler.colorMode == monitor.colors.ALT1 ? 1 : 0; 
        
        screenBuffer[bufferN][bpos.byteN] = setBit(screenBuffer[bufferN][bpos.byteN], bpos.bitN, frontColor ? 0 : 1);
        if (!frontColor) {
            screenBuffer[bufferN == 1 ? 0 : 1][bpos.byteN] = setBit(screenBuffer[bufferN == 1 ? 0 : 1][bpos.byteN], bpos.bitN, 1);
        }
    }
    
    function bufferGetCursor(x, y) {
        
        var bitPerPixel = monitor.bitPerPixel ? monitor.bitPerPixel : 1;
        
        var bitPos = ((y) * screen.width) + x;  
            bitPos = bitPerPixel * bitPos;
            
        if (bitPos % 8) {
            
            var rt = {byteN : Math.floor(bitPos / 8)};
                rt.bitN = bitPos - (rt.byteN * 8);
                
            return rt;
            
        } else return {byteN : bitPos / 8, bitN : 0};
    }
    
    function screenInit(width, height) {
        
        handler.rotate = 0;
        imageData[0] = {}; imageData[1] = {};
        if (!width) {
            width = monitor.width;
            height = monitor.height;
        }
        
        screen.width = width;
        screen.height = height;

        screenCtx.rect(0, 0, width, height);
        screenCtx.fillStyle = monitor.colors.WHITE;
        screenCtx.fill();
        
        console.log(monitor.bufferType);
        if (monitor.bufferType == 'separate') {
        
            handler.colorMode = monitor.colors.ALT1; 
            bufferFillRect(0, 0, width, height, false);
            
            handler.colorMode = monitor.colors.BLACK;        
            bufferFillRect(0, 0, width, height, false);
            
        } else {
            
            handler.colorMode = monitor.colors.BLACK;        
            bufferFillRect(0, 0, width, height, false);
        }
        
        return screen;
    }
    
    function screenUpdate() {
        
        handler.colorMode = monitor.colors.BLACK;
        if (monitor.bufferType == 'separate') {
        
            screenDrawBuffer(0);
            screenDrawBuffer(1);
            
        } else {
            
            screenDrawBufferMerged();
        }
        
        updateCppButtons();
    }
    
    handler.screenUpdate = function() {
        screenUpdate();
    } 
    
    handler.screenInit = function() {
        return screenInit();
    } 
    
    function screenDrawBufferMerged() {
        
        var pixelData = screenCtx.getImageData(0, 0, screen.width, screen.height);
        
        for (var bufferY = 0; bufferY < screen.height; bufferY++) {
              
              for (var bufferX = 0; bufferX < screen.width; bufferX++) {
                          
                    var bpos = bufferGetCursor(bufferX, bufferY);
                    var colorName = getMergedColor([getBit(screenBuffer[0][bpos.byteN], bpos.bitN), getBit(screenBuffer[0][bpos.byteN], bpos.bitN+1)]);
                             
                    if (colorName != 'WHITE') {
                        var rgbCF = hexToRgb(monitor.colors[colorName]);
                        var g = getCanvasCursor(bufferX, bufferY, screen);
                        
                        pixelData.data[g + 0] = rgbCF.r;
                        pixelData.data[g + 1] = rgbCF.g;
                        pixelData.data[g + 2] = rgbCF.b;                             
                    }                
              }
              
        }
        
        screenCtx.clearRect(0, 0, screen.width, screen.height);
        screenCtx.putImageData(pixelData, 0, 0 );      
    }
    
    function screenDrawBuffer(n) {
    
        var bitCursor = 0, byteN = 0;   
        var rgbCF = hexToRgb(n ? monitor.colors.ALT1 : monitor.colors.BLACK);
        var pixelData = screenCtx.getImageData(0, 0, screen.width, screen.height);
        
        for (var bufferY = 0; bufferY < screen.height; bufferY++) {
              
              for (var bufferX = 0; bufferX < screen.width; bufferX++) {
                    
                    var pixel = !getBit(screenBuffer[n][byteN], bitCursor) ? true : false;                    
                    if (pixel) {
                    
                        var g = getCanvasCursor(bufferX+1, bufferY+1, screen);
                        
                        pixelData.data[g + 0] = rgbCF.r;
                        pixelData.data[g + 1] = rgbCF.g;
                        pixelData.data[g + 2] = rgbCF.b;                             
                    }
                    
                    bitCursor++;
                    
                    if (bitCursor > 7) {
                        byteN++;
                        bitCursor = 0;                            
                    }                   
              }
              
        }
        
        screenCtx.clearRect(0, 0, screen.width, screen.height);
        screenCtx.putImageData( pixelData, 0, 0 );      
    }
    
    function getCanvasCursor(x, y, contextScreen) {
        return (((y - 1) * (contextScreen ? contextScreen.width : screen.width)) + x - 1) * 4;
    }
      
    function rgbToHsv(r, g, b) {
        
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
        
    handler.print = function(notice, error) {
		
		var result = document.getElementById('result'); 
		if (!result) {		
			console.log(notice);
			document.getElementById('notice').innerText = notice;
			return;
		}
		
		if (!handler.noticeInit) {
			handler.noticeInit = true;
			
			document.addEventListener('click', function (e) {
				 if (result.classList.contains('show')) {
					 
					var noticeParent = e.target; 
					while (noticeParent && !noticeParent.classList.contains('notice')) {
						noticeParent = noticeParent.parentElement;
					}
    
					if (e.target.id == 'result-close' || !noticeParent) handler.print(false);
				 }
			});
		}
			   
		if (notice) {
			
			if (result.classList.contains('show')) {
				
				handler.print(false);
				setTimeout(function() { handler.print(notice, error); }, 500);
				return;
			}
			
			result.children[1].innerHTML = notice;
			setTimeout(function() { result.style.bottom = '12px'; result.classList.add('show'); }, 100);      
			
			error ? result.classList.add('error') : result.classList.remove('error'); 
			
		} else {
			
			result.style.bottom = "-" + result.getBoundingClientRect().height + "px";
			result.classList.remove('show');
		}
    }
    
    // algo taken from - https://github.com/ticky project - https://github.com/ticky/canvas-dither
    
    function greyscaleLuminance(image) {

        for (var i = 0; i <= image.data.length; i += 4) {

            image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt(image.data[i] * 0.21 + image.data[i + 1] * 0.71 + image.data[i + 2] * 0.07, 10);

        }

        return image;
    }

    function ditherAtkinson(image, imageWidth, drawColour) {
    
        skipPixels = 4;
        if (!drawColour)
            drawColour = false;

        if(drawColour == true)
            skipPixels = 1;

        imageLength    = image.data.length;

        for (currentPixel = 0; currentPixel <= imageLength; currentPixel += skipPixels) {

            if (image.data[currentPixel] <= 128) {
                newPixelColour = 0;
            } else {
                newPixelColour = 255;
            }

            err = parseInt((image.data[currentPixel] - newPixelColour) / 8, 10);
            image.data[currentPixel] = newPixelColour;

            image.data[currentPixel + 4]                        += err;
            image.data[currentPixel + 8]                        += err;
            image.data[currentPixel + (4 * imageWidth) - 4]        += err;
            image.data[currentPixel + (4 * imageWidth)]            += err;
            image.data[currentPixel + (4 * imageWidth) + 4]        += err;
            image.data[currentPixel + (8 * imageWidth)]            += err;

            if (drawColour == false)
                image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

        }

        return image.data;
    }
        
    function fitToScreen(canvas, image, resizeBy) {
        
        var ctx = canvas.getContext('2d'); 
        var auto = false;
        
        if (!resizeBy) {
            
            auto = true;
            
                 if (image.width >= screen.width) resizeBy = 'width';
            else if (image.height >= screen.height) resizeBy = 'height';
            
        } else if (resizeBy == 'width' && image.width <= screen.width) {
            resizeBy = false;
        } else if (resizeBy == 'height' && image.height <= screen.height) {
            resizeBy = false;
        }
        
        var fit = function(dt, by) {
        
            if (by == 'width') {                
                var dW = screen.width;
                var k = dt.width / screen.width;
                var dH = Math.ceil(dt.height / k);                
            } else if (by == 'height') {            
                var dH = screen.height;
                var k = dt.height / screen.height;
                var dW = Math.ceil(dt.width / k);                
            }
            
            return {width : dW, height : dH};
        }
        
        if (resizeBy == 'width') {    
            
            var fitData = fit(image, 'width');
            if (fitData.height > screen.height) fitData = fit(fitData, 'height');
            
        } else if (resizeBy == 'height') {
        
            var fitData = fit(image, 'height');
            if (fitData.width > screen.width) fitData = fit(fitData, 'width');
            
        } else {
        
            canvas.width = image.width;                
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            
            return;
        }
        
        canvas.width = fitData.width;                
        canvas.height = fitData.height;
        
        ctx.drawImage(image, 0, 0, fitData.width, fitData.height);
    }
        
    /* FONT COVERTOR TESTS */
    
    handler.fitGlyph = function(size, font, c, ctx, canvas, initOffsets) {
                        
        var offsetX = initOffsets[c] ? initOffsets[c][0] : 0;
        var offsetY = initOffsets[c] ? initOffsets[c][1] : 0;
        var limit = 100;
        var outOfBounds = false;        
        var lastOutOfBounds = false;
        var fixedBy = {x : false, y : false}; // marker by which axis we moved character
        
        var drawC = function() {
        
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.fill();

            ctx.fillStyle = '#000';            
            ctx.font = size + 'px ' + font;            
            ctx.fillText(c, 0 + offsetX, canvas.height + offsetY);
        }
        
        // Checks is character out of canvas, by go through perimetr and trigger when some pixels setted on borders - this will counts as out of bounds
        // return first found axis (x or y) or false if simbol is fitted is ok 
        
        var checkBounds = function() {
        
            var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

            for(var y = 1; y <= canvas.height; y++) {                     
                var g = getCanvasCursor(canvas.width, y, canvas);
                // console.log(g + ' || ' + canvas.width + ' | ' + y  + ' || ' + pixels.data[g + 1] + ' || ' + pixels.data[g + 2] + ' || ' );
                
                if (pixels.data[g + 0] != 255 || pixels.data[g + 1] != 255 || pixels.data[g + 2] != 255) { 
                    return 'x';
                }    
            }
               
            for(var x = 1; x <= canvas.width; x++) {                                  
                var g = getCanvasCursor(x, canvas.height, canvas);
                // console.log(x + ' | ' + canvas.height);
                
                if (pixels.data[g + 0] != 255 || pixels.data[g + 1] != 255 || pixels.data[g + 2] != 255) { 
                    return 'y';
                }      
            }
            
            return false;            
        }
        
        // move character back to border if passed
        var correctLast = function() {
            if (fixedBy.x) {
                offsetX++;
            }
            
            if (fixedBy.y) {
                offsetY++;
            }
        }
        
        drawC();        
        while ((outOfBounds = checkBounds()) && outOfBounds !== false && limit > 0) {
            
            if (lastOutOfBounds !== false && lastOutOfBounds != outOfBounds) {
                fixedBy[lastOutOfBounds] = true; 
            }
            
            lastOutOfBounds = outOfBounds;
            if (outOfBounds == 'x') {
                offsetX--;
            } else {
                offsetY--;
            }
            
            drawC();
            limit--;
            // console.log(offsetX + ' | ' + offsetY + ' | ' + limit + ' | ' + outOfBounds + ' | ' + c);
        }
        
        if (lastOutOfBounds) fixedBy[lastOutOfBounds] = true; 
        if (fixedBy.x || fixedBy.y) {
            correctLast();
            drawC();
        }
        
        return {offsetX : offsetX, offsetY : offsetY};
    }
    
    handler.drawGlyph = function(screenX, screenY, fontData, c, frontColor) {
        
        var font = fontData.font;
        var fontSettings = fontData.settings;
        var charIndex = fontSettings.map.indexOf(c.charCodeAt(0));
        if (charIndex == -1) {
            console.log('no symbol ' + c);
            return false;
        }
        
        var xb = fontSettings.xb[charIndex];
        var byteN = xb[xbKeys['pByte']];
        var bitCursor = xb[xbKeys['pBit']];
        
        var scaleY = 1;
     
        // packed :
        screenY += (fontSettings.h - xb[xbKeys['aHeight']]) * handler.scale;
        screenY += xb[xbKeys['yBefore']]  * handler.scale;
        
        // raw variant :
        
        // if (typeof fontSettings.xb[charIndex][2] != 'undefined') y -= fontSettings.xb[charIndex][2];        
        // for (var glyphY = 1; glyphY <= fontSettings.h; glyphY++) {
   
        for (var glyphY = 1; glyphY <= xb[xbKeys['aHeight']]; glyphY++) {
        
              var y = screenY + scaleY - 1;     
              var scaleX = 1;
              
              // raw variant :
              // for (var glyphX = 1; glyphX <= fontSettings.w; glyphX++) {
              
               for (var glyphX = 1; glyphX <= xb[xbKeys['aWidth']]; glyphX++) {
                                        
                    // console.log(getBit(font[bit], bitCursor));
                    
                    var glyphXYpixel = getBit(font[byteN], bitCursor) ? true : false;
                    if (glyphXYpixel) {
                        
                        
                        var resultX = screenX + scaleX - 1;
                        var resultY = y;
                        //     console.log(glyphX + ' || ' +  glyphY + ' || ' + resultX + ' || ' +  resultY);
                      
                        // if (resultX > screen.width || resultY > screen.height) {
                        if (resultX < 0 || resultY < 0) {
                        
                        } else {
                        
                            if (handler.scale == 1) bufferSetPixel(resultX, resultY, frontColor ? true : false);     
                            else {
                                bufferSetPixel(resultX, resultY, true); 
                                //bufferFillRect    
                                bufferDrawCircle(resultX, resultY, handler.scale, frontColor ? true : false);
                            }
                        }                        
                    }
                    
                    bitCursor++;
                    scaleX += handler.scale;
                    
                    if (bitCursor > 7) {
                        byteN++;
                        bitCursor = 0;                            
                    }                   
              }
              
              scaleY += handler.scale;
        }
    };

    handler.drawString = function(screenX, screenY, text, fontData, frontColor) {

        var fontSettings = fontData.settings;
        var posX = screenX;
        
        for ( var i = 0; i < text.length; i++) {
        
                var index = fontSettings.map.indexOf(text[i].charCodeAt(0));
                if (index === -1) {
                    console.error('UNKNOWN CHAR : '  + text[i] + ' | CHAR CODE :' + text[i].charCodeAt(0));
                    continue;
                }
             
             // console.log(fontSettings.xb[index]);
             
             if (i > 0) posX += fontSettings.xb[index][0] * handler.scale;

             handler.drawGlyph(posX, screenY, fontData, text[i], frontColor ? true : false);
             
             posX += (fontSettings.w * handler.scale) + (fontSettings.xb[index][1] * handler.scale);
             //if (posX >= screen.width) break;
        }
        
        var width = posX-screenX;
        if (width <= 0) width = 1;
        return width;
    };
    
    handler.drawStringGetWidth = function(text, fontData) {

        var fontSettings = fontData.settings;
        var posX = screenX;
        
        for ( var i = 0; i < text.length; i++) {
        
                var index = fontSettings.map.indexOf(text[i].charCodeAt(0));
                if (index === -1) {
                    console.error('UNKNOWN CHAR : '  + text[i]);
                    continue;
                }
             
             // console.log(fontSettings.xb[index]);
             
             if (i > 0) posX += fontSettings.xb[index][0] * handler.scale;

             posX += (fontSettings.w * handler.scale) + (fontSettings.xb[index][1] * handler.scale);
        }
        
        var width = posX-screenX;
        if (width <= 0) width = 1;
        return width;
    };
    
    handler.showFontDrawGlyphButtons = function(show) {
        
        var ct = document.getElementById('screen-glyphs');
            ct.innerHTML = '';
            
        if (!show) return;
    
        var helper = document.createElement('canvas');
            helper.width = handler.fontData.settings.w;
            helper.height = handler.fontData.settings.h;
            
        var helperCtx = helper.getContext('2d', { willReadFrequently: true });
            
        var settings = handler.fontData.settings;
        
        var deselectAll = function() {
            var glyphSelectors = ct.getElementsByClassName('screen-glyphs-glyph');
            for (var i = 0; i < glyphSelectors.length; i++) glyphSelectors[i].classList.remove('active');                
        }
        
        // Draw glyph preview
                
        for (var i = 0; i < handler.fontData.settings.map.length; i++) {
            
            var charIndex = settings.map[i];
            var xb = settings.xb[i];
            var byteN = xb[xbKeys['pByte']];
            var bitCursor = xb[xbKeys['pBit']];
            
            helperCtx.rect(0, 0, helper.width, helper.height);
            helperCtx.fillStyle = '#fff';
            helperCtx.fill();   
            var pixelsHardwareFont = helperCtx.getImageData(0, 0, helper.width, helper.height);
            
            for (var glyphY = 1; glyphY <= xb[xbKeys['aHeight']]; glyphY++) {
            
                   for (var glyphX = 1; glyphX <= xb[xbKeys['aWidth']]; glyphX++) {
                                
                        var show = getBit(handler.fontData.font[byteN], bitCursor) ? true : false;
                        
                        var rY = settings.h - xb[xbKeys['aHeight']] + glyphY;
                        if (xb[xbKeys['yBefore']] < 0) rY += xb[xbKeys['yBefore']];
                        
                        var g = getCanvasCursor(glyphX, rY, helper);    
                        var color = show ? {r : 0, g : 0, b : 0} : {r : 255, g : 255, b : 255};
                        
                        pixelsHardwareFont.data[g + 0] = color.r;
                        pixelsHardwareFont.data[g + 1] = color.g;
                        pixelsHardwareFont.data[g + 2] = color.b;     
                            
                        bitCursor++;
                        
                        if (bitCursor > 7) {
                            byteN++;
                            bitCursor = 0;                            
                        }                   
                  }
            }
            
            if (xb[xbKeys['yBefore']] > 0) {
                    
                for (var x = 1; x <= helper.width; x++) {
                    
                    var g = getCanvasCursor(x, settings.h - xb[xbKeys['yBefore']], helper);   
                    pixelsHardwareFont.data[g + 0] = 255;
                    pixelsHardwareFont.data[g + 1] = 0;
                    pixelsHardwareFont.data[g + 2] = 0;  
                }
            }
            
            if (xb[xbKeys['xAfter']] < 0) {
                    
                for (var y = 1; y <= helper.width; y++) {
                    
                    var g = getCanvasCursor(settings.w + xb[xbKeys['xAfter']], y, helper);   
                    pixelsHardwareFont.data[g + 0] = 0;
                    pixelsHardwareFont.data[g + 1] = 255;
                    pixelsHardwareFont.data[g + 2] = 0;  
                }
            }
            
            helperCtx.clearRect(0, 0, helper.width, helper.height);             
            helperCtx.putImageData( pixelsHardwareFont, 0, 0 );      
            
            var image = document.createElement('IMG');
                image.className = 'screen-glyphs-glyph'; 
                image.id = 'screen-glyphs-glyph-' + i;
                image.src = helper.toDataURL();
                image.setAttribute('data-map-index', i);
                image.onclick = function() {                
                    // screenInit(monitor.width, monitor.height);
                    // handler.drawString(20, 20, this.getAttribute('data-c'), handler.fontData, true);
                    // screenUpdate();
                    deselectAll();
                    showFontGlyphEditor(true, parseInt(this.getAttribute('data-map-index')));
                    this.classList.add('active')
                }
                
            ct.appendChild(image);  
        }
        
        var addNew = document.createElement('BUTTON');
            addNew.innerText = '+';
            addNew.className = 'screen-glyphs-add screen-glyphs-glyph';
            addNew.onclick = function() {       
                deselectAll();
                showFontGlyphEditor(true, false);
                this.classList.add('active')
            }
            ct.appendChild(addNew);    
    }
    
	handler.fontGeneratorUpdatePreviewText = function() {
		if (handler.fontData) {
			screenInit(monitor.width, monitor.height);
			// console.log(handler.fontData.settings.maxOffsetY);
			handler.drawString(20, 20, document.getElementById('font-generator-text').value, handler.fontData, true);
			// handler.drawString(20, handler.fontData.settings.h + handler.fontData.settings.maxOffsetY + 8, "1234567890%", handler.fontData, true);
			screenUpdate();
		}
	}
		
    handler.fontGenerator = function(n, size, cssFontSize, text, threshhold, lineWidth, textMap) {
        
        if (!threshhold || threshhold <= 0) threshhold = 0.5;
       // todo - форма генерации, редактор по клику на отдельный глиф
       // controller.loadFonts(function() { controller.fontGenerator(17, 44, 36);});
        console.log(n);
        var log = document.getElementById('font-generator-log');
        if (!textMap) textMap = defaultLetterSet;
        
        var initOffsets = {"_" : [0, -4],};
        
        var map = [];
        
        for (var i = 0; i < textMap.length; i++) {
            var charCode = textMap[i].charCodeAt(0);
            if (map.indexOf(charCode) != -1) {
                console.log('skipped double char in textMap : ' + textMap[i]);
            } else {
                map.push(charCode);
            }
        }
                 
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d', { willReadFrequently: true });  
                
        canvas.width = size ? size : 32;
        canvas.height = size ? size : 32;
        size = canvas.width;
                
        var max = map.length;
        var fileName = n === false ? handler.dinamicFontName : handler.fonts[n][2];
		
        var fontData = {
            font : [],
            name : fileName.split('.')[0],
            inputSettings : {
                name : fileName,
                fontSize : cssFontSize,
                canvasSize : size,
                threshhold : threshhold,
                lineWidth : lineWidth,
            },
            settings : {
                textMap : textMap,
                map : map,
                w : size,
                h : size,
				maxOffsetY : 0,
                xb : [
                    
                    // before x, after x, top y
                
                ],
            },
        };
          
        var glyphBits = ''; 
        var actualBits = 0;
        
        for (var i = 0; i < max; i++) {
            
            var glyphOffsets = handler.fitGlyph(cssFontSize ? cssFontSize : size, n === false ? "dinamicFontData" : handler.fonts[n][1], textMap[i], ctx, canvas, initOffsets);
                glyphOffsets.topY = size; // крайняя точка с пикселями от верха
                glyphOffsets.rightX = 0; // крайняя точка с заполнеными пикселями справа
            
            var pixelsRichFont = ctx.getImageData(0, 0, canvas.width, canvas.height);
                 
            for(var y = 1; y <= canvas.height; y++) {
                
                for(var x = 1; x <= canvas.width; x++) {
                    var g = getCanvasCursor(x, y, canvas);
                    var hide = true;
                    var hsv = rgbToHsv(pixelsRichFont.data[g + 0], pixelsRichFont.data[g + 1], pixelsRichFont.data[g + 2]);
                    if (hsv.v < 0.5) hide = false;   
                    if (!hide && glyphOffsets.topY > y) glyphOffsets.topY = y;
                    if (!hide && glyphOffsets.rightX < x) glyphOffsets.rightX = x;
                }    
            }
            
            //document.getElementById('screen-glyphs').appendChild(canvas);
            //debugger;
            
            // glyphOffsets.offsetX - handler.fitGlyph сдвиг отрендеренного символа внутри картинки влево чтобы символ вместился в область границ изображения
            // glyphOffsets.offsetY - handler.fitGlyph сдвиг отрендеренного символа внутри картинки вверх чтобы символ вместился в область границ изображения
            glyphOffsets.aHeight = size - (glyphOffsets.topY - 1); // фактический размер по границам непустой части изображения
            glyphOffsets.aWidth = glyphOffsets.rightX; 
            glyphOffsets.xBefore = 1; // отступ перед символом, если в строке больше одного символа
            glyphOffsets.xAfter = (-1 * (size - glyphOffsets.rightX - glyphOffsets.offsetX)) + (lineWidth ? lineWidth : 0); // смещение следующего после символа
            glyphOffsets.yBefore = -1 * glyphOffsets.offsetY; // сдвиг символа по Y
            
            if (textMap[i] == ' ') {
                glyphOffsets.xAfter = Math.ceil(size / 1.5) * -1;
            }
            
            if (glyphOffsets.aWidth <= 0 || glyphOffsets.aHeight <= 0) {                
                glyphOffsets.aWidth = 1;
                glyphOffsets.aHeight = 1;                
            }
            
            if (glyphOffsets.topY == size) {
                glyphOffsets.topY = size-1;
            }
            
            glyphOffsets.pByte = fontData.font.length;
            glyphOffsets.pBit = glyphBits.length;
            
            // for(var y = 1; y <= size; y++) {
            for(var y = glyphOffsets.topY; y <= size; y++) {
            // for(var x = 1; x <= size; x++) {    
                for(var x = 1; x <= glyphOffsets.aWidth; x++) {
                    
                    var hide = true;
                    var g = getCanvasCursor(x, y, canvas);
                    var hsv = rgbToHsv(pixelsRichFont.data[g + 0], pixelsRichFont.data[g + 1], pixelsRichFont.data[g + 2]);
                    
                    if (hsv.v < threshhold) hide = false;            
                    
                    var color = !hide ? {r : 0, g : 0, b : 0} : {r : 255, g : 255, b : 255};
                   
                    glyphBits += color.r == 0 ? '1' : '0';
                    if (glyphBits.length == 8) {
                        
                        var glyphByte = parseInt(glyphBits, 2);
                        fontData.font.push(glyphByte);
                        
                        glyphBits = '';
                    }  
                }    
            }
            
            var xb = [];    
            for (var xbKey in xbKeys) {
                xb[xbKeys[xbKey]] = glyphOffsets[xbKey];
            }
                
			if (fontData.settings.maxOffsetY < glyphOffsets.yBefore) {
				fontData.settings.maxOffsetY = glyphOffsets.yBefore;
			}
			
            // console.log(xb);
            
            // console.log(textMap[i] + ' | Actual size : ' + glyphOffsets.aWidth + 'x' + glyphOffsets.aHeight + ' xStart : 0' + ' yStart : ' + glyphOffsets.topY);
            
            fontData.settings.xb.push(xb);
            
            // console.log(glyphBytes);
            // console.log( textMap[i]);
            // console.log(glyphOffsets)             
        }
        
        if (glyphBits.length) {
            for (var x = 8 - glyphBits.length; x > 0; x--) glyphBits += '0';
    
            var glyphByte = parseInt(glyphBits, 2);
            fontData.font.push(glyphByte);
        }
        
        var fontBytes = '';  
        var glyphBytesCounter = 8;
        for (var i = 0; i < fontData.font.length; i++) {
        
            var glyphByte = formatHex(fontData.font[i]) + ', ';
                     
            glyphBytesCounter--;
            if (glyphBytesCounter <= 0) {
                glyphBytesCounter = 8;
                glyphByte += ' \r\n';
            }
            
            fontBytes += glyphByte; // + ' // [' + textMap[i] + '] | CHARCODE : ' + textMap[i].charCodeAt(0) + ' \r\n';
        }
        
        if (log)
        log.innerText = 'text file bytes : ' + fontBytes.length + ' | font raw bytes : ' + ((size * size * fontData.settings.map.length) / 8) + ' | pack bytes : ' + (fontData.font.length);
            
        handler.fontData = fontData;
        updateFontTextMap();
        
        handler.fontGeneratorUpdatePreviewText();
        
        handler.showFontDrawGlyphButtons(true);
        // todo - импрот в C++
        // console.log(fontBytes)
    }
        
    /* FONT CONVERTOR END */
    
    
    handler.rotateScreenEl = function(to) {
        // handler.rotate = parseInt(this.value);
        var wrap = document.getElementById('screen-wrap');
            wrap.classList.remove('screen-rotate-90');
            wrap.classList.remove('screen-rotate-180');
            wrap.classList.remove('screen-rotate-270');
            wrap.classList.add('screen-rotate-' + to);
    }
	
	handler.initScreenRotate = function() {
		
        document.getElementById('screen-rotate').onchange = function() {            
                handler.rotateScreenEl(this.value);
        }
	}
	
	handler.initFontEditor = function() {
		
		var fontSelector = document.getElementById('font-generator-font');
		var clearDinamicFont = function() {
			
			if (handler.dinamicFont) { 
			//	document.fonts.remove(handler.dinamicFont);
			}
			
			handler.dinamicFont = false;
			
		}
		
		var updateFontLicInfo = function() {
			
			document.getElementById('font-generator-from-file').value = "";
			
			var ltext = "";
			if (handler.fonts[parseInt(fontSelector.value)][4]) ltext += handler.fonts[parseInt(fontSelector.value)][4];
			if (handler.fonts[parseInt(fontSelector.value)][3]) ltext += ' (<a href="' + handler.fonts[parseInt(fontSelector.value)][3] + '" target="_blank">' + handler.fonts[parseInt(fontSelector.value)][3] + "</a>)";
			
			document.getElementById('font-generator-license').innerHTML = ltext;
		};
				
        loadFonts(function() {
            var fontsList = document.getElementById('font-generator-font');
            
            var html = '';
            for (var i = 0; i < handler.fontsLoaded.length; i++) {
                html += '<option value="' + handler.fontsLoaded[i] + '"' + (i == 0 ? " selected" : "") + '>' + handler.fonts[handler.fontsLoaded[i]][2] + '</option>';
            }
            
            fontsList.innerHTML = html;
			updateFontLicInfo();
        });
		
		fontSelector.onchange = function() {
			clearDinamicFont();
			updateFontLicInfo();
		}
		
		document.getElementById('font-generator-letter-set').value = defaultLetterSet;
        
        document.getElementById('font-generator-show').onclick = function() {
			
			var initDinamicFont = function(onnready) {
				
				handler.dinamicFont = false;
				var dinamicFontFile = document.getElementById('font-generator-from-file');
					
				if (dinamicFontFile.files.length > 0) {
					
					var reader = new FileReader();
						reader.addEventListener("loadend", function() {
							
							handler.dinamicFont = new FontFace('dinamicFontData', reader.result);
							handler.dinamicFont.load().then(
							  function(){
								document.fonts.add(handler.dinamicFont);
								handler.dinamicFontName = dinamicFontFile.files[0].name;
								onnready(true);
								/*
								document.fonts.load("36px FontFamily dinamicFontData").then(
								  function(fonts){
									handler.dinamicFontName = dinamicFontFile.files[0].name;
									onnready(true);
								  },
								  function(err){
									console.error(err);
									handler.dinamicFont = false;
									dinamicFontFile.value = "";
									onnready(false);
								  },
								);
								*/
								//setTimeout(function(){  onnready(true); }, 1000);
							  },
							  function(err){
								console.error(err);
								handler.dinamicFont = false;
								dinamicFontFile.value = "";
								onnready(false);
							  },
							);
							
							
						});
						
					reader.readAsArrayBuffer(dinamicFontFile.files[0]);
					
				} else onnready(false);
			}
			
			var generateFontByFormData = function() {
                
				var fontItem = parseInt(document.getElementById('font-generator-font').value);
                
                if (handler.dinamicFont === false && isNaN(fontItem)) {
                    handler.print('Дождитесь загрузки набора шрифтов или выберите локальный файл', false);
                    return false;
                }
                
				showFontGlyphEditor(false);
				handler.showFontDrawGlyphButtons(false);				
			
				var fontSize = parseInt(document.getElementById('font-generator-font-size').value);
				var imageSize = parseInt(document.getElementById('font-generator-image-size').value);
				var threshhold = validateFloatString(document.getElementById('font-generator-font-threshhold').value);
				
				console.log(handler.dinamicFont);
                
				handler.fontGenerator(
					handler.dinamicFont !== false ? false : fontItem, 
					imageSize, 
					fontSize, 
					document.getElementById('font-generator-text').value, 
					threshhold,
					parseInt(document.getElementById('font-generator-line-width').value),
					document.getElementById('font-generator-letter-set').value,
				);
                
                return true;
			}
			
			if (handler.fontData && handler.fontDataModified) {
				handler.print('1-bit шрифт был изменен. Если его пересоздать, все изменения будут утеряны. Подтвердите действие. <a id="font-generator-confirm" href="#">Продолжить</a>');
				var fontGenerateAction = this;
				document.getElementById('font-generator-confirm').onclick = function() {
					handler.fontDataModified = false;
					handler.print(false);
					fontGenerateAction.onclick();
				}
				
				return;
			}
			
            clearDinamicFont();
            
			if (document.getElementById('font-generator-from-file').files.length > 0) {
                                
				initDinamicFont(function(success) {
                    
                    console.log('Dynamic font load : ');
                    console.log(handler.dinamicFont);
                    
					if (!success) handler.print('Некорректный файл шрифта', true);
					else generateFontByFormData();
				});
			} else {
				generateFontByFormData();
			}
        }
        
        document.getElementById('font-generator-text').onchange = handler.fontGeneratorUpdatePreviewText;
		document.getElementById('font-generator-text').onkeyup = handler.fontGeneratorUpdatePreviewText;
		
        document.getElementById('json-font-data-show').onclick = function() {
        
            var file = document.getElementById('json-font-data-json-file');
            if (file.files.length <= 0) {
                return handler.print('Файл не выбран', true);
            }
            
            var reader = new FileReader();
                reader.addEventListener("loadend", function() {
                
                    try {
                        var result = reader.result;
                            result = result.split("[JSON-FONT]");
                            
                        console.log(result.length-1);
                        result = result[result.length-1];
                        
                        console.log(result);
                        
                        
                        var fontData = JSON.parse(result);
                        if (fontData && fontData.font && fontData.font.length > 1) {
                            handler.print("Растровый шрифт загружен");
                            handler.fontData = fontData;
                            screenInit(monitor.width, monitor.height);
                            handler.drawString(20, 20, document.getElementById('font-generator-text').value, handler.fontData, true);
                            screenUpdate();
                            handler.showFontDrawGlyphButtons(true);
                            
                        } else {
                            handler.print("Ошибка чтения, не найден массив данных растрового шрифта", true);
                            console.log(fontData);
                            
                        }
                    } catch (e) {
                        console.log(e);
                        handler.print("Ошибка чтения", true);                        
                    }
                        
                
                });
                
                reader.readAsText(file.files[0]);
        }
        
        
		// Кнопка переключения в режим редактирования отдельных глифов шрифта
		
        document.getElementById('font-glyph-editor-display').onclick = function() {
            if (handler.fontData) {
                showResultBlock(false);
                handler.showFontDrawGlyphButtons(true);
            } 
        }
        
        var getFontTextCommentInfo = function() {
            var text = ""; 
            text += '/*' + '\r\n';                        
            text += '        Font name : ' +  handler.fontData.inputSettings.name + '\r\n';
            text += '        Font size : ' +  handler.fontData.inputSettings.fontSize + 'px' + '\r\n'; 
            text += '        Storage image (glyph) bounds : ' +  handler.fontData.inputSettings.fontSize + 'px' + '\r\n'; 
            text += '        Generator params : threshhold : ' +  handler.fontData.inputSettings.threshhold + ' line widh : ' +  handler.fontData.inputSettings.lineWidth + '\r\n'; 
            
            text += '        Total glyphs : ' +  handler.fontData.settings.map.length + '\r\n';  
            text += '        Font bin size : ' +  handler.fontData.font.length + ' bytes' + '\r\n';                        
            text += '*/' + '\r\n';
            text += '\r\n';
            text += '\r\n';
            text += '\r\n';
            
            return text;
        }
		
        document.getElementById('font-to-js').onclick = function() {
        
                showFontGlyphEditor(false);
                handler.showFontDrawGlyphButtons(false);
                
                showResultBlock(getFontTextCommentInfo() + '// [JSON-FONT]' + '\r\n' + JSON.stringify(handler.fontData), handler.fontData.name + '_' + handler.fontData.settings.w + 'x' + handler.fontData.settings.h + '.json');
        }
                 
        document.getElementById('font-to-cpp').onclick = function() {
        
                showFontGlyphEditor(false);
                handler.showFontDrawGlyphButtons(false);
                
                var getGlyphNotice = function(index) {                
                    
                    var charCode = fontData.settings.map[index];
                    
                    var charI = String.fromCharCode(charCode);
                    if (charI == ' ') charI = 'space';
                    if (charI == '℃') charI = 'celsius';
                    
                    return charI;
                }     
                
                var fontData = handler.fontData;
                var generator = document.getElementById('font-generator-font');

                var text = getFontTextCommentInfo();
                    text += '#include <KellyCanvas.h>'  +  '\r\n'  +  '\r\n';
                    text +=  '\r\n' +  '\r\n' +  '\r\n';
                    
                var fontName = 'font' + fontData.settings.w + 'x' + fontData.settings.h;
                
                /* glyphs binary */
                
                var currentRow = 0;                
                
                text += 'const static uint8_t ' + fontName + '[] PROGMEM  = {' +  '\r\n';
                text += '        ';
                
                for (var i = 0; i < fontData.font.length; i++) {
                    
                    text += formatHex(fontData.font[i]) + ',';
                    currentRow++;
                    
                    if (currentRow == 8) {
                        currentRow = 0;
                        text += '\r\n';
                        text += '        ';    
                    }
                }
                
                text += '};' +  '\r\n';
                text +=  '\r\n' +  '\r\n' +  '\r\n';
                
                /* glyphs settings */
                
                var codeMap = '';
  
                for (var i = 0; i < fontData.settings.map.length; i++) {
                    codeMap += fontData.settings.map[i] + ',';
                }
                
                text +=  '\r\n' +  '\r\n' +  '\r\n';
                
                text += 'const static int ' + fontName + 'Map[] PROGMEM = {' + '\r\n' + codeMap +  '\r\n' + '};' +  '\r\n';
                
                text +=  '\r\n' +  '\r\n' +  '\r\n';
                
                text += 'const glyphSettings ' + fontName + 'GlyphSettings[] PROGMEM = {' + '\r\n';
                
                for (var i = 0; i < fontData.settings.xb.length; i++) {
                
                    var glyphSettings = fontData.settings.xb[i];                    
                    text += '        {';
                    var settingNoticePading = '';
                    
                    for (var b = 0; b < glyphSettings.length; b++) {
                        
                        var settingValue = typeof glyphSettings[b] == 'undefined' ? '0' : glyphSettings[b].toString();
                        if (settingValue.length <= 1) settingNoticePading += ' ';
                        
                        text += settingValue;
                        
                        if (b < glyphSettings.length-1) {
                            text += ', ';
                        }
                    }   

                    text += '}, ' + settingNoticePading + '// ' + getGlyphNotice(i);       
                    text +=  '\r\n';                
                }
                
                text +=  '};' + '\r\n';
                text +=  '\r\n' +  '\r\n' +  '\r\n';
                
                text += 'const fontManifest ' + fontName + 'Config PROGMEM = {' + '\r\n';
                text += '   (uint8_t *) ' + fontName + ',' + '\r\n';
                text += '   (int *) ' + fontName + 'Map,' + '\r\n';
                text += '    ' + fontData.settings.w + ',' + '\r\n';
                text += '    ' + fontData.settings.h + ',' + '\r\n';
                text += '    ' + fontData.settings.xb.length + ',' + '\r\n';
                text += '   (glyphSettings *) ' + fontName + 'GlyphSettings' + ',' + '\r\n';
                text += '};';
                
                showResultBlock(text, handler.fontData.name + '_' + handler.fontData.settings.w + 'x' + handler.fontData.settings.h + '.h');
        }
        
		
	}
   
	handler.initButtons = function() {
		
        // todo - support merged color format (2-bit) - currently function checks pixel just by 1-bit status
        // example - colorName = getMergedColor([!getBit(imageData[bit], bitCursor), !getBit(imageData[bit], bitCursor+1)]);
        // set color bitmask by imageBits += mergedColorBitMask[colorName][0] - first bit, imageBits += mergedColorBitMask[colorName][1] - second bit
        
        var bufferToText = function(bufferData, imageD, namePostFix) {
                
                var bit = 0, bitCursor = 0;
                var imageBits = '';
                var imageText = ''; var imageTextRowByte = 0;
                
                var totalBytes = 0;
                
                for(var y = 0; y < screen.height; y++) {
                            
                    for(var x = 0; x < screen.width; x++) {
                        
                        if (x >= imageD.sX && y >= imageD.sY && x < imageD.w && y < imageD.h) {
                            imageBits += getBit(bufferData[bit], bitCursor) ? '1' : '0';
                            if (imageBits.length == 8) {
                            
                                imageTextRowByte++;
                                imageText += (imageText ? ', ' : '') + (imageTextRowByte == 8 ? '\r\n' : '') + formatHex(parseInt(imageBits, 2));                                    
                                
                                if (imageTextRowByte == 8) {
                                    imageTextRowByte = 0;
                                }
                                
                                totalBytes++;
                                imageBits = '';
                            } 
                        }
                        
                        bitCursor++;                
                        if (bitCursor > 7) {                    
                            bit++;
                            bitCursor = 0;                        
                        }
                    }    
                }
                
                if (imageBits.length) {
                    for (var x = 8 - imageBits.length; x > 0; x--) imageBits += '0';
                    imageText += (imageText ? ', ' : '') + formatHex(parseInt(imageBits, 2));
                    totalBytes++;
                }
                
                var vName = 'gImage_' + imageD.w + 'x' + imageD.h + '' + (namePostFix ? namePostFix : '');
                var result = 'const static uint8_t ' + vName + '[] PROGMEM = {' + '\r\n ' + imageText + '};';
                    result += '\r\n' + '\r\n' + '\r\n';
                    
                    result += 'imageData ' + vName + '_settings PROGMEM = ';
                    result += '{' + '\r\n';
                        result += '       ' + '(uint8_t *)  ' + vName + ',' + '\r\n';
                        result += '       ' + totalBytes + ',' + '\r\n';
                        result += '       ' + imageD.w + ','  + '\r\n';
                        result += '       ' + imageD.h + ','  + '\r\n';
                    result += '};';
                    
                    result += '\r\n' + '\r\n' + '\r\n';
                    
                    return result;
         }
 
         var bufferToBin = function(bufferData, imageD) {
                
                var bit = 0, bitCursor = 0, totalBytes = 0;
                var imageBits = '';
                var imageText = ''; var imageTextRowByte = 0;
                
                var size = (imageD.w * imageD.h) / 8;
                    size = Math.ceil(size);
                    
                var imageBin = new Uint8Array(size);
                
                for(var y = 0; y < screen.height; y++) {
                            
                    for(var x = 0; x < screen.width; x++) {
                        
                        if (x >= imageD.sX && y >= imageD.sY && x < imageD.w && y < imageD.h) {
                            imageBits += getBit(bufferData[bit], bitCursor) ? '1' : '0';
                            if (imageBits.length == 8) {
                            
                                imageTextRowByte++;
                                imageBin[totalBytes] = parseInt(imageBits, 2);                                    
                                
                                if (imageTextRowByte == 8) {
                                    imageTextRowByte = 0;
                                }
                                
                                totalBytes++;
                                imageBits = '';
                            } 
                        }
                        
                        bitCursor++;                
                        if (bitCursor > 7) {                    
                            bit++;
                            bitCursor = 0;                        
                        }
                    }    
                }
                
                if (imageBits.length) {
                    for (var x = 8 - imageBits.length; x > 0; x--) imageBits += '0';
                    imageBin[totalBytes] = formatHex(parseInt(imageBits, 2));
                    totalBytes++;
                }
                
                return imageBin;
        }
               
        var screenBufferToCpp = function() {
        
                var header = '';
                    
                    header += '#include <KellyCanvas.h>' + '\r\n' + '\r\n';
                    
                    header += '/*' + '\r\n';
                    header += 'typedef struct {' +'\r\n';
                    header += '           unsigned char * data;' +'\r\n';
                    header += '           int size;' +'\r\n';
                    header += '           int width;' +'\r\n';
                    header += '           int height;' +'\r\n';
                    header += '} imageData;' +'\r\n';
                    header += '*/' +'\r\n';
                    header += '\r\n';
                    header += '\r\n';
                    header += '\r\n';
                    header += '\r\n';
                    header += '\r\n';
               
               var result = '';
               
               
               if (this.id == 'image-to-cpp') {
               
                   if (monitor.bufferType == 'separate') {
                        if (imageData[0] && imageData[0].settings && imageData[0].settings.w > 0) result += bufferToText(screenBuffer[0], imageData[0].settings, 'bw') + '\r\n' + '\r\n' + '\r\n';
                        if (imageData[1] && imageData[1].settings && imageData[1].settings.w > 0) result += bufferToText(screenBuffer[1], imageData[1].settings, 'red');
                   } else {
                        if (imageData[0] && imageData[0].settings && imageData[0].settings.w > 0) result += bufferToText(screenBuffer[0], imageData[0].settings, 'merged');
                   }
                   
               } else {
               
                    result += bufferToText(screenBuffer[0], {sX : 0, sY : 0, w : screen.width, h : screen.height}, 'b1');
                    result += bufferToText(screenBuffer[1], {sX : 0, sY : 0, w : screen.width, h : screen.height}, 'b2');
                    
               }
               
                result = header + result;
                showResultBlock(result, (imageData[0].settings.name ? imageData[0].settings.name.split('.')[0] : 'default') + '_' + imageData[0].settings.w +'x' + imageData[0].settings.h + '_' + 'bw' + '.h');
        }
        
        document.getElementById('image-to-cpp').onclick = screenBufferToCpp;
        document.getElementById('image-to-bin').onclick = function() {

            showFontGlyphEditor(false);
            handler.showFontDrawGlyphButtons(false);
            download(
                bufferToBin(screenBuffer[0], imageData[0].settings), 
                (imageData[0].settings.name ? imageData[0].settings.name.split('.')[0] : 'default') + '_' + imageData[0].settings.w +'x' + imageData[0].settings.h + '_' + 'bw' + '.bin'
            );
        };
        
        document.getElementById('screen-to-cpp').onclick = function() {
        
                showFontGlyphEditor(false);
                handler.showFontDrawGlyphButtons(false);
                
                screenBufferToCpp();
        }
           
        var onToggleForm = function() {

            var form = document.getElementById(this.getAttribute('data-target'));
            var active = form.classList.contains('form-active');

			var formToggle = document.getElementsByClassName('form-toggle');
			for (var i = 0; i < formToggle.length; i++) document.getElementById(formToggle[i].getAttribute('data-target')).classList.remove('form-active');
			
            if (active) form.classList.remove('form-active');
            else form.classList.add('form-active');
        }

        
        var formToggle = document.getElementsByClassName('form-toggle');
        for (var i = 0; i < formToggle.length; i++) {
            formToggle[i].onclick = onToggleForm;
        }
		
        if (document.getElementById('image-image-refresh')) document.getElementById('image-image-refresh').onclick = function() {
            
            var file = document.getElementById('image-image');
            if (file.files.length <= 0) {
                return handler.print('Файл не выбран', true);
            }
            
            var additionBuffer = document.getElementById('image-image-2');
            var loadFile = function(file, onReady) {
                
                var reader = new FileReader();
                    reader.addEventListener("loadend", function() {
                        
                          var src = new Image();
                              src.onload = function() {
                                 onReady(this);
                              }
                              
                              src.src = this.result;
                    });
                    
                    reader.readAsDataURL(file);
            }
            
            loadFile(file.files[0], function(src) {
            
                monitor = monitors[document.getElementById('monitor-type').value];
                
                screenInit(monitor.width, monitor.height);
                
                renderImageElToBuffer(src, getConversionSettings('image'), 0);                
                imageData[0].settings.name = file.files[0].name;
                
                if (additionBuffer.files.length > 0) {
                    loadFile(additionBuffer.files[0], function(src2) {
                    
                        handler.colorMode = monitor.colors.ALT1;
                        
                        renderImageElToBuffer(src2, getConversionSettings('image-2'), 1);                        
                        imageData[1].settings.name = additionBuffer.files[0].name;
                        
                        screenUpdate();
                    });
                } else {
                    screenUpdate();
                }
            });
             
        }
        
		// Загрузить изображение из CPP \ bin файла
		
        if (document.getElementById('cpp-image-refresh')) document.getElementById('cpp-image-refresh').onclick = function() {
            
            var file = document.getElementById('cpp-image');
            if (file.files.length <= 0) {
                return handler.print('Файл не выбран', true);
            }
            
            var fileType = file.files[0].name.split('.');
                fileType = fileType[fileType.length-1];
                
            monitor = monitors[document.getElementById('monitor-type').value];
            
            var width = monitor.width;
            var height = monitor.height;
            
            if (!document.getElementById('cpp-image-size-auto').checked) {
                width = parseInt(document.getElementById('cpp-image-width').value);
                height = parseInt(document.getElementById('cpp-image-height').value);
                
                width = isNaN(width) ? monitor.width : width;
                height = isNaN(height) ? monitor.height : height;
            }
            
            var reader = new FileReader();
                reader.addEventListener("loadend", function() {
                    
                    var imageData = {type : false, buffer1 : false, buffer2 : false};
                    imageData.bufferLength = Math.ceil(((width * height) / 8) * (monitor.bitPerPixel ? monitor.bitPerPixel : 1));

                    if (fileType == 'bin') {
                    
                        imageData.buffer1 = [];
                        var view = new Uint8Array(reader.result);
                        for (var i = 0; i < imageData.bufferLength; i++) {
                        
                            if (i > view.length-1) {
                            
                                imageData.buffer1.push(0);
                                
                            } else {
                            
                                imageData.buffer1[i] = view[i];
                            }
                        }
                        
                    } else {
                    
                         var r = reader.result;
                            r = r.replace(new RegExp('PROGMEM', 'g'), '');
                            // r = r.replace(new RegExp('\\[\\]', 'g'), '');
                            r = r.replace(/\*(.|\n)*?\*/,"");
                            r = r.replace(new RegExp('\\/\\/', 'g'),"");
                            r = r.trim().replace(/(\r\n\t|\n|\r\t)/gm,"");

                        console.log(r);

                        var pageDataRegExp = new RegExp('([A-Za-z0-9_]+)\\[(.*?)\\][ \t]*=[ \t]\\{(.*?)}', 'gs');

                        if (r.indexOf('[') == -1) {
                                  
                                r = r.split(',');
                                
                                imageData.buffer1 = [];
                                for (var i = 0; i < imageData.bufferLength; i++) {
                                
                                    if (i > r.length-1) {
                                    
                                        imageData.buffer1.push(0);
                                        
                                    } else {
                                    
                                        imageData.buffer1[i] = r[i].trim();
                                        var byteData = parseInt(r[i]);
                                        
                                        if (isNaN(byteData)) byteData = 0;
                                        if (byteData > 255) byteData = 255; // max 0xFF
                                        
                                        imageData.buffer1[i] = byteData;
                                    }
                                }
                                
                        } else {
                            
                            while (match = pageDataRegExp.exec(r)){
                            
                                if (!imageData.buffer1) {
                                    imageData.buffer1 = textToByteData(match[3], imageData.bufferLength);
                                    
                                    if (monitor.bufferType == 'merged') break;
                                    
                                } else if (!imageData.buffer2) {
                                    imageData.buffer2 = textToByteData(match[3], imageData.bufferLength);
                                } else break;
                            }
                        
                        }
                        
                    }
                   
                    screenInit();
                    console.log('ImageData : ');
                    console.log(imageData.bufferLength);
                    console.log(imageData.buffer1.length);
                    
                    renderImageArrayToBufferCpp(imageData.buffer1, 0, 0, width, height);
                    
                    if (monitor.bufferType == 'separate' && imageData.buffer2.length) {
                        handler.colorMode = monitor.colors.ALT1;
                        
                        renderImageArrayToBufferCpp(imageData.buffer2, 0, 0, width, height);
                    }      
                    
                    screenUpdate();
                });

                if (fileType == 'bin') reader.readAsArrayBuffer(file.files[0]); else reader.readAsText(file.files[0]);
        }
        
	}
	
    handler.init = function(env) {
        
		if (!env) env = {};
		
		if (env.name) {
			document.title = env.name + " v" + env.version;
		}
		
		if (document.getElementById('app-name')) document.getElementById('app-name').innerText = env.name;
		if (document.getElementById('app-version')) document.getElementById('app-version').innerText = env.version;
		if (document.getElementById('app-extend-mode')) document.getElementById('app-extend-mode').onclick = function() {
			if (document.body.classList.contains('extended-mode')) {
				document.body.classList.remove('extended-mode');
				document.body.classList.add('normal-mode');
			} else {
				document.body.classList.remove('normal-mode');
				document.body.classList.add('extended-mode');
			}
		}
		
		if (env.fonts) handler.fonts = env.fonts;
		if (env.monitors) controller.setMonitors(env.monitors);
		
        screen = document.getElementById('screen'); 
        screen.width = 1;
        screen.height = 1;
        
        screenCtx = screen.getContext('2d');  
        
        initMonitorSelect();
        initCopyright();
		initConversionSettings();
        updateCppButtons();
        
		if (!env.shortInit) {
			handler.initButtons();
			handler.initScreenRotate();
			handler.initFontEditor();
		}
    }
}