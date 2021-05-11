/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["securitySolution_bundle_jsonpfunction"]=window["securitySolution_bundle_jsonpfunction"]||[]).push([[13],{1184:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"EndpointPackageCustomExtension",(function(){return EndpointPackageCustomExtension}));var external_kbnSharedDeps_React_=__webpack_require__(6);var external_kbnSharedDeps_React_default=__webpack_require__.n(external_kbnSharedDeps_React_);var external_kbnSharedDeps_ElasticEui_=__webpack_require__(72);var external_kbnSharedDeps_KbnI18n_=__webpack_require__(1);var external_kbnSharedDeps_KbnI18nReact_=__webpack_require__(74);var public_=__webpack_require__(94);var kibanaReact_public_=__webpack_require__(82);var routing=__webpack_require__(148);var common_=__webpack_require__(87);var constants=__webpack_require__(121);var external_kbnSharedDeps_StyledComponents_=__webpack_require__(73);var external_kbnSharedDeps_StyledComponents_default=__webpack_require__.n(external_kbnSharedDeps_StyledComponents_);var link_to_app=__webpack_require__(276);const LinkLabel=external_kbnSharedDeps_StyledComponents_default.a.span.withConfig({displayName:"LinkLabel",componentId:"sc-1ril6c5-0"})(["display:inline-block;padding-right:",";"],props=>props.theme.eui.paddingSizes.s);const LinkWithIcon=Object(external_kbnSharedDeps_React_["memo"])(({children:children,...props})=>external_kbnSharedDeps_React_default.a.createElement(link_to_app["a"],props,external_kbnSharedDeps_React_default.a.createElement(LinkLabel,null,children),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiIcon"],{type:"popout"})));LinkWithIcon.displayName="LinkWithIcon";var service=__webpack_require__(517);const SUMMARY_KEYS=["windows","macos","linux","total"];const SUMMARY_LABELS={windows:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.securitySolution.endpoint.fleetCustomExtension.trustedAppItemsSummary.windows",{defaultMessage:"Windows"}),linux:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.securitySolution.endpoint.fleetCustomExtension.trustedAppItemsSummary.linux",{defaultMessage:"Linux"}),macos:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.securitySolution.endpoint.fleetCustomExtension.trustedAppItemsSummary.macos",{defaultMessage:"Mac"}),total:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.securitySolution.endpoint.fleetCustomExtension.trustedAppItemsSummary.total",{defaultMessage:"Total"})};const CSS_BOLD={fontWeight:"bold"};const TrustedAppItemsSummary=Object(external_kbnSharedDeps_React_["memo"])(()=>{const{services:{http:http}}=Object(kibanaReact_public_["useKibana"])();const[stats,setStats]=Object(external_kbnSharedDeps_React_["useState"])();const[trustedAppsApi]=Object(external_kbnSharedDeps_React_["useState"])(()=>new service["a"](http));Object(external_kbnSharedDeps_React_["useEffect"])(()=>{trustedAppsApi.getTrustedAppsSummary().then(response=>{setStats(response)})},[trustedAppsApi]);return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexGroup"],{responsive:false},SUMMARY_KEYS.map(stat=>{var _stats$stat;return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],null,external_kbnSharedDeps_React_default.a.createElement(SummaryStat,{value:(_stats$stat=stats===null||stats===void 0?void 0:stats[stat])!==null&&_stats$stat!==void 0?_stats$stat:0,color:stat==="total"?"primary":"default",key:stat},SUMMARY_LABELS[stat]))}))});TrustedAppItemsSummary.displayName="TrustedAppItemsSummary";const SummaryStat=Object(external_kbnSharedDeps_React_["memo"])(({children:children,value:value,color:color,...commonProps})=>external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiText"],{className:"eui-displayInlineBlock",size:"s"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexGroup"],{responsive:false,justifyContent:"center",direction:"row",alignItems:"center"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],{grow:false,style:color==="primary"?CSS_BOLD:undefined},children),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],{grow:false},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiBadge"],{color:color},value)))));SummaryStat.displayName="SummaryState";const FleetTrustedAppsCard=Object(external_kbnSharedDeps_React_["memo"])(({pkgkey:pkgkey})=>{const{services:{application:{getUrlForApp:getUrlForApp}}}=Object(kibanaReact_public_["useKibana"])();const trustedAppsListUrlPath=Object(routing["f"])();const trustedAppRouteState=Object(external_kbnSharedDeps_React_["useMemo"])(()=>{const fleetPackageCustomUrlPath=`#${public_["pagePathGetters"].integration_details_custom({pkgkey:pkgkey})}`;return{backButtonLabel:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.securitySolution.endpoint.fleetCustomExtension.backButtonLabel",{defaultMessage:"Back to Endpoint Integration"}),onBackButtonNavigateTo:[common_["PLUGIN_ID"],{path:fleetPackageCustomUrlPath}],backButtonUrl:getUrlForApp(common_["PLUGIN_ID"],{path:fleetPackageCustomUrlPath})}},[getUrlForApp,pkgkey]);return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiPanel"],{paddingSize:"l"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexGroup"],{alignItems:"baseline"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiText"],null,external_kbnSharedDeps_React_default.a.createElement("h4",null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.securitySolution.endpoint.fleetCustomExtension.trustedAppsLabel",defaultMessage:"Trusted Applications"})))),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],{grow:false},external_kbnSharedDeps_React_default.a.createElement(TrustedAppItemsSummary,null)),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],{grow:false},external_kbnSharedDeps_React_default.a.createElement("span",null,external_kbnSharedDeps_React_default.a.createElement(LinkWithIcon,{appId:constants["b"],href:getUrlForApp(constants["b"],{path:trustedAppsListUrlPath}),appPath:trustedAppsListUrlPath,appState:trustedAppRouteState,"data-test-subj":"linkToTrustedApps"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.securitySolution.endpoint.fleetCustomExtension.manageTrustedAppLinkLabel",defaultMessage:"Manage trusted applications"}))))))});FleetTrustedAppsCard.displayName="FleetTrustedAppsCard";const EndpointPackageCustomExtension=Object(external_kbnSharedDeps_React_["memo"])(props=>external_kbnSharedDeps_React_default.a.createElement("div",{"data-test-subj":"fleetEndpointPackageCustomContent"},external_kbnSharedDeps_React_default.a.createElement(FleetTrustedAppsCard,props)));EndpointPackageCustomExtension.displayName="EndpointPackageCustomExtension"},121:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"b",(function(){return MANAGEMENT_APP_ID}));__webpack_require__.d(__webpack_exports__,"i",(function(){return MANAGEMENT_ROUTING_ROOT_PATH}));__webpack_require__.d(__webpack_exports__,"f",(function(){return MANAGEMENT_ROUTING_ENDPOINTS_PATH}));__webpack_require__.d(__webpack_exports__,"g",(function(){return MANAGEMENT_ROUTING_POLICIES_PATH}));__webpack_require__.d(__webpack_exports__,"h",(function(){return MANAGEMENT_ROUTING_POLICY_DETAILS_PATH}));__webpack_require__.d(__webpack_exports__,"j",(function(){return MANAGEMENT_ROUTING_TRUSTED_APPS_PATH}));__webpack_require__.d(__webpack_exports__,"l",(function(){return MANAGEMENT_STORE_GLOBAL_NAMESPACE}));__webpack_require__.d(__webpack_exports__,"m",(function(){return MANAGEMENT_STORE_POLICY_DETAILS_NAMESPACE}));__webpack_require__.d(__webpack_exports__,"k",(function(){return MANAGEMENT_STORE_ENDPOINTS_NAMESPACE}));__webpack_require__.d(__webpack_exports__,"n",(function(){return MANAGEMENT_STORE_TRUSTED_APPS_NAMESPACE}));__webpack_require__.d(__webpack_exports__,"e",(function(){return MANAGEMENT_PAGE_SIZE_OPTIONS}));__webpack_require__.d(__webpack_exports__,"c",(function(){return MANAGEMENT_DEFAULT_PAGE}));__webpack_require__.d(__webpack_exports__,"d",(function(){return MANAGEMENT_DEFAULT_PAGE_SIZE}));__webpack_require__.d(__webpack_exports__,"a",(function(){return DEFAULT_POLL_INTERVAL}));var _types__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(195);var _common_constants__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2);var _app_types__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(3);const MANAGEMENT_APP_ID=`${_common_constants__WEBPACK_IMPORTED_MODULE_1__["f"]}:${_app_types__WEBPACK_IMPORTED_MODULE_2__["a"].administration}`;const MANAGEMENT_ROUTING_ROOT_PATH="";const MANAGEMENT_ROUTING_ENDPOINTS_PATH=`${MANAGEMENT_ROUTING_ROOT_PATH}/:tabName(${_types__WEBPACK_IMPORTED_MODULE_0__["a"].endpoints})`;const MANAGEMENT_ROUTING_POLICIES_PATH=`${MANAGEMENT_ROUTING_ROOT_PATH}/:tabName(${_types__WEBPACK_IMPORTED_MODULE_0__["a"].policies})`;const MANAGEMENT_ROUTING_POLICY_DETAILS_PATH=`${MANAGEMENT_ROUTING_ROOT_PATH}/:tabName(${_types__WEBPACK_IMPORTED_MODULE_0__["a"].policies})/:policyId`;const MANAGEMENT_ROUTING_TRUSTED_APPS_PATH=`${MANAGEMENT_ROUTING_ROOT_PATH}/:tabName(${_types__WEBPACK_IMPORTED_MODULE_0__["a"].trustedApps})`;const MANAGEMENT_STORE_GLOBAL_NAMESPACE="management";const MANAGEMENT_STORE_POLICY_DETAILS_NAMESPACE="policyDetails";const MANAGEMENT_STORE_ENDPOINTS_NAMESPACE="endpoints";const MANAGEMENT_STORE_TRUSTED_APPS_NAMESPACE="trustedApps";const MANAGEMENT_PAGE_SIZE_OPTIONS=[10,20,50];const MANAGEMENT_DEFAULT_PAGE=0;const MANAGEMENT_DEFAULT_PAGE_SIZE=10;const DEFAULT_POLL_INTERVAL=1e4},148:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"d",(function(){return getEndpointListPath}));__webpack_require__.d(__webpack_exports__,"c",(function(){return getEndpointDetailsPath}));__webpack_require__.d(__webpack_exports__,"e",(function(){return getPolicyDetailPath}));__webpack_require__.d(__webpack_exports__,"a",(function(){return extractListPaginationParams}));__webpack_require__.d(__webpack_exports__,"b",(function(){return extractTrustedAppsListPageLocation}));__webpack_require__.d(__webpack_exports__,"f",(function(){return getTrustedAppsListPath}));var lodash_fp__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(7);var lodash_fp__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(lodash_fp__WEBPACK_IMPORTED_MODULE_0__);var react_router_dom__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(75);var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);var querystring__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(214);var querystring__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(querystring__WEBPACK_IMPORTED_MODULE_2__);var _constants__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(121);var _types__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(195);var _common_components_link_to_helpers__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(169);const querystringStringify=params=>querystring__WEBPACK_IMPORTED_MODULE_2___default.a.stringify(params);const getEndpointListPath=(props,search)=>{const{name:name,...queryParams}=props;const urlQueryParams=querystringStringify(queryParams);const urlSearch=`${urlQueryParams&&!Object(lodash_fp__WEBPACK_IMPORTED_MODULE_0__["isEmpty"])(search)?"&":""}${search!==null&&search!==void 0?search:""}`;if(name==="endpointList"){return`${Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["generatePath"])(_constants__WEBPACK_IMPORTED_MODULE_3__["f"],{tabName:_types__WEBPACK_IMPORTED_MODULE_4__["a"].endpoints})}${Object(_common_components_link_to_helpers__WEBPACK_IMPORTED_MODULE_5__["a"])(`${urlQueryParams?`${urlQueryParams}${urlSearch}`:urlSearch}`)}`}return`${Object(_common_components_link_to_helpers__WEBPACK_IMPORTED_MODULE_5__["a"])(`${urlQueryParams?`${urlQueryParams}${urlSearch}`:urlSearch}`)}`};const getEndpointDetailsPath=(props,search)=>{const{name:name,...queryParams}=props;queryParams.show=props.name==="endpointPolicyResponse"?"policy_response":"";const urlQueryParams=querystringStringify(queryParams);const urlSearch=`${urlQueryParams&&!Object(lodash_fp__WEBPACK_IMPORTED_MODULE_0__["isEmpty"])(search)?"&":""}${search!==null&&search!==void 0?search:""}`;return`${Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["generatePath"])(_constants__WEBPACK_IMPORTED_MODULE_3__["f"],{tabName:_types__WEBPACK_IMPORTED_MODULE_4__["a"].endpoints})}${Object(_common_components_link_to_helpers__WEBPACK_IMPORTED_MODULE_5__["a"])(`${urlQueryParams?`${urlQueryParams}${urlSearch}`:urlSearch}`)}`};const getPoliciesPath=search=>`${Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["generatePath"])(_constants__WEBPACK_IMPORTED_MODULE_3__["g"],{tabName:_types__WEBPACK_IMPORTED_MODULE_4__["a"].policies})}${Object(_common_components_link_to_helpers__WEBPACK_IMPORTED_MODULE_5__["a"])(search)}`;const getPolicyDetailPath=(policyId,search)=>`${Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["generatePath"])(_constants__WEBPACK_IMPORTED_MODULE_3__["h"],{tabName:_types__WEBPACK_IMPORTED_MODULE_4__["a"].policies,policyId:policyId})}${Object(_common_components_link_to_helpers__WEBPACK_IMPORTED_MODULE_5__["a"])(search)}`;const isDefaultOrMissing=(value,defaultValue)=>value===undefined||value===defaultValue;const normalizeTrustedAppsPageLocation=location=>{if(location){return{...!isDefaultOrMissing(location.page_index,_constants__WEBPACK_IMPORTED_MODULE_3__["c"])?{page_index:location.page_index}:{},...!isDefaultOrMissing(location.page_size,_constants__WEBPACK_IMPORTED_MODULE_3__["d"])?{page_size:location.page_size}:{},...!isDefaultOrMissing(location.view_type,"grid")?{view_type:location.view_type}:{},...!isDefaultOrMissing(location.show,undefined)?{show:location.show}:{}}}else{return{}}};const extractFirstParamValue=(query,key)=>{const value=query[key];return Array.isArray(value)?value[value.length-1]:value};const extractPageIndex=query=>{const pageIndex=Number(extractFirstParamValue(query,"page_index"));return!Number.isFinite(pageIndex)||pageIndex<0?_constants__WEBPACK_IMPORTED_MODULE_3__["c"]:pageIndex};const extractPageSize=query=>{const pageSize=Number(extractFirstParamValue(query,"page_size"));return _constants__WEBPACK_IMPORTED_MODULE_3__["e"].includes(pageSize)?pageSize:_constants__WEBPACK_IMPORTED_MODULE_3__["d"]};const extractListPaginationParams=query=>({page_index:extractPageIndex(query),page_size:extractPageSize(query)});const extractTrustedAppsListPageLocation=query=>({...extractListPaginationParams(query),view_type:extractFirstParamValue(query,"view_type")==="list"?"list":"grid",show:extractFirstParamValue(query,"show")==="create"?"create":undefined});const getTrustedAppsListPath=location=>{const path=Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["generatePath"])(_constants__WEBPACK_IMPORTED_MODULE_3__["j"],{tabName:_types__WEBPACK_IMPORTED_MODULE_4__["a"].trustedApps});return`${path}${Object(_common_components_link_to_helpers__WEBPACK_IMPORTED_MODULE_5__["a"])(querystring__WEBPACK_IMPORTED_MODULE_2___default.a.stringify(normalizeTrustedAppsPageLocation(location)))}`}},169:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return appendSearch}));var lodash_fp__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(7);var lodash_fp__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(lodash_fp__WEBPACK_IMPORTED_MODULE_0__);const appendSearch=search=>Object(lodash_fp__WEBPACK_IMPORTED_MODULE_0__["isEmpty"])(search)?"":`${search!==null&&search!==void 0&&search.startsWith("?")?search:`?${search}`}`},195:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return AdministrationSubTab}));let AdministrationSubTab;(function(AdministrationSubTab){AdministrationSubTab["endpoints"]="endpoints";AdministrationSubTab["policies"]="policy";AdministrationSubTab["trustedApps"]="trusted_apps"})(AdministrationSubTab||(AdministrationSubTab={}))},212:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return useNavigateToAppEventHandler}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(6);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _lib_kibana__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(104);const useNavigateToAppEventHandler=(appId,options)=>{const{services:services}=Object(_lib_kibana__WEBPACK_IMPORTED_MODULE_1__["h"])();const{path:path,state:state,onClick:onClick}=options||{};return Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(ev=>{try{if(onClick){onClick(ev)}}catch(error){ev.preventDefault();throw error}if(ev.defaultPrevented){return}if(ev.button!==0){return}if(ev.currentTarget instanceof HTMLAnchorElement&&ev.currentTarget.target!==""&&ev.currentTarget.target!=="_self"){return}if(ev.metaKey||ev.altKey||ev.ctrlKey||ev.shiftKey){return}ev.preventDefault();services.application.navigateToApp(appId,{path:path,state:state})},[appId,onClick,path,services.application,state])}},214:function(module,exports,__webpack_require__){"use strict";exports.decode=exports.parse=__webpack_require__(314);exports.encode=exports.stringify=__webpack_require__(315)},276:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return LinkToApp}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(6);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(72);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);var _hooks_endpoint_use_navigate_to_app_event_handler__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(212);function _extends(){_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};return _extends.apply(this,arguments)}const LinkToApp=Object(react__WEBPACK_IMPORTED_MODULE_0__["memo"])(({appId:appId,appPath:path,appState:state,onClick:onClick,asButton:asButton,children:children,...otherProps})=>{const handleOnClick=Object(_hooks_endpoint_use_navigate_to_app_event_handler__WEBPACK_IMPORTED_MODULE_2__["a"])(appId,{path:path,state:state,onClick:onClick});return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,null,asButton&&asButton===true?react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"],_extends({},otherProps,{onClick:handleOnClick}),children):react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"],_extends({},otherProps,{onClick:handleOnClick}),children))})},314:function(module,exports,__webpack_require__){"use strict";function hasOwnProperty(obj,prop){return Object.prototype.hasOwnProperty.call(obj,prop)}module.exports=function(qs,sep,eq,options){sep=sep||"&";eq=eq||"=";var obj={};if(typeof qs!=="string"||qs.length===0){return obj}var regexp=/\+/g;qs=qs.split(sep);var maxKeys=1e3;if(options&&typeof options.maxKeys==="number"){maxKeys=options.maxKeys}var len=qs.length;if(maxKeys>0&&len>maxKeys){len=maxKeys}for(var i=0;i<len;++i){var x=qs[i].replace(regexp,"%20"),idx=x.indexOf(eq),kstr,vstr,k,v;if(idx>=0){kstr=x.substr(0,idx);vstr=x.substr(idx+1)}else{kstr=x;vstr=""}k=decodeURIComponent(kstr);v=decodeURIComponent(vstr);if(!hasOwnProperty(obj,k)){obj[k]=v}else if(isArray(obj[k])){obj[k].push(v)}else{obj[k]=[obj[k],v]}}return obj};var isArray=Array.isArray||function(xs){return Object.prototype.toString.call(xs)==="[object Array]"}},315:function(module,exports,__webpack_require__){"use strict";var stringifyPrimitive=function(v){switch(typeof v){case"string":return v;case"boolean":return v?"true":"false";case"number":return isFinite(v)?v:"";default:return""}};module.exports=function(obj,sep,eq,name){sep=sep||"&";eq=eq||"=";if(obj===null){obj=undefined}if(typeof obj==="object"){return map(objectKeys(obj),(function(k){var ks=encodeURIComponent(stringifyPrimitive(k))+eq;if(isArray(obj[k])){return map(obj[k],(function(v){return ks+encodeURIComponent(stringifyPrimitive(v))})).join(sep)}else{return ks+encodeURIComponent(stringifyPrimitive(obj[k]))}})).join(sep)}if(!name)return"";return encodeURIComponent(stringifyPrimitive(name))+eq+encodeURIComponent(stringifyPrimitive(obj))};var isArray=Array.isArray||function(xs){return Object.prototype.toString.call(xs)==="[object Array]"};function map(xs,f){if(xs.map)return xs.map(f);var res=[];for(var i=0;i<xs.length;i++){res.push(f(xs[i],i))}return res}var objectKeys=Object.keys||function(obj){var res=[];for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))res.push(key)}return res}},399:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"e",(function(){return metadataCurrentIndexPattern}));__webpack_require__.d(__webpack_exports__,"c",(function(){return TRUSTED_APPS_LIST_API}));__webpack_require__.d(__webpack_exports__,"a",(function(){return TRUSTED_APPS_CREATE_API}));__webpack_require__.d(__webpack_exports__,"b",(function(){return TRUSTED_APPS_DELETE_API}));__webpack_require__.d(__webpack_exports__,"d",(function(){return TRUSTED_APPS_SUMMARY_API}));const eventsIndexPattern="logs-endpoint.events.*";const alertsIndexPattern="logs-endpoint.alerts-*";const metadataIndexPattern="metrics-endpoint.metadata-*";const metadataCurrentIndexPattern="metrics-endpoint.metadata_current_*";const metadataTransformPrefix="endpoint.metadata_current-default";const policyIndexPattern="metrics-endpoint.policy-*";const telemetryIndexPattern="metrics-endpoint.telemetry-*";const LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG="endpoint:limited-concurrency";const LIMITED_CONCURRENCY_ENDPOINT_COUNT=100;const TRUSTED_APPS_LIST_API="/api/endpoint/trusted_apps";const TRUSTED_APPS_CREATE_API="/api/endpoint/trusted_apps";const TRUSTED_APPS_DELETE_API="/api/endpoint/trusted_apps/{id}";const TRUSTED_APPS_SUMMARY_API="/api/endpoint/trusted_apps/summary";const BASE_POLICY_RESPONSE_ROUTE=`/api/endpoint/policy_response`;const BASE_POLICY_ROUTE=`/api/endpoint/policy`;const AGENT_POLICY_SUMMARY_ROUTE=`${BASE_POLICY_ROUTE}/summaries`},517:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return service_TrustedAppsHttpService}));var constants=__webpack_require__(399);const resolvePathVariables=(path,variables)=>Object.keys(variables).reduce((acc,paramName)=>acc.replace(new RegExp(`{${paramName}}`,"g"),String(variables[paramName])),path);class service_TrustedAppsHttpService{constructor(http){this.http=http}async getTrustedAppsList(request){return this.http.get(constants["c"],{query:request})}async deleteTrustedApp(request){return this.http.delete(resolvePathVariables(constants["b"],request))}async createTrustedApp(request){return this.http.post(constants["a"],{body:JSON.stringify(request)})}async getTrustedAppsSummary(){return this.http.get(constants["d"])}}}}]);