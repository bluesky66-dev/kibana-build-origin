(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{enumerable:true,get:getter})}};__webpack_require__.r=function(exports){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(exports,"__esModule",{value:true})};__webpack_require__.t=function(value,mode){if(mode&1)value=__webpack_require__(value);if(mode&8)return value;if(mode&4&&typeof value==="object"&&value&&value.__esModule)return value;var ns=Object.create(null);__webpack_require__.r(ns);Object.defineProperty(ns,"default",{enumerable:true,value:value});if(mode&2&&typeof value!="string")for(var key in value)__webpack_require__.d(ns,key,function(key){return value[key]}.bind(null,key));return ns};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";return __webpack_require__(__webpack_require__.s=2)})([function(module,exports){},function(module,exports){},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_val_loader_dist_cjs_js_key_spacesOss_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(3);var _node_modules_val_loader_dist_cjs_js_key_spacesOss_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_val_loader_dist_cjs_js_key_spacesOss_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__);__kbnBundles__.define("plugin/spacesOss/public",__webpack_require__,4)},function(module,exports,__webpack_require__){__webpack_require__.p=window.__kbnPublicPath__["spacesOss"]},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"SpacesOssPluginSetup",(function(){return types["SpacesOssPluginSetup"]}));__webpack_require__.d(__webpack_exports__,"SpacesOssPluginStart",(function(){return types["SpacesOssPluginStart"]}));__webpack_require__.d(__webpack_exports__,"SpacesAvailableStartContract",(function(){return types["SpacesAvailableStartContract"]}));__webpack_require__.d(__webpack_exports__,"SpacesUnavailableStartContract",(function(){return types["SpacesUnavailableStartContract"]}));__webpack_require__.d(__webpack_exports__,"SpacesApi",(function(){return api["SpacesApi"]}));__webpack_require__.d(__webpack_exports__,"SpacesApiUi",(function(){return api["SpacesApiUi"]}));__webpack_require__.d(__webpack_exports__,"SpacesApiUiComponent",(function(){return api["SpacesApiUiComponent"]}));__webpack_require__.d(__webpack_exports__,"SpacesContextProps",(function(){return api["SpacesContextProps"]}));__webpack_require__.d(__webpack_exports__,"ShareToSpaceFlyoutProps",(function(){return api["ShareToSpaceFlyoutProps"]}));__webpack_require__.d(__webpack_exports__,"ShareToSpaceSavedObjectTarget",(function(){return api["ShareToSpaceSavedObjectTarget"]}));__webpack_require__.d(__webpack_exports__,"SpaceListProps",(function(){return api["SpaceListProps"]}));__webpack_require__.d(__webpack_exports__,"LegacyUrlConflictProps",(function(){return api["LegacyUrlConflictProps"]}));__webpack_require__.d(__webpack_exports__,"plugin",(function(){return public_plugin}));function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class SpacesOssPlugin{constructor(){_defineProperty(this,"api",void 0)}setup(){return{registerSpacesApi:provider=>{if(this.api){throw new Error("Spaces API can only be registered once")}this.api=provider}}}start(){if(this.api){return{isSpacesAvailable:true,...this.api}}else{return{isSpacesAvailable:false}}}}var types=__webpack_require__(1);var api=__webpack_require__(0);const public_plugin=()=>new SpacesOssPlugin}]);