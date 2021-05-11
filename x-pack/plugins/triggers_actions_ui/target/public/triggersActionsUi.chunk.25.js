/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["triggersActionsUi_bundle_jsonpfunction"]=window["triggersActionsUi_bundle_jsonpfunction"]||[]).push([[25],{266:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"IndexParamsFields",(function(){return IndexParamsFields}));__webpack_require__.d(__webpack_exports__,"default",(function(){return IndexParamsFields}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(0);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(1);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__);var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(8);var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__);var _json_editor_with_message_variables__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(137);var _common_lib_kibana__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(34);const IndexParamsFields=({actionParams:actionParams,index:index,editAction:editAction,messageVariables:messageVariables,errors:errors})=>{const{docLinks:docLinks}=Object(_common_lib_kibana__WEBPACK_IMPORTED_MODULE_5__["b"])().services;const{documents:documents}=actionParams;const onDocumentsChange=updatedDocuments=>{try{const documentsJSON=JSON.parse(updatedDocuments);editAction("documents",[documentsJSON],index)}catch(e){editAction("documents",[{}],index)}};return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_json_editor_with_message_variables__WEBPACK_IMPORTED_MODULE_4__["a"],{messageVariables:messageVariables,paramsProperty:"documents","data-test-subj":"documentToIndex",inputTargetValue:documents===null?"{}":documents&&documents.length>0?documents[0]:undefined,label:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("xpack.triggersActionsUI.components.builtinActionTypes.indexAction.documentsFieldLabel",{defaultMessage:"Document to index"}),"aria-label":_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("xpack.triggersActionsUI.components.builtinActionTypes.indexAction.jsonDocAriaLabel",{defaultMessage:"Code editor"}),errors:errors.documents,onDocumentsChange:onDocumentsChange,helpText:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"],{href:docLinks.links.alerting.indexAction,target:"_blank"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__["FormattedMessage"],{id:"xpack.triggersActionsUI.components.builtinActionTypes.indexAction.indexDocumentHelpLabel",defaultMessage:"Index document example."})),onBlur:()=>{if(!(documents&&documents.length>0?documents[0]:undefined)){onDocumentsChange("{}")}}})}}}]);