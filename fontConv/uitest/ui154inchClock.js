function testUI1in54Clock() {  
        
        var handler = controller;
        
        handler.rotateScreenEl(270);
        
        
        var monitor = handler.setMonitor(2); // 4in2
        // monitor = monitors[2]; // 1.54
        
        var screen = handler.screenInit();
    
        handler.colorMode = monitor.colors.BLACK;
  
        var localWidth = 200;
        var localHeight = 200;
        handler.rotate = 90;
       
        var theight = 20;
        var twidthTitle = 90;
              
        var t = '24 декабря, вт';
        var x = (localWidth - handler.drawStringGetWidth(t, fontData_cbold18x18)) / 2;
            x = Math.floor(x);
        handler.drawString(x, 200-64, t, fontData_cbold18x18, true);
        
        var t = '00:15:12';
        var x = (localWidth - handler.drawStringGetWidth(t, fontData_cbold44x44)) / 2;
            x = Math.floor(x);
        handler.drawString(x, 200-48, t, fontData_cbold44x44, true);
        
        handler.renderImageArrayToBuffer(frog174x139, 0, 0, 174, 139, false, false, true, false, 0, 0, 0, 0, false);
       
   
        handler.screenUpdate();
        
}