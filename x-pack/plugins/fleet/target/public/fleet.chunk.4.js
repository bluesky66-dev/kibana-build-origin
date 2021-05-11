/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["fleet_bundle_jsonpfunction"]=window["fleet_bundle_jsonpfunction"]||[]).push([[4],{143:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"tutorialDirectoryNoticeState$",(function(){return tutorialDirectoryNoticeState$}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(2);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var rxjs__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(100);var rxjs__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(rxjs__WEBPACK_IMPORTED_MODULE_1__);var styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(95);var styled_components__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_2__);var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(94);var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(10);var _elastic_eui__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__);var _src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(97);var _src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(_src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_5__);var _hooks__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(106);const FlexItemButtonWrapper=styled_components__WEBPACK_IMPORTED_MODULE_2___default()(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlexItem"]).withConfig({displayName:"FlexItemButtonWrapper",componentId:"xjub75-0"})(["&&&{margin-bottom:0;}"]);const tutorialDirectoryNoticeState$=new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]({settingsDataLoaded:false,hasSeenNotice:false});const TutorialDirectoryNotice=Object(react__WEBPACK_IMPORTED_MODULE_0__["memo"])(()=>{var _settingsData$item2;const{getHref:getHref}=Object(_hooks__WEBPACK_IMPORTED_MODULE_6__["hb"])();const{application:application}=Object(_hooks__WEBPACK_IMPORTED_MODULE_6__["mb"])();const{show:hasIngestManager}=Object(_hooks__WEBPACK_IMPORTED_MODULE_6__["K"])();const{data:settingsData,isLoading:isLoading}=Object(_hooks__WEBPACK_IMPORTED_MODULE_6__["cb"])();const[dismissedNotice,setDismissedNotice]=Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);const dismissNotice=Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(async()=>{setDismissedNotice(true);await Object(_hooks__WEBPACK_IMPORTED_MODULE_6__["D"])({has_seen_add_data_notice:true})},[]);Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(()=>{var _settingsData$item;tutorialDirectoryNoticeState$.next({settingsDataLoaded:!isLoading,hasSeenNotice:Boolean(dismissedNotice||(settingsData===null||settingsData===void 0?void 0:(_settingsData$item=settingsData.item)===null||_settingsData$item===void 0?void 0:_settingsData$item.has_seen_add_data_notice))})},[isLoading,settingsData,dismissedNotice]);const hasSeenNotice=isLoading||(settingsData===null||settingsData===void 0?void 0:(_settingsData$item2=settingsData.item)===null||_settingsData$item2===void 0?void 0:_settingsData$item2.has_seen_add_data_notice)||dismissedNotice;return hasIngestManager&&!hasSeenNotice?react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiSpacer"],{size:"m"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiCallOut"],{iconType:"cheer",title:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__["FormattedMessage"],{id:"xpack.fleet.homeIntegration.tutorialDirectory.noticeTitle",defaultMessage:"{newPrefix} Elastic Agent and Fleet Beta",values:{newPrefix:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong",null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__["FormattedMessage"],{id:"xpack.fleet.homeIntegration.tutorialDirectory.noticeTitle.newPrefix",defaultMessage:"New:"}))}})},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p",null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__["FormattedMessage"],{id:"xpack.fleet.homeIntegration.tutorialDirectory.noticeText",defaultMessage:"The Elastic Agent provides a simple, unified way to add monitoring for logs, metrics, and other types of data to your hosts. You no longer need to install multiple Beats and other agents, which makes it easier and faster to deploy policies across your infrastructure. For more information, read our {blogPostLink}.",values:{blogPostLink:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiLink"],{href:"https://ela.st/ingest-manager-announcement",external:true,target:"_blank"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__["FormattedMessage"],{id:"xpack.fleet.homeIntegration.tutorialDirectory.noticeText.blogPostLink",defaultMessage:"announcement blog post"}))}})),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFlexGroup"],{gutterSize:"s"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FlexItemButtonWrapper,{grow:false},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_5__["RedirectAppLinks"],{application:application},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiButton"],{size:"s",href:getHref("overview")},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__["FormattedMessage"],{id:"xpack.fleet.homeIntegration.tutorialDirectory.fleetAppButtonText",defaultMessage:"Try Fleet Beta"}))))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FlexItemButtonWrapper,{grow:false},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiButtonEmpty"],{size:"s",onClick:()=>{dismissNotice()}},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__["FormattedMessage"],{id:"xpack.fleet.homeIntegration.tutorialDirectory.dismissNoticeButtonText",defaultMessage:"Dismiss message"}))))))):null});__webpack_exports__["default"]=TutorialDirectoryNotice}}]);