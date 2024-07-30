function testUI1in54() {  
        
        var handler = controller;
        
        fontData_cbold17x17 = fontData_cbold18x18;
        
        var mail = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x3F, 0xFC, 0x30, 0xC, 0x28, 0x14, 0x24, 0x24, 0x26, 0x64, 0x29, 0x94, 0x30, 0xC, 0x3F, 0xFC, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, ]; // 16x16;
        var temp = [
            0xFC, 0x7F, 0xF0, 0x7F, 0xC0, 0x7F, 0x9C, 0xFF, 0x39, 0xFE, 0x73, 0xFC, 0xE7, 0xF9, 0xCF, 0xF3, 0x9F, 0xE7, 0x3F, 0xCE, 0x7F, 0x9C, 0xFF, 0x39, 0xFE, 0x73, 0xFC, 0xE7, 0xF9, 0xCF, 0xF3, 0x9F, 0xE7, 0x3F, 0xCE, 0x7F, 0x9C, 0xFF, 0x39, 0xFE, 0x73, 0xFC, 0xE7, 0xF9, 0xCF, 0xF3, 0x9F, 0xE7, 0x3F, 0xCE, 0x7F, 0x9C, 0xFF, 0x39, 0xFE, 0x73, 0xFC, 0xE7, 0xF9, 0xCF, 0xF3, 0x9F, 0xE7, 0x3F, 0x8E, 0x3E, 0x3E, 0x38, 0xFE, 0x33, 0xFE, 0x4F, 0xFE, 0x1F, 0xFC, 0x3F, 0xF8, 0x7F, 0xF0, 0x7F, 0xC4, 0xFF, 0x98, 0xFE, 0x38, 0xF8, 0xF8, 0x3, 0xFC, 0x1F, 
        ]; // 15x48
        
        var tempMeter = [
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xE3, 0xFF, 0xC7, 0xFF, 0x8F, 0xFF, 0x1F, 0xFE, 0x3F, 0xFC, 0x7F, 0xF8, 0xFF, 0xF1, 0xFF, 0xE3, 0xFF, 0xC7, 0xFF, 0x8F, 0xFF, 0x1F, 0xFE, 0x3F, 0xFC, 0x7F, 0xF8, 0xFF, 0xF1, 0xFF, 0xE3, 0xFF, 0xC7, 0xFF, 0x8F, 0xFF, 0x1F, 0xFE, 0x3F, 0xFC, 0x7F, 0xF8, 0xFF, 0xF1, 0xFF, 0xE3, 0xFF, 0xC7, 0xFF, 0x8F, 0xFF, 0x1F, 0xFE, 0x3F, 0xFC, 0x7F, 0xF8, 0xFF, 0xF1, 0xFF, 0xC1, 0xFF, 0x1, 0xFC, 0x1, 0xF0, 0x1, 0xE0, 0x3, 0xC0, 0x7, 0x80, 0xF, 0x80, 0x3F, 0x0, 0x7F, 0x1, 0xFF, 0x7, 0xFF, 0xFF, 0xFF, 0xFF,          
        ]; // 15x48
        
        var tempMeterOutline = [
            0xFC, 0x1F, 0xFC, 0xE7, 0xFC, 0xF9, 0xFE, 0xFE, 0xFF, 0x7F, 0x7F, 0xBF, 0xBF, 0xDF, 0xDF, 0xEF, 0xEF, 0xF7, 0xF7, 0xFB, 0xFB, 0xFD, 0xFD, 0xFE, 0xFE, 0xFF, 0x7F, 0x7F, 0xBF, 0xBF, 0xDF, 0xDF, 0xEF, 0xEF, 0xF7, 0xF7, 0xFB, 0xFB, 0xFD, 0xFD, 0xFE, 0xFE, 0xFF, 0x7F, 0x7F, 0xBF, 0xBF, 0xDF, 0xDF, 0xEF, 0xEF, 0xF7, 0xF7, 0xFB, 0xFB, 0xFD, 0xFD, 0xFE, 0xFE, 0xFF, 0x7F, 0x7F, 0xBF, 0xBF, 0xDF, 0xDF, 0xEF, 0xEF, 0xF7, 0xF7, 0xFB, 0xFB, 0xF9, 0xFC, 0xF9, 0xFF, 0x39, 0xFF, 0xCD, 0xFF, 0xF4, 0xFF, 0xF8, 0xFF, 0xFE, 0x7F, 0xFF, 0x3F, 0xFF, 0x9F, 0xFF, 0xCF, 0xFF, 0xE3, 0xFF, 0xE5, 0xFF, 0xF6, 0x7F, 0xF3, 0x9F, 0xF3, 0xE3, 0xE3, 0xFC, 0x7, 0xC0 
        ]; // 17x50
        

        
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
        
        
        var monitor = handler.setMonitor(2); // 4in2
        // monitor = monitors[2]; // 1.54
        
        var screen = handler.screenInit();
        handler.colorMode = monitor.colors.ALT1;
    
        handler.colorMode = monitor.colors.BLACK;
        
         handler.bufferFillRect(2, 2, screen.width - 4, screen.height - 4, true);            
        handler.bufferFillRect(2, 2, 50, screen.height - 4, false);
        
        handler.colorMode = monitor.colors.BLACK;
        
        
        handler.colorMode = monitor.colors.BLACK;

        handler.bufferFillRect(2, 2 + 5, 2, screen.height - 14, true);
        handler.bufferFillRect(2 + 5, 2, screen.width - 16, 2, true);
        handler.bufferFillRect(2 + 5, screen.height - 4, screen.width - 16, 2, true);
                    
        handler.renderImageArrayToBuffer(cornerLine, 0, 0, 7, 7, false, false, true, true);
        handler.renderImageArrayToBuffer(cornerLine, 0, screen.height - 7 - 1, 7, 7, false, true, true, true);
        handler.renderImageArrayToBuffer(corner, screen.width - 2 - 7, 1, 7, 7, true, false, false);
        handler.renderImageArrayToBuffer(corner, screen.width - 2 - 7, screen.height - 2 - 7 , 7, 7, true, true, false);
        
        
        var localWidth = 200;
        var localHeight = 200;
        handler.rotate = 90;
       
        var theight = 20;
        var twidthTitle = 90;
        
        handler.drawString(10, theight - 20, 'температура', fontData_cbold17x17, false);

        
        var twidth = handler.drawString(10, theight, '12.23', fontData_cbold44x44, false);
        
        handler.drawString(10, theight + 70 - 20, 'влажность', fontData_cbold17x17, false);
        handler.drawString(10, theight + 70, '50%', fontData_cbold44x44, false);
        
        handler.renderImageArrayToBuffer(c, 10 + twidth, theight + 4, 39, 43, false, false, false);
        
        twidth += 39;
        
        handler.renderImageArrayToBuffer(temp, 16 + twidth, theight - 4, 15, 48, false, false, false);
        //handler.renderImageArrayToBuffer(tempMeterOutline, 16 + twidth - 1, theight - 4 - 1, 17, 50, false, false, false);
        handler.colorMode = monitor.colors.ALT1;       
        handler.renderImageArrayToBuffer(tempMeter, 16 + twidth, theight - 4, 15, 48, false, false, false, false);        
        handler.renderImageArrayToBuffer(tempMeter, 16 + twidth, theight - 4, 15, 48, false, false, true, false, 0, 0, 20, 48);            
        handler.colorMode = monitor.colors.BLACK;
                
        theight = localHeight - 50;
        
        //handler.rotate = 180;
        var batPosX = 48;
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
        handler.rotate = 90;
        // handler.drawString(28, theight + 20, '24 декабря', fontData_cbold44x44, true);
        
        theight = localHeight - 28;
        
 
        var dateWidth = 0; //handler.drawStringGetWidth('24 декабря, вт', fontData_cbold17x17);
        //handler.drawString(0 + Math.ceil((dateWidth - handler.drawStringGetWidth('20:15', fontData_cbold44x44)) / 2), theight, '20:15', fontData_cbold44x44, true);
        
        //theight += 44;
		var testDate = '20:15 вт, 03.12.' + new Date().getFullYear();
        handler.drawString(8, theight, testDate, fontData_cbold17x17, true);
        theight += 17;
        
        // handler.drawString(10, theight, '24 декабря, вт', fontData_cbold17x17, true);
        
        // handler.renderImageArrayToBuffer(cat115x125, localWidth - 100, localHeight - 125 - 2, 115, 125, false, false, true, false, 0, 0, 0, 0, false);
       
   
        handler.screenUpdate();
        
}