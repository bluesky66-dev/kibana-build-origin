(function(modules){function webpackJsonpCallback(data){var chunkIds=data[0];var moreModules=data[1];var moduleId,chunkId,i=0,resolves=[];for(;i<chunkIds.length;i++){chunkId=chunkIds[i];if(Object.prototype.hasOwnProperty.call(installedChunks,chunkId)&&installedChunks[chunkId]){resolves.push(installedChunks[chunkId][0])}installedChunks[chunkId]=0}for(moduleId in moreModules){if(Object.prototype.hasOwnProperty.call(moreModules,moduleId)){modules[moduleId]=moreModules[moduleId]}}if(parentJsonpFunction)parentJsonpFunction(data);while(resolves.length){resolves.shift()()}}var installedModules={};var installedChunks={0:0};function jsonpScriptSrc(chunkId){return __webpack_require__.p+"timelion.chunk."+chunkId+".js"}function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.e=function requireEnsure(chunkId){var promises=[];var installedChunkData=installedChunks[chunkId];if(installedChunkData!==0){if(installedChunkData){promises.push(installedChunkData[2])}else{var promise=new Promise((function(resolve,reject){installedChunkData=installedChunks[chunkId]=[resolve,reject]}));promises.push(installedChunkData[2]=promise);var script=document.createElement("script");var onScriptComplete;script.charset="utf-8";script.timeout=120;if(__webpack_require__.nc){script.setAttribute("nonce",__webpack_require__.nc)}script.src=jsonpScriptSrc(chunkId);var error=new Error;onScriptComplete=function(event){script.onerror=script.onload=null;clearTimeout(timeout);var chunk=installedChunks[chunkId];if(chunk!==0){if(chunk){var errorType=event&&(event.type==="load"?"missing":event.type);var realSrc=event&&event.target&&event.target.src;error.message="Loading chunk "+chunkId+" failed.\n("+errorType+": "+realSrc+")";error.name="ChunkLoadError";error.type=errorType;error.request=realSrc;chunk[1](error)}installedChunks[chunkId]=undefined}};var timeout=setTimeout((function(){onScriptComplete({type:"timeout",target:script})}),12e4);script.onerror=script.onload=onScriptComplete;document.head.appendChild(script)}}return Promise.all(promises)};__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{enumerable:true,get:getter})}};__webpack_require__.r=function(exports){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(exports,"__esModule",{value:true})};__webpack_require__.t=function(value,mode){if(mode&1)value=__webpack_require__(value);if(mode&8)return value;if(mode&4&&typeof value==="object"&&value&&value.__esModule)return value;var ns=Object.create(null);__webpack_require__.r(ns);Object.defineProperty(ns,"default",{enumerable:true,value:value});if(mode&2&&typeof value!="string")for(var key in value)__webpack_require__.d(ns,key,function(key){return value[key]}.bind(null,key));return ns};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";__webpack_require__.oe=function(err){console.error(err);throw err};var jsonpArray=window["timelion_bundle_jsonpfunction"]=window["timelion_bundle_jsonpfunction"]||[];var oldJsonpFunction=jsonpArray.push.bind(jsonpArray);jsonpArray.push=webpackJsonpCallback;jsonpArray=jsonpArray.slice();for(var i=0;i<jsonpArray.length;i++)webpackJsonpCallback(jsonpArray[i]);var parentJsonpFunction=oldJsonpFunction;return __webpack_require__(__webpack_require__.s=6)})([function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("entry/core/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,exports){module.exports=__kbnSharedDeps__.RxjsOperators},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/kibanaLegacy/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/kibanaUtils/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/data/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,exports){module.exports=__kbnSharedDeps__.Rxjs},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_val_loader_dist_cjs_js_key_timelion_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(7);var _node_modules_val_loader_dist_cjs_js_key_timelion_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_val_loader_dist_cjs_js_key_timelion_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__);__kbnBundles__.define("plugin/timelion/public",__webpack_require__,8)},function(module,exports,__webpack_require__){__webpack_require__.p=window.__kbnPublicPath__["timelion"]},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"plugin",(function(){return public_plugin}));var external_kbnSharedDeps_Rxjs_=__webpack_require__(5);var external_kbnSharedDeps_RxjsOperators_=__webpack_require__(1);var public_=__webpack_require__(0);var kibanaLegacy_public_=__webpack_require__(2);var kibanaUtils_public_=__webpack_require__(3);var data_public_=__webpack_require__(4);function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class plugin_TimelionPlugin{constructor(initializerContext){_defineProperty(this,"initializerContext",void 0);_defineProperty(this,"appStateUpdater",new external_kbnSharedDeps_Rxjs_["BehaviorSubject"](()=>({})));_defineProperty(this,"stopUrlTracking",undefined);_defineProperty(this,"currentHistory",undefined);this.initializerContext=initializerContext}setup(core,{data:data,visTypeTimelion:visTypeTimelion}){const timelionPanels=new Map;const{appMounted:appMounted,appUnMounted:appUnMounted,stop:stopUrlTracker}=Object(kibanaUtils_public_["createKbnUrlTracker"])({baseUrl:core.http.basePath.prepend("/app/timelion"),defaultSubUrl:"#/",storageKey:`lastUrl:${core.http.basePath.get()}:timelion`,navLinkUpdater$:this.appStateUpdater,toastNotifications:core.notifications.toasts,stateParams:[{kbnUrlKey:"_g",stateUpdate$:data.query.state$.pipe(Object(external_kbnSharedDeps_RxjsOperators_["filter"])(({changes:changes})=>!!(changes.globalFilters||changes.time||changes.refreshInterval)),Object(external_kbnSharedDeps_RxjsOperators_["map"])(({state:state})=>{var _state$filters;return{...state,filters:(_state$filters=state.filters)===null||_state$filters===void 0?void 0:_state$filters.filter(data_public_["esFilters"].isFilterPinned)}}))}],getHistory:()=>this.currentHistory});this.stopUrlTracking=()=>{stopUrlTracker()};Object(kibanaLegacy_public_["initAngularBootstrap"])();core.application.register({id:"timelion",title:"Timelion",order:8e3,defaultPath:"#/",euiIconType:"logoKibana",category:public_["DEFAULT_APP_CATEGORIES"].kibana,navLinkStatus:visTypeTimelion.isUiEnabled===false?public_["AppNavLinkStatus"].hidden:public_["AppNavLinkStatus"].default,mount:async params=>{const[coreStart,pluginsStart]=await core.getStartServices();this.currentHistory=params.history;appMounted();const unlistenParentHistory=params.history.listen(()=>{window.dispatchEvent(new HashChangeEvent("hashchange"))});const{renderApp:renderApp}=await __webpack_require__.e(1).then(__webpack_require__.bind(null,64));params.element.classList.add("timelionAppContainer");const unmount=renderApp({mountParams:params,pluginInitializerContext:this.initializerContext,timelionPanels:timelionPanels,core:coreStart,plugins:pluginsStart});return()=>{unlistenParentHistory();unmount();appUnMounted()}}})}start(){}stop(){if(this.stopUrlTracking){this.stopUrlTracking()}}}function public_plugin(initializerContext){return new plugin_TimelionPlugin(initializerContext)}},function(module,exports){module.exports=__kbnSharedDeps__.Lodash},function(module,exports){module.exports=__kbnSharedDeps__.Jquery},function(module,exports){module.exports=__kbnSharedDeps__.KbnI18n},function(module,exports){module.exports=__kbnSharedDeps__.React},function(module,exports){module.exports=__kbnSharedDeps__.ElasticEui},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/visTypeTimelion/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/savedObjects/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,exports){module.exports=__kbnSharedDeps__.KbnI18nReact},function(module,exports){module.exports=__kbnSharedDeps__.Angular},function(module,exports){module.exports=__kbnSharedDeps__.KbnI18nAngular},function(module,exports){module.exports=__kbnSharedDeps__.MomentTimezone},function(module,exports){module.exports=__kbnSharedDeps__.Moment},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/visualizations/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))}]);