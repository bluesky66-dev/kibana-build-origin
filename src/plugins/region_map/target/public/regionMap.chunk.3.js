(window["regionMap_bundle_jsonpfunction"]=window["regionMap_bundle_jsonpfunction"]||[]).push([[3],{30:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"default",(function(){return RegionMapOptions}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(2);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(12);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(1);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__);var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(14);var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__);var _charts_public__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(11);var _charts_public__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(_charts_public__WEBPACK_IMPORTED_MODULE_4__);var _vis_default_editor_public__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(15);var _vis_default_editor_public__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(_vis_default_editor_public__WEBPACK_IMPORTED_MODULE_5__);var _maps_legacy_public__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(4);var _maps_legacy_public__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(_maps_legacy_public__WEBPACK_IMPORTED_MODULE_6__);var _kibana_services__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(0);const mapLayerForOption=({layerId:layerId,name:name})=>({text:name,value:layerId});const mapFieldForOption=({description:description,name:name})=>({text:description,value:name});const tmsLayers=Object(_kibana_services__WEBPACK_IMPORTED_MODULE_7__["g"])();const vectorLayers=Object(_kibana_services__WEBPACK_IMPORTED_MODULE_7__["h"])();const vectorLayerOptions=vectorLayers.map(mapLayerForOption);function RegionMapOptions(props){const{getServiceSettings:getServiceSettings,stateParams:stateParams,setValue:setValue}=props;const fieldOptions=Object(react__WEBPACK_IMPORTED_MODULE_0__["useMemo"])(()=>(stateParams.selectedLayer&&stateParams.selectedLayer.fields||[]).map(mapFieldForOption),[stateParams.selectedLayer]);const setEmsHotLink=Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(async layer=>{const serviceSettings=await getServiceSettings();const emsHotLink=await serviceSettings.getEMSHotLink(layer);setValue("emsHotLink",emsHotLink)},[setValue,getServiceSettings]);const setLayer=Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(async(paramName,value)=>{const newLayer=vectorLayers.find(({layerId:layerId})=>layerId===value);if(newLayer){setValue(paramName,newLayer);setValue("selectedJoinField",newLayer.fields[0]);setEmsHotLink(newLayer)}},[setEmsHotLink,setValue]);const setField=Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])((paramName,value)=>{if(stateParams.selectedLayer){setValue(paramName,stateParams.selectedLayer.fields.find(f=>f.name===value))}},[setValue,stateParams.selectedLayer]);return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPanel"],{paddingSize:"s"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"],{size:"xs"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2",null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__["FormattedMessage"],{id:"regionMap.visParams.layerSettingsTitle",defaultMessage:"Layer settings"}))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"s"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_vis_default_editor_public__WEBPACK_IMPORTED_MODULE_5__["SelectOption"],{id:"regionMapOptionsSelectLayer",label:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("regionMap.visParams.vectorMapLabel",{defaultMessage:"Vector map"}),labelAppend:stateParams.emsHotLink&&react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"],{size:"xs"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"],{href:stateParams.emsHotLink,target:"_blank",title:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("regionMap.visParams.previewOnEMSLinkTitle",{defaultMessage:"Preview {selectedLayerName} on the Elastic Maps Service",values:{selectedLayerName:stateParams.selectedLayer&&stateParams.selectedLayer.name}})},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__["FormattedMessage"],{id:"regionMap.visParams.previewOnEMSLinkText",defaultMessage:"Preview on EMS"})," ",react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"],{type:"popout",size:"s"}))),options:vectorLayerOptions,paramName:"selectedLayer",value:stateParams.selectedLayer&&stateParams.selectedLayer.layerId,setValue:setLayer}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_vis_default_editor_public__WEBPACK_IMPORTED_MODULE_5__["SelectOption"],{id:"regionMapOptionsSelectJoinField",label:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("regionMap.visParams.joinFieldLabel",{defaultMessage:"Join field"}),options:fieldOptions,paramName:"selectedJoinField",value:stateParams.selectedJoinField&&stateParams.selectedJoinField.name,setValue:setField}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_vis_default_editor_public__WEBPACK_IMPORTED_MODULE_5__["SwitchOption"],{label:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("regionMap.visParams.displayWarningsLabel",{defaultMessage:"Display warnings"}),tooltip:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("regionMap.visParams.switchWarningsTipText",{defaultMessage:"Turns on/off warnings. When turned on, warning will be shown for each term that cannot be matched to a shape in the vector layer based on the join field. When turned off, these warnings will be turned off."}),paramName:"isDisplayWarning",value:stateParams.isDisplayWarning,setValue:setValue}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_vis_default_editor_public__WEBPACK_IMPORTED_MODULE_5__["SwitchOption"],{label:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("regionMap.visParams.showAllShapesLabel",{defaultMessage:"Show all shapes"}),tooltip:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("regionMap.visParams.turnOffShowingAllShapesTipText",{defaultMessage:"Turning this off only shows the shapes that were matched with a corresponding term."}),paramName:"showAllShapes",value:stateParams.showAllShapes,setValue:setValue})),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"s"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPanel"],{paddingSize:"s"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"],{size:"xs"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2",null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_3__["FormattedMessage"],{id:"regionMap.visParams.styleSettingsLabel",defaultMessage:"Style settings"}))),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"s"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_vis_default_editor_public__WEBPACK_IMPORTED_MODULE_5__["SelectOption"],{label:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("regionMap.visParams.colorSchemaLabel",{defaultMessage:"Color schema"}),options:_charts_public__WEBPACK_IMPORTED_MODULE_4__["truncatedColorSchemas"],paramName:"colorSchema",value:stateParams.colorSchema,setValue:setValue}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_vis_default_editor_public__WEBPACK_IMPORTED_MODULE_5__["NumberInputOption"],{label:_kbn_i18n__WEBPACK_IMPORTED_MODULE_2__["i18n"].translate("regionMap.visParams.outlineWeightLabel",{defaultMessage:"Border thickness"}),min:0,paramName:"outlineWeight",value:stateParams.outlineWeight,setValue:setValue})),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"],{size:"s"}),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_maps_legacy_public__WEBPACK_IMPORTED_MODULE_6__["WmsOptions"],{setValue:setValue,stateParams:stateParams,tmsLayers:tmsLayers}))}}}]);