/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["triggersActionsUi_bundle_jsonpfunction"]=window["triggersActionsUi_bundle_jsonpfunction"]||[]).push([[28],{275:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"default",(function(){return ResilientConnectorFields}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(0);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);var _translations__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(14);const ResilientConnectorFields=({action:action,editActionSecrets:editActionSecrets,editActionConfig:editActionConfig,errors:errors,readOnly:readOnly})=>{const{apiUrl:apiUrl,orgId:orgId}=action.config;const isApiUrlInvalid=errors.apiUrl.length>0&&apiUrl!==undefined;const{apiKeyId:apiKeyId,apiKeySecret:apiKeySecret}=action.secrets;const isOrgIdInvalid=errors.orgId.length>0&&orgId!==undefined;const isApiKeyInvalid=errors.apiKeyId.length>0&&apiKeyId!==undefined;const isApiKeySecretInvalid=errors.apiKeySecret.length>0&&apiKeySecret!==undefined;const handleOnChangeActionConfig=Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])((key,value)=>editActionConfig(key,value),[editActionConfig]);const handleOnChangeSecretConfig=Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])((key,value)=>editActionSecrets(key,value),[editActionSecrets]);return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"],{id:"apiUrl",fullWidth:true,error:errors.apiUrl,isInvalid:isApiUrlInvalid,label:_translations__WEBPACK_IMPORTED_MODULE_2__["g"]},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldText"],{fullWidth:true,isInvalid:isApiUrlInvalid,name:"apiUrl",readOnly:readOnly,value:apiUrl||"","data-test-subj":"apiUrlFromInput",onChange:evt=>handleOnChangeActionConfig("apiUrl",evt.target.value),onBlur:()=>{if(!apiUrl){editActionConfig("apiUrl","")}}})))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"m"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"],{id:"connector-resilient-orgId-key",fullWidth:true,error:errors.orgId,isInvalid:isOrgIdInvalid,label:_translations__WEBPACK_IMPORTED_MODULE_2__["m"]},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldText"],{fullWidth:true,isInvalid:isOrgIdInvalid,name:"connector-resilient-orgId",value:orgId||"","data-test-subj":"connector-resilient-orgId-form-input",onChange:evt=>handleOnChangeActionConfig("orgId",evt.target.value),onBlur:()=>{if(!orgId){editActionConfig("orgId","")}}})))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"m"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"],{size:"xxs"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4",null,_translations__WEBPACK_IMPORTED_MODULE_2__["c"])))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"m"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"],{fullWidth:true},getEncryptedFieldNotifyLabel(!action.id)))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"m"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"],{id:"connector-resilient-apiKeyId",fullWidth:true,error:errors.apiKeyId,isInvalid:isApiKeyInvalid,label:_translations__WEBPACK_IMPORTED_MODULE_2__["a"]},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldText"],{fullWidth:true,isInvalid:isApiKeyInvalid,readOnly:readOnly,name:"connector-resilient-apiKeyId",value:apiKeyId||"","data-test-subj":"connector-resilient-apiKeyId-form-input",onChange:evt=>handleOnChangeSecretConfig("apiKeyId",evt.target.value),onBlur:()=>{if(!apiKeyId){editActionSecrets("apiKeyId","")}}})))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"m"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"],{id:"connector-resilient-apiKeySecret",fullWidth:true,error:errors.apiKeySecret,isInvalid:isApiKeySecretInvalid,label:_translations__WEBPACK_IMPORTED_MODULE_2__["d"]},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldPassword"],{fullWidth:true,readOnly:readOnly,isInvalid:isApiKeySecretInvalid,name:"connector-resilient-apiKeySecret",value:apiKeySecret||"","data-test-subj":"connector-resilient-apiKeySecret-form-input",onChange:evt=>handleOnChangeSecretConfig("apiKeySecret",evt.target.value),onBlur:()=>{if(!apiKeySecret){editActionSecrets("apiKeySecret","")}}})))))};function getEncryptedFieldNotifyLabel(isCreate){if(isCreate){return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"],{size:"s","data-test-subj":"rememberValuesMessage"},_translations__WEBPACK_IMPORTED_MODULE_2__["p"])}return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiCallOut"],{size:"s",iconType:"iInCircle",title:_translations__WEBPACK_IMPORTED_MODULE_2__["o"],"data-test-subj":"reenterValuesMessage"})}}}]);