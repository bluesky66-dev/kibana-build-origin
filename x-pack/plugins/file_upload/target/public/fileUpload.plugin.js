/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */(function(modules){function webpackJsonpCallback(data){var chunkIds=data[0];var moreModules=data[1];var moduleId,chunkId,i=0,resolves=[];for(;i<chunkIds.length;i++){chunkId=chunkIds[i];if(Object.prototype.hasOwnProperty.call(installedChunks,chunkId)&&installedChunks[chunkId]){resolves.push(installedChunks[chunkId][0])}installedChunks[chunkId]=0}for(moduleId in moreModules){if(Object.prototype.hasOwnProperty.call(moreModules,moduleId)){modules[moduleId]=moreModules[moduleId]}}if(parentJsonpFunction)parentJsonpFunction(data);while(resolves.length){resolves.shift()()}}var installedModules={};var installedChunks={0:0};function jsonpScriptSrc(chunkId){return __webpack_require__.p+"fileUpload.chunk."+chunkId+".js"}function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.e=function requireEnsure(chunkId){var promises=[];var installedChunkData=installedChunks[chunkId];if(installedChunkData!==0){if(installedChunkData){promises.push(installedChunkData[2])}else{var promise=new Promise((function(resolve,reject){installedChunkData=installedChunks[chunkId]=[resolve,reject]}));promises.push(installedChunkData[2]=promise);var script=document.createElement("script");var onScriptComplete;script.charset="utf-8";script.timeout=120;if(__webpack_require__.nc){script.setAttribute("nonce",__webpack_require__.nc)}script.src=jsonpScriptSrc(chunkId);var error=new Error;onScriptComplete=function(event){script.onerror=script.onload=null;clearTimeout(timeout);var chunk=installedChunks[chunkId];if(chunk!==0){if(chunk){var errorType=event&&(event.type==="load"?"missing":event.type);var realSrc=event&&event.target&&event.target.src;error.message="Loading chunk "+chunkId+" failed.\n("+errorType+": "+realSrc+")";error.name="ChunkLoadError";error.type=errorType;error.request=realSrc;chunk[1](error)}installedChunks[chunkId]=undefined}};var timeout=setTimeout((function(){onScriptComplete({type:"timeout",target:script})}),12e4);script.onerror=script.onload=onScriptComplete;document.head.appendChild(script)}}return Promise.all(promises)};__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{enumerable:true,get:getter})}};__webpack_require__.r=function(exports){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(exports,"__esModule",{value:true})};__webpack_require__.t=function(value,mode){if(mode&1)value=__webpack_require__(value);if(mode&8)return value;if(mode&4&&typeof value==="object"&&value&&value.__esModule)return value;var ns=Object.create(null);__webpack_require__.r(ns);Object.defineProperty(ns,"default",{enumerable:true,value:value});if(mode&2&&typeof value!="string")for(var key in value)__webpack_require__.d(ns,key,function(key){return value[key]}.bind(null,key));return ns};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";__webpack_require__.oe=function(err){console.error(err);throw err};var jsonpArray=window["fileUpload_bundle_jsonpfunction"]=window["fileUpload_bundle_jsonpfunction"]||[];var oldJsonpFunction=jsonpArray.push.bind(jsonpArray);jsonpArray.push=webpackJsonpCallback;jsonpArray=jsonpArray.slice();for(var i=0;i<jsonpArray.length;i++)webpackJsonpCallback(jsonpArray[i]);var parentJsonpFunction=oldJsonpFunction;return __webpack_require__(__webpack_require__.s=6)})([function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return FileUploadPlugin}));var _get_file_upload_component__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(1);var _kibana_services__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2);class FileUploadPlugin{setup(core,plugins){Object(_kibana_services__WEBPACK_IMPORTED_MODULE_1__["e"])(core)}start(core,plugins){Object(_kibana_services__WEBPACK_IMPORTED_MODULE_1__["f"])(core,plugins);return{getFileUploadComponent:_get_file_upload_component__WEBPACK_IMPORTED_MODULE_0__["b"]}}}},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"b",(function(){return getFileUploadComponent}));let lazyLoadPromise;async function getFileUploadComponent(){if(typeof lazyLoadPromise!=="undefined"){return lazyLoadPromise}lazyLoadPromise=new Promise(async resolve=>{const{JsonUploadAndParse:JsonUploadAndParse}=await __webpack_require__.e(1).then(__webpack_require__.bind(null,14));resolve(JsonUploadAndParse)});return lazyLoadPromise}},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"b",(function(){return indexPatternService}));__webpack_require__.d(__webpack_exports__,"d",(function(){return savedObjectsClient}));__webpack_require__.d(__webpack_exports__,"a",(function(){return basePath}));__webpack_require__.d(__webpack_exports__,"c",(function(){return kbnFetch}));__webpack_require__.d(__webpack_exports__,"e",(function(){return setupInitServicesAndConstants}));__webpack_require__.d(__webpack_exports__,"f",(function(){return startInitServicesAndConstants}));let indexPatternService;let savedObjectsClient;let basePath;let kbnFetch;const setupInitServicesAndConstants=({http:http})=>{basePath=http.basePath.basePath;kbnFetch=http.fetch};const startInitServicesAndConstants=({savedObjects:savedObjects},{data:data})=>{indexPatternService=data.indexPatterns;savedObjectsClient=savedObjects.client}},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _constants__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(4);__webpack_require__.d(__webpack_exports__,"MAX_FILE_SIZE",(function(){return _constants__WEBPACK_IMPORTED_MODULE_0__["d"]}));__webpack_require__.d(__webpack_exports__,"MAX_FILE_SIZE_BYTES",(function(){return _constants__WEBPACK_IMPORTED_MODULE_0__["e"]}));__webpack_require__.d(__webpack_exports__,"ABSOLUTE_MAX_FILE_SIZE_BYTES",(function(){return _constants__WEBPACK_IMPORTED_MODULE_0__["a"]}));__webpack_require__.d(__webpack_exports__,"FILE_SIZE_DISPLAY_FORMAT",(function(){return _constants__WEBPACK_IMPORTED_MODULE_0__["b"]}));__webpack_require__.d(__webpack_exports__,"INDEX_META_DATA_CREATED_BY",(function(){return _constants__WEBPACK_IMPORTED_MODULE_0__["c"]}));var _types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(5);var _types__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_types__WEBPACK_IMPORTED_MODULE_1__);for(var __WEBPACK_IMPORT_KEY__ in _types__WEBPACK_IMPORTED_MODULE_1__)if(["default","MAX_FILE_SIZE","MAX_FILE_SIZE_BYTES","ABSOLUTE_MAX_FILE_SIZE_BYTES","FILE_SIZE_DISPLAY_FORMAT","INDEX_META_DATA_CREATED_BY"].indexOf(__WEBPACK_IMPORT_KEY__)<0)(function(key){__webpack_require__.d(__webpack_exports__,key,(function(){return _types__WEBPACK_IMPORTED_MODULE_1__[key]}))})(__WEBPACK_IMPORT_KEY__)},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"d",(function(){return MAX_FILE_SIZE}));__webpack_require__.d(__webpack_exports__,"e",(function(){return MAX_FILE_SIZE_BYTES}));__webpack_require__.d(__webpack_exports__,"a",(function(){return ABSOLUTE_MAX_FILE_SIZE_BYTES}));__webpack_require__.d(__webpack_exports__,"b",(function(){return FILE_SIZE_DISPLAY_FORMAT}));__webpack_require__.d(__webpack_exports__,"c",(function(){return INDEX_META_DATA_CREATED_BY}));const MAX_FILE_SIZE="100MB";const MAX_FILE_SIZE_BYTES=104857600;const ABSOLUTE_MAX_FILE_SIZE_BYTES=1073741274;const FILE_SIZE_DISPLAY_FORMAT="0,0.[0] b";const INDEX_META_DATA_CREATED_BY="ml-file-data-visualizer"},function(module,exports){},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_val_loader_dist_cjs_js_key_fileUpload_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(7);var _node_modules_val_loader_dist_cjs_js_key_fileUpload_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_val_loader_dist_cjs_js_key_fileUpload_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__);__kbnBundles__.define("plugin/fileUpload/public",__webpack_require__,8)},function(module,exports,__webpack_require__){__webpack_require__.p=window.__kbnPublicPath__["fileUpload"]},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"plugin",(function(){return plugin}));var _plugin__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(0);var _common__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(3);for(var __WEBPACK_IMPORT_KEY__ in _common__WEBPACK_IMPORTED_MODULE_1__)if(["default","plugin","StartContract","FileUploadComponentProps"].indexOf(__WEBPACK_IMPORT_KEY__)<0)(function(key){__webpack_require__.d(__webpack_exports__,key,(function(){return _common__WEBPACK_IMPORTED_MODULE_1__[key]}))})(__WEBPACK_IMPORT_KEY__);__webpack_require__.d(__webpack_exports__,"StartContract",(function(){return _plugin__WEBPACK_IMPORTED_MODULE_0__["StartContract"]}));var _get_file_upload_component__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(1);__webpack_require__.d(__webpack_exports__,"FileUploadComponentProps",(function(){return _get_file_upload_component__WEBPACK_IMPORTED_MODULE_2__["FileUploadComponentProps"]}));function plugin(){return new _plugin__WEBPACK_IMPORTED_MODULE_0__["a"]}},function(module,exports){module.exports=__kbnSharedDeps__.KbnI18n},function(module,exports){module.exports=__kbnSharedDeps__.React},function(module,exports){module.exports=__kbnSharedDeps__.ElasticEui},function(module,exports){module.exports=__kbnSharedDeps__.Lodash},function(module,exports){module.exports=__kbnSharedDeps__.KbnI18nReact}]);