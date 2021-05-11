/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */(function(modules){function webpackJsonpCallback(data){var chunkIds=data[0];var moreModules=data[1];var moduleId,chunkId,i=0,resolves=[];for(;i<chunkIds.length;i++){chunkId=chunkIds[i];if(Object.prototype.hasOwnProperty.call(installedChunks,chunkId)&&installedChunks[chunkId]){resolves.push(installedChunks[chunkId][0])}installedChunks[chunkId]=0}for(moduleId in moreModules){if(Object.prototype.hasOwnProperty.call(moreModules,moduleId)){modules[moduleId]=moreModules[moduleId]}}if(parentJsonpFunction)parentJsonpFunction(data);while(resolves.length){resolves.shift()()}}var installedModules={};var installedChunks={0:0};function jsonpScriptSrc(chunkId){return __webpack_require__.p+"licenseManagement.chunk."+chunkId+".js"}function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.e=function requireEnsure(chunkId){var promises=[];var installedChunkData=installedChunks[chunkId];if(installedChunkData!==0){if(installedChunkData){promises.push(installedChunkData[2])}else{var promise=new Promise((function(resolve,reject){installedChunkData=installedChunks[chunkId]=[resolve,reject]}));promises.push(installedChunkData[2]=promise);var script=document.createElement("script");var onScriptComplete;script.charset="utf-8";script.timeout=120;if(__webpack_require__.nc){script.setAttribute("nonce",__webpack_require__.nc)}script.src=jsonpScriptSrc(chunkId);var error=new Error;onScriptComplete=function(event){script.onerror=script.onload=null;clearTimeout(timeout);var chunk=installedChunks[chunkId];if(chunk!==0){if(chunk){var errorType=event&&(event.type==="load"?"missing":event.type);var realSrc=event&&event.target&&event.target.src;error.message="Loading chunk "+chunkId+" failed.\n("+errorType+": "+realSrc+")";error.name="ChunkLoadError";error.type=errorType;error.request=realSrc;chunk[1](error)}installedChunks[chunkId]=undefined}};var timeout=setTimeout((function(){onScriptComplete({type:"timeout",target:script})}),12e4);script.onerror=script.onload=onScriptComplete;document.head.appendChild(script)}}return Promise.all(promises)};__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{enumerable:true,get:getter})}};__webpack_require__.r=function(exports){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(exports,"__esModule",{value:true})};__webpack_require__.t=function(value,mode){if(mode&1)value=__webpack_require__(value);if(mode&8)return value;if(mode&4&&typeof value==="object"&&value&&value.__esModule)return value;var ns=Object.create(null);__webpack_require__.r(ns);Object.defineProperty(ns,"default",{enumerable:true,value:value});if(mode&2&&typeof value!="string")for(var key in value)__webpack_require__.d(ns,key,function(key){return value[key]}.bind(null,key));return ns};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";__webpack_require__.oe=function(err){console.error(err);throw err};var jsonpArray=window["licenseManagement_bundle_jsonpfunction"]=window["licenseManagement_bundle_jsonpfunction"]||[];var oldJsonpFunction=jsonpArray.push.bind(jsonpArray);jsonpArray.push=webpackJsonpCallback;jsonpArray=jsonpArray.slice();for(var i=0;i<jsonpArray.length;i++)webpackJsonpCallback(jsonpArray[i]);var parentJsonpFunction=oldJsonpFunction;return __webpack_require__(__webpack_require__.s=5)})([function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"PLUGIN",(function(){return PLUGIN}));__webpack_require__.d(__webpack_exports__,"API_BASE_PATH",(function(){return API_BASE_PATH}));__webpack_require__.d(__webpack_exports__,"EXTERNAL_LINKS",(function(){return EXTERNAL_LINKS}));__webpack_require__.d(__webpack_exports__,"APP_PERMISSION",(function(){return APP_PERMISSION}));var external_kbnSharedDeps_KbnI18n_=__webpack_require__(1);const PLUGIN={title:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.licenseMgmt.managementSectionDisplayName",{defaultMessage:"License Management"}),id:"license_management"};const API_BASE_PATH="/api/license";const ELASTIC_BASE_URL="https://www.elastic.co/";const EXTERNAL_LINKS={SUBSCRIPTIONS:`${ELASTIC_BASE_URL}subscriptions`,TRIAL_EXTENSION:`${ELASTIC_BASE_URL}trialextension`,TRIAL_LICENSE:`${ELASTIC_BASE_URL}legal/trial_license`};const APP_PERMISSION="cluster:manage"},function(module,exports){module.exports=__kbnSharedDeps__.KbnI18n},function(module,exports,__webpack_require__){"use strict";var isOldIE=function isOldIE(){var memo;return function memorize(){if(typeof memo==="undefined"){memo=Boolean(window&&document&&document.all&&!window.atob)}return memo}}();var getTarget=function getTarget(){var memo={};return function memorize(target){if(typeof memo[target]==="undefined"){var styleTarget=document.querySelector(target);if(window.HTMLIFrameElement&&styleTarget instanceof window.HTMLIFrameElement){try{styleTarget=styleTarget.contentDocument.head}catch(e){styleTarget=null}}memo[target]=styleTarget}return memo[target]}}();var stylesInDom=[];function getIndexByIdentifier(identifier){var result=-1;for(var i=0;i<stylesInDom.length;i++){if(stylesInDom[i].identifier===identifier){result=i;break}}return result}function modulesToDom(list,options){var idCountMap={};var identifiers=[];for(var i=0;i<list.length;i++){var item=list[i];var id=options.base?item[0]+options.base:item[0];var count=idCountMap[id]||0;var identifier="".concat(id," ").concat(count);idCountMap[id]=count+1;var index=getIndexByIdentifier(identifier);var obj={css:item[1],media:item[2],sourceMap:item[3]};if(index!==-1){stylesInDom[index].references++;stylesInDom[index].updater(obj)}else{stylesInDom.push({identifier:identifier,updater:addStyle(obj,options),references:1})}identifiers.push(identifier)}return identifiers}function insertStyleElement(options){var style=document.createElement("style");var attributes=options.attributes||{};if(typeof attributes.nonce==="undefined"){var nonce=true?__webpack_require__.nc:undefined;if(nonce){attributes.nonce=nonce}}Object.keys(attributes).forEach((function(key){style.setAttribute(key,attributes[key])}));if(typeof options.insert==="function"){options.insert(style)}else{var target=getTarget(options.insert||"head");if(!target){throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.")}target.appendChild(style)}return style}function removeStyleElement(style){if(style.parentNode===null){return false}style.parentNode.removeChild(style)}var replaceText=function replaceText(){var textStore=[];return function replace(index,replacement){textStore[index]=replacement;return textStore.filter(Boolean).join("\n")}}();function applyToSingletonTag(style,index,remove,obj){var css=remove?"":obj.media?"@media ".concat(obj.media," {").concat(obj.css,"}"):obj.css;if(style.styleSheet){style.styleSheet.cssText=replaceText(index,css)}else{var cssNode=document.createTextNode(css);var childNodes=style.childNodes;if(childNodes[index]){style.removeChild(childNodes[index])}if(childNodes.length){style.insertBefore(cssNode,childNodes[index])}else{style.appendChild(cssNode)}}}function applyToTag(style,options,obj){var css=obj.css;var media=obj.media;var sourceMap=obj.sourceMap;if(media){style.setAttribute("media",media)}else{style.removeAttribute("media")}if(sourceMap&&btoa){css+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))))," */")}if(style.styleSheet){style.styleSheet.cssText=css}else{while(style.firstChild){style.removeChild(style.firstChild)}style.appendChild(document.createTextNode(css))}}var singleton=null;var singletonCounter=0;function addStyle(obj,options){var style;var update;var remove;if(options.singleton){var styleIndex=singletonCounter++;style=singleton||(singleton=insertStyleElement(options));update=applyToSingletonTag.bind(null,style,styleIndex,false);remove=applyToSingletonTag.bind(null,style,styleIndex,true)}else{style=insertStyleElement(options);update=applyToTag.bind(null,style,options);remove=function remove(){removeStyleElement(style)}}update(obj);return function updateStyle(newObj){if(newObj){if(newObj.css===obj.css&&newObj.media===obj.media&&newObj.sourceMap===obj.sourceMap){return}update(obj=newObj)}else{remove()}}}module.exports=function(list,options){options=options||{};if(!options.singleton&&typeof options.singleton!=="boolean"){options.singleton=isOldIE()}list=list||[];var lastIdentifiers=modulesToDom(list,options);return function update(newList){newList=newList||[];if(Object.prototype.toString.call(newList)!=="[object Array]"){return}for(var i=0;i<lastIdentifiers.length;i++){var identifier=lastIdentifiers[i];var index=getIndexByIdentifier(identifier);stylesInDom[index].references--}var newLastIdentifiers=modulesToDom(newList,options);for(var _i=0;_i<lastIdentifiers.length;_i++){var _identifier=lastIdentifiers[_i];var _index=getIndexByIdentifier(_identifier);if(stylesInDom[_index].references===0){stylesInDom[_index].updater();stylesInDom.splice(_index,1)}}lastIdentifiers=newLastIdentifiers}}},function(module,exports,__webpack_require__){"use strict";module.exports=function(useSourceMap){var list=[];list.toString=function toString(){return this.map((function(item){var content=cssWithMappingToString(item,useSourceMap);if(item[2]){return"@media ".concat(item[2]," {").concat(content,"}")}return content})).join("")};list.i=function(modules,mediaQuery,dedupe){if(typeof modules==="string"){modules=[[null,modules,""]]}var alreadyImportedModules={};if(dedupe){for(var i=0;i<this.length;i++){var id=this[i][0];if(id!=null){alreadyImportedModules[id]=true}}}for(var _i=0;_i<modules.length;_i++){var item=[].concat(modules[_i]);if(dedupe&&alreadyImportedModules[item[0]]){continue}if(mediaQuery){if(!item[2]){item[2]=mediaQuery}else{item[2]="".concat(mediaQuery," and ").concat(item[2])}}list.push(item)}};return list};function cssWithMappingToString(item,useSourceMap){var content=item[1]||"";var cssMapping=item[3];if(!cssMapping){return content}if(useSourceMap&&typeof btoa==="function"){var sourceMapping=toComment(cssMapping);var sourceURLs=cssMapping.sources.map((function(source){return"/*# sourceURL=".concat(cssMapping.sourceRoot||"").concat(source," */")}));return[content].concat(sourceURLs).concat([sourceMapping]).join("\n")}return[content].join("\n")}function toComment(sourceMap){var base64=btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));var data="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);return"/*# ".concat(data," */")}},function(module,exports){module.exports=__kbnSharedDeps__.RxjsOperators},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_val_loader_dist_cjs_js_key_licenseManagement_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(6);var _node_modules_val_loader_dist_cjs_js_key_licenseManagement_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_val_loader_dist_cjs_js_key_licenseManagement_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__);__kbnBundles__.define("plugin/licenseManagement/public",__webpack_require__,16);__kbnBundles__.define("plugin/licenseManagement/common/constants",__webpack_require__,0)},function(module,exports,__webpack_require__){__webpack_require__.p=window.__kbnPublicPath__["licenseManagement"]},function(module,exports,__webpack_require__){switch(window.__kbnThemeTag__){case"v7dark":return __webpack_require__(8);case"v7light":return __webpack_require__(10);case"v8dark":return __webpack_require__(12);case"v8light":return __webpack_require__(14)}},function(module,exports,__webpack_require__){var api=__webpack_require__(2);var content=__webpack_require__(9);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(3);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".licFeature {\n  flex-grow: 1; }\n\n.licManagement__modal {\n  width: 70vw; }\n\n.licManagement__narrowText {\n  width: 240px; }\n\n.licManagement__ieFlex {\n  flex-shrink: 0; }\n",""]);module.exports=exports},function(module,exports,__webpack_require__){var api=__webpack_require__(2);var content=__webpack_require__(11);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(3);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".licFeature {\n  flex-grow: 1; }\n\n.licManagement__modal {\n  width: 70vw; }\n\n.licManagement__narrowText {\n  width: 240px; }\n\n.licManagement__ieFlex {\n  flex-shrink: 0; }\n",""]);module.exports=exports},function(module,exports,__webpack_require__){var api=__webpack_require__(2);var content=__webpack_require__(13);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(3);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".licFeature {\n  flex-grow: 1; }\n\n.licManagement__modal {\n  width: 70vw; }\n\n.licManagement__narrowText {\n  width: 240px; }\n\n.licManagement__ieFlex {\n  flex-shrink: 0; }\n",""]);module.exports=exports},function(module,exports,__webpack_require__){var api=__webpack_require__(2);var content=__webpack_require__(15);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(3);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".licFeature {\n  flex-grow: 1; }\n\n.licManagement__modal {\n  width: 70vw; }\n\n.licManagement__narrowText {\n  width: 240px; }\n\n.licManagement__ieFlex {\n  flex-shrink: 0; }\n",""]);module.exports=exports},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"LicenseManagementUIPluginSetup",(function(){return undefined}));__webpack_require__.d(__webpack_exports__,"LicenseManagementUIPluginStart",(function(){return undefined}));__webpack_require__.d(__webpack_exports__,"plugin",(function(){return public_plugin}));var external_kbnSharedDeps_RxjsOperators_=__webpack_require__(4);var constants=__webpack_require__(0);var external_kbnSharedDeps_KbnI18n_=__webpack_require__(1);function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class breadcrumbs_BreadcrumbService{constructor(){_defineProperty(this,"breadcrumbs",{dashboard:[],upload:[]});_defineProperty(this,"setBreadcrumbsHandler",void 0)}setup(setBreadcrumbsHandler){this.setBreadcrumbsHandler=setBreadcrumbsHandler;this.breadcrumbs.dashboard=[{text:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.licenseMgmt.dashboard.breadcrumb",{defaultMessage:"License management"}),href:`/`}];this.breadcrumbs.upload=[...this.breadcrumbs.dashboard,{text:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.licenseMgmt.upload.breadcrumb",{defaultMessage:"Upload"})}]}setBreadcrumbs(type){if(!this.setBreadcrumbsHandler){throw new Error(`BreadcrumbService#setup() must be called first!`)}const newBreadcrumbs=this.breadcrumbs[type]?[...this.breadcrumbs[type]]:[...this.breadcrumbs.home];const lastBreadcrumb=newBreadcrumbs.pop();newBreadcrumbs.push({...lastBreadcrumb,href:undefined});this.setBreadcrumbsHandler(newBreadcrumbs)}}function plugin_defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class plugin_LicenseManagementUIPlugin{constructor(initializerContext){this.initializerContext=initializerContext;plugin_defineProperty(this,"breadcrumbService",new breadcrumbs_BreadcrumbService)}setup(coreSetup,plugins){const config=this.initializerContext.config.get();if(!config.ui.enabled){return{enabled:false}}const{getStartServices:getStartServices}=coreSetup;const{management:management,licensing:licensing}=plugins;management.sections.section.stack.registerApp({id:constants["PLUGIN"].id,title:constants["PLUGIN"].title,order:0,mount:async({element:element,setBreadcrumbs:setBreadcrumbs,history:history})=>{const[coreStart,{telemetry:telemetry}]=await getStartServices();const initialLicense=await plugins.licensing.license$.pipe(Object(external_kbnSharedDeps_RxjsOperators_["first"])()).toPromise();const{docLinks:docLinks,chrome:{docTitle:docTitle}}=coreStart;const appDocLinks={security:docLinks.links.security.elasticsearchSettings};docTitle.change(constants["PLUGIN"].title);this.breadcrumbService.setup(setBreadcrumbs);const appDependencies={core:coreStart,config:config,plugins:{licensing:licensing,telemetry:telemetry},services:{breadcrumbService:this.breadcrumbService,history:history},store:{initialLicense:initialLicense},docLinks:appDocLinks};const{renderApp:renderApp}=await __webpack_require__.e(1).then(__webpack_require__.bind(null,102));const unmountAppCallback=renderApp(element,appDependencies);return()=>{docTitle.reset();unmountAppCallback()}}});return{enabled:true}}start(){}stop(){}}var application=__webpack_require__(7);const public_plugin=ctx=>new plugin_LicenseManagementUIPlugin(ctx)},function(module,exports){module.exports=__kbnSharedDeps__.React},function(module,exports){module.exports=__kbnSharedDeps__.ElasticEui},function(module,exports){module.exports=__kbnSharedDeps__.KbnI18nReact},function(module,exports){module.exports=__kbnSharedDeps__.ReactRouterDom},function(module,exports){module.exports=__kbnSharedDeps__.ReactDom},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,exports){module.exports=__kbnSharedDeps__.MomentTimezone},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/telemetryManagementSection/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))}]);