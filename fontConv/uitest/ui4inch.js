function testUI4in2() {  
        
        var handler = controller;
        
        fontData_cbold17x17 = fontData_cbold18x18;
        
        var mail = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x3F, 0xFC, 0x30, 0xC, 0x28, 0x14, 0x24, 0x24, 0x26, 0x64, 0x29, 0x94, 0x30, 0xC, 0x3F, 0xFC, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, ]; // 16x16;
        var temp = [
            0xFC, 0x7F, 0xF0, 0x7F, 0xC0, 0x7F, 0x80, 
            0xFF, 0x01, 0xFE, 0x03, 0xFC, 0x07, 0xF8, 0x0F, 
            0xF0, 0x1F, 0xE0, 0x3F, 0xC0, 0x7F, 0x80, 0xFF, 
            0x01, 0xFE, 0x03, 0xFC, 0x07, 0xF8, 0x0F, 0xF0, 
            0x1F, 0xE0, 0x3F, 0xC0, 0x7F, 0x80, 0xFF, 0x01, 
            0xFE, 0x03, 0xFC, 0x07, 0xF8, 0x0F, 0xF0, 0x1F, 
            0xE0, 0x3F, 0xC0, 0x7F, 0x80, 0xFF, 0x01, 0xFE, 
            0x03, 0xFC, 0x07, 0xF8, 0x0F, 0xF0, 0x1F, 0xE0, 
            0x3F, 0xC0, 0x7F, 0x80, 0xFF, 0x01, 0xFE, 0x03, 
            0xFC, 0x07, 0xF8, 0x0F, 0xF0, 0x1F, 0xE0, 0x3F, 
            0xC0, 0x7F, 0x80, 0xFF, 0x01, 0xFE, 0x03, 0xFC, 
            0x07, 0xF8, 0x0F, 0xF0, 0x1F, 0xE0, 0x3F, 0xC0, 
            0x7F, 0x80, 0xFF, 0x01, 0xFE, 0x03, 0xF8, 0x03, 
            0xE0, 0x03, 0x80, 0x03, 0x00, 0x04, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 
            0x01, 0x80, 0x03, 0x80, 0x0F, 0x80, 0x3F, 0xC1, 0xF0
        ]; // 15x68
        
        var tempMeter = [
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xE3, 0xFF, 0xC7, 0xFF, 0x8F, 0xFF, 0x1F, 0xFE, 0x3F, 0xFC, 0x7F, 0xF8, 0xFF, 0xF1, 0xFF, 0xE3, 0xFF, 0xC7, 0xFF, 0x8F, 0xFF, 0x1F, 0xFE, 0x3F, 0xFC, 0x7F, 0xF8, 0xFF, 0xF1, 0xFF, 0xE3, 0xFF, 0xC7, 0xFF, 0x8F, 0xFF, 0x1F, 0xFE, 0x3F, 0xFC, 0x7F, 0xF8, 0xFF, 0xF1, 0xFF, 0xE3, 0xFF, 0xC7, 0xFF, 0x8F, 0xFF, 0x1F, 0xFE, 0x3F, 0xFC, 0x7F, 0xF8, 0xFF, 0xF1, 0xFF, 0xE3, 0xFF, 0xC7, 0xFF, 0x8F, 0xFF, 0x1F, 0xFE, 0x3F, 0xFC, 0x7F, 0xF8, 0xFF, 0xF1, 0xFF, 0xE3, 0xFF, 0xC7, 0xFF, 0x8F, 0xFF, 0x1F, 0xFE, 0x3F, 0xFC, 0x7F, 0xF8, 0xFF, 0xF1, 0xFF, 0xE3, 0xFF, 0xC7, 0xFF, 0x8F, 0xFF, 0x1F, 0xFE, 0x3F, 0xF8, 0x3F, 0xE0, 0x3F, 0x80, 0x3F, 0x0, 0x7E, 0x0, 0xFC, 0x1, 0xF8, 0x3, 0xF8, 0xF, 0xF8, 0x3F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF0          
        ]; // 15x68
        
        var c = [
            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF8, 0x7F, 0xFF, 0xFF, 0xFF, 0xE0, 0x7F, 0xF8, 0x1, 0xFF, 0xC0, 0xFF, 0x80, 0x0, 0xFF, 0x81, 0xFE, 0x0, 0x0, 0x7F, 0x3, 0xF0, 0x0, 0x0, 0x7F, 0xF, 0xC0, 0x0, 0x0, 0x7F, 0xFF, 0x0, 0x3F, 0x0, 0xFF, 0xFC, 0x3, 0xFF, 0xC1, 0xFF, 0xF0, 0xF, 0xFF, 0xC3, 0xFF, 0xE0, 0x7F, 0xFF, 0xFF, 0xFF, 0x81, 0xFF, 0xFF, 0xFF, 0xFF, 0x3, 0xFF, 0xFF, 0xFF, 0xFC, 0xF, 0xFF, 0xFF, 0xFF, 0xF8, 0x1F, 0xFF, 0xFF, 0xFF, 0xF0, 0x7F, 0xFF, 0xFF, 0xFF, 0xE0, 0xFF, 0xFF, 0xFF, 0xFF, 0xC1, 0xFF, 0xFF, 0xFF, 0xFF, 0x3, 0xFF, 0xFF, 0xFF, 0xFE, 0x7, 0xFF, 0xFF, 0xFF, 0xFC, 0xF, 0xFF, 0xFF, 0xFF, 0xFC, 0x1F, 0xFF, 0xFF, 0xFF, 0xF8, 0x3F, 0xFF, 0xFF, 0xFF, 0xF0, 0x7F, 0xFF, 0xFF, 0xFF, 0xE0, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0xFF, 0xFF, 0xFF, 0xFF, 0x81, 0xFF, 0xFF, 0xFF, 0xFF, 0x81, 0xFF, 0xFF, 0xFF, 0xFF, 0x0, 0xFF, 0xFC, 0x3F, 0xFF, 0x0, 0xFF, 0xF0, 0x7F, 0xFF, 0x0, 0x3F, 0x0, 0xFF, 0xFF, 0x0, 0x0, 0x1, 0xFF, 0xFF, 0x0, 0x0, 0x7, 0xFF, 0xFF, 0x80, 0x0, 0x1F, 0xFF, 0xFF, 0x80, 0x0, 0xFF, 0xFF, 0xFF, 0xE0, 0x7, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF8 
        ]; // 39x43
        
        var bat = [
            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x0, 0x0, 0x0, 0x0, 0xFF, 0xC0, 0x0, 0x0, 0x0, 0xF, 0xF0, 0xFF, 0xFF, 0xFF, 0xE1, 0xFE, 0x3F, 0xFF, 0xFF, 0xFE, 0x3F, 0x47, 0xFF, 0xFF, 0xFF, 0xC7, 0xE8, 0xFF, 0xFF, 0xFF, 0xF8, 0xFD, 0x1F, 0xFF, 0xFF, 0xFF, 0x1F, 0xA3, 0xFF, 0xFF, 0xFF, 0xE3, 0xF4, 0x7F, 0xFF, 0xFF, 0xFC, 0x7E, 0x8F, 0xFF, 0xFF, 0xFF, 0x8F, 0xD1, 0xFF, 0xFF, 0xFF, 0xF1, 0xFA, 0x3F, 0xFF, 0xFF, 0xFE, 0x3F, 0x47, 0xFF, 0xFF, 0xFF, 0xC7, 0xE8, 0xFF, 0xFF, 0xFF, 0xF8, 0xFF, 0x1F, 0xFF, 0xFF, 0xFF, 0x1F, 0xE1, 0xFF, 0xFF, 0xFF, 0xC3, 0xFE, 0x0, 0x0, 0x0, 0x0, 0x7F, 0xE0, 0x0, 0x0, 0x0, 0x1F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF8 
        ]; // 43 x 39
        
        var batCels = [
            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0x3, 0x1, 0x80, 0xFF, 0xFF, 0xC0, 0x60, 0x30, 0x1F, 0xFF, 0xF8, 0xC, 0x6, 0x3, 0xFF, 0xFF, 0x1, 0x80, 0xC0, 0x7F, 0xFF, 0xE0, 0x30, 0x18, 0xF, 0xFF, 0xFC, 0x6, 0x3, 0x1, 0xFF, 0xFF, 0x80, 0xC0, 0x60, 0x3F, 0xFF, 0xF0, 0x18, 0xC, 0x7, 0xFF, 0xFE, 0x3, 0x1, 0x80, 0xFF, 0xFF, 0xC0, 0x60, 0x30, 0x1F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF8
        ]; // 43 x 39
        
        var corner = [0x0, 0x0, 0x38, 0xF3, 0xE7, 0xCF, 0x80 ]; // filled 7x7
        var cornerLine = [0x0, 0x0, 0x38, 0xF3, 0x86, 0xC, 0x0 ];
        
        handler.rotateScreenEl(270);
        
        
        var monitor = handler.setMonitor(0); // 4in2
        // monitor = monitors[2]; // 1.54
        
        var screen = handler.screenInit();
        handler.colorMode = monitor.colors.ALT1;
    
        handler.colorMode = monitor.colors.BLACK;
        
        handler.bufferFillRect(2, 2, screen.width - 4, screen.height - 4, true);            
        handler.bufferFillRect(2, 2, screen.width / 2, screen.height - 4, false);
        
        handler.colorMode = monitor.colors.BLACK;
        
        
        handler.colorMode = monitor.colors.BLACK;

        handler.bufferFillRect(2, 2 + 5, 2, screen.height - 14, true);
        handler.bufferFillRect(2 + 5, 2, screen.width - 16, 2, true);
        handler.bufferFillRect(2 + 5, screen.height - 4, screen.width - 16, 2, true);
                    
        handler.renderImageArrayToBuffer(cornerLine, 0, 0, 7, 7, false, false, true, true);
        handler.renderImageArrayToBuffer(cornerLine, 0, screen.height - 7 - 1, 7, 7, false, true, true, true);
        handler.renderImageArrayToBuffer(corner, screen.width - 2 - 7, 1, 7, 7, true, false, false);
        handler.renderImageArrayToBuffer(corner, screen.width - 2 - 7, screen.height - 2 - 7 , 7, 7, true, true, false);
        
        
        var localWidth = 300;
        var localHeight = 400;
        handler.rotate = 90;
       
        var theight = 34;
        var twidthTitle = 90;
        
        handler.drawString(10, theight - 20, 'дом', fontData_cbold17x17, false);
        handler.drawString(twidthTitle + 88, theight - 20, 'влажность', fontData_cbold17x17, false);
        handler.drawString(twidthTitle + 88, theight, '50%', fontData_cbold44x44, false);
        
        var twidth = handler.drawString(10, theight, '12.23', fontData_cbold44x44, false);
        
        handler.renderImageArrayToBuffer(c, 10 + twidth, theight + 4, 39, 43, false, false, false);
        
        twidth += 39;
        
        handler.renderImageArrayToBuffer(temp, 16 + twidth, theight - 20, 15, 68, false, false, false);
        
        handler.colorMode = monitor.colors.ALT1;       
        handler.renderImageArrayToBuffer(tempMeter, 16 + twidth, theight - 20, 15, 68, false, false, true, false, 0, 0, 0, 68);            
        handler.colorMode = monitor.colors.BLACK;
        
        theight += 74;
        
        street = true;
        
        if (street) {
        handler.bufferFillRect(0, theight, localWidth, 2, false);
        
        theight += 34;
        
        handler.drawString(10, theight - 20, 'улица', fontData_cbold17x17, false);
        handler.drawString(twidthTitle + 88, theight - 20, 'влажность', fontData_cbold17x17, false);
        handler.drawString(twidthTitle + 88, theight, '100%', fontData_cbold44x44, false);
        
        var twidth = handler.drawString(10, theight, '-12.23', fontData_cbold44x44, false);
        
        handler.renderImageArrayToBuffer(c, 10 + twidth, theight + 4, 39, 43, false, false, false);
        
        twidth += 39;
        
        handler.renderImageArrayToBuffer(temp, 16 + twidth, theight - 20, 15, 68, false, false, false);
                    
        handler.colorMode = monitor.colors.ALT1;
       
        handler.renderImageArrayToBuffer(tempMeter, 16 + twidth, theight - 20, 15, 68, false, false, true, false, 0, 0, 55, 68);
        
        handler.colorMode = monitor.colors.BLACK;
        
        theight += 54;
        
        }
        
        handler.colorMode = monitor.colors.BLACK;
        
        theight = localHeight / 2 + 4;
        
        var batPosX = localWidth - 10 - 40;
        var chargeLvl = 80;
        var cargeMinP = 10;
        var chargeMaxP = 36;
        var chargePixelsTotal = chargeMaxP - cargeMinP; 
        var chargePixels = chargePixelsTotal - (((chargePixelsTotal) / 100) * chargeLvl);
        handler.drawString(batPosX - 39, theight, chargeLvl + '%', fontData_cbold17x17, true);

        
        handler.renderImageArrayToBuffer(bat, batPosX, theight - 10, 43, 39, false, false, true);
                    
        handler.colorMode = monitor.colors.ALT1;
        
        handler.renderImageArrayToBuffer(batCels, batPosX, theight - 10, 43, 39, false, false, true, false, cargeMinP + chargePixels, chargeMaxP, 0, 0);
        
        handler.colorMode = monitor.colors.BLACK;
        
        //handler.drawString(28, theight + 20, '24 декабря', fontData_cbold44x44, true);
        
        theight = localHeight - 90;
        
 
        var dateWidth = handler.drawStringGetWidth('24 декабря, вт', fontData_cbold17x17);
        handler.drawString(Math.ceil((dateWidth - handler.drawStringGetWidth('20:15', fontData_cbold44x44)) / 2), theight, '20:15', fontData_cbold44x44, true);
        
        theight += 44;
		
		var testDate = '02.05.' + new Date().getFullYear();
        handler.drawString( Math.ceil((dateWidth - handler.drawStringGetWidth(testDate, fontData_cbold17x17)) / 2), theight, testDate, fontData_cbold17x17, true);
        
        theight += 17;
        handler.drawString(Math.ceil((dateWidth - handler.drawStringGetWidth('02 мая, пн', fontData_cbold17x17)) / 2), theight, '02 мая, пн', fontData_cbold17x17, true);
        theight += 17;
        
        
        var hpad = 0;
        // handler.drawString(10, theight, '24 декабря, вт', fontData_cbold17x17, true);
        
        // old format
        handler.renderImageArrayToBuffer(cat115x125, localWidth - 125, localHeight - 125 - 2, 115, 125, false, false, true, false, 0, 0, 0, 0, false);
       
       
       
        // hpad = 132 - 2;
        // handler.renderImageArrayToBuffer(catfeed125x127, localWidth - 150, localHeight - hpad, 125, 127, false, false, true, false, 0, 0, 0, 0, false);

        
        // hpad = 94 - 2;
        // handler.renderImageArrayToBuffer(cathp80x94, localWidth - 105, localHeight - hpad, 80, 94, false, false, true, false, 0, 0, 0, 0, false);
        // hpad -= 20;
        
        //hpad = 97 - 2;
        //handler.renderImageArrayToBuffer(cat93x97, localWidth - 105, localHeight - 97 - 2, 93, 97, false, false, true, false, 0, 0, 0, 0, false);
        //hpad -= 20;
        
        //hpad = 97 - 2;
        //handler.renderImageArrayToBuffer(catvamp88x100, localWidth - 105, localHeight - hpad, 88, 100, false, false, true, false, 0, 0, 0, 0, false);
        //hpad -= 20;
        
        // hpad = 72+8;
        // handler.renderImageArrayToBuffer(catsleep96x72, localWidth - 125, localHeight - hpad, 96, 72, false, false, true, false, 0, 0, 0, 0, false);
        // hpad -= 10;
              
        //hpad += 90; 
        //handler.renderImageArrayToBuffer(sunclear68x66, localWidth - 100, localHeight - hpad, 68, 66, false, false, true, false, 0, 0, 0, 0, false);
          
        
        // hpad += 80; 
        // handler.renderImageArrayToBuffer(moonclear93x63, localWidth - 125, localHeight - hpad, 93, 63, false, false, true, false, 0, 0, 0, 0, false);
        
        //  hpad += 60; 
        // handler.renderImageArrayToBuffer(catsnow116x39, localWidth - 125, localHeight - hpad, 116, 39, false, false, true, false, 0, 0, 0, 0, false);
        
        handler.screenUpdate();
        
}