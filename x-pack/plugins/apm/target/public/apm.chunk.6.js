/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["apm_bundle_jsonpfunction"]=window["apm_bundle_jsonpfunction"]||[]).push([[6],{127:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return ChartPreview}));var _elastic_charts__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(15);var _elastic_charts__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_elastic_charts__WEBPACK_IMPORTED_MODULE_0__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(10);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);var react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(2);var react__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);var _hooks_use_theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(41);function ChartPreview({data:data=[],yTickFormat:yTickFormat,threshold:threshold}){const theme=Object(_hooks_use_theme__WEBPACK_IMPORTED_MODULE_3__["a"])();const thresholdOpacity=.3;const timestamps=data.map(d=>d.x);const xMin=Math.min(...timestamps);const xMax=Math.max(...timestamps);const xFormatter=Object(_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["niceTimeFormatter"])([xMin,xMax]);const values=data.map(d=>{var _d$y;return(_d$y=d.y)!==null&&_d$y!==void 0?_d$y:0});const yMax=Math.max(...values,threshold*1.2);const style={fill:theme.eui.euiColorVis2,line:{strokeWidth:2,stroke:theme.eui.euiColorVis2,opacity:1},opacity:thresholdOpacity};const rectDataValues=[{coordinates:{x0:null,x1:null,y0:threshold,y1:null}}];return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment,null,react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"m"}),react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["Chart"],{size:{height:150},"data-test-subj":"ChartPreview"},react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["Settings"],{tooltip:"none"}),react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["LineAnnotation"],{dataValues:[{dataValue:threshold}],domainType:_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["AnnotationDomainTypes"].YDomain,id:"chart_preview_line_annotation",markerPosition:"left",style:style}),react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["RectAnnotation"],{dataValues:rectDataValues,hideTooltips:true,id:"chart_preview_rect_annotation",style:style}),react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["Axis"],{id:"chart_preview_x_axis",position:_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["Position"].Bottom,showOverlappingTicks:true,tickFormat:xFormatter}),react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["Axis"],{id:"chart_preview_y_axis",position:_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["Position"].Left,tickFormat:yTickFormat,ticks:5,domain:{max:yMax}}),react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["BarSeries"],{color:theme.eui.euiColorVis1,data:data,id:"chart_preview_bar_series",xAccessor:"x",xScaleType:_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["ScaleType"].Linear,yAccessors:["y"],yScaleType:_elastic_charts__WEBPACK_IMPORTED_MODULE_0__["ScaleType"].Linear})))}},128:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return getAbsoluteTimeRange}));var _elastic_datemath__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(130);var _elastic_datemath__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_elastic_datemath__WEBPACK_IMPORTED_MODULE_0__);function getAbsoluteTimeRange(windowSize,windowUnit){var _datemath$parse$toISO,_datemath$parse;const now=(new Date).toISOString();return{start:(_datemath$parse$toISO=(_datemath$parse=_elastic_datemath__WEBPACK_IMPORTED_MODULE_0___default.a.parse(`now-${windowSize}${windowUnit}`))===null||_datemath$parse===void 0?void 0:_datemath$parse.toISOString())!==null&&_datemath$parse$toISO!==void 0?_datemath$parse$toISO:now,end:now}}},1420:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"TransactionErrorRateAlertTrigger",(function(){return TransactionErrorRateAlertTrigger}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(2);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var react_router_dom__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(11);var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);var _triggers_actions_ui_public__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(29);var _triggers_actions_ui_public__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_triggers_actions_ui_public__WEBPACK_IMPORTED_MODULE_2__);var _common_environment_filter_values__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(54);var _common_utils_formatters__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(40);var _context_apm_service_use_apm_service_context__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(47);var _context_url_params_context_use_url_params__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(36);var _hooks_use_environments_fetcher__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(111);var _hooks_use_fetcher__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(37);var _chart_preview__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(127);var _fields__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__(97);var _helper__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__(128);var _service_alert_trigger__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__(98);function TransactionErrorRateAlertTrigger(props){const{setAlertParams:setAlertParams,alertParams:alertParams,setAlertProperty:setAlertProperty}=props;const{urlParams:urlParams}=Object(_context_url_params_context_use_url_params__WEBPACK_IMPORTED_MODULE_6__["a"])();const{transactionTypes:transactionTypes}=Object(_context_apm_service_use_apm_service_context__WEBPACK_IMPORTED_MODULE_5__["a"])();const{serviceName:serviceName}=Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["useParams"])();const{start:start,end:end,transactionType:transactionType}=urlParams;const{environmentOptions:environmentOptions}=Object(_hooks_use_environments_fetcher__WEBPACK_IMPORTED_MODULE_7__["a"])({serviceName:serviceName,start:start,end:end});const{threshold:threshold,windowSize:windowSize,windowUnit:windowUnit,environment:environment}=alertParams;const thresholdAsPercent=(threshold!==null&&threshold!==void 0?threshold:0)/100;const{data:data}=Object(_hooks_use_fetcher__WEBPACK_IMPORTED_MODULE_8__["b"])(callApmApi=>{if(windowSize&&windowUnit){return callApmApi({endpoint:"GET /api/apm/alerts/chart_preview/transaction_error_rate",params:{query:{...Object(_helper__WEBPACK_IMPORTED_MODULE_11__["a"])(windowSize,windowUnit),environment:environment,serviceName:serviceName,transactionType:alertParams.transactionType}}})}},[alertParams.transactionType,environment,serviceName,windowSize,windowUnit]);if(serviceName&&!transactionTypes.length){return null}const defaultParams={threshold:30,windowSize:5,windowUnit:"m",transactionType:transactionType||transactionTypes[0],environment:urlParams.environment||_common_environment_filter_values__WEBPACK_IMPORTED_MODULE_3__["a"].value};const params={...defaultParams,...alertParams};const fields=[react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fields__WEBPACK_IMPORTED_MODULE_10__["c"],{value:serviceName}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fields__WEBPACK_IMPORTED_MODULE_10__["d"],{currentValue:params.transactionType,options:transactionTypes.map(key=>({text:key,value:key})),onChange:e=>setAlertParams("transactionType",e.target.value)}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fields__WEBPACK_IMPORTED_MODULE_10__["a"],{currentValue:params.environment,options:environmentOptions,onChange:e=>setAlertParams("environment",e.target.value)}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fields__WEBPACK_IMPORTED_MODULE_10__["b"],{value:params.threshold,unit:"%",onChange:value=>setAlertParams("threshold",value||0)}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_triggers_actions_ui_public__WEBPACK_IMPORTED_MODULE_2__["ForLastExpression"],{onChangeWindowSize:timeWindowSize=>setAlertParams("windowSize",timeWindowSize||""),onChangeWindowUnit:timeWindowUnit=>setAlertParams("windowUnit",timeWindowUnit),timeWindowSize:params.windowSize,timeWindowUnit:params.windowUnit,errors:{timeWindowSize:[],timeWindowUnit:[]}})];const chartPreview=react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_chart_preview__WEBPACK_IMPORTED_MODULE_9__["a"],{data:data,yTickFormat:d=>Object(_common_utils_formatters__WEBPACK_IMPORTED_MODULE_4__["g"])(d,1),threshold:thresholdAsPercent});return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_service_alert_trigger__WEBPACK_IMPORTED_MODULE_12__["a"],{fields:fields,defaults:defaultParams,setAlertParams:setAlertParams,setAlertProperty:setAlertProperty,chartPreview:chartPreview})}__webpack_exports__["default"]=TransactionErrorRateAlertTrigger},40:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"b",(function(){return asDecimal}));__webpack_require__.d(__webpack_exports__,"e",(function(){return asInteger}));__webpack_require__.d(__webpack_exports__,"g",(function(){return asPercent}));__webpack_require__.d(__webpack_exports__,"j",(function(){return getDateDifference}));__webpack_require__.d(__webpack_exports__,"a",(function(){return asAbsoluteDateTime}));__webpack_require__.d(__webpack_exports__,"h",(function(){return asRelativeDateTimeRange}));__webpack_require__.d(__webpack_exports__,"k",(function(){return getDurationFormatter}));__webpack_require__.d(__webpack_exports__,"i",(function(){return asTransactionRate}));__webpack_require__.d(__webpack_exports__,"c",(function(){return asDuration}));__webpack_require__.d(__webpack_exports__,"f",(function(){return asMillisecondDuration}));__webpack_require__.d(__webpack_exports__,"l",(function(){return getFixedByteFormatter}));__webpack_require__.d(__webpack_exports__,"d",(function(){return asDynamicBytes}));var external_kbnSharedDeps_ElasticNumeral_=__webpack_require__(19);var external_kbnSharedDeps_ElasticNumeral_default=__webpack_require__.n(external_kbnSharedDeps_ElasticNumeral_);var i18n=__webpack_require__(51);var is_finite_number=__webpack_require__(62);function asDecimal(value){if(!Object(is_finite_number["a"])(value)){return i18n["a"]}return external_kbnSharedDeps_ElasticNumeral_default()(value).format("0,0.0")}function asInteger(value){if(!Object(is_finite_number["a"])(value)){return i18n["a"]}return external_kbnSharedDeps_ElasticNumeral_default()(value).format("0,0")}function asPercent(numerator,denominator,fallbackResult=i18n["a"]){if(!denominator||!Object(is_finite_number["a"])(numerator)){return fallbackResult}const decimal=numerator/denominator;if(Math.abs(decimal)>=.1||decimal===0){return external_kbnSharedDeps_ElasticNumeral_default()(decimal).format("0%")}return external_kbnSharedDeps_ElasticNumeral_default()(decimal).format("0.0%")}function asDecimalOrInteger(value){if(value===0||value>=10){return asInteger(value)}return asDecimal(value)}var external_kbnSharedDeps_MomentTimezone_=__webpack_require__(23);var external_kbnSharedDeps_MomentTimezone_default=__webpack_require__.n(external_kbnSharedDeps_MomentTimezone_);function formatTimezone(momentTime){const DEFAULT_TIMEZONE_FORMAT="Z";const utcOffsetHours=momentTime.utcOffset()/60;const customTimezoneFormat=utcOffsetHours>0?`+${utcOffsetHours}`:utcOffsetHours;const utcOffsetFormatted=Number.isInteger(utcOffsetHours)?customTimezoneFormat:DEFAULT_TIMEZONE_FORMAT;return momentTime.format(`(UTC${utcOffsetFormatted})`)}function getTimeFormat(timeUnit){switch(timeUnit){case"hours":return"HH";case"minutes":return"HH:mm";case"seconds":return"HH:mm:ss";case"milliseconds":return"HH:mm:ss.SSS";default:return""}}function getDateFormat(dateUnit){switch(dateUnit){case"years":return"YYYY";case"months":return"MMM YYYY";case"days":return"MMM D, YYYY";default:return""}}const getDateDifference=({start:start,end:end,unitOfTime:unitOfTime,precise:precise})=>end.diff(start,unitOfTime,precise);function getFormatsAccordingToDateDifference(start,end){if(getDateDifference({start:start,end:end,unitOfTime:"years"})>=5){return{dateFormat:getDateFormat("years")}}if(getDateDifference({start:start,end:end,unitOfTime:"months"})>=5){return{dateFormat:getDateFormat("months")}}const dateFormatWithDays=getDateFormat("days");if(getDateDifference({start:start,end:end,unitOfTime:"days"})>1){return{dateFormat:dateFormatWithDays}}if(getDateDifference({start:start,end:end,unitOfTime:"minutes"})>=1){return{dateFormat:dateFormatWithDays,timeFormat:getTimeFormat("minutes")}}if(getDateDifference({start:start,end:end,unitOfTime:"seconds"})>=10){return{dateFormat:dateFormatWithDays,timeFormat:getTimeFormat("seconds")}}return{dateFormat:dateFormatWithDays,timeFormat:getTimeFormat("milliseconds")}}function asAbsoluteDateTime(time,timeUnit="milliseconds"){const momentTime=external_kbnSharedDeps_MomentTimezone_default()(time);const formattedTz=formatTimezone(momentTime);return momentTime.format(`${getDateFormat("days")}, ${getTimeFormat(timeUnit)} ${formattedTz}`)}function asRelativeDateTimeRange(start,end){const momentStartTime=external_kbnSharedDeps_MomentTimezone_default()(start);const momentEndTime=external_kbnSharedDeps_MomentTimezone_default()(end);const{dateFormat:dateFormat,timeFormat:timeFormat}=getFormatsAccordingToDateDifference(momentStartTime,momentEndTime);if(timeFormat){const startFormatted=momentStartTime.format(`${dateFormat}, ${timeFormat}`);const endFormatted=momentEndTime.format(timeFormat);const formattedTz=formatTimezone(momentStartTime);return`${startFormatted} - ${endFormatted} ${formattedTz}`}const startFormatted=momentStartTime.format(dateFormat);const endFormatted=momentEndTime.format(dateFormat);return`${startFormatted} - ${endFormatted}`}var external_kbnSharedDeps_KbnI18n_=__webpack_require__(0);var external_kbnSharedDeps_Moment_=__webpack_require__(17);var external_kbnSharedDeps_Moment_default=__webpack_require__.n(external_kbnSharedDeps_Moment_);var external_kbnSharedDeps_Lodash_=__webpack_require__(12);function getUnitLabelAndConvertedValue(unitKey,value){switch(unitKey){case"hours":{return{unitLabel:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.apm.formatters.hoursTimeUnitLabel",{defaultMessage:"h"}),convertedValue:asDecimalOrInteger(external_kbnSharedDeps_Moment_default.a.duration(value/1e3).asHours())}}case"minutes":{return{unitLabel:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.apm.formatters.minutesTimeUnitLabel",{defaultMessage:"min"}),convertedValue:asDecimalOrInteger(external_kbnSharedDeps_Moment_default.a.duration(value/1e3).asMinutes())}}case"seconds":{return{unitLabel:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.apm.formatters.secondsTimeUnitLabel",{defaultMessage:"s"}),convertedValue:asDecimalOrInteger(external_kbnSharedDeps_Moment_default.a.duration(value/1e3).asSeconds())}}case"milliseconds":{return{unitLabel:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.apm.formatters.millisTimeUnitLabel",{defaultMessage:"ms"}),convertedValue:asDecimalOrInteger(external_kbnSharedDeps_Moment_default.a.duration(value/1e3).asMilliseconds())}}case"microseconds":{return{unitLabel:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.apm.formatters.microsTimeUnitLabel",{defaultMessage:"μs"}),convertedValue:asInteger(value)}}}}function convertTo({unit:unit,microseconds:microseconds,defaultValue:defaultValue=i18n["a"]}){if(!Object(is_finite_number["a"])(microseconds)){return{value:defaultValue,formatted:defaultValue}}const{convertedValue:convertedValue,unitLabel:unitLabel}=getUnitLabelAndConvertedValue(unit,microseconds);return{value:convertedValue,unit:unitLabel,formatted:`${convertedValue} ${unitLabel}`}}const toMicroseconds=(value,timeUnit)=>external_kbnSharedDeps_Moment_default.a.duration(value,timeUnit).asMilliseconds()*1e3;function getDurationUnitKey(max){if(max>toMicroseconds(10,"hours")){return"hours"}if(max>toMicroseconds(10,"minutes")){return"minutes"}if(max>toMicroseconds(10,"seconds")){return"seconds"}if(max>toMicroseconds(1,"milliseconds")){return"milliseconds"}return"microseconds"}const getDurationFormatter=Object(external_kbnSharedDeps_Lodash_["memoize"])(max=>{const unit=getDurationUnitKey(max);return(value,{defaultValue:defaultValue}={})=>convertTo({unit:unit,microseconds:value,defaultValue:defaultValue})});function asTransactionRate(value){if(!Object(is_finite_number["a"])(value)){return i18n["a"]}let displayedValue;if(value===0){displayedValue="0"}else if(value<=.1){displayedValue="< 0.1"}else{displayedValue=asDecimal(value)}return external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.apm.transactionRateLabel",{defaultMessage:`{value} tpm`,values:{value:displayedValue}})}function asDuration(value,{defaultValue:defaultValue=i18n["a"]}={}){if(!Object(is_finite_number["a"])(value)){return defaultValue}const formatter=getDurationFormatter(value);return formatter(value,{defaultValue:defaultValue}).formatted}function asMillisecondDuration(value){return convertTo({unit:"milliseconds",microseconds:value}).formatted}function asKilobytes(value){return`${asDecimal(value/1e3)} KB`}function asMegabytes(value){return`${asDecimal(value/1e6)} MB`}function asGigabytes(value){return`${asDecimal(value/1e9)} GB`}function asTerabytes(value){return`${asDecimal(value/1e12)} TB`}function asBytes(value){return`${asDecimal(value)} B`}const bailIfNumberInvalid=cb=>val=>{if(val===null||val===undefined||isNaN(val)){return""}return cb(val)};const getFixedByteFormatter=Object(external_kbnSharedDeps_Lodash_["memoize"])(max=>{const formatter=unmemoizedFixedByteFormatter(max);return bailIfNumberInvalid(formatter)});const asDynamicBytes=bailIfNumberInvalid(value=>unmemoizedFixedByteFormatter(value)(value));const unmemoizedFixedByteFormatter=max=>{if(max>1e12){return asTerabytes}if(max>1e9){return asGigabytes}if(max>1e6){return asMegabytes}if(max>1e3){return asKilobytes}return asBytes}},41:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return useTheme}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(2);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(16);var styled_components__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_1__);function useTheme(){const theme=Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(styled_components__WEBPACK_IMPORTED_MODULE_1__["ThemeContext"]);return theme}},47:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return useApmServiceContext}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(2);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _apm_service_context__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(82);function useApmServiceContext(){return Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_apm_service_context__WEBPACK_IMPORTED_MODULE_1__["a"])}},51:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return NOT_AVAILABLE_LABEL}));__webpack_require__.d(__webpack_exports__,"b",(function(){return UNIDENTIFIED_SERVICE_NODES_LABEL}));var _kbn_i18n__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(0);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__);const NOT_AVAILABLE_LABEL=_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate("xpack.apm.notAvailableLabel",{defaultMessage:"N/A"});const UNIDENTIFIED_SERVICE_NODES_LABEL=_kbn_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate("xpack.apm.serviceNodeNameMissing",{defaultMessage:"(Empty)"})},58:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return OPEN_TELEMETRY_AGENT_NAMES}));__webpack_require__.d(__webpack_exports__,"b",(function(){return RUM_AGENT_NAMES}));__webpack_require__.d(__webpack_exports__,"c",(function(){return isJavaAgentName}));__webpack_require__.d(__webpack_exports__,"d",(function(){return isRumAgentName}));const OPEN_TELEMETRY_AGENT_NAMES=["otlp","opentelemetry/cpp","opentelemetry/dotnet","opentelemetry/erlang","opentelemetry/go","opentelemetry/java","opentelemetry/nodejs","opentelemetry/php","opentelemetry/python","opentelemetry/ruby","opentelemetry/webjs"];const AGENT_NAMES=["dotnet","go","java","js-base","nodejs","python","ruby","rum-js",...OPEN_TELEMETRY_AGENT_NAMES];const RUM_AGENT_NAMES=["js-base","rum-js","opentelemetry/webjs"];function isJavaAgentName(agentName){return agentName==="java"}function isRumAgentName(agentName){return RUM_AGENT_NAMES.includes(agentName)}},62:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return isFiniteNumber}));var lodash__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(12);var lodash__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);function isFiniteNumber(value){return Object(lodash__WEBPACK_IMPORTED_MODULE_0__["isFinite"])(value)}},72:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return TRANSACTION_PAGE_LOAD}));__webpack_require__.d(__webpack_exports__,"b",(function(){return TRANSACTION_REQUEST}));const TRANSACTION_PAGE_LOAD="page-load";const TRANSACTION_REQUEST="request";const TRANSACTION_ROUTE_CHANGE="route-change"},77:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return PopoverExpression}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(2);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(10);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);function PopoverExpression(props){const{title:title,value:value,children:children}=props;const[popoverOpen,setPopoverOpen]=Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPopover"],{isOpen:popoverOpen,anchorPosition:"downLeft",closePopover:()=>setPopoverOpen(false),button:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiExpression"],{description:title,value:value,isActive:popoverOpen,onClick:()=>setPopoverOpen(true)}),repositionOnScroll:true},children)}},82:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return APMServiceContext}));__webpack_require__.d(__webpack_exports__,"b",(function(){return ApmServiceContextProvider}));var external_kbnSharedDeps_React_=__webpack_require__(2);var external_kbnSharedDeps_React_default=__webpack_require__.n(external_kbnSharedDeps_React_);var agent_name=__webpack_require__(58);var transaction_types=__webpack_require__(72);var external_kbnSharedDeps_ReactRouterDom_=__webpack_require__(11);var use_fetcher=__webpack_require__(37);var use_url_params=__webpack_require__(36);const INITIAL_DATA={transactionTypes:[]};function useServiceTransactionTypesFetcher(){const{serviceName:serviceName}=Object(external_kbnSharedDeps_ReactRouterDom_["useParams"])();const{urlParams:urlParams}=Object(use_url_params["a"])();const{start:start,end:end}=urlParams;const{data:data=INITIAL_DATA}=Object(use_fetcher["b"])(callApmApi=>{if(serviceName&&start&&end){return callApmApi({endpoint:"GET /api/apm/services/{serviceName}/transaction_types",params:{path:{serviceName:serviceName},query:{start:start,end:end}}})}},[serviceName,start,end]);return data.transactionTypes}function useServiceAgentNameFetcher(){const{serviceName:serviceName}=Object(external_kbnSharedDeps_ReactRouterDom_["useParams"])();const{urlParams:urlParams}=Object(use_url_params["a"])();const{start:start,end:end}=urlParams;const{data:data,error:error,status:status}=Object(use_fetcher["b"])(callApmApi=>{if(serviceName&&start&&end){return callApmApi({endpoint:"GET /api/apm/services/{serviceName}/agent_name",params:{path:{serviceName:serviceName},query:{start:start,end:end}}})}},[serviceName,start,end]);return{agentName:data===null||data===void 0?void 0:data.agentName,status:status,error:error}}const APMServiceContext=Object(external_kbnSharedDeps_React_["createContext"])({transactionTypes:[]});function ApmServiceContextProvider({children:children}){const{urlParams:urlParams}=Object(use_url_params["a"])();const{agentName:agentName}=useServiceAgentNameFetcher();const transactionTypes=useServiceTransactionTypesFetcher();const transactionType=getTransactionType({urlParams:urlParams,transactionTypes:transactionTypes,agentName:agentName});return external_kbnSharedDeps_React_default.a.createElement(APMServiceContext.Provider,{value:{agentName:agentName,transactionType:transactionType,transactionTypes:transactionTypes},children:children})}function getTransactionType({urlParams:urlParams,transactionTypes:transactionTypes,agentName:agentName}){if(urlParams.transactionType){return urlParams.transactionType}if(!agentName||transactionTypes.length===0){return}const defaultTransactionType=Object(agent_name["d"])(agentName)?transaction_types["a"]:transaction_types["b"];return transactionTypes.includes(defaultTransactionType)?defaultTransactionType:transactionTypes[0]}},97:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"c",(function(){return ServiceField}));__webpack_require__.d(__webpack_exports__,"a",(function(){return EnvironmentField}));__webpack_require__.d(__webpack_exports__,"d",(function(){return TransactionTypeField}));__webpack_require__.d(__webpack_exports__,"b",(function(){return IsAboveField}));var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(10);var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);var react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2);var react__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(0);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__);var _common_environment_filter_values__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(54);var _service_alert_trigger_popover_expression__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(77);const ALL_OPTION=_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("xpack.apm.alerting.fields.all_option",{defaultMessage:"All"});function ServiceField({value:value}){return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiExpression"],{description:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("xpack.apm.alerting.fields.service",{defaultMessage:"Service"}),value:value||ALL_OPTION})}function EnvironmentField({currentValue:currentValue,options:options,onChange:onChange}){return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_service_alert_trigger_popover_expression__WEBPACK_IMPORTED_MODULE_4__["a"],{value:Object(_common_environment_filter_values__WEBPACK_IMPORTED_MODULE_3__["c"])(currentValue),title:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("xpack.apm.alerting.fields.environment",{defaultMessage:"Environment"})},react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSelect"],{defaultValue:currentValue,options:options,onChange:onChange,compressed:true}))}function TransactionTypeField({currentValue:currentValue,options:options,onChange:onChange}){const label=_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("xpack.apm.alerting.fields.type",{defaultMessage:"Type"});if(!options||options.length<=1){return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiExpression"],{description:label,value:currentValue||ALL_OPTION})}return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_service_alert_trigger_popover_expression__WEBPACK_IMPORTED_MODULE_4__["a"],{value:currentValue,title:label},react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSelect"],{"data-test-subj":"transactionTypeField",defaultValue:currentValue,options:options,onChange:onChange,compressed:true}))}function IsAboveField({value:value,unit:unit,onChange:onChange,step:step}){return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_service_alert_trigger_popover_expression__WEBPACK_IMPORTED_MODULE_4__["a"],{value:value?`${value.toString()}${unit}`:"",title:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("xpack.apm.transactionErrorRateAlertTrigger.isAbove",{defaultMessage:"is above"})},react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFieldNumber"],{value:value!==null&&value!==void 0?value:"",onChange:e=>onChange(parseInt(e.target.value,10)),append:unit,compressed:true,step:step}))}},98:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return ServiceAlertTrigger}));var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(10);var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);var react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2);var react__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);var react_router_dom__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(11);var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);function ServiceAlertTrigger(props){const{serviceName:serviceName}=Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["useParams"])();const{fields:fields,setAlertParams:setAlertParams,defaults:defaults,chartPreview:chartPreview}=props;const params={...defaults,serviceName:serviceName};Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(()=>{Object.keys(params).forEach(key=>{setAlertParams(key,params[key])})},[]);return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment,null,react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"],{size:"l"}),react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGrid"],{gutterSize:"l",direction:"row",columns:2},fields.map((field,index)=>react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"],{grow:false,key:index},field))),chartPreview,react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"],{size:"m"}))}}}]);