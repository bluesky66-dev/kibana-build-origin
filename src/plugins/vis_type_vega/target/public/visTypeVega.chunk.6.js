(window["visTypeVega_bundle_jsonpfunction"]=window["visTypeVega_bundle_jsonpfunction"]||[]).push([[6],{135:function(module,exports,__webpack_require__){switch(window.__kbnThemeTag__){case"v7dark":return __webpack_require__(136);case"v7light":return __webpack_require__(138);case"v8dark":return __webpack_require__(140);case"v8light":return __webpack_require__(142)}},136:function(module,exports,__webpack_require__){var api=__webpack_require__(38);var content=__webpack_require__(137);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},137:function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(37);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".vgaVegaDataInspector,\n.vgaVegaDataInspector__specViewer {\n  height: 100%; }\n\n.vgaVegaDataInspector {\n  display: flex;\n  flex-direction: column; }\n  .vgaVegaDataInspector [role='tablist'] {\n    flex-shrink: 0; }\n  .vgaVegaDataInspector [role='tabpanel'] {\n    flex-grow: 1; }\n",""]);module.exports=exports},138:function(module,exports,__webpack_require__){var api=__webpack_require__(38);var content=__webpack_require__(139);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},139:function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(37);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".vgaVegaDataInspector,\n.vgaVegaDataInspector__specViewer {\n  height: 100%; }\n\n.vgaVegaDataInspector {\n  display: flex;\n  flex-direction: column; }\n  .vgaVegaDataInspector [role='tablist'] {\n    flex-shrink: 0; }\n  .vgaVegaDataInspector [role='tabpanel'] {\n    flex-grow: 1; }\n",""]);module.exports=exports},140:function(module,exports,__webpack_require__){var api=__webpack_require__(38);var content=__webpack_require__(141);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},141:function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(37);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".vgaVegaDataInspector,\n.vgaVegaDataInspector__specViewer {\n  height: 100%; }\n\n.vgaVegaDataInspector {\n  display: flex;\n  flex-direction: column; }\n  .vgaVegaDataInspector [role='tablist'] {\n    flex-shrink: 0; }\n  .vgaVegaDataInspector [role='tabpanel'] {\n    flex-grow: 1; }\n",""]);module.exports=exports},142:function(module,exports,__webpack_require__){var api=__webpack_require__(38);var content=__webpack_require__(143);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},143:function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(37);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".vgaVegaDataInspector,\n.vgaVegaDataInspector__specViewer {\n  height: 100%; }\n\n.vgaVegaDataInspector {\n  display: flex;\n  flex-direction: column; }\n  .vgaVegaDataInspector [role='tablist'] {\n    flex-shrink: 0; }\n  .vgaVegaDataInspector [role='tabpanel'] {\n    flex-grow: 1; }\n",""]);module.exports=exports},211:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"default",(function(){return VegaDataInspector}));var vega_data_inspector=__webpack_require__(135);var external_kbnSharedDeps_React_=__webpack_require__(0);var external_kbnSharedDeps_React_default=__webpack_require__.n(external_kbnSharedDeps_React_);var external_kbnSharedDeps_ElasticEui_=__webpack_require__(8);var external_kbnSharedDeps_KbnI18n_=__webpack_require__(3);const DEFAULT_PAGE_SIZE=15;const InspectorDataGrid=({columns:columns,data:data,dataGridAriaLabel:dataGridAriaLabel})=>{const[pagination,setPagination]=Object(external_kbnSharedDeps_React_["useState"])({pageIndex:0,pageSize:DEFAULT_PAGE_SIZE});const onChangeItemsPerPage=Object(external_kbnSharedDeps_React_["useCallback"])(pageSize=>setPagination(p=>({...p,pageSize:pageSize,pageIndex:0})),[setPagination]);const onChangePage=Object(external_kbnSharedDeps_React_["useCallback"])(pageIndex=>setPagination(p=>({...p,pageIndex:pageIndex})),[setPagination]);const[visibleColumns,setVisibleColumns]=Object(external_kbnSharedDeps_React_["useState"])([]);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{setPagination({...pagination,pageIndex:0});setVisibleColumns(columns.map(column=>column.id))},[dataGridAriaLabel]);const[sortingColumns,setSortingColumns]=Object(external_kbnSharedDeps_React_["useState"])([]);const onSort=Object(external_kbnSharedDeps_React_["useCallback"])(newSortingColumns=>{setSortingColumns(newSortingColumns)},[setSortingColumns]);let gridData=Object(external_kbnSharedDeps_React_["useMemo"])(()=>[...data].sort((a,b)=>{for(let i=0;i<sortingColumns.length;i++){const column=sortingColumns[i];const aValue=a[column.id];const bValue=b[column.id];if(aValue<bValue)return column.direction==="asc"?-1:1;if(aValue>bValue)return column.direction==="asc"?1:-1}return 0}),[data,sortingColumns]);const renderCellValue=Object(external_kbnSharedDeps_React_["useMemo"])(()=>({rowIndex:rowIndex,columnId:columnId})=>{let adjustedRowIndex=rowIndex;adjustedRowIndex=rowIndex-pagination.pageIndex*pagination.pageSize;return gridData.hasOwnProperty(adjustedRowIndex)?gridData[adjustedRowIndex][columnId]||null:null},[gridData,pagination.pageIndex,pagination.pageSize]);gridData=Object(external_kbnSharedDeps_React_["useMemo"])(()=>{const rowStart=pagination.pageIndex*pagination.pageSize;const rowEnd=Math.min(rowStart+pagination.pageSize,gridData.length);return gridData.slice(rowStart,rowEnd)},[gridData,pagination]);const[columnsWidth,setColumnsWidth]=Object(external_kbnSharedDeps_React_["useState"])({});const onColumnResize=Object(external_kbnSharedDeps_React_["useCallback"])(({columnId:columnId,width:width})=>{setColumnsWidth({...columnsWidth,[columnId]:width})},[columnsWidth]);return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiDataGrid"],{"aria-label":dataGridAriaLabel,columns:columns.map(column=>{if(columnsWidth[column.id]){return{...column,initialWidth:columnsWidth[column.id]}}return column}),columnVisibility:{visibleColumns:visibleColumns,setVisibleColumns:setVisibleColumns},rowCount:data.length,renderCellValue:renderCellValue,sorting:{columns:sortingColumns,onSort:onSort},toolbarVisibility:{showFullScreenSelector:false},onColumnResize:onColumnResize,pagination:{...pagination,pageSizeOptions:[DEFAULT_PAGE_SIZE,25,50],onChangeItemsPerPage:onChangeItemsPerPage,onChangePage:onChangePage}})};function _extends(){_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};return _extends.apply(this,arguments)}const getDataGridArialabel=view=>external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeVega.inspector.dataViewer.gridAriaLabel",{defaultMessage:"{name} data grid",values:{name:view.id}});const dataSetAriaLabel=external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeVega.inspector.dataViewer.dataSetAriaLabel",{defaultMessage:"Data set"});const DataViewer=({vegaAdapter:vegaAdapter,...rest})=>{const[inspectDataSets,setInspectDataSets]=Object(external_kbnSharedDeps_React_["useState"])([]);const[selectedView,setSelectedView]=Object(external_kbnSharedDeps_React_["useState"])();const[dataGridAriaLabel,setDataGridAriaLabel]=Object(external_kbnSharedDeps_React_["useState"])("");const onViewChange=Object(external_kbnSharedDeps_React_["useCallback"])(selectedOptions=>{const newView=inspectDataSets.find(view=>view.id===selectedOptions[0].label);if(newView){setDataGridAriaLabel(getDataGridArialabel(newView));setSelectedView(newView)}},[inspectDataSets]);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{const subscription=vegaAdapter.getDataSetsSubscription().subscribe(dataSets=>{setInspectDataSets(dataSets)});return()=>{subscription.unsubscribe()}},[vegaAdapter]);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{if(inspectDataSets){if(!selectedView){setSelectedView(inspectDataSets[0])}else{setDataGridAriaLabel(getDataGridArialabel(selectedView))}}},[selectedView,inspectDataSets]);if(!selectedView){return null}return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexGroup"],_extends({direction:"column",gutterSize:"s",wrap:false,responsive:false},rest),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],{grow:false},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSpacer"],{size:"s"}),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiComboBox"],{fullWidth:true,options:inspectDataSets.map(item=>({label:item.id})),"aria-label":dataSetAriaLabel,onChange:onViewChange,isClearable:false,singleSelection:{asPlainText:true},selectedOptions:[{label:selectedView.id}]})),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],{grow:true},external_kbnSharedDeps_React_default.a.createElement(InspectorDataGrid,{columns:selectedView.columns,data:selectedView.data,dataGridAriaLabel:dataGridAriaLabel})))};const initialSignalColumnWidth=150;const signalDataGridAriaLabel=external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeVega.inspector.signalViewer.gridAriaLabel",{defaultMessage:"Signal values data grid"});const SignalViewer=({vegaAdapter:vegaAdapter})=>{const[inspectSignalsSets,setInspectSignalsSets]=Object(external_kbnSharedDeps_React_["useState"])();Object(external_kbnSharedDeps_React_["useEffect"])(()=>{const subscription=vegaAdapter.getSignalsSetsSubscription().subscribe(signalSets=>{if(signalSets){setInspectSignalsSets(signalSets)}});return()=>{subscription.unsubscribe()}},[vegaAdapter]);if(!inspectSignalsSets){return null}return external_kbnSharedDeps_React_default.a.createElement("div",null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSpacer"],{size:"s"}),external_kbnSharedDeps_React_default.a.createElement(InspectorDataGrid,{columns:inspectSignalsSets.columns.map((column,index)=>{if(index===0){return{...column,initialWidth:initialSignalColumnWidth}}return column}),data:inspectSignalsSets.data,dataGridAriaLabel:signalDataGridAriaLabel}))};var external_kbnSharedDeps_KbnMonaco_=__webpack_require__(34);var public_=__webpack_require__(18);function spec_viewer_extends(){spec_viewer_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};return spec_viewer_extends.apply(this,arguments)}const copyToClipboardLabel=external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeVega.inspector.specViewer.copyToClipboardLabel",{defaultMessage:"Copy to clipboard"});const SpecViewer=({vegaAdapter:vegaAdapter,...rest})=>{const[spec,setSpec]=Object(external_kbnSharedDeps_React_["useState"])();Object(external_kbnSharedDeps_React_["useEffect"])(()=>{const subscription=vegaAdapter.getSpecSubscription().subscribe(data=>{if(data){setSpec(data)}});return()=>{subscription.unsubscribe()}},[vegaAdapter]);if(!spec){return null}return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexGroup"],spec_viewer_extends({direction:"column",gutterSize:"s",wrap:false,responsive:false},rest),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],{grow:false},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSpacer"],{size:"s"}),external_kbnSharedDeps_React_default.a.createElement("div",{className:"eui-textRight"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiCopy"],{textToCopy:spec},copy=>external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiButtonEmpty"],{size:"xs",flush:"right",iconType:"copyClipboard",onClick:copy,"data-test-subj":"vegaDataInspectorCopyClipboardButton"},copyToClipboardLabel)))),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],{grow:true},external_kbnSharedDeps_React_default.a.createElement(public_["CodeEditor"],{languageId:external_kbnSharedDeps_KbnMonaco_["XJsonLang"].ID,value:spec,onChange:()=>{},options:{readOnly:true,lineNumbers:"off",fontSize:12,minimap:{enabled:false},scrollBeyondLastLine:false,folding:true,wordWrap:"on",wrappingIndent:"indent",automaticLayout:true}})))};const dataSetsLabel=external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeVega.inspector.dataSetsLabel",{defaultMessage:"Data sets"});const signalValuesLabel=external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeVega.inspector.signalValuesLabel",{defaultMessage:"Signal values"});const specLabel=external_kbnSharedDeps_KbnI18n_["i18n"].translate("visTypeVega.inspector.specLabel",{defaultMessage:"Spec"});const VegaDataInspector=({adapters:adapters})=>{const tabs=[{id:"data-viewer--id",name:dataSetsLabel,content:external_kbnSharedDeps_React_default.a.createElement(DataViewer,{vegaAdapter:adapters.vega}),"data-test-subj":"vegaDataInspectorDataViewerButton"},{id:"signal-viewer--id",name:signalValuesLabel,content:external_kbnSharedDeps_React_default.a.createElement(SignalViewer,{vegaAdapter:adapters.vega}),"data-test-subj":"vegaDataInspectorSignalViewerButton"},{id:"spec-viewer--id",name:specLabel,content:external_kbnSharedDeps_React_default.a.createElement(SpecViewer,{className:"vgaVegaDataInspector__specViewer",vegaAdapter:adapters.vega}),"data-test-subj":"vegaDataInspectorSpecViewerButton"}];return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiTabbedContent"],{className:"vgaVegaDataInspector",size:"s",tabs:tabs,initialSelectedTab:tabs[0],autoFocus:"selected"})}},37:function(module,exports,__webpack_require__){"use strict";module.exports=function(useSourceMap){var list=[];list.toString=function toString(){return this.map((function(item){var content=cssWithMappingToString(item,useSourceMap);if(item[2]){return"@media ".concat(item[2]," {").concat(content,"}")}return content})).join("")};list.i=function(modules,mediaQuery,dedupe){if(typeof modules==="string"){modules=[[null,modules,""]]}var alreadyImportedModules={};if(dedupe){for(var i=0;i<this.length;i++){var id=this[i][0];if(id!=null){alreadyImportedModules[id]=true}}}for(var _i=0;_i<modules.length;_i++){var item=[].concat(modules[_i]);if(dedupe&&alreadyImportedModules[item[0]]){continue}if(mediaQuery){if(!item[2]){item[2]=mediaQuery}else{item[2]="".concat(mediaQuery," and ").concat(item[2])}}list.push(item)}};return list};function cssWithMappingToString(item,useSourceMap){var content=item[1]||"";var cssMapping=item[3];if(!cssMapping){return content}if(useSourceMap&&typeof btoa==="function"){var sourceMapping=toComment(cssMapping);var sourceURLs=cssMapping.sources.map((function(source){return"/*# sourceURL=".concat(cssMapping.sourceRoot||"").concat(source," */")}));return[content].concat(sourceURLs).concat([sourceMapping]).join("\n")}return[content].join("\n")}function toComment(sourceMap){var base64=btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));var data="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);return"/*# ".concat(data," */")}},38:function(module,exports,__webpack_require__){"use strict";var isOldIE=function isOldIE(){var memo;return function memorize(){if(typeof memo==="undefined"){memo=Boolean(window&&document&&document.all&&!window.atob)}return memo}}();var getTarget=function getTarget(){var memo={};return function memorize(target){if(typeof memo[target]==="undefined"){var styleTarget=document.querySelector(target);if(window.HTMLIFrameElement&&styleTarget instanceof window.HTMLIFrameElement){try{styleTarget=styleTarget.contentDocument.head}catch(e){styleTarget=null}}memo[target]=styleTarget}return memo[target]}}();var stylesInDom=[];function getIndexByIdentifier(identifier){var result=-1;for(var i=0;i<stylesInDom.length;i++){if(stylesInDom[i].identifier===identifier){result=i;break}}return result}function modulesToDom(list,options){var idCountMap={};var identifiers=[];for(var i=0;i<list.length;i++){var item=list[i];var id=options.base?item[0]+options.base:item[0];var count=idCountMap[id]||0;var identifier="".concat(id," ").concat(count);idCountMap[id]=count+1;var index=getIndexByIdentifier(identifier);var obj={css:item[1],media:item[2],sourceMap:item[3]};if(index!==-1){stylesInDom[index].references++;stylesInDom[index].updater(obj)}else{stylesInDom.push({identifier:identifier,updater:addStyle(obj,options),references:1})}identifiers.push(identifier)}return identifiers}function insertStyleElement(options){var style=document.createElement("style");var attributes=options.attributes||{};if(typeof attributes.nonce==="undefined"){var nonce=true?__webpack_require__.nc:undefined;if(nonce){attributes.nonce=nonce}}Object.keys(attributes).forEach((function(key){style.setAttribute(key,attributes[key])}));if(typeof options.insert==="function"){options.insert(style)}else{var target=getTarget(options.insert||"head");if(!target){throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.")}target.appendChild(style)}return style}function removeStyleElement(style){if(style.parentNode===null){return false}style.parentNode.removeChild(style)}var replaceText=function replaceText(){var textStore=[];return function replace(index,replacement){textStore[index]=replacement;return textStore.filter(Boolean).join("\n")}}();function applyToSingletonTag(style,index,remove,obj){var css=remove?"":obj.media?"@media ".concat(obj.media," {").concat(obj.css,"}"):obj.css;if(style.styleSheet){style.styleSheet.cssText=replaceText(index,css)}else{var cssNode=document.createTextNode(css);var childNodes=style.childNodes;if(childNodes[index]){style.removeChild(childNodes[index])}if(childNodes.length){style.insertBefore(cssNode,childNodes[index])}else{style.appendChild(cssNode)}}}function applyToTag(style,options,obj){var css=obj.css;var media=obj.media;var sourceMap=obj.sourceMap;if(media){style.setAttribute("media",media)}else{style.removeAttribute("media")}if(sourceMap&&btoa){css+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))))," */")}if(style.styleSheet){style.styleSheet.cssText=css}else{while(style.firstChild){style.removeChild(style.firstChild)}style.appendChild(document.createTextNode(css))}}var singleton=null;var singletonCounter=0;function addStyle(obj,options){var style;var update;var remove;if(options.singleton){var styleIndex=singletonCounter++;style=singleton||(singleton=insertStyleElement(options));update=applyToSingletonTag.bind(null,style,styleIndex,false);remove=applyToSingletonTag.bind(null,style,styleIndex,true)}else{style=insertStyleElement(options);update=applyToTag.bind(null,style,options);remove=function remove(){removeStyleElement(style)}}update(obj);return function updateStyle(newObj){if(newObj){if(newObj.css===obj.css&&newObj.media===obj.media&&newObj.sourceMap===obj.sourceMap){return}update(obj=newObj)}else{remove()}}}module.exports=function(list,options){options=options||{};if(!options.singleton&&typeof options.singleton!=="boolean"){options.singleton=isOldIE()}list=list||[];var lastIdentifiers=modulesToDom(list,options);return function update(newList){newList=newList||[];if(Object.prototype.toString.call(newList)!=="[object Array]"){return}for(var i=0;i<lastIdentifiers.length;i++){var identifier=lastIdentifiers[i];var index=getIndexByIdentifier(identifier);stylesInDom[index].references--}var newLastIdentifiers=modulesToDom(newList,options);for(var _i=0;_i<lastIdentifiers.length;_i++){var _identifier=lastIdentifiers[_i];var _index=getIndexByIdentifier(_identifier);if(stylesInDom[_index].references===0){stylesInDom[_index].updater();stylesInDom.splice(_index,1)}}lastIdentifiers=newLastIdentifiers}}}}]);