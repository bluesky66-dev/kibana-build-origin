/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["ml_bundle_jsonpfunction"]=window["ml_bundle_jsonpfunction"]||[]).push([[9,19],{379:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"AnomalyDetectorService",(function(){return AnomalyDetectorService}));var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(21);var rxjs_operators__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__);var _ml_api_service__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(59);function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class AnomalyDetectorService{constructor(httpService){this.httpService=httpService;_defineProperty(this,"apiBasePath",Object(_ml_api_service__WEBPACK_IMPORTED_MODULE_1__["basePath"])()+"/anomaly_detectors")}getJobById$(jobId){return this.httpService.http$({path:`${this.apiBasePath}/${jobId}`}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["map"])(response=>response.jobs[0]))}getJobs$(jobIds){return this.httpService.http$({path:`${this.apiBasePath}/${jobIds.join(",")}`}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["map"])(response=>response.jobs))}extractInfluencers(jobs){if(!Array.isArray(jobs)){jobs=[jobs]}const influencers=new Set;for(const job of jobs){for(const influencer of job.analysis_config.influencers){influencers.add(influencer)}}return Array.from(influencers)}}},843:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"resolveAnomalySwimlaneUserInput",(function(){return resolveAnomalySwimlaneUserInput}));var external_kbnSharedDeps_React_=__webpack_require__(10);var external_kbnSharedDeps_React_default=__webpack_require__.n(external_kbnSharedDeps_React_);var external_kbnSharedDeps_Moment_=__webpack_require__(12);var external_kbnSharedDeps_Moment_default=__webpack_require__.n(external_kbnSharedDeps_Moment_);var external_kbnSharedDeps_RxjsOperators_=__webpack_require__(21);var external_kbnSharedDeps_Rxjs_=__webpack_require__(19);var explorer_constants=__webpack_require__(69);var public_=__webpack_require__(36);var external_kbnSharedDeps_ElasticEui_=__webpack_require__(33);var external_kbnSharedDeps_KbnI18nReact_=__webpack_require__(34);var external_kbnSharedDeps_KbnI18n_=__webpack_require__(2);const AnomalySwimlaneInitializer=({defaultTitle:defaultTitle,influencers:influencers,onCreate:onCreate,onCancel:onCancel,initialInput:initialInput})=>{var _initialInput$swimlan;const[panelTitle,setPanelTitle]=Object(external_kbnSharedDeps_React_["useState"])(defaultTitle);const[swimlaneType,setSwimlaneType]=Object(external_kbnSharedDeps_React_["useState"])((_initialInput$swimlan=initialInput===null||initialInput===void 0?void 0:initialInput.swimlaneType)!==null&&_initialInput$swimlan!==void 0?_initialInput$swimlan:explorer_constants["h"].OVERALL);const[viewBySwimlaneFieldName,setViewBySwimlaneFieldName]=Object(external_kbnSharedDeps_React_["useState"])(initialInput===null||initialInput===void 0?void 0:initialInput.viewBy);const swimlaneTypeOptions=[{id:explorer_constants["h"].OVERALL,label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.ml.explorer.overallLabel",{defaultMessage:"Overall"})},{id:explorer_constants["h"].VIEW_BY,label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.ml.explorer.viewByLabel",{defaultMessage:"View by"})}];const viewBySwimlaneOptions=["",...influencers].map(influencer=>({value:influencer,text:influencer}));const isPanelTitleValid=panelTitle.length>0;const isFormValid=isPanelTitleValid&&(swimlaneType===explorer_constants["h"].OVERALL||swimlaneType===explorer_constants["h"].VIEW_BY&&!!viewBySwimlaneFieldName);return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiModal"],{initialFocus:"[name=panelTitle]",onClose:onCancel},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiModalHeader"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiModalHeaderTitle"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.ml.swimlaneEmbeddable.setupModal.title",defaultMessage:"Anomaly swim lane configuration"}))),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiModalBody"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiForm"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{label:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.ml.swimlaneEmbeddable.panelTitleLabel",defaultMessage:"Panel title"}),isInvalid:!isPanelTitleValid},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFieldText"],{id:"panelTitle",name:"panelTitle",value:panelTitle,onChange:e=>setPanelTitle(e.target.value),isInvalid:!isPanelTitleValid})),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{label:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.ml.swimlaneEmbeddable.setupModal.swimlaneTypeLabel",defaultMessage:"Swim lane type"})},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiButtonGroup"],{id:"selectSwimlaneType",name:"selectSwimlaneType",color:"primary",isFullWidth:true,legend:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.ml.swimlaneEmbeddable.setupModal.swimlaneTypeLabel",{defaultMessage:"Swim lane type"}),options:swimlaneTypeOptions,idSelected:swimlaneType,onChange:id=>setSwimlaneType(id)})),swimlaneType===explorer_constants["h"].VIEW_BY&&external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_React_default.a.Fragment,null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{label:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.ml.explorer.viewByLabel",defaultMessage:"View by"})},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSelect"],{id:"selectViewBy",name:"selectViewBy",options:viewBySwimlaneOptions,value:viewBySwimlaneFieldName,onChange:e=>setViewBySwimlaneFieldName(e.target.value)}))))),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiModalFooter"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiButtonEmpty"],{onClick:onCancel},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.ml.swimlaneEmbeddable.setupModal.cancelButtonLabel",defaultMessage:"Cancel"})),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiButton"],{isDisabled:!isFormValid,onClick:onCreate.bind(null,{panelTitle:panelTitle,swimlaneType:swimlaneType,viewBy:viewBySwimlaneFieldName}),fill:true},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.ml.swimlaneEmbeddable.setupModal.confirmButtonLabel",defaultMessage:"Confirm"}))))};var job_selector_flyout=__webpack_require__(383);var anomaly_detector_service=__webpack_require__(379);var job_selector=__webpack_require__(264);var anomaly_swimlane_embeddable=__webpack_require__(266);var app=__webpack_require__(380);var http_service=__webpack_require__(99);var dashboard_public_=__webpack_require__(49);async function resolveAnomalySwimlaneUserInput(coreStart,input){const{http:http,uiSettings:uiSettings,overlays:overlays,application:{currentAppId$:currentAppId$}}=coreStart;const anomalyDetectorService=new anomaly_detector_service["AnomalyDetectorService"](new http_service["a"](http));return new Promise(async(resolve,reject)=>{const maps={groupsMap:Object(job_selector["b"])([]),jobsMap:{}};const tzConfig=uiSettings.get("dateFormat:tz");const dateFormatTz=tzConfig!=="Browser"?tzConfig:external_kbnSharedDeps_Moment_default.a.tz.guess();const selectedIds=input===null||input===void 0?void 0:input.jobIds;const flyoutSession=coreStart.overlays.openFlyout(Object(public_["toMountPoint"])(external_kbnSharedDeps_React_default.a.createElement(public_["KibanaContextProvider"],{services:{...coreStart,mlServices:Object(app["getMlGlobalServices"])(http)}},external_kbnSharedDeps_React_default.a.createElement(job_selector_flyout["b"],{selectedIds:selectedIds,withTimeRangeSelector:false,dateFormatTz:dateFormatTz,singleSelection:false,timeseriesOnly:true,onFlyoutClose:()=>{flyoutSession.close();reject()},onSelectionConfirmed:async({jobIds:jobIds,groups:groups})=>{var _input$title;const title=(_input$title=input===null||input===void 0?void 0:input.title)!==null&&_input$title!==void 0?_input$title:Object(anomaly_swimlane_embeddable["getDefaultPanelTitle"])(jobIds);const jobs=await anomalyDetectorService.getJobs$(jobIds).toPromise();const influencers=anomalyDetectorService.extractInfluencers(jobs);influencers.push(explorer_constants["j"]);await flyoutSession.close();const modalSession=overlays.openModal(Object(public_["toMountPoint"])(external_kbnSharedDeps_React_default.a.createElement(AnomalySwimlaneInitializer,{defaultTitle:title,influencers:influencers,initialInput:input,onCreate:({panelTitle:panelTitle,viewBy:viewBy,swimlaneType:swimlaneType})=>{modalSession.close();resolve({jobIds:jobIds,title:panelTitle,swimlaneType:swimlaneType,viewBy:viewBy})},onCancel:()=>{modalSession.close();reject()}})))},maps:maps}))),{"data-test-subj":"mlFlyoutJobSelector",ownFocus:true,closeButtonAriaLabel:"jobSelectorFlyout"});currentAppId$.pipe(Object(external_kbnSharedDeps_RxjsOperators_["takeUntil"])(Object(external_kbnSharedDeps_Rxjs_["from"])(flyoutSession.onClose))).subscribe(appId=>{if(appId!==dashboard_public_["DashboardConstants"].DASHBOARDS_ID){flyoutSession.close()}})})}}}]);