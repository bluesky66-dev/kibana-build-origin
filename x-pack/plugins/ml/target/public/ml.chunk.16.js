/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["ml_bundle_jsonpfunction"]=window["ml_bundle_jsonpfunction"]||[]).push([[16],{152:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return SWIM_LANE_SELECTION_TRIGGER}));__webpack_require__.d(__webpack_exports__,"b",(function(){return registerMlUiActions}));var external_kbnSharedDeps_KbnI18n_=__webpack_require__(2);var public_=__webpack_require__(40);var embeddable_public_=__webpack_require__(41);var embeddables=__webpack_require__(89);const EDIT_SWIMLANE_PANEL_ACTION="editSwimlanePanelAction";function createEditSwimlanePanelAction(getStartServices){return Object(public_["createAction"])({id:"edit-anomaly-swimlane",type:EDIT_SWIMLANE_PANEL_ACTION,getIconType(context){return"pencil"},getDisplayName:()=>external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.ml.actions.editSwimlaneTitle",{defaultMessage:"Edit swim lane"}),async execute({embeddable:embeddable}){if(!embeddable){throw new Error("Not possible to execute an action without the embeddable context")}const[coreStart]=await getStartServices();try{const{resolveAnomalySwimlaneUserInput:resolveAnomalySwimlaneUserInput}=await Promise.all([__webpack_require__.e(0),__webpack_require__.e(3),__webpack_require__.e(1),__webpack_require__.e(2),__webpack_require__.e(4),__webpack_require__.e(5),__webpack_require__.e(6),__webpack_require__.e(7),__webpack_require__.e(8),__webpack_require__.e(9)]).then(__webpack_require__.bind(null,843));const result=await resolveAnomalySwimlaneUserInput(coreStart,embeddable.getInput());embeddable.updateInput(result)}catch(e){return Promise.reject()}},async isCompatible({embeddable:embeddable}){return embeddable.type===embeddables["ANOMALY_SWIMLANE_EMBEDDABLE_TYPE"]&&embeddable.getInput().viewMode===embeddable_public_["ViewMode"].EDIT}})}var ml_url_generator=__webpack_require__(0);const OPEN_IN_ANOMALY_EXPLORER_ACTION="openInAnomalyExplorerAction";function createOpenInExplorerAction(getStartServices){return Object(public_["createAction"])({id:"open-in-anomaly-explorer",type:OPEN_IN_ANOMALY_EXPLORER_ACTION,getIconType(context){return"visTable"},getDisplayName(){return external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.ml.actions.openInAnomalyExplorerTitle",{defaultMessage:"Open in Anomaly Explorer"})},async getHref({embeddable:embeddable,data:data}){const[,pluginsStart]=await getStartServices();const urlGenerator=pluginsStart.share.urlGenerators.getUrlGenerator(ml_url_generator["a"]);const{jobIds:jobIds,timeRange:timeRange,viewBy:viewBy}=embeddable.getInput();const{perPage:perPage,fromPage:fromPage}=embeddable.getOutput();return urlGenerator.createUrl({page:"explorer",pageState:{jobIds:jobIds,timeRange:timeRange,mlExplorerSwimlane:{viewByFromPage:fromPage,viewByPerPage:perPage,viewByFieldName:viewBy,...data?{selectedType:data.type,selectedTimes:data.times,selectedLanes:data.lanes}:{}}}})},async execute({embeddable:embeddable,data:data}){if(!embeddable){throw new Error("Not possible to execute an action without the embeddable context")}const[{application:application}]=await getStartServices();const anomalyExplorerUrl=await this.getHref({embeddable:embeddable,data:data});await application.navigateToUrl(anomalyExplorerUrl)},async isCompatible({embeddable:embeddable}){return embeddable.type===embeddables["ANOMALY_SWIMLANE_EMBEDDABLE_TYPE"]}})}var explorer_constants=__webpack_require__(69);var common_=__webpack_require__(44);var constants=__webpack_require__(27);const APPLY_INFLUENCER_FILTERS_ACTION="applyInfluencerFiltersAction";function createApplyInfluencerFiltersAction(getStartServices){return Object(public_["createAction"])({id:"apply-to-current-view",type:APPLY_INFLUENCER_FILTERS_ACTION,getIconType(context){return"filter"},getDisplayName(){return external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.ml.actions.applyInfluencersFiltersTitle",{defaultMessage:"Filter for value"})},async execute({data:data}){if(!data){throw new Error("No swim lane selection data provided")}const[,pluginStart]=await getStartServices();const filterManager=pluginStart.data.query.filterManager;filterManager.addFilters(data.lanes.map(influencerValue=>({$state:{store:common_["FilterStateStore"].APP_STATE},meta:{alias:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.ml.actions.influencerFilterAliasLabel",{defaultMessage:"Influencer {labelValue}",values:{labelValue:`${data.viewByFieldName}:${influencerValue}`}}),controlledBy:constants["a"],disabled:false,key:data.viewByFieldName,negate:false,params:{query:influencerValue},type:"phrase"},query:{match_phrase:{[data.viewByFieldName]:influencerValue}}})))},async isCompatible({embeddable:embeddable,data:data}){return embeddable.type===embeddables["ANOMALY_SWIMLANE_EMBEDDABLE_TYPE"]&&data!==undefined&&data.type===explorer_constants["h"].VIEW_BY&&data.viewByFieldName!==explorer_constants["j"]&&data.lanes.length===1}})}const SWIM_LANE_SELECTION_TRIGGER="SWIM_LANE_SELECTION_TRIGGER";const swimLaneSelectionTrigger={id:SWIM_LANE_SELECTION_TRIGGER,title:"",description:"Swim lane selection triggered"};var external_kbnSharedDeps_Moment_=__webpack_require__(12);var external_kbnSharedDeps_Moment_default=__webpack_require__.n(external_kbnSharedDeps_Moment_);const APPLY_TIME_RANGE_SELECTION_ACTION="applyTimeRangeSelectionAction";function createApplyTimeRangeSelectionAction(getStartServices){return Object(public_["createAction"])({id:"apply-time-range-selection",type:APPLY_TIME_RANGE_SELECTION_ACTION,getIconType(context){return"timeline"},getDisplayName:()=>external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.ml.actions.applyTimeRangeSelectionTitle",{defaultMessage:"Apply time range selection"}),async execute({embeddable:embeddable,data:data}){if(!data){throw new Error("No swim lane selection data provided")}const[,pluginStart]=await getStartServices();const timefilter=pluginStart.data.query.timefilter.timefilter;const{interval:interval}=embeddable.getOutput();if(!interval){throw new Error("Interval is required to set a time range")}let[from,to]=data.times;from=from*1e3;to=to*1e3;timefilter.setTime({from:external_kbnSharedDeps_Moment_default()(from),to:external_kbnSharedDeps_Moment_default()(to),mode:"absolute"})},async isCompatible({embeddable:embeddable,data:data}){return embeddable.type===embeddables["ANOMALY_SWIMLANE_EMBEDDABLE_TYPE"]&&data!==undefined}})}const CLEAR_SELECTION_ACTION="clearSelectionAction";function createClearSelectionAction(getStartServices){return Object(public_["createAction"])({id:"clear-selection-action",type:CLEAR_SELECTION_ACTION,getIconType(context){return"cross"},getDisplayName:()=>external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.ml.actions.clearSelectionTitle",{defaultMessage:"Clear selection"}),shouldAutoExecute:()=>Promise.resolve(false),async execute({updateCallback:updateCallback}){updateCallback()},async isCompatible({updateCallback:updateCallback}){return typeof updateCallback==="function"}})}function registerMlUiActions(uiActions,core){const editSwimlanePanelAction=createEditSwimlanePanelAction(core.getStartServices);const openInExplorerAction=createOpenInExplorerAction(core.getStartServices);const applyInfluencerFiltersAction=createApplyInfluencerFiltersAction(core.getStartServices);const applyTimeRangeSelectionAction=createApplyTimeRangeSelectionAction(core.getStartServices);const clearSelectionAction=createClearSelectionAction(core.getStartServices);uiActions.registerAction(editSwimlanePanelAction);uiActions.registerAction(openInExplorerAction);uiActions.registerAction(applyInfluencerFiltersAction);uiActions.registerAction(applyTimeRangeSelectionAction);uiActions.registerAction(clearSelectionAction);uiActions.attachAction(embeddable_public_["CONTEXT_MENU_TRIGGER"],editSwimlanePanelAction.id);uiActions.attachAction(embeddable_public_["CONTEXT_MENU_TRIGGER"],openInExplorerAction.id);uiActions.registerTrigger(swimLaneSelectionTrigger);uiActions.addTriggerAction(SWIM_LANE_SELECTION_TRIGGER,applyInfluencerFiltersAction);uiActions.addTriggerAction(SWIM_LANE_SELECTION_TRIGGER,applyTimeRangeSelectionAction);uiActions.addTriggerAction(SWIM_LANE_SELECTION_TRIGGER,openInExplorerAction);uiActions.addTriggerAction(SWIM_LANE_SELECTION_TRIGGER,clearSelectionAction)}},169:function(module,exports){},265:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return anomaly_swimlane_embeddable_factory_AnomalySwimlaneEmbeddableFactory}));var external_kbnSharedDeps_KbnI18n_=__webpack_require__(2);var http_service=__webpack_require__(99);var embeddables=__webpack_require__(89);function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class anomaly_swimlane_embeddable_factory_AnomalySwimlaneEmbeddableFactory{constructor(getStartServices){this.getStartServices=getStartServices;_defineProperty(this,"type",embeddables["ANOMALY_SWIMLANE_EMBEDDABLE_TYPE"])}async isEditable(){return true}getDisplayName(){return external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.ml.components.jobAnomalyScoreEmbeddable.displayName",{defaultMessage:"ML Anomaly Swim Lane"})}async getExplicitInput(){const[coreStart]=await this.getServices();try{const{resolveAnomalySwimlaneUserInput:resolveAnomalySwimlaneUserInput}=await Promise.all([__webpack_require__.e(0),__webpack_require__.e(3),__webpack_require__.e(1),__webpack_require__.e(2),__webpack_require__.e(4),__webpack_require__.e(5),__webpack_require__.e(6),__webpack_require__.e(7),__webpack_require__.e(8),__webpack_require__.e(9)]).then(__webpack_require__.bind(null,843));return await resolveAnomalySwimlaneUserInput(coreStart)}catch(e){return Promise.reject()}}async getServices(){const[coreStart,pluginsStart]=await this.getStartServices();const{AnomalyDetectorService:AnomalyDetectorService}=await Promise.all([__webpack_require__.e(0),__webpack_require__.e(19)]).then(__webpack_require__.bind(null,379));const{AnomalyTimelineService:AnomalyTimelineService}=await __webpack_require__.e(17).then(__webpack_require__.bind(null,371));const{mlApiServicesProvider:mlApiServicesProvider}=await __webpack_require__.e(0).then(__webpack_require__.bind(null,59));const{mlResultsServiceProvider:mlResultsServiceProvider}=await Promise.all([__webpack_require__.e(0),__webpack_require__.e(3),__webpack_require__.e(1),__webpack_require__.e(4),__webpack_require__.e(7)]).then(__webpack_require__.bind(null,114));const httpService=new http_service["a"](coreStart.http);const anomalyDetectorService=new AnomalyDetectorService(httpService);const anomalyTimelineService=new AnomalyTimelineService(pluginsStart.data.query.timefilter.timefilter,coreStart.uiSettings,mlResultsServiceProvider(mlApiServicesProvider(httpService)));return[coreStart,pluginsStart,{anomalyDetectorService:anomalyDetectorService,anomalyTimelineService:anomalyTimelineService}]}async create(initialInput,parent){const services=await this.getServices();const{AnomalySwimlaneEmbeddable:AnomalySwimlaneEmbeddable}=await __webpack_require__.e(20).then(__webpack_require__.bind(null,266));return new AnomalySwimlaneEmbeddable(initialInput,services,parent)}}},69:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"c",(function(){return EXPLORER_ACTION}));__webpack_require__.d(__webpack_exports__,"d",(function(){return FILTER_ACTION}));__webpack_require__.d(__webpack_exports__,"h",(function(){return SWIMLANE_TYPE}));__webpack_require__.d(__webpack_exports__,"b",(function(){return CHART_TYPE}));__webpack_require__.d(__webpack_exports__,"e",(function(){return MAX_CATEGORY_EXAMPLES}));__webpack_require__.d(__webpack_exports__,"f",(function(){return MAX_INFLUENCER_FIELD_VALUES}));__webpack_require__.d(__webpack_exports__,"j",(function(){return VIEW_BY_JOB_LABEL}));__webpack_require__.d(__webpack_exports__,"g",(function(){return OVERALL_LABEL}));__webpack_require__.d(__webpack_exports__,"a",(function(){return ANOMALY_SWIM_LANE_HARD_LIMIT}));__webpack_require__.d(__webpack_exports__,"i",(function(){return SWIM_LANE_DEFAULT_PAGE_SIZE}));var _kbn_i18n__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(2);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__);const DRAG_SELECT_ACTION={NEW_SELECTION:"newSelection",ELEMENT_SELECT:"elementSelect",DRAG_START:"dragStart"};const EXPLORER_ACTION={CLEAR_INFLUENCER_FILTER_SETTINGS:"clearInfluencerFilterSettings",CLEAR_JOBS:"clearJobs",JOB_SELECTION_CHANGE:"jobSelectionChange",SET_CHARTS:"setCharts",SET_EXPLORER_DATA:"setExplorerData",SET_FILTER_DATA:"setFilterData",SET_INFLUENCER_FILTER_SETTINGS:"setInfluencerFilterSettings",SET_SELECTED_CELLS:"setSelectedCells",SET_SWIMLANE_CONTAINER_WIDTH:"setSwimlaneContainerWidth",SET_VIEW_BY_SWIMLANE_FIELD_NAME:"setViewBySwimlaneFieldName",SET_VIEW_BY_SWIMLANE_LOADING:"setViewBySwimlaneLoading",SET_VIEW_BY_PER_PAGE:"setViewByPerPage",SET_VIEW_BY_FROM_PAGE:"setViewByFromPage"};const FILTER_ACTION={ADD:"+",REMOVE:"-"};const SWIMLANE_TYPE={OVERALL:"overall",VIEW_BY:"viewBy"};const CHART_TYPE={EVENT_DISTRIBUTION:"event_distribution",POPULATION_DISTRIBUTION:"population_distribution",SINGLE_METRIC:"single_metric",GEO_MAP:"geo_map"};const MAX_CATEGORY_EXAMPLES=10;const MAX_INFLUENCER_FIELD_VALUES=10;const MAX_INFLUENCER_FIELD_NAMES=50;const VIEW_BY_JOB_LABEL=_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate("xpack.ml.explorer.jobIdLabel",{defaultMessage:"job ID"});const OVERALL_LABEL=_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate("xpack.ml.explorer.overallLabel",{defaultMessage:"Overall"});const ANOMALY_SWIM_LANE_HARD_LIMIT=1e3;const SWIM_LANE_DEFAULT_PAGE_SIZE=10},89:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"registerEmbeddables",(function(){return registerEmbeddables}));var _anomaly_swimlane__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(265);var _constants__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(25);__webpack_require__.d(__webpack_exports__,"ANOMALY_SWIMLANE_EMBEDDABLE_TYPE",(function(){return _constants__WEBPACK_IMPORTED_MODULE_1__["a"]}));var _types__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(169);var _types__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_types__WEBPACK_IMPORTED_MODULE_2__);function registerEmbeddables(embeddable,core){const anomalySwimlaneEmbeddableFactory=new _anomaly_swimlane__WEBPACK_IMPORTED_MODULE_0__["a"](core.getStartServices);embeddable.registerEmbeddableFactory(anomalySwimlaneEmbeddableFactory.type,anomalySwimlaneEmbeddableFactory)}},99:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"b",(function(){return http}));__webpack_require__.d(__webpack_exports__,"c",(function(){return http$}));__webpack_require__.d(__webpack_exports__,"a",(function(){return HttpService}));var rxjs__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(19);var rxjs__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(rxjs__WEBPACK_IMPORTED_MODULE_0__);var _util_dependency_cache__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(18);function getResultHeaders(headers){return{"Content-Type":"application/json",...headers}}function getFetchOptions(options){var _options$headers;if(!options.path){throw new Error("URL path is missing")}return{path:options.path,fetchOptions:{asSystemRequest:true,credentials:"same-origin",method:options.method||"GET",...options.body?{body:options.body}:{},...options.query?{query:options.query}:{},headers:getResultHeaders((_options$headers=options.headers)!==null&&_options$headers!==void 0?_options$headers:{})}}}async function http(options){const{path:path,fetchOptions:fetchOptions}=getFetchOptions(options);return Object(_util_dependency_cache__WEBPACK_IMPORTED_MODULE_1__["e"])().fetch(path,fetchOptions)}function http$(options){const{path:path,fetchOptions:fetchOptions}=getFetchOptions(options);return fromHttpHandler(path,fetchOptions)}function fromHttpHandler(input,init){return new rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"](subscriber=>{const controller=new AbortController;const signal=controller.signal;let abortable=true;let unsubscribed=false;if(init!==null&&init!==void 0&&init.signal){if(init.signal.aborted){controller.abort()}else{init.signal.addEventListener("abort",()=>{if(!signal.aborted){controller.abort()}})}}const perSubscriberInit={...init?init:{},signal:signal};Object(_util_dependency_cache__WEBPACK_IMPORTED_MODULE_1__["e"])().fetch(input,perSubscriberInit).then(response=>{abortable=false;subscriber.next(response);subscriber.complete()}).catch(err=>{abortable=false;if(!unsubscribed){subscriber.error(err)}});return()=>{unsubscribed=true;if(abortable){controller.abort()}}})}class HttpService{constructor(httpStart){this.httpStart=httpStart}getResultHeaders(headers){return{"Content-Type":"application/json",...headers}}getFetchOptions(options){var _options$headers2;if(!options.path){throw new Error("URL path is missing")}return{path:options.path,fetchOptions:{asSystemRequest:true,credentials:"same-origin",method:options.method||"GET",...options.body?{body:options.body}:{},...options.query?{query:options.query}:{},headers:this.getResultHeaders((_options$headers2=options.headers)!==null&&_options$headers2!==void 0?_options$headers2:{})}}}fromHttpHandler(input,init){return new rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"](subscriber=>{const controller=new AbortController;const signal=controller.signal;let abortable=true;let unsubscribed=false;if(init!==null&&init!==void 0&&init.signal){if(init.signal.aborted){controller.abort()}else{init.signal.addEventListener("abort",()=>{if(!signal.aborted){controller.abort()}})}}const perSubscriberInit={...init?init:{},signal:signal};this.httpStart.fetch(input,perSubscriberInit).then(response=>{abortable=false;subscriber.next(response);subscriber.complete()}).catch(err=>{abortable=false;if(!unsubscribed){subscriber.error(err)}});return()=>{unsubscribed=true;if(abortable){controller.abort()}}})}async http(options){const{path:path,fetchOptions:fetchOptions}=this.getFetchOptions(options);return this.httpStart.fetch(path,fetchOptions)}http$(options){const{path:path,fetchOptions:fetchOptions}=this.getFetchOptions(options);return this.fromHttpHandler(path,fetchOptions)}}}}]);