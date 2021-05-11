/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["triggersActionsUi_bundle_jsonpfunction"]=window["triggersActionsUi_bundle_jsonpfunction"]||[]).push([[10],{271:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"default",(function(){return ServiceNowConnectorFields}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(0);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(8);var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_2__);var _translations__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(10);var _common_lib_kibana__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(34);const ServiceNowConnectorFields=({action:action,editActionSecrets:editActionSecrets,editActionConfig:editActionConfig,errors:errors,consumer:consumer,readOnly:readOnly})=>{const{docLinks:docLinks}=Object(_common_lib_kibana__WEBPACK_IMPORTED_MODULE_4__["b"])().services;const{apiUrl:apiUrl}=action.config;const isApiUrlInvalid=errors.apiUrl.length>0&&apiUrl!==undefined;const{username:username,password:password}=action.secrets;const isUsernameInvalid=errors.username.length>0&&username!==undefined;const isPasswordInvalid=errors.password.length>0&&password!==undefined;const handleOnChangeActionConfig=Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])((key,value)=>editActionConfig(key,value),[editActionConfig]);const handleOnChangeSecretConfig=Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])((key,value)=>editActionSecrets(key,value),[editActionSecrets]);return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"],{id:"apiUrl",fullWidth:true,error:errors.apiUrl,isInvalid:isApiUrlInvalid,label:_translations__WEBPACK_IMPORTED_MODULE_3__["b"],helpText:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"],{href:docLinks.links.alerting.serviceNowAction,target:"_blank"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_2__["FormattedMessage"],{id:"xpack.triggersActionsUI.components.builtinActionTypes.serviceNowAction.apiUrlHelpLabel",defaultMessage:"Configure a Personal Developer Instance"}))},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldText"],{fullWidth:true,isInvalid:isApiUrlInvalid,name:"apiUrl",readOnly:readOnly,value:apiUrl||"","data-test-subj":"apiUrlFromInput",onChange:evt=>handleOnChangeActionConfig("apiUrl",evt.target.value),onBlur:()=>{if(!apiUrl){editActionConfig("apiUrl","")}}})))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"m"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"],{size:"xxs"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4",null,_translations__WEBPACK_IMPORTED_MODULE_3__["e"])))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"m"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"],{fullWidth:true},getEncryptedFieldNotifyLabel(!action.id)))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"m"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"],{id:"connector-servicenow-username",fullWidth:true,error:errors.username,isInvalid:isUsernameInvalid,label:_translations__WEBPACK_IMPORTED_MODULE_3__["D"]},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldText"],{fullWidth:true,isInvalid:isUsernameInvalid,readOnly:readOnly,name:"connector-servicenow-username",value:username||"","data-test-subj":"connector-servicenow-username-form-input",onChange:evt=>handleOnChangeSecretConfig("username",evt.target.value),onBlur:()=>{if(!username){editActionSecrets("username","")}}})))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"m"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"],{id:"connector-servicenow-password",fullWidth:true,error:errors.password,isInvalid:isPasswordInvalid,label:_translations__WEBPACK_IMPORTED_MODULE_3__["o"]},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldPassword"],{fullWidth:true,readOnly:readOnly,isInvalid:isPasswordInvalid,name:"connector-servicenow-password",value:password||"","data-test-subj":"connector-servicenow-password-form-input",onChange:evt=>handleOnChangeSecretConfig("password",evt.target.value),onBlur:()=>{if(!password){editActionSecrets("password","")}}})))))};function getEncryptedFieldNotifyLabel(isCreate){if(isCreate){return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"],{size:"s","data-test-subj":"rememberValuesMessage"},_translations__WEBPACK_IMPORTED_MODULE_3__["s"])}return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiCallOut"],{size:"s",iconType:"iInCircle",title:_translations__WEBPACK_IMPORTED_MODULE_3__["r"],"data-test-subj":"reenterValuesMessage"})}}}]);