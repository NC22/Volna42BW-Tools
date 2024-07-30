const char webdata_clienthttpproto_js[] PROGMEM = "function gid(n) { return document.getElementById(n);}function lloc(n) { return typeof ENVDATA[\"loc_\" + ENVDATA.lng][n] == 'undefined' ? n : ENVDATA[\"loc_\" + ENVDATA.lng][n];} KellyTools = {};KellyTools.detectLanguage = function() {	 var language = window.navigator.userLanguage || window.navigator.language; if (language) { if (language.indexOf('-') != -1) language = language.split('-')[0];  language = language.trim(); ENVDATA.lng = language;  } else ENVDATA.lng = 'en';  if (typeof ENVDATA[\"loc_\" + ENVDATA.lng] == \"undefined\") { ENVDATA.lng = 'en';  }  return ENVDATA.lng;}KellyTools.getParentByClass = function(el, className) {  var parent = el;  while (parent && !parent.classList.contains(className)) { parent = parent.parentElement; }  return parent;}; KellyTools.cfetch = function(url, cfg, callback) {  fetch(url, cfg).then(function(response) { if (response.status == 200) {  if (cfg.responseType == 'blob') return response.blob().then(callback); else if (cfg.responseType == 'json') return response.json().then(callback); else if (cfg.responseType == 'text') return response.text().then(callback); else if (cfg.responseType == 'binary' || cfg.responseType == 'arrayBuffer') return response.arrayBuffer().then(callback); } else {   callback(false, 'Устройство не доступно ' + response.status); }  }).then(function(text) {}) .catch(function(error) { callback(false, error); }); };KellyTools.getSelectWidget = function(cfg) {  var wg = {};  wg.create = function(cfg) {  wg.cfg = cfg; if (cfg.list) wg.list = cfg.list; wg.inputEl = gid(cfg.inputId);  wg.selected = []; wg.containerEl = gid(cfg.cId); }  wg.commit = function() {  var result = ''; for (var i = 0; i < wg.selected.length; i++) { result += (result ? ',' : '') + wg.list[i][wg.valueIndex]; if (!wg.cfg.multiselect) break; } wg.inputEl.value = result; }  wg.updateList = function() {  if (wg.lastError) {  wg.containerEl.innerText = 'Не удалось загрузить список : ' + wg.lastError;  } else if (!wg.list) {  wg.containerEl.innerText = 'Ошибка обработки данных списка';  } else {  var html = ''; if (wg.list.length <= 0) { html += 'Список пуст'; }  for (var i = 0; i < wg.list.length; i++) {  var htmlTitle = wg.cfg.tpl; for (var b = 0; b < wg.list[i].length; b++) { htmlTitle = htmlTitle.replace('#' + b + '#', wg.list[i][b]); }  html += '<li class=\"dselect-item' + (wg.selected.indexOf(i) != -1 ? ' selected' : '') + '\" data-index=\"' + i + '\" data-value=\"' + wg.list[i][1] +' \">'; html += htmlTitle + '</li>'; }  wg.containerEl.innerHTML = html; var items = wg.containerEl.getElementsByClassName('dselect-item'); for (var i = 0; i < items.length; i++) {  items[i].onclick = function() {  var index = parseInt(this.getAttribute('data-index'));  if (wg.selected.indexOf(index) == -1) { this.classList.remove('selected'); if (wg.cfg.multiselect) wg.selected.push(index); else wg.selected = [index];  } else { wg.selected.splice(index, 1); this.classList.add('selected'); }  wg.commit(); } }  } }  wg.show = function() {  if (!wg.list) {  wg.containerEl.classList.add('loading'); wg.lastError = false;  KellyTools.cfetch(wg.cfg.getListUrl, {method: 'GET', responseType : 'json'}, function(response, error) { if (response) {  wg.list = response; wg.updateList();  } else {  wg.lastError = error; wg.updateList(); } }); } else { wg.updateList(); } }  wg.create(cfg); return wg;} KellyTools.getListWidget = function(cfg) {  var wg = {};  wg.create = function(cfg) {  wg.cfg = cfg;  wg.inputEl = gid(cfg.inputId); wg.itemsArr = wg.inputEl.value.trim().length <= 0 ? [] : wg.inputEl.value.split(',');  wg.containerEl = gid(cfg.cId); if (cfg.editable) { wg.containerEl.classList.add('dtl-list-editable'); }   wg.stateEl = false; wg.stateArr = false;  if (cfg.states) { wg.stateEl = gid(cfg.inputId + 'Enabled'); wg.stateArr = wg.itemsArr.length <= 0 ? [] : wg.stateEl.value.split(','); }  }  wg.getIndex = function(el) { return parseInt(KellyTools.getParentByClass(el, 'data-list-item').getAttribute('data-index')); }  wg.commit = function() { wg.inputEl.value = wg.itemsArr.join(','); if (wg.stateEl) { wg.stateEl.value = wg.stateArr.join(','); } }  wg.render = function() {   var html = '';  for (var i = 0; i < wg.itemsArr.length; i++) {  var k = cfg.cId + '-' + i; html += '<div class=\"data-list-item\" id=\"dtl-' + k + '\" data-index=\"' + i + '\" data-input=\"' + cfg.inputId + '\">';  html += '<label for=\"dtl-enabled-' + k + '\">';  if (cfg.states) { html += '<input type=\"checkbox\" class=\"dtl-enabled\" id=\"dtl-enabled-' + k +'\" ' + (parseInt(wg.stateArr[i]) > 0 ? 'checked' : '') + '>'; }  html += '<div class=\"dtl-name\">';  if (cfg.editable) {   html += '<div class=\"k-options-row-input\"><input class=\"dtl-input\" type=\"text\" value=\"' + wg.itemsArr[i] + '\"></div>';  } else {  html += '<span class=\"dtl-name\">' + lloc(cfg.locPrefix + wg.itemsArr[i]) + '</span>'; }  html += '</div>';  if (cfg.editable) {  html += '<button class=\"dtl-delete\">x</button>';  }  if (cfg.orderChange) {  html += '<div class=\"dtl-actions\">'; html += '<button class=\"dtl-priority dtl-priority-up\">▲</button>'; html += '<button class=\"dtl-priority dtl-priority-down\">▼</button>'; html += '</div>';  }  html += '</label>'; html += '</div>';   }  if (cfg.editable) { html += '<div class=\"k-options-row-input dtl-add-row\">'; html += '<button class=\"dtl-add\">+</button></div>'; }  wg.containerEl.innerHTML = html;  var mInputs = wg.containerEl.getElementsByClassName('dtl-priority'); for (var i = mInputs.length-1; i >= 0; i--) { mInputs[i].onclick = function() {   var up = this.classList.contains('dtl-priority-up'); var index = wg.getIndex(this); var value = wg.itemsArr[index];  if (index == -1 || (up && index == 0)) { return false; }  if (!up && index == wg.itemsArr.length - 1) { return false; }  if (!up && index == wg.itemsArr.length - 1) { return false; }  var switchIndex = up ? index - 1 : index + 1; var switchValue = wg.itemsArr[switchIndex];   inputArr[index] = switchValue; inputArr[switchIndex] = value;  if (wg.stateArr) { var switchState = wg.stateArr[switchIndex];  var state = wg.stateArr[index];  wg.stateArr[index] = switchState; wg.stateArr[switchIndex] = state; }  var itemEl = document.getElementById('dtl-' + cfg.cId + '-' + index); var itemIndexEl = itemEl.getElementsByClassName('dtl-index'); itemIndexEl[0].innerText = switchIndex+1;  var switchItemEl = document.getElementById('dtl-' + cfg.cId + '-' + switchIndex); var switchItemIndexEl = switchItemEl.getElementsByClassName('dtl-index'); switchItemIndexEl[0].innerText = index+1;  if (up) itemEl.parentNode.insertBefore(itemEl, switchItemEl); else itemEl.parentNode.insertBefore(switchItemEl, itemEl);  itemEl.classList.add('fade'); switchItemEl.classList.add('fade'); setTimeout(function() { itemEl.classList.remove('fade'); switchItemEl.classList.remove('fade'); }, 200);  return false; }; }  var mInputs = wg.containerEl.getElementsByClassName('dtl-enabled'); for (var i = mInputs.length-1; i >= 0; i--) { mInputs[i].onchange = function() { wg.stateArr[wg.getIndex(this)] = this.checked ? '1' : '0'; wg.commit(); } }  if (cfg.editable) { wg.containerEl.getElementsByClassName('dtl-add')[0].onclick = function() {  wg.itemsArr.push(wg.cfg.defaultInput);  if (wg.stateEl) { wg.stateArr.push(defaultState); }  wg.commit(); wg.render();  };   mInputs = wg.containerEl.getElementsByClassName('dtl-input'); for (var i = mInputs.length-1; i >= 0; i--) { mInputs[i].onchange = function() { wg.itemsArr[wg.getIndex(this)] = this.value; wg.commit(); }; }  mInputs = wg.containerEl.getElementsByClassName('dtl-delete'); for (var i = mInputs.length-1; i >= 0; i--) { mInputs[i].onclick = function() { var index = wg.getIndex(this); wg.itemsArr.splice(index, 1);  if (wg.stateEl) { wg.stateArr.splice(index, 1); }  wg.commit(); wg.render();  }; } } }  wg.create(cfg); return wg;} function KellyClockEnv(env) {  var handler = this;  var env = env; var lng;  var cVarCls = 'kelly-commitable-option';  var urlSave = '/commit'; var urlGetWifi = '/wifiList';  var hiddenKeys = ['modeList', 'modeListEnabled', 'ntpHosts', 'externalHosts']; var listKeys = ['modeList', 'ntpHosts', 'externalHosts'];  function showTitle() {  handler.page = document.getElementById('page');  handler.title = lloc('title'); handler.titleHtml = '<span class=\"kelly-app-name\">' + handler.title + '</span><span class=\"kelly-copyright\">created by <a href=\"https:  document.title = handler.title;  document.getElementById('header').innerHTML = handler.titleHtml; }  function showNotice(notice, error) {  var result = gid('result'); result.innerText = notice; result.classList.add('show');  error ? result.classList.add('error') : result.classList.remove('error'); }  function hideSpoiler(key) { document.getElementById('spoiler-__' + key + '__').classList.remove('show'); }  function initHelps() {  }  function initSpoilers() {  var spoilers = document.getElementsByClassName('k-options-additions-show'); for (var i = 0; i < spoilers.length; i++) { spoilers[i].onclick = function(e) {  if (e.target.classList.contains('k-options-row-help')) return;  var additions = document.getElementById(this.getAttribute('data-for')); additions.classList.contains('show') ? additions.classList.remove('show') : additions.classList.add('show');  };  } }  function saveForm() {  var cOptions = document.getElementsByClassName(cVarCls); var formData = new FormData();  for (var i = 0; i < cOptions.length; i++) { formData.append(cOptions[i].getAttribute('data-key'), cOptions[i].value);  console.log(cOptions[i].getAttribute('data-key') + ' :: ' + cOptions[i].value) }  KellyTools.cfetch(urlSave, {method : 'POST', body : formData, responseType : 'text'}, function(response, error) { showNotice(response ? text : 'Устройство не доступно : ' + error);  });  }  function showPage() {  var html = '';  showTitle();  for (var key in env.cfg) {  var helpHtml = ''; if (typeof env[\"loc_\" + lng]['cfg_' + key + '_help'] != 'undefined') { helpHtml = '&nbsp;&nbsp;<a href=\"#\" class=\"k-options-row-help\" data-help=\"cfg_' + key + '_help\">(?)</a>'; }  if (key.indexOf('_/') === 0) {  if (key == '_/wifi') {  html += '<div class=\"wList\">'; html += '<a href=\"#\" id=\"wList-get\">Показать список WiFi сетей</a><ul id=\"wList-items\"></ul>'; html += '</div>'; }  html += '</div></div>';  } else if (key.indexOf('_') === 0) {  html += '<button class=\"k-options-additions-show\" data-for=\"spoiler-' + key + '\">' + lloc('cfg_' + key) + helpHtml + '</button>'; html += '<div class=\"k-options-additions-wrap\" id=\"spoiler-' + key + '\"><div class=\"k-options-additions\">';  if (key == '_text') {   } else if (key == '_log') {   } } else {  var inputType = 'text';  if (env.cfg[key].secret) inputType = 'password'; else if (hiddenKeys.indexOf(key) != -1) inputType = 'hidden';  if (listKeys.indexOf(key) != -1) {  html += '<div class=\"k-options-row-title\">' + lloc('cfg_' + key) + '</div>' html += '<div class=\"dtl-list-container\" id=\"k-options-' + key + '-Manager\"></div>'; }  if (inputType == 'hidden') { html += '<input type=\"hidden\" data-key=\"' + key + '\" class=\"' + cVarCls + '\" id=\"option-' + key + '\" value=\"' + env.cfg[key].value + '\">'; continue; }   var title = lloc('cfg_' + key) + helpHtml;  var htmlCheckbox = '';  if (env.cfg[key].type == \"bool\") {  html += '<input type=\"checkbox\" data-key=\"' + key + '\" class=\"' + cVarCls + '\" id=\"option-' + key + '-enabled\" ' + (env.cfg[key].value ? 'checked' : '') +'> '; }   var htmlHeader = '<div class=\"k-options-row' + '\"><div class=\"k-options-row-title\"><label>' + htmlCheckbox + title + '</label></div>';  if (env.cfg[key].type == \"bool\") {  html += htmlHeader + '</div>';  } else if (env.cfg[key].type != 'action') {  html += htmlHeader; html += '<div class=\"k-options-row-input\">'; html += '<input class=\"' + cVarCls + '\" type=\"' + inputType + '\" data-type=\"' + env.cfg[key].type + '\" '; html += 'data-key=\"' + key + '\" id=\"option-' + key + '\" placeholder=\"' + title + '\" value=\"' + env.cfg[key].value + '\">'; html += '</div>' + '</div>';  } else {  html += '<a class=\"k-options-action\" href=\"#\">' + lloc(key) + '</a>'; } }  }  html += '<div class=\"k-options-save\"><button id=\"commit\">' + lloc('save') + '</button></div>'; html += '<div id=\"result\"></div>';  handler.page.innerHTML = html; handler.modeList = KellyTools.getListWidget({  locPrefix : 'mode_',  states : true, orderChange : true, editable : false,  inputId : 'option-modeList',  cId : 'k-options-modeList-Manager', }); handler.modeList.render();  handler.ntpList = KellyTools.getListWidget({  locPrefix : 'mode_', editable : true,  inputId : 'option-ntpHosts',  cId : 'k-options-ntpHosts-Manager', defaultInput : '', }); handler.ntpList.render();  handler.eHostsList = KellyTools.getListWidget({  locPrefix : 'mode_',  editable : true,  inputId : 'option-externalHosts',  cId : 'k-options-externalHosts-Manager', defaultInput : '', }); handler.eHostsList.render();  handler.wifiSelect = KellyTools.getSelectWidget({ tpl : '<div class=\"lvl lvl#0#\"><div></div><div></div><div></div></div><a href=\"#\">#1#</a>', valueIndex : 2, list : [[3, 'RetroWave', 'test'], [1, 'test2', 'test'], [2, 'test3', 'test'],[0, 'Hydro', 'test'],], cId : 'wList-items', inputId : 'option-externalHosts',  });  gid('wList-get').onclick = handler.wifiSelect.show;  gid('commit').onclick = saveForm;  initSpoilers();  initHelps(); }  this.init = function() { lng = KellyTools.detectLanguage(); showPage(); } }var ENV = new KellyClockEnv(ENVDATA); ENV.init();";
const unsigned int webdataSize_clienthttpproto_js PROGMEM = 13654;