(window["visTypeTable_bundle_jsonpfunction"]=window["visTypeTable_bundle_jsonpfunction"]||[]).push([[4],{24:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"b",(function(){return VIS_TYPE_TABLE}));__webpack_require__.d(__webpack_exports__,"a",(function(){return AggTypes}));const VIS_TYPE_TABLE="table";let AggTypes;(function(AggTypes){AggTypes["SUM"]="sum";AggTypes["AVG"]="avg";AggTypes["MIN"]="min";AggTypes["MAX"]="max";AggTypes["COUNT"]="count"})(AggTypes||(AggTypes={}))},25:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return TableOptions}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(8);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);const TableOptionsComponent=Object(react__WEBPACK_IMPORTED_MODULE_0__["lazy"])(()=>__webpack_require__.e(5).then(__webpack_require__.bind(null,28)));const TableOptions=props=>react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Suspense"],{fallback:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLoadingSpinner"],null)},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TableOptionsComponent,props))},26:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return toExpressionAst}));var _expressions_public__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(13);var _expressions_public__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_expressions_public__WEBPACK_IMPORTED_MODULE_0__);var _visualizations_public__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(9);var _visualizations_public__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_visualizations_public__WEBPACK_IMPORTED_MODULE_1__);const buildTableVisConfig=(schemas,visParams)=>{const metrics=schemas.metric;const buckets=schemas.bucket||[];const visConfig={dimensions:{metrics:metrics,buckets:buckets,splitRow:schemas.split_row,splitColumn:schemas.split_column}};if(visParams.showPartialRows&&!visParams.showMetricsAtAllLevels){const metricsPerBucket=metrics.length/buckets.length;visConfig.dimensions.metrics.splice(0,metricsPerBucket*buckets.length-metricsPerBucket)}return visConfig};const toExpressionAst=(vis,params)=>{const esaggs=Object(_expressions_public__WEBPACK_IMPORTED_MODULE_0__["buildExpressionFunction"])("esaggs",{index:Object(_expressions_public__WEBPACK_IMPORTED_MODULE_0__["buildExpression"])([Object(_expressions_public__WEBPACK_IMPORTED_MODULE_0__["buildExpressionFunction"])("indexPatternLoad",{id:vis.data.indexPattern.id})]),metricsAtAllLevels:vis.isHierarchical(),partialRows:vis.params.showPartialRows,aggs:vis.data.aggs.aggs.map(agg=>Object(_expressions_public__WEBPACK_IMPORTED_MODULE_0__["buildExpression"])(agg.toExpressionAst()))});const schemas=Object(_visualizations_public__WEBPACK_IMPORTED_MODULE_1__["getVisSchemas"])(vis,params);const visConfig={...vis.params,...buildTableVisConfig(schemas,vis.params),title:vis.title};const table=Object(_expressions_public__WEBPACK_IMPORTED_MODULE_0__["buildExpressionFunction"])("kibana_table",{visConfig:JSON.stringify(visConfig)});const ast=Object(_expressions_public__WEBPACK_IMPORTED_MODULE_0__["buildExpression"])([esaggs,table]);return ast.toAst()}},54:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"registerLegacyVis",(function(){return registerLegacyVis}));function wrapArray(subj){return Array.isArray(subj)?subj:[subj]}class UnreachableCaseError extends Error{constructor(val){super(`Unreachable case: ${val}`)}}function createUiCounterMetric({type:type,appName:appName,eventName:eventName,count:count=1}){return{type:type,appName:appName,eventName:eventName,count:count}}function trackUsageAgent(appName){const userAgent=window&&window.navigator&&window.navigator.userAgent||"";return{type:METRIC_TYPE.USER_AGENT,appName:appName,userAgent:userAgent}}var external_kbnSharedDeps_MomentTimezone_=__webpack_require__(12);var external_kbnSharedDeps_MomentTimezone_default=__webpack_require__.n(external_kbnSharedDeps_MomentTimezone_);function createApplicationUsageMetric(appId,viewId){return{type:METRIC_TYPE.APPLICATION_USAGE,appId:appId,viewId:viewId,startTime:external_kbnSharedDeps_MomentTimezone_default()(),numberOfClicks:0}}let METRIC_TYPE;(function(METRIC_TYPE){METRIC_TYPE["COUNT"]="count";METRIC_TYPE["LOADED"]="loaded";METRIC_TYPE["CLICK"]="click";METRIC_TYPE["USER_AGENT"]="user_agent";METRIC_TYPE["APPLICATION_USAGE"]="application_usage"})(METRIC_TYPE||(METRIC_TYPE={}));function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class ReportStorageManager{constructor(storageKey,storage){_defineProperty(this,"storageKey",void 0);_defineProperty(this,"storage",void 0);this.storageKey=storageKey;this.storage=storage}get(){if(!this.storage)return;return this.storage.get(this.storageKey)}store(report){if(!this.storage)return;this.storage.set(this.storageKey,report)}}function application_usage_tracker_defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class application_usage_tracker_ApplicationUsageTracker{constructor(reporter){application_usage_tracker_defineProperty(this,"trackedApplicationViews",{});application_usage_tracker_defineProperty(this,"reporter",void 0);application_usage_tracker_defineProperty(this,"currentAppId",void 0);application_usage_tracker_defineProperty(this,"currentApplicationKeys",[]);application_usage_tracker_defineProperty(this,"beforeUnloadListener",void 0);application_usage_tracker_defineProperty(this,"onVisiblityChangeListener",void 0);this.reporter=reporter}createKey(appId,viewId){return{appId:appId,viewId:viewId}}static serializeKey({appId:appId,viewId:viewId}){return`${appId}-${viewId}`}trackApplications(appKeys){for(const{appId:appId,viewId:viewId}of appKeys.filter(Boolean)){const serializedKey=application_usage_tracker_ApplicationUsageTracker.serializeKey({appId:appId,viewId:viewId});if(typeof this.trackedApplicationViews[serializedKey]!=="undefined"){continue}const metric=createApplicationUsageMetric(appId,viewId);this.trackedApplicationViews[serializedKey]=metric}}attachListeners(){if(typeof window==="undefined"||typeof document==="undefined"){return}this.beforeUnloadListener=()=>{this.flushTrackedViews()};this.onVisiblityChangeListener=()=>{if(document.visibilityState==="visible"){this.resumeTrackingAll()}else if(document.visibilityState==="hidden"){this.pauseTrackingAll()}};window.addEventListener("beforeunload",this.beforeUnloadListener);document.addEventListener("visibilitychange",this.onVisiblityChangeListener)}detachListeners(){if(typeof window==="undefined"||typeof document==="undefined"){return}if(this.beforeUnloadListener){window.removeEventListener("beforeunload",this.beforeUnloadListener)}if(this.onVisiblityChangeListener){document.removeEventListener("visibilitychange",this.onVisiblityChangeListener)}}sendMetricsToReporter(metrics){metrics.forEach(metric=>{this.reporter.reportApplicationUsage(metric)})}updateViewClickCounter(viewId){if(!this.currentAppId){return}const appKey=application_usage_tracker_ApplicationUsageTracker.serializeKey({appId:this.currentAppId,viewId:viewId});if(this.trackedApplicationViews[appKey]){this.trackedApplicationViews[appKey].numberOfClicks++}}flushTrackedViews(){const appViewMetrics=Object.values(this.trackedApplicationViews);this.sendMetricsToReporter(appViewMetrics);this.trackedApplicationViews={}}start(){this.attachListeners()}stop(){this.flushTrackedViews();this.detachListeners()}setCurrentAppId(appId){this.flushTrackedViews();this.currentAppId=appId}trackApplicationViewUsage(viewId){if(!this.currentAppId){return}const appKey=this.createKey(this.currentAppId,viewId);this.trackApplications([appKey])}pauseTrackingAll(){this.currentApplicationKeys=Object.values(this.trackedApplicationViews).map(({appId:appId,viewId:viewId})=>this.createKey(appId,viewId));this.flushTrackedViews()}resumeTrackingAll(){this.trackApplications(this.currentApplicationKeys);this.currentApplicationKeys=[];this.reporter.sendReports()}flushTrackedView(viewId){if(!this.currentAppId){return}const appKey=this.createKey(this.currentAppId,viewId);const serializedKey=application_usage_tracker_ApplicationUsageTracker.serializeKey(appKey);const appViewMetric=this.trackedApplicationViews[serializedKey];this.sendMetricsToReporter([appViewMetric]);delete this.trackedApplicationViews[serializedKey]}}function report_defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}const REPORT_VERSION=3;class report_ReportManager{constructor(report){report_defineProperty(this,"report",void 0);this.report=report||report_ReportManager.createReport()}static createReport(){return{reportVersion:REPORT_VERSION}}clearReport(){this.report=report_ReportManager.createReport()}isReportEmpty(){const{uiCounter:uiCounter,userAgent:userAgent,application_usage:appUsage}=this.report;const noUiCounters=!uiCounter||Object.keys(uiCounter).length===0;const noUserAgents=!userAgent||Object.keys(userAgent).length===0;const noAppUsage=!appUsage||Object.keys(appUsage).length===0;return noUiCounters&&noUserAgents&&noAppUsage}incrementTotal(count,currentTotal){const currentTotalNumber=typeof currentTotal==="number"?currentTotal:0;return count+currentTotalNumber}assignReports(newMetrics){wrapArray(newMetrics).forEach(newMetric=>this.assignReport(this.report,newMetric));return{report:this.report}}static createMetricKey(metric){switch(metric.type){case METRIC_TYPE.USER_AGENT:{const{appName:appName,type:type}=metric;return`${appName}-${type}`}case METRIC_TYPE.CLICK:case METRIC_TYPE.LOADED:case METRIC_TYPE.COUNT:{const{appName:appName,eventName:eventName,type:type}=metric;return`${appName}-${type}-${eventName}`}case METRIC_TYPE.APPLICATION_USAGE:{const{appId:appId,viewId:viewId}=metric;return application_usage_tracker_ApplicationUsageTracker.serializeKey({appId:appId,viewId:viewId})}default:throw new UnreachableCaseError(metric)}}assignReport(report,metric){const key=report_ReportManager.createMetricKey(metric);switch(metric.type){case METRIC_TYPE.USER_AGENT:{const{appName:appName,type:type,userAgent:userAgent}=metric;if(userAgent){report.userAgent={[key]:{key:key,appName:appName,type:type,userAgent:metric.userAgent}}}return}case METRIC_TYPE.CLICK:case METRIC_TYPE.LOADED:case METRIC_TYPE.COUNT:{var _report$uiCounter$key;const{appName:appName,type:type,eventName:eventName,count:count}=metric;report.uiCounter=report.uiCounter||{};const currentTotal=(_report$uiCounter$key=report.uiCounter[key])===null||_report$uiCounter$key===void 0?void 0:_report$uiCounter$key.total;report.uiCounter[key]={key:key,appName:appName,eventName:eventName,type:type,total:this.incrementTotal(count,currentTotal)};return}case METRIC_TYPE.APPLICATION_USAGE:{const{numberOfClicks:numberOfClicks,startTime:startTime,appId:appId,viewId:viewId}=metric;const minutesOnScreen=external_kbnSharedDeps_MomentTimezone_default()().diff(startTime,"minutes",true);report.application_usage=report.application_usage||{};const appExistingData=report.application_usage[key]||{minutesOnScreen:0,numberOfClicks:0,appId:appId,viewId:viewId};report.application_usage[key]={...appExistingData,minutesOnScreen:appExistingData.minutesOnScreen+minutesOnScreen,numberOfClicks:appExistingData.numberOfClicks+numberOfClicks};return}default:throw new UnreachableCaseError(metric)}}}report_defineProperty(report_ReportManager,"REPORT_VERSION",REPORT_VERSION);function reporter_defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class reporter_Reporter{constructor(config){reporter_defineProperty(this,"checkInterval",void 0);reporter_defineProperty(this,"interval",void 0);reporter_defineProperty(this,"http",void 0);reporter_defineProperty(this,"reportManager",void 0);reporter_defineProperty(this,"storageManager",void 0);reporter_defineProperty(this,"debug",void 0);reporter_defineProperty(this,"retryCount",0);reporter_defineProperty(this,"maxRetries",3);reporter_defineProperty(this,"start",()=>{if(!this.interval){this.interval=setTimeout(()=>{this.interval=undefined;this.sendReports()},this.checkInterval)}});reporter_defineProperty(this,"reportUiCounter",(appName,type,eventNames,count)=>{const metrics=wrapArray(eventNames).map(eventName=>{this.log(`${type} Metric -> (${appName}:${eventName}):`);const report=createUiCounterMetric({type:type,appName:appName,eventName:eventName,count:count});this.log(report);return report});this.saveToReport(metrics)});reporter_defineProperty(this,"reportUserAgent",appName=>{this.log(`Reporting user-agent.`);const report=trackUsageAgent(appName);this.saveToReport([report])});reporter_defineProperty(this,"sendReports",async()=>{if(!this.reportManager.isReportEmpty()){try{await this.http(this.reportManager.report);this.flushReport()}catch(err){this.log(`Error Sending Metrics Report ${err}`);this.retryCount=this.retryCount+1;const versionMismatch=this.reportManager.report.reportVersion!==report_ReportManager.REPORT_VERSION;if(versionMismatch||this.retryCount>this.maxRetries){this.flushReport()}}}this.start()});const{http:http,storage:storage,debug:debug,checkInterval:checkInterval=9e4,storageKey:storageKey="analytics"}=config;this.http=http;this.checkInterval=checkInterval;this.storageManager=new ReportStorageManager(storageKey,storage);const storedReport=this.storageManager.get();this.reportManager=new report_ReportManager(storedReport);this.debug=!!debug}saveToReport(newMetrics){this.reportManager.assignReports(newMetrics);this.storageManager.store(this.reportManager.report)}flushReport(){this.retryCount=0;this.reportManager.clearReport();this.storageManager.store(this.reportManager.report)}log(message){if(this.debug){console.debug(message)}}reportApplicationUsage(appUsageReport){this.log(`Reporting application usage for ${appUsageReport.appId}, ${appUsageReport.viewId}`);this.saveToReport([appUsageReport])}}var external_kbnSharedDeps_KbnI18n_=__webpack_require__(6);var services=__webpack_require__(0);function tableVisLegacyResponseHandler(table,dimensions){const converted={tables:[]};const split=dimensions.splitColumn||dimensions.splitRow;if(split){converted.direction=dimensions.splitRow?"row":"column";const splitColumnIndex=split[0].accessor;const splitColumnFormatter=Object(services["a"])().deserialize(split[0].format);const splitColumn=table.columns[splitColumnIndex];const splitMap={};let splitIndex=0;table.rows.forEach((row,rowIndex)=>{const splitValue=row[splitColumn.id];if(!splitMap.hasOwnProperty(splitValue)){splitMap[splitValue]=splitIndex++;const tableGroup={$parent:converted,title:`${splitColumnFormatter.convert(splitValue)}: ${splitColumn.name}`,name:splitColumn.name,key:splitValue,column:splitColumnIndex,row:rowIndex,table:table,tables:[]};tableGroup.tables.push({$parent:tableGroup,columns:table.columns,rows:[]});converted.tables.push(tableGroup)}const tableIndex=splitMap[splitValue];converted.tables[tableIndex].tables[0].rows.push(row)})}else{converted.tables.push({columns:table.columns,rows:table.rows})}return converted}var common=__webpack_require__(24);const createTableVisLegacyFn=()=>({name:"kibana_table",type:"render",inputTypes:["datatable"],help:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeTable.function.help",{defaultMessage:"Table visualization"}),args:{visConfig:{types:["string","null"],default:'"{}"',help:""}},fn(input,args){const visConfig=args.visConfig&&JSON.parse(args.visConfig);const convertedData=tableVisLegacyResponseHandler(input,visConfig.dimensions);return{type:"render",as:"table_vis",value:{visData:convertedData,visType:common["b"],visConfig:visConfig}}}});const tableVisRegistry=new Map;const getTableVisLegacyRenderer=(core,context)=>({name:"table_vis",reuseDomNode:true,render:async(domNode,config,handlers)=>{let registeredController=tableVisRegistry.get(domNode);if(!registeredController){const{getTableVisualizationControllerClass:getTableVisualizationControllerClass}=await __webpack_require__.e(1).then(__webpack_require__.bind(null,55));const Controller=getTableVisualizationControllerClass(core,context);registeredController=new Controller(domNode);tableVisRegistry.set(domNode,registeredController);handlers.onDestroy(()=>{var _registeredController;(_registeredController=registeredController)===null||_registeredController===void 0?void 0:_registeredController.destroy();tableVisRegistry.delete(domNode)})}await registeredController.render(config.visData,config.visConfig,handlers);handlers.done()}});var public_=__webpack_require__(10);var table_vis_options_lazy=__webpack_require__(25);var visualizations_public_=__webpack_require__(9);var to_ast=__webpack_require__(26);const tableVisLegacyTypeDefinition={name:common["b"],title:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeTable.tableVisTitle",{defaultMessage:"Data table"}),icon:"visTable",description:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeTable.tableVisDescription",{defaultMessage:"Display data in rows and columns."}),getSupportedTriggers:()=>[visualizations_public_["VIS_EVENT_TO_TRIGGER"].filter],visConfig:{defaults:{perPage:10,showPartialRows:false,showMetricsAtAllLevels:false,sort:{columnIndex:null,direction:null},showTotal:false,totalFunc:"sum",percentageCol:""}},editorConfig:{optionsTemplate:table_vis_options_lazy["a"],schemas:[{group:public_["AggGroupNames"].Metrics,name:"metric",title:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeTable.tableVisEditorConfig.schemas.metricTitle",{defaultMessage:"Metric"}),aggFilter:["!geo_centroid","!geo_bounds"],aggSettings:{top_hits:{allowStrings:true}},min:1,defaults:[{type:"count",schema:"metric"}]},{group:public_["AggGroupNames"].Buckets,name:"bucket",title:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeTable.tableVisEditorConfig.schemas.bucketTitle",{defaultMessage:"Split rows"}),aggFilter:["!filter"]},{group:public_["AggGroupNames"].Buckets,name:"split",title:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeTable.tableVisEditorConfig.schemas.splitTitle",{defaultMessage:"Split table"}),min:0,max:1,aggFilter:["!filter"]}]},toExpressionAst:to_ast["a"],hierarchicalData:vis=>vis.params.showPartialRows||vis.params.showMetricsAtAllLevels,requiresSearch:true};const registerLegacyVis=(core,{expressions:expressions,visualizations:visualizations,usageCollection:usageCollection},context)=>{usageCollection===null||usageCollection===void 0?void 0:usageCollection.reportUiCounter("vis_type_table",METRIC_TYPE.LOADED,"legacyVisEnabled");expressions.registerFunction(createTableVisLegacyFn);expressions.registerRenderer(getTableVisLegacyRenderer(core,context));visualizations.createBaseVisualization(tableVisLegacyTypeDefinition)}}}]);