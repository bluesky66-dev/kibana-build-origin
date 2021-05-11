(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{enumerable:true,get:getter})}};__webpack_require__.r=function(exports){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(exports,"__esModule",{value:true})};__webpack_require__.t=function(value,mode){if(mode&1)value=__webpack_require__(value);if(mode&8)return value;if(mode&4&&typeof value==="object"&&value&&value.__esModule)return value;var ns=Object.create(null);__webpack_require__.r(ns);Object.defineProperty(ns,"default",{enumerable:true,value:value});if(mode&2&&typeof value!="string")for(var key in value)__webpack_require__.d(ns,key,function(key){return value[key]}.bind(null,key));return ns};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";return __webpack_require__(__webpack_require__.s=6)})([function(module,exports){module.exports=__kbnSharedDeps__.React},function(module,exports){module.exports=__kbnSharedDeps__.MomentTimezone},function(module,exports){module.exports=__kbnSharedDeps__.RxjsOperators},function(module,exports){module.exports=__kbnSharedDeps__.ReactDom},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/kibanaUtils/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,exports){module.exports=__kbnSharedDeps__.Rxjs},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_val_loader_dist_cjs_js_key_usageCollection_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(7);var _node_modules_val_loader_dist_cjs_js_key_usageCollection_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_val_loader_dist_cjs_js_key_usageCollection_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__);__kbnBundles__.define("plugin/usageCollection/public",__webpack_require__,8)},function(module,exports,__webpack_require__){__webpack_require__.p=window.__kbnPublicPath__["usageCollection"]},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"METRIC_TYPE",(function(){return METRIC_TYPE}));__webpack_require__.d(__webpack_exports__,"UsageCollectionSetup",(function(){return undefined}));__webpack_require__.d(__webpack_exports__,"UsageCollectionStart",(function(){return undefined}));__webpack_require__.d(__webpack_exports__,"TrackApplicationView",(function(){return TrackApplicationView}));__webpack_require__.d(__webpack_exports__,"plugin",(function(){return public_plugin}));function wrapArray(subj){return Array.isArray(subj)?subj:[subj]}class UnreachableCaseError extends Error{constructor(val){super(`Unreachable case: ${val}`)}}function createUiCounterMetric({type:type,appName:appName,eventName:eventName,count:count=1}){return{type:type,appName:appName,eventName:eventName,count:count}}function trackUsageAgent(appName){const userAgent=window&&window.navigator&&window.navigator.userAgent||"";return{type:METRIC_TYPE.USER_AGENT,appName:appName,userAgent:userAgent}}var external_kbnSharedDeps_MomentTimezone_=__webpack_require__(1);var external_kbnSharedDeps_MomentTimezone_default=__webpack_require__.n(external_kbnSharedDeps_MomentTimezone_);function createApplicationUsageMetric(appId,viewId){return{type:METRIC_TYPE.APPLICATION_USAGE,appId:appId,viewId:viewId,startTime:external_kbnSharedDeps_MomentTimezone_default()(),numberOfClicks:0}}let METRIC_TYPE;(function(METRIC_TYPE){METRIC_TYPE["COUNT"]="count";METRIC_TYPE["LOADED"]="loaded";METRIC_TYPE["CLICK"]="click";METRIC_TYPE["USER_AGENT"]="user_agent";METRIC_TYPE["APPLICATION_USAGE"]="application_usage"})(METRIC_TYPE||(METRIC_TYPE={}));function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class ReportStorageManager{constructor(storageKey,storage){_defineProperty(this,"storageKey",void 0);_defineProperty(this,"storage",void 0);this.storageKey=storageKey;this.storage=storage}get(){if(!this.storage)return;return this.storage.get(this.storageKey)}store(report){if(!this.storage)return;this.storage.set(this.storageKey,report)}}function application_usage_tracker_defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class application_usage_tracker_ApplicationUsageTracker{constructor(reporter){application_usage_tracker_defineProperty(this,"trackedApplicationViews",{});application_usage_tracker_defineProperty(this,"reporter",void 0);application_usage_tracker_defineProperty(this,"currentAppId",void 0);application_usage_tracker_defineProperty(this,"currentApplicationKeys",[]);application_usage_tracker_defineProperty(this,"beforeUnloadListener",void 0);application_usage_tracker_defineProperty(this,"onVisiblityChangeListener",void 0);this.reporter=reporter}createKey(appId,viewId){return{appId:appId,viewId:viewId}}static serializeKey({appId:appId,viewId:viewId}){return`${appId}-${viewId}`}trackApplications(appKeys){for(const{appId:appId,viewId:viewId}of appKeys.filter(Boolean)){const serializedKey=application_usage_tracker_ApplicationUsageTracker.serializeKey({appId:appId,viewId:viewId});if(typeof this.trackedApplicationViews[serializedKey]!=="undefined"){continue}const metric=createApplicationUsageMetric(appId,viewId);this.trackedApplicationViews[serializedKey]=metric}}attachListeners(){if(typeof window==="undefined"||typeof document==="undefined"){return}this.beforeUnloadListener=()=>{this.flushTrackedViews()};this.onVisiblityChangeListener=()=>{if(document.visibilityState==="visible"){this.resumeTrackingAll()}else if(document.visibilityState==="hidden"){this.pauseTrackingAll()}};window.addEventListener("beforeunload",this.beforeUnloadListener);document.addEventListener("visibilitychange",this.onVisiblityChangeListener)}detachListeners(){if(typeof window==="undefined"||typeof document==="undefined"){return}if(this.beforeUnloadListener){window.removeEventListener("beforeunload",this.beforeUnloadListener)}if(this.onVisiblityChangeListener){document.removeEventListener("visibilitychange",this.onVisiblityChangeListener)}}sendMetricsToReporter(metrics){metrics.forEach(metric=>{this.reporter.reportApplicationUsage(metric)})}updateViewClickCounter(viewId){if(!this.currentAppId){return}const appKey=application_usage_tracker_ApplicationUsageTracker.serializeKey({appId:this.currentAppId,viewId:viewId});if(this.trackedApplicationViews[appKey]){this.trackedApplicationViews[appKey].numberOfClicks++}}flushTrackedViews(){const appViewMetrics=Object.values(this.trackedApplicationViews);this.sendMetricsToReporter(appViewMetrics);this.trackedApplicationViews={}}start(){this.attachListeners()}stop(){this.flushTrackedViews();this.detachListeners()}setCurrentAppId(appId){this.flushTrackedViews();this.currentAppId=appId}trackApplicationViewUsage(viewId){if(!this.currentAppId){return}const appKey=this.createKey(this.currentAppId,viewId);this.trackApplications([appKey])}pauseTrackingAll(){this.currentApplicationKeys=Object.values(this.trackedApplicationViews).map(({appId:appId,viewId:viewId})=>this.createKey(appId,viewId));this.flushTrackedViews()}resumeTrackingAll(){this.trackApplications(this.currentApplicationKeys);this.currentApplicationKeys=[];this.reporter.sendReports()}flushTrackedView(viewId){if(!this.currentAppId){return}const appKey=this.createKey(this.currentAppId,viewId);const serializedKey=application_usage_tracker_ApplicationUsageTracker.serializeKey(appKey);const appViewMetric=this.trackedApplicationViews[serializedKey];this.sendMetricsToReporter([appViewMetric]);delete this.trackedApplicationViews[serializedKey]}}function report_defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}const REPORT_VERSION=3;class report_ReportManager{constructor(report){report_defineProperty(this,"report",void 0);this.report=report||report_ReportManager.createReport()}static createReport(){return{reportVersion:REPORT_VERSION}}clearReport(){this.report=report_ReportManager.createReport()}isReportEmpty(){const{uiCounter:uiCounter,userAgent:userAgent,application_usage:appUsage}=this.report;const noUiCounters=!uiCounter||Object.keys(uiCounter).length===0;const noUserAgents=!userAgent||Object.keys(userAgent).length===0;const noAppUsage=!appUsage||Object.keys(appUsage).length===0;return noUiCounters&&noUserAgents&&noAppUsage}incrementTotal(count,currentTotal){const currentTotalNumber=typeof currentTotal==="number"?currentTotal:0;return count+currentTotalNumber}assignReports(newMetrics){wrapArray(newMetrics).forEach(newMetric=>this.assignReport(this.report,newMetric));return{report:this.report}}static createMetricKey(metric){switch(metric.type){case METRIC_TYPE.USER_AGENT:{const{appName:appName,type:type}=metric;return`${appName}-${type}`}case METRIC_TYPE.CLICK:case METRIC_TYPE.LOADED:case METRIC_TYPE.COUNT:{const{appName:appName,eventName:eventName,type:type}=metric;return`${appName}-${type}-${eventName}`}case METRIC_TYPE.APPLICATION_USAGE:{const{appId:appId,viewId:viewId}=metric;return application_usage_tracker_ApplicationUsageTracker.serializeKey({appId:appId,viewId:viewId})}default:throw new UnreachableCaseError(metric)}}assignReport(report,metric){const key=report_ReportManager.createMetricKey(metric);switch(metric.type){case METRIC_TYPE.USER_AGENT:{const{appName:appName,type:type,userAgent:userAgent}=metric;if(userAgent){report.userAgent={[key]:{key:key,appName:appName,type:type,userAgent:metric.userAgent}}}return}case METRIC_TYPE.CLICK:case METRIC_TYPE.LOADED:case METRIC_TYPE.COUNT:{var _report$uiCounter$key;const{appName:appName,type:type,eventName:eventName,count:count}=metric;report.uiCounter=report.uiCounter||{};const currentTotal=(_report$uiCounter$key=report.uiCounter[key])===null||_report$uiCounter$key===void 0?void 0:_report$uiCounter$key.total;report.uiCounter[key]={key:key,appName:appName,eventName:eventName,type:type,total:this.incrementTotal(count,currentTotal)};return}case METRIC_TYPE.APPLICATION_USAGE:{const{numberOfClicks:numberOfClicks,startTime:startTime,appId:appId,viewId:viewId}=metric;const minutesOnScreen=external_kbnSharedDeps_MomentTimezone_default()().diff(startTime,"minutes",true);report.application_usage=report.application_usage||{};const appExistingData=report.application_usage[key]||{minutesOnScreen:0,numberOfClicks:0,appId:appId,viewId:viewId};report.application_usage[key]={...appExistingData,minutesOnScreen:appExistingData.minutesOnScreen+minutesOnScreen,numberOfClicks:appExistingData.numberOfClicks+numberOfClicks};return}default:throw new UnreachableCaseError(metric)}}}report_defineProperty(report_ReportManager,"REPORT_VERSION",REPORT_VERSION);function reporter_defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class reporter_Reporter{constructor(config){reporter_defineProperty(this,"checkInterval",void 0);reporter_defineProperty(this,"interval",void 0);reporter_defineProperty(this,"http",void 0);reporter_defineProperty(this,"reportManager",void 0);reporter_defineProperty(this,"storageManager",void 0);reporter_defineProperty(this,"debug",void 0);reporter_defineProperty(this,"retryCount",0);reporter_defineProperty(this,"maxRetries",3);reporter_defineProperty(this,"start",()=>{if(!this.interval){this.interval=setTimeout(()=>{this.interval=undefined;this.sendReports()},this.checkInterval)}});reporter_defineProperty(this,"reportUiCounter",(appName,type,eventNames,count)=>{const metrics=wrapArray(eventNames).map(eventName=>{this.log(`${type} Metric -> (${appName}:${eventName}):`);const report=createUiCounterMetric({type:type,appName:appName,eventName:eventName,count:count});this.log(report);return report});this.saveToReport(metrics)});reporter_defineProperty(this,"reportUserAgent",appName=>{this.log(`Reporting user-agent.`);const report=trackUsageAgent(appName);this.saveToReport([report])});reporter_defineProperty(this,"sendReports",async()=>{if(!this.reportManager.isReportEmpty()){try{await this.http(this.reportManager.report);this.flushReport()}catch(err){this.log(`Error Sending Metrics Report ${err}`);this.retryCount=this.retryCount+1;const versionMismatch=this.reportManager.report.reportVersion!==report_ReportManager.REPORT_VERSION;if(versionMismatch||this.retryCount>this.maxRetries){this.flushReport()}}}this.start()});const{http:http,storage:storage,debug:debug,checkInterval:checkInterval=9e4,storageKey:storageKey="analytics"}=config;this.http=http;this.checkInterval=checkInterval;this.storageManager=new ReportStorageManager(storageKey,storage);const storedReport=this.storageManager.get();this.reportManager=new report_ReportManager(storedReport);this.debug=!!debug}saveToReport(newMetrics){this.reportManager.assignReports(newMetrics);this.storageManager.store(this.reportManager.report)}flushReport(){this.retryCount=0;this.reportManager.clearReport();this.storageManager.store(this.reportManager.report)}log(message){if(this.debug){console.debug(message)}}reportApplicationUsage(appUsageReport){this.log(`Reporting application usage for ${appUsageReport.appId}, ${appUsageReport.viewId}`);this.saveToReport([appUsageReport])}}var external_kbnSharedDeps_React_=__webpack_require__(0);var external_kbnSharedDeps_React_default=__webpack_require__.n(external_kbnSharedDeps_React_);var public_=__webpack_require__(4);function createReporter(config){const{localStorage:localStorage,debug:debug,fetch:fetch}=config;return new reporter_Reporter({debug:debug,storage:localStorage,async http(report){const response=await fetch.post("/api/ui_counters/_report",{body:JSON.stringify({report:report}),asSystemRequest:true});if(response.status!=="ok"){throw Error("Unable to store report.")}return response}})}var external_kbnSharedDeps_Rxjs_=__webpack_require__(5);var external_kbnSharedDeps_RxjsOperators_=__webpack_require__(2);const KIBANA_STATS_TYPE="kibana_stats";const DEFAULT_MAXIMUM_WAIT_TIME_FOR_ALL_COLLECTORS_IN_S=60;const MAIN_APP_DEFAULT_VIEW_ID="main";const DO_NOT_REPORT=["kibana"];function trackApplicationUsageChange(currentAppId$,applicationUsageTracker){const windowClickSubscrition=Object(external_kbnSharedDeps_Rxjs_["fromEvent"])(window,"click").subscribe(()=>{applicationUsageTracker.updateViewClickCounter(MAIN_APP_DEFAULT_VIEW_ID)});const appIdSubscription=currentAppId$.pipe(Object(external_kbnSharedDeps_RxjsOperators_["filter"])(appId=>typeof appId==="string"&&!DO_NOT_REPORT.includes(appId)),Object(external_kbnSharedDeps_RxjsOperators_["distinctUntilChanged"])()).subscribe(appId=>{if(!appId){return}applicationUsageTracker.setCurrentAppId(appId);applicationUsageTracker.trackApplicationViewUsage(MAIN_APP_DEFAULT_VIEW_ID)});return[windowClickSubscrition,appIdSubscription]}var external_kbnSharedDeps_ReactDom_=__webpack_require__(3);var external_kbnSharedDeps_ReactDom_default=__webpack_require__.n(external_kbnSharedDeps_ReactDom_);function track_application_view_component_defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class track_application_view_component_TrackApplicationViewComponent extends external_kbnSharedDeps_React_["Component"]{constructor(...args){super(...args);track_application_view_component_defineProperty(this,"onClick",()=>{const{applicationUsageTracker:applicationUsageTracker,viewId:viewId}=this.props;applicationUsageTracker===null||applicationUsageTracker===void 0?void 0:applicationUsageTracker.updateViewClickCounter(viewId)})}componentDidMount(){const{applicationUsageTracker:applicationUsageTracker,viewId:viewId}=this.props;if(applicationUsageTracker){var _ReactDOM$findDOMNode,_ReactDOM$findDOMNode2;applicationUsageTracker.trackApplicationViewUsage(viewId);(_ReactDOM$findDOMNode=external_kbnSharedDeps_ReactDom_default.a.findDOMNode(this))===null||_ReactDOM$findDOMNode===void 0?void 0:(_ReactDOM$findDOMNode2=_ReactDOM$findDOMNode.parentNode)===null||_ReactDOM$findDOMNode2===void 0?void 0:_ReactDOM$findDOMNode2.addEventListener("click",this.onClick)}}componentWillUnmount(){const{applicationUsageTracker:applicationUsageTracker,viewId:viewId}=this.props;if(applicationUsageTracker){var _ReactDOM$findDOMNode3,_ReactDOM$findDOMNode4;applicationUsageTracker.flushTrackedView(viewId);(_ReactDOM$findDOMNode3=external_kbnSharedDeps_ReactDom_default.a.findDOMNode(this))===null||_ReactDOM$findDOMNode3===void 0?void 0:(_ReactDOM$findDOMNode4=_ReactDOM$findDOMNode3.parentNode)===null||_ReactDOM$findDOMNode4===void 0?void 0:_ReactDOM$findDOMNode4.removeEventListener("click",this.onClick)}}render(){return this.props.children}}const ApplicationUsageContext=Object(external_kbnSharedDeps_React_["createContext"])(undefined);const TrackApplicationView=props=>external_kbnSharedDeps_React_default.a.createElement(ApplicationUsageContext.Consumer,null,value=>{const propsWithTracker={...props,applicationUsageTracker:value};return external_kbnSharedDeps_React_default.a.createElement(track_application_view_component_TrackApplicationViewComponent,propsWithTracker)});function plugin_defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}function isUnauthenticated(http){const{anonymousPaths:anonymousPaths}=http;return anonymousPaths.isAnonymous(window.location.pathname)}class plugin_UsageCollectionPlugin{constructor(initializerContext){plugin_defineProperty(this,"applicationUsageTracker",void 0);plugin_defineProperty(this,"trackUserAgent",true);plugin_defineProperty(this,"subscriptions",[]);plugin_defineProperty(this,"reporter",void 0);plugin_defineProperty(this,"config",void 0);this.config=initializerContext.config.get()}setup({http:http}){const localStorage=new public_["Storage"](window.localStorage);const debug=this.config.uiCounters.debug;this.reporter=createReporter({localStorage:localStorage,debug:debug,fetch:http});this.applicationUsageTracker=new application_usage_tracker_ApplicationUsageTracker(this.reporter);const applicationUsageTracker=this.getPublicApplicationUsageTracker();return{components:{ApplicationUsageTrackingProvider:props=>external_kbnSharedDeps_React_default.a.createElement(ApplicationUsageContext.Provider,{value:applicationUsageTracker},props.children)},applicationUsageTracker:applicationUsageTracker,allowTrackUserAgent:allow=>{this.trackUserAgent=allow},reportUiCounter:this.reporter.reportUiCounter,METRIC_TYPE:METRIC_TYPE}}start({http:http,application:application}){if(!this.reporter||!this.applicationUsageTracker){throw new Error("Usage collection reporter not set up correctly")}if(this.config.uiCounters.enabled&&!isUnauthenticated(http)){this.reporter.start();this.applicationUsageTracker.start();this.subscriptions=trackApplicationUsageChange(application.currentAppId$,this.applicationUsageTracker)}if(this.trackUserAgent){this.reporter.reportUserAgent("kibana")}return{applicationUsageTracker:this.getPublicApplicationUsageTracker(),reportUiCounter:this.reporter.reportUiCounter,METRIC_TYPE:METRIC_TYPE}}stop(){if(this.applicationUsageTracker){this.applicationUsageTracker.stop();this.subscriptions.forEach(subscription=>subscription.unsubscribe())}}getPublicApplicationUsageTracker(){return{trackApplicationViewUsage:this.applicationUsageTracker.trackApplicationViewUsage.bind(this.applicationUsageTracker),flushTrackedView:this.applicationUsageTracker.flushTrackedView.bind(this.applicationUsageTracker),updateViewClickCounter:this.applicationUsageTracker.updateViewClickCounter.bind(this.applicationUsageTracker)}}}function public_plugin(initializerContext){return new plugin_UsageCollectionPlugin(initializerContext)}}]);