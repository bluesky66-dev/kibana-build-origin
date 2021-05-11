/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */(function(modules){function webpackJsonpCallback(data){var chunkIds=data[0];var moreModules=data[1];var moduleId,chunkId,i=0,resolves=[];for(;i<chunkIds.length;i++){chunkId=chunkIds[i];if(Object.prototype.hasOwnProperty.call(installedChunks,chunkId)&&installedChunks[chunkId]){resolves.push(installedChunks[chunkId][0])}installedChunks[chunkId]=0}for(moduleId in moreModules){if(Object.prototype.hasOwnProperty.call(moreModules,moduleId)){modules[moduleId]=moreModules[moduleId]}}if(parentJsonpFunction)parentJsonpFunction(data);while(resolves.length){resolves.shift()()}}var installedModules={};var installedChunks={0:0};function jsonpScriptSrc(chunkId){return __webpack_require__.p+"logstash.chunk."+chunkId+".js"}function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.e=function requireEnsure(chunkId){var promises=[];var installedChunkData=installedChunks[chunkId];if(installedChunkData!==0){if(installedChunkData){promises.push(installedChunkData[2])}else{var promise=new Promise((function(resolve,reject){installedChunkData=installedChunks[chunkId]=[resolve,reject]}));promises.push(installedChunkData[2]=promise);var script=document.createElement("script");var onScriptComplete;script.charset="utf-8";script.timeout=120;if(__webpack_require__.nc){script.setAttribute("nonce",__webpack_require__.nc)}script.src=jsonpScriptSrc(chunkId);var error=new Error;onScriptComplete=function(event){script.onerror=script.onload=null;clearTimeout(timeout);var chunk=installedChunks[chunkId];if(chunk!==0){if(chunk){var errorType=event&&(event.type==="load"?"missing":event.type);var realSrc=event&&event.target&&event.target.src;error.message="Loading chunk "+chunkId+" failed.\n("+errorType+": "+realSrc+")";error.name="ChunkLoadError";error.type=errorType;error.request=realSrc;chunk[1](error)}installedChunks[chunkId]=undefined}};var timeout=setTimeout((function(){onScriptComplete({type:"timeout",target:script})}),12e4);script.onerror=script.onload=onScriptComplete;document.head.appendChild(script)}}return Promise.all(promises)};__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{enumerable:true,get:getter})}};__webpack_require__.r=function(exports){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(exports,"__esModule",{value:true})};__webpack_require__.t=function(value,mode){if(mode&1)value=__webpack_require__(value);if(mode&8)return value;if(mode&4&&typeof value==="object"&&value&&value.__esModule)return value;var ns=Object.create(null);__webpack_require__.r(ns);Object.defineProperty(ns,"default",{enumerable:true,value:value});if(mode&2&&typeof value!="string")for(var key in value)__webpack_require__.d(ns,key,function(key){return value[key]}.bind(null,key));return ns};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";__webpack_require__.oe=function(err){console.error(err);throw err};var jsonpArray=window["logstash_bundle_jsonpfunction"]=window["logstash_bundle_jsonpfunction"]||[];var oldJsonpFunction=jsonpArray.push.bind(jsonpArray);jsonpArray.push=webpackJsonpCallback;jsonpArray=jsonpArray.slice();for(var i=0;i<jsonpArray.length;i++)webpackJsonpCallback(jsonpArray[i]);var parentJsonpFunction=oldJsonpFunction;return __webpack_require__(__webpack_require__.s=9)})([function(module,exports){module.exports=__kbnSharedDeps__.Lodash},function(module,exports){module.exports=__kbnSharedDeps__.KbnI18n},function(module,exports){module.exports=__kbnSharedDeps__.Moment},function(module,exports){module.exports=__kbnSharedDeps__.Rxjs},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return TOOLTIPS}));var _kbn_i18n__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(1);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__);const TOOLTIPS={settings:{"pipeline.workers":_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate("xpack.logstash.workersTooltip",{defaultMessage:"The number of workers that will, in parallel, execute the filter and "+"output stages of the pipeline. If you find that events are backing up, "+"or that the CPU is not saturated, consider increasing this number to "+"better utilize machine processing power.\n\n"+"Default value: Number of the host’s CPU cores"}),"pipeline.batch.size":_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate("xpack.logstash.pipelineBatchSizeTooltip",{defaultMessage:"The maximum number of events an individual worker thread will collect "+"from inputs before attempting to execute its filters and outputs. Larger "+"batch sizes are generally more efficient, but come at the cost of increased "+"memory overhead. You may have to increase the JVM heap size by setting the "+"LS_HEAP_SIZE variable to effectively use the option.\n\n"+"Default value: 125"}),"pipeline.batch.delay":_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate("xpack.logstash.pipelineBatchDelayTooltip",{defaultMessage:"When creating pipeline event batches, how long in milliseconds to wait "+"for each event before dispatching an undersized batch to pipeline workers.\n\n"+"Default value: 50ms"}),"queue.type":_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate("xpack.logstash.queueTypeTooltip",{defaultMessage:"The internal queuing model to use for event buffering. Specify memory for "+"legacy in-memory based queuing, or persisted for disk-based ACKed queueing\n\n"+"Default value: memory"}),"queue.max_bytes":_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate("xpack.logstash.queueMaxBytesTooltip",{defaultMessage:"The total capacity of the queue in number of bytes. Make sure the "+"capacity of your disk drive is greater than the value you specify here.\n\n"+"Default value: 1024mb (1g)"}),"queue.checkpoint.writes":_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate("xpack.logstash.queueCheckpointWritesTooltip",{defaultMessage:"The maximum number of written events before forcing a checkpoint when "+"persistent queues are enabled. Specify 0 to set this value to unlimited.\n\n"+"Default value: 1024"})}}},function(module,exports){module.exports=__kbnSharedDeps__.RxjsOperators},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return cluster_service_ClusterService}));__webpack_require__.d(__webpack_exports__,"b",(function(){return logstash_license_service_LogstashLicenseService}));__webpack_require__.d(__webpack_exports__,"c",(function(){return monitoring_service_MonitoringService}));__webpack_require__.d(__webpack_exports__,"d",(function(){return pipeline_service_PipelineService}));__webpack_require__.d(__webpack_exports__,"e",(function(){return pipelines_service_PipelinesService}));const INDEX_NAMES={PIPELINES:".logstash"};const ROUTES={API_ROOT:"/api/logstash",MONITORING_API_ROOT:"/api/monitoring"};const PAGINATION={PAGE_SIZE:20};const PLUGIN={ID:"logstash"};const ES_SCROLL_SETTINGS={KEEPALIVE:"30s",PAGE_SIZE:100};var tooltips=__webpack_require__(4);const PIPELINE={ORIGIN:{CCM:"centralized_configuration_management",OTHER:"file_or_command_line_interface_or_pipelines_yml"}};const MONITORING={ACTIVE_PIPELINE_RANGE_S:30};var external_kbnSharedDeps_Lodash_=__webpack_require__(0);class cluster_Cluster{constructor(props){this.uuid=Object(external_kbnSharedDeps_Lodash_["get"])(props,"uuid")}static fromUpstreamJSON(cluster){return new cluster_Cluster({uuid:cluster.uuid})}}class cluster_service_ClusterService{constructor(http){this.http=http}loadCluster(){return this.http.get(`${ROUTES.API_ROOT}/cluster`).then(response=>{if(!response){return}return cluster_Cluster.fromUpstreamJSON(response.cluster)})}isClusterInfoAvailable(){return this.loadCluster().then(cluster=>Boolean(cluster)).catch(()=>false)}}var external_kbnSharedDeps_KbnI18n_=__webpack_require__(1);class logstash_license_service_LogstashLicenseService{constructor(license,navigateToApp,toasts){this.license=license;this.navigateToApp=navigateToApp;this.toasts=toasts}get enableLinks(){return this.calculated.enableLinks}get isAvailable(){return this.calculated.isAvailable}get isReadOnly(){return this.calculated.isReadOnly}get message(){return this.calculated.message}get isSecurityEnabled(){return this.license.getFeature(`security`).isEnabled}checkValidity(){return new Promise((resolve,reject)=>{if(this.isAvailable){return resolve()}return reject()})}get calculated(){if(!this.license){throw new Error(`No license available!`)}if(!this.isSecurityEnabled){return{isAvailable:false,enableLinks:false,isReadOnly:false,message:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.logstash.managementSection.enableSecurityDescription",{defaultMessage:"Security must be enabled in order to use Logstash pipeline management features."+" Please set xpack.security.enabled: true in your elasticsearch.yml."})}}if(!this.license.hasAtLeast("standard")){return{isAvailable:false,enableLinks:false,isReadOnly:false,message:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.logstash.managementSection.licenseDoesNotSupportDescription",{defaultMessage:"Your {licenseType} license does not support Logstash pipeline management features. Please upgrade your license.",values:{licenseType:this.license.type}})}}if(!this.license.isActive){return{isAvailable:true,enableLinks:true,isReadonly:true,message:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.logstash.managementSection.pipelineCrudOperationsNotAllowedDescription",{defaultMessage:"You cannot edit, create, or delete your Logstash pipelines because your {licenseType} license has expired.",values:{licenseType:this.license.type}})}}return{isAvailable:true,enableLinks:true,isReadOnly:false}}}var external_kbnSharedDeps_Moment_=__webpack_require__(2);var external_kbnSharedDeps_Moment_default=__webpack_require__.n(external_kbnSharedDeps_Moment_);function getSearchValue(obj,fields){return Object(external_kbnSharedDeps_Lodash_["values"])(Object(external_kbnSharedDeps_Lodash_["pick"])(obj,fields)).join("\n")}class pipeline_list_item_PipelineListItem{constructor(props){this.id=props.id;this.origin=props.origin;this.description=props.description;this.username=props.username;if(props.lastModified){this.lastModified=getMomentDate(props.lastModified);this.lastModifiedHumanized=Object(external_kbnSharedDeps_Lodash_["upperFirst"])(this.lastModified.fromNow())}}get searchValue(){return getSearchValue(this,["id"])}get isCentrallyManaged(){return this.origin===PIPELINE.ORIGIN.CCM}static fromUpstreamJSON(pipelineListItem){const props=Object(external_kbnSharedDeps_Lodash_["pick"])(pipelineListItem,["id","description","username"]);props.origin=PIPELINE.ORIGIN.CCM;props.lastModified=pipelineListItem.last_modified;return new pipeline_list_item_PipelineListItem(props)}static fromUpstreamMonitoringJSON(pipelineListItem){const props=Object(external_kbnSharedDeps_Lodash_["pick"])(pipelineListItem,["id"]);props.origin=PIPELINE.ORIGIN.OTHER;return new pipeline_list_item_PipelineListItem(props)}}function getMomentDate(date){if(!date){return null}return external_kbnSharedDeps_Moment_default()(date)}class monitoring_service_MonitoringService{constructor(http,isMonitoringEnabled,clusterService){this.http=http;this._isMonitoringEnabled=isMonitoringEnabled;this.clusterService=clusterService}isMonitoringEnabled(){return this._isMonitoringEnabled}getPipelineList(){if(!this.isMonitoringEnabled()){return Promise.resolve([])}return this.clusterService.loadCluster().then(cluster=>{const url=`${ROUTES.MONITORING_API_ROOT}/v1/clusters/${cluster.uuid}/logstash/pipeline_ids`;const now=external_kbnSharedDeps_Moment_default.a.utc();const body=JSON.stringify({timeRange:{max:now.toISOString(),min:now.subtract(MONITORING.ACTIVE_PIPELINE_RANGE_S,"seconds").toISOString()}});return this.http.post(url,{body:body})}).then(response=>response.map(pipeline=>pipeline_list_item_PipelineListItem.fromUpstreamMonitoringJSON(pipeline))).catch(()=>[])}}var models_pipeline=__webpack_require__(7);class pipeline_service_PipelineService{constructor(http,pipelinesService){this.http=http;this.pipelinesService=pipelinesService}loadPipeline(id){return this.http.get(`${ROUTES.API_ROOT}/pipeline/${id}`).then(response=>models_pipeline["a"].fromUpstreamJSON(response))}savePipeline(pipelineModel){return this.http.put(`${ROUTES.API_ROOT}/pipeline/${pipelineModel.id}`,{body:JSON.stringify(pipelineModel.upstreamJSON)}).catch(e=>{throw e.message})}deletePipeline(id){return this.http.delete(`${ROUTES.API_ROOT}/pipeline/${id}`).then(()=>this.pipelinesService.addToRecentlyDeleted(id)).catch(e=>{throw e.message})}}const RECENTLY_DELETED_PIPELINE_IDS_STORAGE_KEY="xpack.logstash.recentlyDeletedPipelines";class pipelines_service_PipelinesService{constructor(http,monitoringService){this.http=http;this.monitoringService=monitoringService}getPipelineList(){return Promise.all([this.getManagementPipelineList(),this.getMonitoringPipelineList()]).then(([managementPipelines,monitoringPipelines])=>{const now=Date.now();const monitoringPipelineIds=monitoringPipelines.map(pipeline=>pipeline.id);this.getRecentlyDeleted().forEach(recentlyDeletedPipeline=>{if(now-recentlyDeletedPipeline.deletedOn<MONITORING.ACTIVE_PIPELINE_RANGE_S*1e3){return}if(monitoringPipelineIds.includes(recentlyDeletedPipeline.id)){return}this.removeFromRecentlyDeleted(recentlyDeletedPipeline.id)});const managementPipelineIds=managementPipelines.map(pipeline=>pipeline.id);return managementPipelines.concat(monitoringPipelines.filter(monitoringPipeline=>!managementPipelineIds.includes(monitoringPipeline.id)&&!this.isRecentlyDeleted(monitoringPipeline.id)))})}getManagementPipelineList(){return this.http.get(`${ROUTES.API_ROOT}/pipelines`).then(response=>response.pipelines.map(pipeline=>pipeline_list_item_PipelineListItem.fromUpstreamJSON(pipeline)))}getMonitoringPipelineList(){return this.monitoringService.getPipelineList()}deletePipelines(pipelineIds){const body=JSON.stringify({pipelineIds:pipelineIds});return this.http.post(`${ROUTES.API_ROOT}/pipelines/delete`,{body:body}).then(response=>{this.addToRecentlyDeleted(...pipelineIds);return response.results})}addToRecentlyDeleted(...pipelineIds){const recentlyDeletedPipelines=this.getRecentlyDeleted();const recentlyDeletedPipelineIds=recentlyDeletedPipelines.map(pipeline=>pipeline.id);pipelineIds.forEach(pipelineId=>{if(!recentlyDeletedPipelineIds.includes(pipelineId)){recentlyDeletedPipelines.push({id:pipelineId,deletedOn:Date.now()})}});this.setRecentlyDeleted(recentlyDeletedPipelines)}removeFromRecentlyDeleted(...pipelineIds){const recentlyDeletedPipelinesToKeep=this.getRecentlyDeleted().filter(recentlyDeletedPipeline=>!pipelineIds.includes(recentlyDeletedPipeline.id));this.setRecentlyDeleted(recentlyDeletedPipelinesToKeep)}isRecentlyDeleted(pipelineId){return this.getRecentlyDeleted().map(pipeline=>pipeline.id).includes(pipelineId)}getRecentlyDeleted(){const recentlyDeletedPipelines=window.localStorage.getItem(RECENTLY_DELETED_PIPELINE_IDS_STORAGE_KEY);if(!recentlyDeletedPipelines){return[]}return JSON.parse(recentlyDeletedPipelines)}setRecentlyDeleted(recentlyDeletedPipelineIds){window.localStorage.setItem(RECENTLY_DELETED_PIPELINE_IDS_STORAGE_KEY,JSON.stringify(recentlyDeletedPipelineIds))}}},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return pipeline_Pipeline}));var external_kbnSharedDeps_Lodash_=__webpack_require__(0);function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}const emptyPipeline="input {\n"+"}\n"+"filter {\n"+"}\n"+"output {\n"+"}";const settingsDefaults={"pipeline.workers":null,"pipeline.batch.size":125,"pipeline.batch.delay":50,"queue.type":"memory","queue.max_bytes.number":1,"queue.max_bytes.units":"gb","queue.checkpoint.writes":1024};class pipeline_Pipeline{constructor(props){_defineProperty(this,"isEqualTo",otherPipeline=>{const cleanPipeline={...this};const cleanOtherPipeline={...otherPipeline};return Object(external_kbnSharedDeps_Lodash_["isEqual"])(cleanPipeline,cleanOtherPipeline)});this.id=Object(external_kbnSharedDeps_Lodash_["get"])(props,"id");this.description=Object(external_kbnSharedDeps_Lodash_["get"])(props,"description","");this.pipeline=Object(external_kbnSharedDeps_Lodash_["get"])(props,"pipeline",emptyPipeline);this.username=Object(external_kbnSharedDeps_Lodash_["get"])(props,"username");this.settings=Object(external_kbnSharedDeps_Lodash_["defaultsDeep"])(Object(external_kbnSharedDeps_Lodash_["get"])(props,"settings",{}),settingsDefaults)}get clone(){return new pipeline_Pipeline({...Object(external_kbnSharedDeps_Lodash_["omit"])(this,["id","username"])})}get upstreamJSON(){const settings=this.settings;const maxBytesNumber=Object(external_kbnSharedDeps_Lodash_["get"])(settings,"queue.max_bytes.number");const maxBytesUnits=Object(external_kbnSharedDeps_Lodash_["get"])(settings,"queue.max_bytes.units");const upstreamSettings={...settings};if(maxBytesNumber&&maxBytesUnits){delete upstreamSettings["queue.max_bytes.number"];delete upstreamSettings["queue.max_bytes.units"];upstreamSettings["queue.max_bytes"]=`${maxBytesNumber}${maxBytesUnits}`}return{description:this.description,pipeline:this.pipeline,username:this.username,settings:upstreamSettings}}static fromUpstreamJSON(pipeline){const settings=pipeline.settings;const maxBytesStr=Object(external_kbnSharedDeps_Lodash_["get"])(settings,"queue.max_bytes","");const maxBytesParts=maxBytesStr.match(/(\d+)(\w+)/);if(Array.isArray(maxBytesParts)&&maxBytesParts.length===3){const maxBytesNumber=maxBytesParts[1];const maxBytesUnits=maxBytesParts[2];if(maxBytesNumber&&maxBytesUnits){delete settings["queue.max_bytes"];settings["queue.max_bytes.number"]=parseInt(maxBytesNumber);settings["queue.max_bytes.units"]=maxBytesUnits}}return new pipeline_Pipeline({id:pipeline.id,description:pipeline.description,pipeline:pipeline.pipeline,username:pipeline.username,settings:settings})}}},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/home/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_val_loader_dist_cjs_js_key_logstash_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(10);var _node_modules_val_loader_dist_cjs_js_key_logstash_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_val_loader_dist_cjs_js_key_logstash_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__);__kbnBundles__.define("plugin/logstash/public",__webpack_require__,11)},function(module,exports,__webpack_require__){__webpack_require__.p=window.__kbnPublicPath__["logstash"]},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"plugin",(function(){return public_plugin}));var external_kbnSharedDeps_KbnI18n_=__webpack_require__(1);var external_kbnSharedDeps_Rxjs_=__webpack_require__(3);var external_kbnSharedDeps_RxjsOperators_=__webpack_require__(5);var external_kbnSharedDeps_Lodash_=__webpack_require__(0);var public_=__webpack_require__(8);var services=__webpack_require__(6);function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class plugin_LogstashPlugin{constructor(){_defineProperty(this,"licenseSubscription",void 0);_defineProperty(this,"capabilities$",new external_kbnSharedDeps_Rxjs_["Subject"])}setup(core,plugins){const logstashLicense$=plugins.licensing.license$.pipe(Object(external_kbnSharedDeps_RxjsOperators_["map"])(license=>new services["b"](license)));const managementApp=plugins.management.sections.section.ingest.registerApp({id:"pipelines",title:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.logstash.managementSection.pipelinesTitle",{defaultMessage:"Logstash Pipelines"}),order:1,mount:async params=>{const[coreStart]=await core.getStartServices();const{renderApp:renderApp}=await __webpack_require__.e(1).then(__webpack_require__.bind(null,22));const isMonitoringEnabled="monitoring"in plugins;return renderApp(coreStart,params,isMonitoringEnabled,logstashLicense$)}});this.licenseSubscription=Object(external_kbnSharedDeps_Rxjs_["combineLatest"])([logstashLicense$,this.capabilities$]).subscribe(([license,capabilities])=>{const shouldShow=license.enableLinks&&capabilities.management.ingest.pipelines===true;if(shouldShow){managementApp.enable()}else{managementApp.disable()}if(plugins.home&&shouldShow){Object(external_kbnSharedDeps_Lodash_["once"])(()=>{plugins.home.featureCatalogue.register({id:"management_logstash",title:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.logstash.homeFeature.logstashPipelinesTitle",{defaultMessage:"Logstash Pipelines"}),description:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.logstash.homeFeature.logstashPipelinesDescription",{defaultMessage:"Create, delete, update, and clone data ingestion pipelines."}),icon:"pipelineApp",path:"/app/management/ingest/pipelines",showOnHomePage:false,category:public_["FeatureCatalogueCategory"].ADMIN})})}})}start(core){this.capabilities$.next(core.application.capabilities)}stop(){if(this.licenseSubscription){this.licenseSubscription.unsubscribe()}}}const public_plugin=()=>new plugin_LogstashPlugin},function(module,exports){module.exports=__kbnSharedDeps__.React},function(module,exports){module.exports=__kbnSharedDeps__.ElasticEui},function(module,exports){module.exports=__kbnSharedDeps__.KbnI18nReact},function(module,exports){module.exports=__kbnSharedDeps__.ReactDom},function(module,exports){module.exports=__kbnSharedDeps__.ReactRouterDom},function(module,exports){module.exports=__kbnSharedDeps__.TsLib}]);