var ENVDATA ={ loc_en : {"cfg__wifi" : "Access to WiFi","cfg_wifiNetwork" : "Network name (SSID)","cfg_wifiPassword" : "Password","cfg__general" : "General options","cfg_timezone" : "Timezone","cfg_tempOffset" : "Temperature offset","cfg_modeList" : "Mode order","cfg__ntp" : "NTP Server","cfg_ntpHosts" : "Server #N#","cfg__external" : "External GET requests (http URL)","cfg__external_help" : "Отправляет GET запрос на указанный адрес, считывает данные и выводит на экран","cfg_externalHosts" : "Sensor #N#","cfg__mqtt" : "MQTT Server","cfg_mqttHost" : "Address","cfg_mqttPort" : "Port","cfg_mqttLogin" : "Login","cfg_mqttPassword" : "Password","cfg__screen" : "Screen controll","cfg_screenAutoTurnOff" : "Turn OFF time","cfg_screenAutoTurnOn" : "Turn ON time","cfg_screenContrast" : "Screen contrast (0-16)","cfg_screenRotate" : "Screen flip","form_text_send" : "Send","mode_time" : "Time","mode_date" : "Date","mode_temp" : "Temperature","mode_text" : "Text","mode_ext" : "External data","help" : "Tip","title" : "KellyC Clock","wifiSearch" : "Network search","save" : "Save changes","cfg__device" : "Device control","showText" : "Display text","showLog" : "Show log","reboot" : "Restart device","restore" : "Restore defaults",},loc_ru : {"cfg__wifi" : "Доступ к WiFi","cfg_wifiNetwork" : "Название сети (SSID)","cfg_wifiPassword" : "Пароль","cfg__general" : "Общие настройки","cfg_timezone" : "Часовой пояс","cfg_tempOffset" : "Корректировка температуры","cfg_modeList" : "Порядок режимов","cfg__ntp" : "Сервера точного времени (NTP)","cfg_ntpHosts" : "Список серверов :","cfg__external" : "Внешние GET запросы","cfg__external_help" : "Отправляет GET запрос на указанный адрес, считывает данные и выводит на экран","cfg_externalHosts" : "Список запросов (HTTP URL) :","cfg__mqtt" : "MQTT сервер","cfg_mqttHost" : "Адрес сервера","cfg_mqttPort" : "Порт","cfg_mqttLogin" : "Логин","cfg_mqttPassword" : "Пароль","cfg__screen" : "Управление экраном","cfg_screenAutoTurnOff" : "Время выключения","cfg_screenAutoTurnOn" : "Время включения","cfg_screenContrast" : "Яркость экрана (0-16)","cfg_screenRotate" : "Перевернуть экран","form_text_send" : "Отправить","mode_time" : "Время","mode_date" : "Дата","mode_temp" : "Температура","mode_text" : "Текст","mode_ext" : "Внешние данные","help" : "Подсказка","title" : "KellyC Clock","wifiSearch" : "Поиск WiFi сети","save" : "Сохранить изменения","cfg__device" : "Управление устройством","showText" : "Display text","showLog" : "Show log","reboot" : "Перезагрузить","restore" : "Сбросить настройки",},cfg : {"_wifi" : { key : "_wifi", type : "section", }, "wifiNetwork" : { key : "wifiNetwork", type : "var", varType : "string", defaultValue : "Retrovawe", value : "Retrovawe",}, "wifiPassword" : { key : "wifiPassword", secret : true, type : "var", varType : "string", defaultValue : "", value : " ",}, "_/wifi" : { key : "_/wifi", type : "section", }, "_general" : { key : "_general", type : "section", }, "timezone" : { key : "timezone", type : "var", varType : "string", defaultValue : "MSK-3", value : "MSK-3",}, "tempOffset" : { key : "tempOffset", type : "var", varType : "string", defaultValue : "0.0", value : "-1.56",}, "modeList" : { key : "modeList", type : "var", varType : "string", defaultValue : "date,time,temp", value : "date,time,temp",}, "modeListEnabled" : { key : "modeListEnabled", type : "var", varType : "string", defaultValue : "1,1,1", value : "1,1,1",}, "_/general" : { key : "_/general", type : "section", }, "_ntp" : { key : "_ntp", type : "section", }, "ntpHosts" : { key : "ntpHosts", type : "var", varType : "string", defaultValue : "pool.ntp.org", value : "pool.ntp.org",}, "_/ntp" : { key : "_/ntp", type : "section", }, "_external" : { key : "_external", type : "section", }, "externalHosts" : { key : "externalHosts", type : "var", varType : "int", defaultValue : "", value : "",}, "_/external" : { key : "_/external", type : "section", }, "_mqtt" : { key : "_mqtt", type : "section", }, "mqttHost" : { key : "mqttHost", type : "var", varType : "string", defaultValue : "", value : "1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1tyyyy1t",}, "mqttPort" : { key : "mqttPort", type : "var", varType : "int", defaultValue : "", value : "",}, "mqttLogin" : { key : "mqttLogin", type : "var", varType : "int", defaultValue : "", value : "",}, "mqttPassword" : { key : "mqttPassword", secret : true, type : "var", varType : "string", defaultValue : "", value : " ",}, "_/mqtt" : { key : "_/mqtt", type : "section", }, "_screen" : { key : "_screen", type : "section", }, "screenAutoTurnOff" : { key : "screenAutoTurnOff", type : "var", varType : "string", defaultValue : "", value : "",}, "screenAutoTurnOn" : { key : "screenAutoTurnOn", type : "var", varType : "int", defaultValue : "", value : "",}, "screenContrast" : { key : "screenContrast", type : "var", varType : "int", defaultValue : "2", value : "2",}, "screenRotate" : { key : "screenRotate", type : "var", varType : "int", defaultValue : "1", value : "1",}, "_/screen" : { key : "_/screen", type : "section", }, "_device" : { key : "_device", type : "section", }, "showText" : { key : "showText", type : "action", }, "showLog" : { key : "showLog", type : "action", }, "reboot" : { key : "reboot", type : "action", }, "restore" : { key : "restore", type : "action", }, "_/device" : { key : "_/device", type : "section", },}}