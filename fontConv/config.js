/*
Config for font converter
*/

window.ENV = {
    
    name : "KellyC Font Converter",
    version : "0.82",
    
    fonts : [
        // ["36px FontFamily HelveticaBold", "FontFamily HelveticaBold", 'HelveticaBold.woff'],
        // ["36px FontFamily HelveticaHeavy", "FontFamily HelveticaHeavy", 'HelveticaHeavy.woff'],
        // ["36px FontFamily HelveticaLight", "FontFamily HelveticaLight", 'HelveticaLight.woff'],
        // ["36px FontFamily HelveticaMedium", "FontFamily HelveticaMedium", 'HelveticaMedium.woff'],
        // ["36px FontFamily motorola1", "FontFamily motorola1", 'motorola1.ttf'],
        // ["36px FontFamily motorola2", "FontFamily motorola2", 'motorola2.ttf'],
        ["36px FontFamily comfortaa-bold", "FontFamily comfortaa-bold", 'comfortaa-bold.woff2', "https://fonts.google.com/specimen/Comfortaa/about", "Free, both for personal and commercial use", true],
        ["36px FontFamily pixel1", "FontFamily pixel1", 'pixel1.otf', false, "Pixel Digivolve (Neale Davidson) 2015. All Rights Reserved"],
        // ["36px FontFamily mono", "FontFamily mono", 'mono.ttf'],
        // ["36px FontFamily Minecraft", "FontFamily Minecraft", 'Minecraft.woff'],
        ["36px FontFamily Roboto-Bold", "FontFamily Roboto-Bold", 'Roboto-Bold.ttf', "https://fonts.google.com/specimen/Roboto/about", "Apache License, Version 2.0."],
        ["36px FontFamily Roboto-Light", "FontFamily Roboto-Light", 'Roboto-Light.ttf', "https://fonts.google.com/specimen/Roboto/about", "Apache License, Version 2.0."],
        ["36px FontFamily Roboto-Regular", "FontFamily Roboto-Regular", 'Roboto-Regular.ttf', "https://fonts.google.com/specimen/Roboto/about", "Apache License, Version 2.0."],
        //  ["36px FontFamily Oxygen", "FontFamily Oxygen", 'oxygen.woff2'],
        ["36px FontFamily FreeMono", "FontFamily FreeMono", 'FreeMono.ttf', "https://en.wikipedia.org/wiki/GNU_FreeFont", "GNU FreeFont"],
        ["36px FontFamily FreeMonoBold", "FontFamily FreeMonoBold", 'FreeMonoBold.ttf', "https://en.wikipedia.org/wiki/GNU_FreeFont", "GNU FreeFont"],
        ["36px FontFamily Monocraft", "FontFamily Monocraft", 'Monocraft.ttf', "https://github.com/IdreesInc/Monocraft", "SIL Open Font License 1.1", true], 
        // ["36px FontFamily Bahamas", "FontFamily Bahamas", 'Bahamas.ttf'],
        ["36px FontFamily Awesome", "FontFamily Awesome", 'Awesome.ttf', "https://fontawesome.com/v4/license/", "GPL friendly | SIL OFL 1.1"],
    ],
    
    monitors : [
        {key : '4in2', width : 400, height : 300, colors : {WHITE : '#fff', BLACK : '#0d0f10', ALT1 : '#ff4243'}, bufferType : 'separate'},
        {key : '2in36', width : 256, height : 168, colors : {WHITE : '#c3ccd0', BLACK : '#0d0f10', ALT1 : '#ff4243', ALT2 : '#f5d534'}, bufferType : 'merged', bitPerPixel : 2},
        {key : '1in54', width : 200, height : 200, colors : {WHITE : '#c3ccd0', BLACK : '#0d0f10', ALT1 : '#ff4243'}, bufferType : 'separate'},
        {key : '2in13', width : 250, height : 122, colors : {WHITE : '#c3ccd0', BLACK : '#0d0f10', ALT1 : '#ff4243'}, bufferType : 'separate'}, // в демках картинка больше - 256 х 122, возможно ошибка парсинга - добавляет лишние байты
        {key : '4in2gray', width : 400, height : 300, colors : {WHITE : '#c3ccd0', BLACK : '#0d0f10', ALT1 : '#ababab', ALT2 : '#656565'}, bufferType : 'merged', bitPerPixel : 2},
        {key : 'custom', width : -1, height : -1, colors : {WHITE : '#c3ccd0', BLACK : '#0d0f10', ALT1 : '#ff4243'}, bufferType : 'separate'},
    ],
};
    