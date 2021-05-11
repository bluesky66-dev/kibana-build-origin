/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["apm_bundle_jsonpfunction"]=window["apm_bundle_jsonpfunction"]||[]).push([[10],{1417:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"fetchUxOverviewDate",(function(){return fetchUxOverviewDate}));__webpack_require__.d(__webpack_exports__,"hasRumData",(function(){return hasRumData}));var _services_rest_createCallApmApi__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(57);__webpack_require__.d(__webpack_exports__,"createCallApmApi",(function(){return _services_rest_createCallApmApi__WEBPACK_IMPORTED_MODULE_0__["b"]}));const fetchUxOverviewDate=async({absoluteTime:absoluteTime,relativeTime:relativeTime,serviceName:serviceName})=>{const data=await Object(_services_rest_createCallApmApi__WEBPACK_IMPORTED_MODULE_0__["a"])({endpoint:"GET /api/apm/rum-client/web-core-vitals",signal:null,params:{query:{start:new Date(absoluteTime.start).toISOString(),end:new Date(absoluteTime.end).toISOString(),uiFilters:`{"serviceName":["${serviceName}"]}`}}});return{coreWebVitals:data,appLink:`/app/ux?rangeFrom=${relativeTime.start}&rangeTo=${relativeTime.end}`}};async function hasRumData({absoluteTime:absoluteTime}){return await Object(_services_rest_createCallApmApi__WEBPACK_IMPORTED_MODULE_0__["a"])({endpoint:"GET /api/apm/observability_overview/has_rum_data",signal:null,params:{query:{start:new Date(absoluteTime.start).toISOString(),end:new Date(absoluteTime.end).toISOString(),uiFilters:""}}})}}}]);