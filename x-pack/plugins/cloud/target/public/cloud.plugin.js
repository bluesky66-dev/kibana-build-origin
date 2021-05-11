/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{enumerable:true,get:getter})}};__webpack_require__.r=function(exports){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(exports,"__esModule",{value:true})};__webpack_require__.t=function(value,mode){if(mode&1)value=__webpack_require__(value);if(mode&8)return value;if(mode&4&&typeof value==="object"&&value&&value.__esModule)return value;var ns=Object.create(null);__webpack_require__.r(ns);Object.defineProperty(ns,"default",{enumerable:true,value:value});if(mode&2&&typeof value!="string")for(var key in value)__webpack_require__.d(ns,key,function(key){return value[key]}.bind(null,key));return ns};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";return __webpack_require__(__webpack_require__.s=1)})([function(module,exports){module.exports=__kbnSharedDeps__.KbnI18n},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_val_loader_dist_cjs_js_key_cloud_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(2);var _node_modules_val_loader_dist_cjs_js_key_cloud_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_val_loader_dist_cjs_js_key_cloud_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__);__kbnBundles__.define("plugin/cloud/public",__webpack_require__,3)},function(module,exports,__webpack_require__){__webpack_require__.p=window.__kbnPublicPath__["cloud"]},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"CloudSetup",(function(){return undefined}));__webpack_require__.d(__webpack_exports__,"CloudConfigType",(function(){return undefined}));__webpack_require__.d(__webpack_exports__,"plugin",(function(){return public_plugin}));var external_kbnSharedDeps_KbnI18n_=__webpack_require__(0);function getIsCloudEnabled(cloudId){return typeof cloudId==="string"}const ELASTIC_SUPPORT_LINK="https://support.elastic.co/";const createUserMenuLinks=config=>{const{resetPasswordUrl:resetPasswordUrl,accountUrl:accountUrl}=config;const userMenuLinks=[];if(resetPasswordUrl){userMenuLinks.push({label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.cloud.userMenuLinks.profileLinkText",{defaultMessage:"Cloud profile"}),iconType:"logoCloud",href:resetPasswordUrl,order:100})}if(accountUrl){userMenuLinks.push({label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.cloud.userMenuLinks.accountLinkText",{defaultMessage:"Account & Billing"}),iconType:"gear",href:accountUrl,order:200})}return userMenuLinks};function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class plugin_CloudPlugin{constructor(initializerContext){this.initializerContext=initializerContext;_defineProperty(this,"config",void 0);_defineProperty(this,"isCloudEnabled",void 0);this.config=this.initializerContext.config.get();this.isCloudEnabled=false}setup(core,{home:home}){const{id:id,resetPasswordUrl:resetPasswordUrl,deploymentUrl:deploymentUrl}=this.config;this.isCloudEnabled=getIsCloudEnabled(id);if(home){home.environment.update({cloud:this.isCloudEnabled});if(this.isCloudEnabled){home.tutorials.setVariable("cloud",{id:id,resetPasswordUrl:resetPasswordUrl})}}return{cloudId:id,cloudDeploymentUrl:deploymentUrl,isCloudEnabled:this.isCloudEnabled}}start(coreStart,{security:security}){const{deploymentUrl:deploymentUrl}=this.config;coreStart.chrome.setHelpSupportUrl(ELASTIC_SUPPORT_LINK);if(deploymentUrl){coreStart.chrome.setCustomNavLink({title:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.cloud.deploymentLinkLabel",{defaultMessage:"Manage this deployment"}),euiIconType:"arrowLeft",href:deploymentUrl})}if(security&&this.isCloudEnabled){const userMenuLinks=createUserMenuLinks(this.config);security.navControlService.addUserMenuLinks(userMenuLinks)}}}function public_plugin(initializerContext){return new plugin_CloudPlugin(initializerContext)}}]);