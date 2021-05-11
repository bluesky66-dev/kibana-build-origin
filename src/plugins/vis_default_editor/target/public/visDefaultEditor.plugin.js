(function(modules){function webpackJsonpCallback(data){var chunkIds=data[0];var moreModules=data[1];var moduleId,chunkId,i=0,resolves=[];for(;i<chunkIds.length;i++){chunkId=chunkIds[i];if(Object.prototype.hasOwnProperty.call(installedChunks,chunkId)&&installedChunks[chunkId]){resolves.push(installedChunks[chunkId][0])}installedChunks[chunkId]=0}for(moduleId in moreModules){if(Object.prototype.hasOwnProperty.call(moreModules,moduleId)){modules[moduleId]=moreModules[moduleId]}}if(parentJsonpFunction)parentJsonpFunction(data);while(resolves.length){resolves.shift()()}}var installedModules={};var installedChunks={0:0};function jsonpScriptSrc(chunkId){return __webpack_require__.p+"visDefaultEditor.chunk."+chunkId+".js"}function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.e=function requireEnsure(chunkId){var promises=[];var installedChunkData=installedChunks[chunkId];if(installedChunkData!==0){if(installedChunkData){promises.push(installedChunkData[2])}else{var promise=new Promise((function(resolve,reject){installedChunkData=installedChunks[chunkId]=[resolve,reject]}));promises.push(installedChunkData[2]=promise);var script=document.createElement("script");var onScriptComplete;script.charset="utf-8";script.timeout=120;if(__webpack_require__.nc){script.setAttribute("nonce",__webpack_require__.nc)}script.src=jsonpScriptSrc(chunkId);var error=new Error;onScriptComplete=function(event){script.onerror=script.onload=null;clearTimeout(timeout);var chunk=installedChunks[chunkId];if(chunk!==0){if(chunk){var errorType=event&&(event.type==="load"?"missing":event.type);var realSrc=event&&event.target&&event.target.src;error.message="Loading chunk "+chunkId+" failed.\n("+errorType+": "+realSrc+")";error.name="ChunkLoadError";error.type=errorType;error.request=realSrc;chunk[1](error)}installedChunks[chunkId]=undefined}};var timeout=setTimeout((function(){onScriptComplete({type:"timeout",target:script})}),12e4);script.onerror=script.onload=onScriptComplete;document.head.appendChild(script)}}return Promise.all(promises)};__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{enumerable:true,get:getter})}};__webpack_require__.r=function(exports){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(exports,"__esModule",{value:true})};__webpack_require__.t=function(value,mode){if(mode&1)value=__webpack_require__(value);if(mode&8)return value;if(mode&4&&typeof value==="object"&&value&&value.__esModule)return value;var ns=Object.create(null);__webpack_require__.r(ns);Object.defineProperty(ns,"default",{enumerable:true,value:value});if(mode&2&&typeof value!="string")for(var key in value)__webpack_require__.d(ns,key,function(key){return value[key]}.bind(null,key));return ns};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";__webpack_require__.oe=function(err){console.error(err);throw err};var jsonpArray=window["visDefaultEditor_bundle_jsonpfunction"]=window["visDefaultEditor_bundle_jsonpfunction"]||[];var oldJsonpFunction=jsonpArray.push.bind(jsonpArray);jsonpArray.push=webpackJsonpCallback;jsonpArray=jsonpArray.slice();for(var i=0;i<jsonpArray.length;i++)webpackJsonpCallback(jsonpArray[i]);var parentJsonpFunction=oldJsonpFunction;return __webpack_require__(__webpack_require__.s=10)})([function(module,exports){module.exports=__kbnSharedDeps__.React},function(module,exports){module.exports=__kbnSharedDeps__.ElasticEui},function(module,exports){module.exports=__kbnSharedDeps__.KbnI18n},function(module,exports){module.exports=__kbnSharedDeps__.Lodash},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"b",(function(){return RangesParamEditor}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(0);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(1);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(5);var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_2__);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(2);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_kbn_i18n__WEBPACK_IMPORTED_MODULE_3__);var lodash__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(3);var lodash__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);const FROM_PLACEHOLDER="−∞";const TO_PLACEHOLDER="+∞";const generateId=Object(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["htmlIdGenerator"])();const isEmpty=value=>value===undefined||value===null;function RangesParamEditor({"data-test-subj":dataTestSubj="range",addRangeValues:addRangeValues,error:error,value:value=[],hidePlaceholders:hidePlaceholders,setValue:setValue,setTouched:setTouched,setValidity:setValidity,validateRange:validateRange}){const[ranges,setRanges]=Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(()=>value.map(range=>({...range,id:generateId()})));const updateRanges=Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(rangeValues=>{setValue(rangeValues.map(range=>Object(lodash__WEBPACK_IMPORTED_MODULE_4__["omit"])(range,"id")));setRanges(rangeValues);if(setTouched){setTouched(true)}},[setTouched,setValue]);const onAddRange=Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(()=>addRangeValues?updateRanges([...ranges,{...addRangeValues(),id:generateId()}]):updateRanges([...ranges,{id:generateId()}]),[addRangeValues,ranges,updateRanges]);const onRemoveRange=id=>updateRanges(ranges.filter(range=>range.id!==id));const onChangeRange=(id,key,newValue)=>updateRanges(ranges.map(range=>range.id===id?{...range,[key]:newValue===""?undefined:parseFloat(newValue)}:range));Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(()=>{if(!value.length){onAddRange()}},[onAddRange,value.length]);Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(()=>{if(value.length!==ranges.length||value.some((range,index)=>!Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isEqual"])(range,Object(lodash__WEBPACK_IMPORTED_MODULE_4__["omit"])(ranges[index],"id")))){setRanges(value.map(range=>({...range,id:generateId()})))}},[ranges,value]);const hasInvalidRange=validateRange&&ranges.some(({from:from,to:to,id:id},index)=>{const[isFromValid,isToValid]=validateRange({from:from,to:to},index);return!isFromValid||!isToValid});Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(()=>{if(setValidity){setValidity(!hasInvalidRange)}},[hasInvalidRange,setValidity]);return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"],{display:"rowCompressed",fullWidth:true},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,null,ranges.map(({from:from,to:to,id:id},index)=>{const deleteBtnTitle=_kbn_i18n__WEBPACK_IMPORTED_MODULE_3__["i18n"].translate("visDefaultEditor.controls.ranges.removeRangeButtonAriaLabel",{defaultMessage:"Remove the range of {from} to {to}",values:{from:isEmpty(from)?FROM_PLACEHOLDER:from,to:isEmpty(to)?TO_PLACEHOLDER:to}});let isFromValid=true;let isToValid=true;if(validateRange){[isFromValid,isToValid]=validateRange({from:from,to:to},index)}const gtePrependLabel=_kbn_i18n__WEBPACK_IMPORTED_MODULE_3__["i18n"].translate("visDefaultEditor.controls.ranges.greaterThanOrEqualPrepend",{defaultMessage:"≥"});const gteTooltipContent=_kbn_i18n__WEBPACK_IMPORTED_MODULE_3__["i18n"].translate("visDefaultEditor.controls.ranges.greaterThanOrEqualTooltip",{defaultMessage:"Greater than or equal to"});const ltPrependLabel=_kbn_i18n__WEBPACK_IMPORTED_MODULE_3__["i18n"].translate("visDefaultEditor.controls.ranges.lessThanPrepend",{defaultMessage:"<"});const ltTooltipContent=_kbn_i18n__WEBPACK_IMPORTED_MODULE_3__["i18n"].translate("visDefaultEditor.controls.ranges.lessThanTooltip",{defaultMessage:"Less than"});return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"],{key:id},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"],{gutterSize:"s",alignItems:"center",responsive:false},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldNumber"],{"aria-label":_kbn_i18n__WEBPACK_IMPORTED_MODULE_3__["i18n"].translate("visDefaultEditor.controls.ranges.fromLabel",{defaultMessage:"From"}),"data-test-subj":`${dataTestSubj}${index}__from`,value:isEmpty(from)?"":from,placeholder:hidePlaceholders?undefined:FROM_PLACEHOLDER,onChange:ev=>onChangeRange(id,"from",ev.target.value),fullWidth:true,compressed:true,isInvalid:!isFromValid,prepend:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiToolTip"],{content:gteTooltipContent},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"],{size:"s"},gtePrependLabel))})),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],{grow:false},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"],{type:"sortRight",color:"subdued"})),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldNumber"],{"aria-label":_kbn_i18n__WEBPACK_IMPORTED_MODULE_3__["i18n"].translate("visDefaultEditor.controls.ranges.toLabel",{defaultMessage:"To"}),"data-test-subj":`${dataTestSubj}${index}__to`,value:isEmpty(to)?"":to,placeholder:hidePlaceholders?undefined:TO_PLACEHOLDER,onChange:ev=>onChangeRange(id,"to",ev.target.value),fullWidth:true,compressed:true,isInvalid:!isToValid,prepend:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiToolTip"],{content:ltTooltipContent},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"],{size:"s"},ltPrependLabel))})),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],{grow:false},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButtonIcon"],{title:deleteBtnTitle,"aria-label":deleteBtnTitle,disabled:value.length===1,color:"danger",iconType:"trash",onClick:()=>onRemoveRange(id)}))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"xs"}))}),hasInvalidRange&&error&&react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormErrorText"],null,error),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"s"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"],null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButtonEmpty"],{"data-test-subj":`${dataTestSubj}__addRangeButton`,iconType:"plusInCircleFilled",onClick:onAddRange,size:"xs"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_2__["FormattedMessage"],{id:"visDefaultEditor.controls.ranges.addRangeButtonLabel",defaultMessage:"Add range"})))))}},function(module,exports){module.exports=__kbnSharedDeps__.KbnI18nReact},function(module,exports){module.exports=__kbnSharedDeps__.ReactDom},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"f",(function(){return useSubAggParamsHandlers}));__webpack_require__.d(__webpack_exports__,"h",(function(){return wrapWithInlineComp}));__webpack_require__.d(__webpack_exports__,"c",(function(){return parseCommaSeparatedList}));__webpack_require__.d(__webpack_exports__,"a",(function(){return formatListAsProse}));__webpack_require__.d(__webpack_exports__,"b",(function(){return isCompatibleAggregation}));__webpack_require__.d(__webpack_exports__,"d",(function(){return useAvailableOptions}));__webpack_require__.d(__webpack_exports__,"e",(function(){return useFallbackMetric}));__webpack_require__.d(__webpack_exports__,"g",(function(){return useValidation}));var external_kbnSharedDeps_React_=__webpack_require__(0);var external_kbnSharedDeps_React_default=__webpack_require__.n(external_kbnSharedDeps_React_);function useSubAggParamsHandlers(agg,aggParam,subAgg,setValue){const setAggParamValue=Object(external_kbnSharedDeps_React_["useCallback"])((aggId,paramName,val)=>{const parsedParams=subAgg.toJSON();const params={...parsedParams,params:{...parsedParams.params,[paramName]:val}};setValue(aggParam.makeAgg(agg,params))},[agg,aggParam,setValue,subAgg]);const onAggTypeChange=Object(external_kbnSharedDeps_React_["useCallback"])((aggId,aggType)=>{const parsedAgg=subAgg.toJSON();const params={...parsedAgg,type:aggType};setValue(aggParam.makeAgg(agg,params))},[agg,aggParam,setValue,subAgg]);return{onAggTypeChange:onAggTypeChange,setAggParamValue:setAggParamValue}}const wrapWithInlineComp=WrapComponent=>props=>external_kbnSharedDeps_React_default.a.createElement("div",{className:`visEditorAggParam--half visEditorAggParam--half-${props.aggParam.name}`},external_kbnSharedDeps_React_default.a.createElement(WrapComponent,props));function parseCommaSeparatedList(input){if(Array.isArray(input)){return input}return String(input||"").split(",").map(word=>word.trim()).filter(Boolean)}function formatListAsProse(list,options={}){const{inclusive:inclusive=true}=options;const count=list.length;const conjunction=inclusive?"and":"or";if(count<=2){return list.join(` ${conjunction} `)}return list.slice(0,-1).concat(`${conjunction} ${list[count-1]}`).join(", ")}var external_kbnSharedDeps_KbnI18n_=__webpack_require__(2);const DEFAULT_METRIC="custom";const CUSTOM_METRIC={text:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visDefaultEditor.controls.customMetricLabel",{defaultMessage:"Custom metric"}),value:DEFAULT_METRIC};function useCompatibleAggCallback(aggFilter){return Object(external_kbnSharedDeps_React_["useCallback"])(isCompatibleAggregation(aggFilter),[aggFilter])}function useFallbackMetric(setValue,aggFilter,metricAggs,value,fallbackValue){const isCompatibleAgg=useCompatibleAggCallback(aggFilter);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{if(metricAggs&&value&&value!==DEFAULT_METRIC){const respAgg=metricAggs.filter(isCompatibleAgg).find(aggregation=>aggregation.id===value);if(!respAgg&&value!==fallbackValue){setValue(fallbackValue)}}},[setValue,isCompatibleAgg,metricAggs,value,fallbackValue])}function useAvailableOptions(aggFilter,metricAggs=[],defaultOptions=[]){const isCompatibleAgg=useCompatibleAggCallback(aggFilter);const options=Object(external_kbnSharedDeps_React_["useMemo"])(()=>[...metricAggs.map(respAgg=>({text:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visDefaultEditor.controls.definiteMetricLabel",{defaultMessage:"Metric: {metric}",values:{metric:safeMakeLabel(respAgg)}}),value:respAgg.id,disabled:!isCompatibleAgg(respAgg)})),CUSTOM_METRIC,...defaultOptions],[metricAggs,defaultOptions,isCompatibleAgg]);return options}function useValidation(setValidity,isValid){Object(external_kbnSharedDeps_React_["useEffect"])(()=>{setValidity(isValid);return()=>setValidity(true)},[isValid,setValidity])}function safeMakeLabel(agg){try{return agg.makeLabel()}catch(e){return external_kbnSharedDeps_KbnI18n_["i18n"].translate("visDefaultEditor.controls.aggNotValidLabel",{defaultMessage:"- agg not valid -"})}}function isCompatibleAggregation(aggFilter){return agg=>!aggFilter.includes(`!${agg.type.name}`)}},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return DefaultEditorSize}));__webpack_require__.d(__webpack_exports__,"b",(function(){return getInitialWidth}));let DefaultEditorSize;(function(DefaultEditorSize){DefaultEditorSize["SMALL"]="small";DefaultEditorSize["MEDIUM"]="medium";DefaultEditorSize["LARGE"]="large"})(DefaultEditorSize||(DefaultEditorSize={}));const getInitialWidth=size=>{switch(size){case DefaultEditorSize.SMALL:return 15;case DefaultEditorSize.LARGE:return 50;case DefaultEditorSize.MEDIUM:default:return 30}}},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return groupAndSortBy}));function groupAndSortBy(objects,groupBy,labelName,keyName){const groupedOptions=objects.reduce((array,obj)=>{const group=array.find(element=>element.label===obj[groupBy]);const option={label:obj[labelName],target:obj,...keyName?{key:obj[keyName]}:{}};if(group&&group.options){group.options.push(option)}else{array.push({label:obj[groupBy],options:[option]})}return array},[]);groupedOptions.sort(sortByLabel);groupedOptions.forEach(group=>{if(Array.isArray(group.options)){group.options.sort(sortByLabel)}});if(groupedOptions.length===1&&!groupedOptions[0].label){return groupedOptions[0].options||[]}return groupedOptions}function sortByLabel(a,b){return(a.label||"").toLowerCase().localeCompare((b.label||"").toLowerCase())}},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_val_loader_dist_cjs_js_key_visDefaultEditor_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(11);var _node_modules_val_loader_dist_cjs_js_key_visDefaultEditor_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_val_loader_dist_cjs_js_key_visDefaultEditor_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__);__kbnBundles__.define("plugin/visDefaultEditor/public",__webpack_require__,12)},function(module,exports,__webpack_require__){__webpack_require__.p=window.__kbnPublicPath__["visDefaultEditor"]},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"DefaultEditorController",(function(){return default_editor_controller_DefaultEditorController}));__webpack_require__.d(__webpack_exports__,"useValidation",(function(){return utils["g"]}));__webpack_require__.d(__webpack_exports__,"PalettePicker",(function(){return PalettePicker}));__webpack_require__.d(__webpack_exports__,"BasicOptions",(function(){return BasicOptions}));__webpack_require__.d(__webpack_exports__,"SwitchOption",(function(){return SwitchOption}));__webpack_require__.d(__webpack_exports__,"SelectOption",(function(){return SelectOption}));__webpack_require__.d(__webpack_exports__,"ColorRanges",(function(){return ColorRanges}));__webpack_require__.d(__webpack_exports__,"SetColorRangeValue",(function(){return undefined}));__webpack_require__.d(__webpack_exports__,"ColorSchemaOptions",(function(){return ColorSchemaOptions}));__webpack_require__.d(__webpack_exports__,"SetColorSchemaOptionsValue",(function(){return undefined}));__webpack_require__.d(__webpack_exports__,"NumberInputOption",(function(){return NumberInputOption}));__webpack_require__.d(__webpack_exports__,"RangeOption",(function(){return RangeOption}));__webpack_require__.d(__webpack_exports__,"RequiredNumberInputOption",(function(){return RequiredNumberInputOption}));__webpack_require__.d(__webpack_exports__,"TextInputOption",(function(){return TextInputOption}));__webpack_require__.d(__webpack_exports__,"RangesParamEditor",(function(){return ranges["b"]}));__webpack_require__.d(__webpack_exports__,"RangeValues",(function(){return ranges["RangeValues"]}));__webpack_require__.d(__webpack_exports__,"DefaultEditorSize",(function(){return editor_size["a"]}));__webpack_require__.d(__webpack_exports__,"getInitialWidth",(function(){return editor_size["b"]}));__webpack_require__.d(__webpack_exports__,"groupAndSortBy",(function(){return public_utils["a"]}));__webpack_require__.d(__webpack_exports__,"plugin",(function(){return public_plugin}));var external_kbnSharedDeps_React_=__webpack_require__(0);var external_kbnSharedDeps_React_default=__webpack_require__.n(external_kbnSharedDeps_React_);var external_kbnSharedDeps_ReactDom_=__webpack_require__(6);var external_kbnSharedDeps_ElasticEui_=__webpack_require__(1);function _extends(){_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};return _extends.apply(this,arguments)}const DefaultEditor=Object(external_kbnSharedDeps_React_["lazy"])(()=>__webpack_require__.e(1).then(__webpack_require__.bind(null,38)));class default_editor_controller_DefaultEditorController{constructor(el,vis,eventEmitter,embeddableHandler){this.el=el;this.vis=vis;this.eventEmitter=eventEmitter;this.embeddableHandler=embeddableHandler}render(props){Object(external_kbnSharedDeps_ReactDom_["render"])(external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiErrorBoundary"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_React_["Suspense"],{fallback:external_kbnSharedDeps_React_default.a.createElement("div",{style:{display:"flex",flex:"1 1 auto",justifyContent:"center",alignItems:"center"}},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiLoadingChart"],{size:"xl",mono:true}))},external_kbnSharedDeps_React_default.a.createElement(DefaultEditor,_extends({eventEmitter:this.eventEmitter,embeddableHandler:this.embeddableHandler,vis:this.vis},props)))),this.el)}destroy(){Object(external_kbnSharedDeps_ReactDom_["unmountComponentAtNode"])(this.el)}}class plugin_VisDefaultEditorPlugin{setup(core,{visualize:visualize}){if(visualize){visualize.visEditorsRegistry.registerDefault(default_editor_controller_DefaultEditorController)}}start(){}stop(){}}var utils=__webpack_require__(7);var external_kbnSharedDeps_KbnI18n_=__webpack_require__(2);function PalettePicker({activePalette:activePalette,palettes:palettes,paramName:paramName,setPalette:setPalette}){return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{fullWidth:true,label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visDefaultEditor.palettePicker.label",{defaultMessage:"Color palette"})},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiColorPalettePicker"],{fullWidth:true,"data-test-subj":"visEditorPalettePicker",compressed:true,palettes:palettes.getAll().filter(({internal:internal})=>!internal).map(({id:id,title:title,getColors:getColors})=>({value:id,title:title,type:"fixed",palette:getColors(10,id===(activePalette===null||activePalette===void 0?void 0:activePalette.name)?activePalette===null||activePalette===void 0?void 0:activePalette.params:undefined)})),onChange:newPalette=>{setPalette(paramName,{type:"palette",name:newPalette})},valueOfSelected:(activePalette===null||activePalette===void 0?void 0:activePalette.name)||"default",selectionDisplay:"palette"}))}function SwitchOption({"data-test-subj":dataTestSubj,tooltip:tooltip,label:label,disabled:disabled,paramName:paramName,value:value=false,setValue:setValue}){return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{fullWidth:true,display:"rowCompressed"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiToolTip"],{content:tooltip,delay:"long",position:"right"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSwitch"],{compressed:true,label:label,checked:value,disabled:disabled,"data-test-subj":dataTestSubj,onChange:ev=>setValue(paramName,ev.target.checked)})))}const emptyValue={text:"",value:"EMPTY_VALUE",disabled:true,hidden:true};function SelectOption({disabled:disabled,helpText:helpText,id:id,label:label,labelAppend:labelAppend,options:options,paramName:paramName,value:value,setValue:setValue,"data-test-subj":dataTestSubj}){const availableOptions=Object(external_kbnSharedDeps_React_["useMemo"])(()=>[emptyValue,...options],[options]);return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{display:"rowCompressed",fullWidth:true,helpText:helpText,id:id,label:label,labelAppend:labelAppend},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSelect"],{compressed:true,disabled:disabled,options:availableOptions,value:value===undefined?emptyValue.value:value,onChange:ev=>setValue(paramName,ev.target.value),fullWidth:true,"data-test-subj":dataTestSubj}))}function BasicOptions({stateParams:stateParams,setValue:setValue,legendPositions:legendPositions}){return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_React_default.a.Fragment,null,external_kbnSharedDeps_React_default.a.createElement(SelectOption,{label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visDefaultEditor.options.vislibBasicOptions.legendPositionLabel",{defaultMessage:"Legend position"}),options:legendPositions,paramName:"legendPosition",value:stateParams.legendPosition,setValue:setValue}),external_kbnSharedDeps_React_default.a.createElement(SwitchOption,{label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visDefaultEditor.options.vislibBasicOptions.showTooltipLabel",{defaultMessage:"Show tooltip"}),paramName:"addTooltip",value:stateParams.addTooltip,setValue:setValue}))}var external_kbnSharedDeps_Lodash_=__webpack_require__(3);var ranges=__webpack_require__(4);function ColorRanges({"data-test-subj":dataTestSubj,colorsRange:colorsRange,setValue:setValue,setValidity:setValidity,setTouched:setTouched}){const addRangeValues=Object(external_kbnSharedDeps_React_["useCallback"])(()=>{const previousRange=Object(external_kbnSharedDeps_Lodash_["last"])(colorsRange)||{};const from=previousRange.to?previousRange.to:0;const to=previousRange.to?from+(previousRange.to-(previousRange.from||0)):100;return{from:from,to:to}},[colorsRange]);const validateRange=Object(external_kbnSharedDeps_React_["useCallback"])(({from:from,to:to},index)=>{if(!colorsRange[index]){return[false,false]}const leftBound=index===0?-Infinity:colorsRange[index-1].to||0;const isFromValid=from>=leftBound;const isToValid=to>=from;return[isFromValid,isToValid]},[colorsRange]);const setColorRanges=Object(external_kbnSharedDeps_React_["useCallback"])(value=>setValue("colorsRange",value),[setValue]);return external_kbnSharedDeps_React_default.a.createElement(ranges["b"],{"data-test-subj":dataTestSubj,error:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visDefaultEditor.options.colorRanges.errorText",{defaultMessage:"Each range should be greater than previous."}),hidePlaceholders:true,value:colorsRange,setValue:setColorRanges,setValidity:setValidity,setTouched:setTouched,addRangeValues:addRangeValues,validateRange:validateRange})}var external_kbnSharedDeps_KbnI18nReact_=__webpack_require__(5);function ColorSchemaOptions({disabled:disabled,colorSchema:colorSchema,colorSchemas:colorSchemas,invertColors:invertColors,uiState:uiState,setValue:setValue,showHelpText:showHelpText=true}){const[isCustomColors,setIsCustomColors]=Object(external_kbnSharedDeps_React_["useState"])(()=>!!uiState.get("vis.colors"));Object(external_kbnSharedDeps_React_["useEffect"])(()=>{uiState.on("colorChanged",()=>{setIsCustomColors(true)})},[uiState]);const resetColorsButton=external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiText"],{size:"xs"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiLink"],{onClick:()=>{uiState.set("vis.colors",null);setIsCustomColors(false)}},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"visDefaultEditor.options.colorSchema.resetColorsButtonLabel",defaultMessage:"Reset colors"})));return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_React_default.a.Fragment,null,external_kbnSharedDeps_React_default.a.createElement(SelectOption,{disabled:disabled,helpText:showHelpText&&external_kbnSharedDeps_KbnI18n_["i18n"].translate("visDefaultEditor.options.colorSchema.howToChangeColorsDescription",{defaultMessage:"Individual colors can be changed in the legend."}),label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visDefaultEditor.options.colorSchema.colorSchemaLabel",{defaultMessage:"Color schema"}),labelAppend:isCustomColors&&resetColorsButton,options:colorSchemas,paramName:"colorSchema",value:colorSchema,setValue:setValue}),external_kbnSharedDeps_React_default.a.createElement(SwitchOption,{disabled:disabled,label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("visDefaultEditor.options.colorSchema.reverseColorSchemaLabel",{defaultMessage:"Reverse schema"}),paramName:"invertColors",value:invertColors,setValue:setValue}))}function NumberInputOption({disabled:disabled,error:error,isInvalid:isInvalid,label:label,max:max,min:min,paramName:paramName,step:step,value:value="",setValue:setValue,"data-test-subj":dataTestSubj}){return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{label:label,error:error,isInvalid:isInvalid,fullWidth:true,display:"rowCompressed"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFieldNumber"],{"data-test-subj":dataTestSubj,disabled:disabled,compressed:true,fullWidth:true,isInvalid:isInvalid,step:step,max:max,min:min,value:value,onChange:ev=>setValue(paramName,isNaN(ev.target.valueAsNumber)?"":ev.target.valueAsNumber)}))}function RangeOption({label:label,max:max,min:min,showInput:showInput,showLabels:showLabels,showValue:showValue=true,step:step,paramName:paramName,value:value,setValue:setValue}){const[stateValue,setStateValue]=Object(external_kbnSharedDeps_React_["useState"])(value);const[isValidState,setIsValidState]=Object(external_kbnSharedDeps_React_["useState"])(true);const error=external_kbnSharedDeps_KbnI18n_["i18n"].translate("visDefaultEditor.options.rangeErrorMessage",{defaultMessage:"Values must be on or between {min} and {max}",values:{min:min,max:max}});const onChangeHandler=(event,isValid)=>{const{valueAsNumber:valueAsNumber}=event.target;setStateValue(valueAsNumber);setIsValidState(isValid);if(isValid){setValue(paramName,valueAsNumber)}};return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{label:label,fullWidth:true,isInvalid:!isValidState,error:error,display:"rowCompressed"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiRange"],{compressed:true,fullWidth:true,max:max,min:min,showInput:showInput,showLabels:showLabels,showValue:showValue,step:step,value:stateValue,onChange:onChangeHandler}))}function RequiredNumberInputOption({disabled:disabled,error:error,isInvalid:isInvalid,label:label,max:max,min:min,paramName:paramName,step:step,value:value,setValue:setValue,setValidity:setValidity,"data-test-subj":dataTestSubj}){const isValid=value!==null;Object(external_kbnSharedDeps_React_["useEffect"])(()=>{setValidity(paramName,isValid);return()=>setValidity(paramName,true)},[isValid,paramName,setValidity]);const onChange=Object(external_kbnSharedDeps_React_["useCallback"])(ev=>setValue(paramName,isNaN(ev.target.valueAsNumber)?null:ev.target.valueAsNumber),[setValue,paramName]);return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{label:label,error:error,isInvalid:isInvalid,fullWidth:true,display:"rowCompressed"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFieldNumber"],{compressed:true,fullWidth:true,required:true,"data-test-subj":dataTestSubj,disabled:disabled,isInvalid:!isValid,step:step,max:max,min:min,value:value===null?"":value,onChange:onChange}))}function TextInputOption({"data-test-subj":dataTestSubj,disabled:disabled,helpText:helpText,label:label,paramName:paramName,value:value="",setValue:setValue}){return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{helpText:helpText,label:label,fullWidth:true,display:"rowCompressed"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFieldText"],{compressed:true,fullWidth:true,"data-test-subj":dataTestSubj,disabled:disabled,value:value,onChange:ev=>setValue(paramName,ev.target.value)}))}var editor_size=__webpack_require__(8);var public_utils=__webpack_require__(9);const public_plugin=context=>new plugin_VisDefaultEditorPlugin},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/data/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,exports){module.exports=__kbnSharedDeps__.TsLib},function(module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__);var ns=__kbnBundles__.get("plugin/kibanaUtils/public");Object.defineProperties(__webpack_exports__,Object.getOwnPropertyDescriptors(ns))},function(module,exports){module.exports=__kbnSharedDeps__.Moment}]);