/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["securitySolution_bundle_jsonpfunction"]=window["securitySolution_bundle_jsonpfunction"]||[]).push([[21],{1183:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"default",(function(){return CaseParamsFields}));var external_kbnSharedDeps_React_=__webpack_require__(6);var external_kbnSharedDeps_React_default=__webpack_require__.n(external_kbnSharedDeps_React_);var external_kbnSharedDeps_StyledComponents_=__webpack_require__(73);var external_kbnSharedDeps_StyledComponents_default=__webpack_require__.n(external_kbnSharedDeps_StyledComponents_);var external_kbnSharedDeps_ElasticEui_=__webpack_require__(72);var api=__webpack_require__(36);var use_get_cases=__webpack_require__(409);var form_context=__webpack_require__(519);var create_form=__webpack_require__(506);var submit_button=__webpack_require__(481);var translations=__webpack_require__(37);const Container=external_kbnSharedDeps_StyledComponents_default.a.div.withConfig({displayName:"Container",componentId:"sc-9l7qtj-0"})(["",""],({theme:theme})=>`\n    margin-top: ${theme.eui.euiSize};\n    text-align: right;\n  `);const CreateModalComponent=({isModalOpen:isModalOpen,onCloseCaseModal:onCloseCaseModal,onSuccess:onSuccess,caseType:caseType=api["f"].individual,hideConnectorServiceNowSir:hideConnectorServiceNowSir=false})=>isModalOpen?external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiModal"],{onClose:onCloseCaseModal,"data-test-subj":"all-cases-modal"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiModalHeader"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiModalHeaderTitle"],null,translations["o"])),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiModalBody"],null,external_kbnSharedDeps_React_default.a.createElement(form_context["a"],{hideConnectorServiceNowSir:hideConnectorServiceNowSir,caseType:caseType,onSuccess:onSuccess},external_kbnSharedDeps_React_default.a.createElement(create_form["a"],{withSteps:false,hideConnectorServiceNowSir:hideConnectorServiceNowSir}),external_kbnSharedDeps_React_default.a.createElement(Container,null,external_kbnSharedDeps_React_default.a.createElement(submit_button["a"],null))))):null;const CreateCaseModal=Object(external_kbnSharedDeps_React_["memo"])(CreateModalComponent);CreateCaseModal.displayName="CreateCaseModal";const useCreateCaseModal=({caseType:caseType=api["f"].individual,onCaseCreated:onCaseCreated,hideConnectorServiceNowSir:hideConnectorServiceNowSir=false})=>{const[isModalOpen,setIsModalOpen]=Object(external_kbnSharedDeps_React_["useState"])(false);const closeModal=Object(external_kbnSharedDeps_React_["useCallback"])(()=>setIsModalOpen(false),[]);const openModal=Object(external_kbnSharedDeps_React_["useCallback"])(()=>setIsModalOpen(true),[]);const onSuccess=Object(external_kbnSharedDeps_React_["useCallback"])(async theCase=>{onCaseCreated(theCase);closeModal()},[onCaseCreated,closeModal]);const state=Object(external_kbnSharedDeps_React_["useMemo"])(()=>({modal:external_kbnSharedDeps_React_default.a.createElement(CreateCaseModal,{caseType:caseType,hideConnectorServiceNowSir:hideConnectorServiceNowSir,isModalOpen:isModalOpen,onCloseCaseModal:closeModal,onSuccess:onSuccess}),isModalOpen:isModalOpen,closeModal:closeModal,openModal:openModal}),[caseType,closeModal,hideConnectorServiceNowSir,isModalOpen,onSuccess,openModal]);return state};var case_translations=__webpack_require__(25);const ADD_CASE_BUTTON_ID="add-case";const addNewCase={value:ADD_CASE_BUTTON_ID,inputDisplay:external_kbnSharedDeps_React_default.a.createElement("span",{className:"euiButtonEmpty euiButtonEmpty--primary euiButtonEmpty--xSmall euiButtonEmpty--flushLeft"},case_translations["a"]),"data-test-subj":"dropdown-connector-add-connector"};const CasesDropdownComponent=({isLoading:isLoading,cases:cases,selectedCase:selectedCase,onCaseChanged:onCaseChanged})=>{const caseOptions=Object(external_kbnSharedDeps_React_["useMemo"])(()=>cases.reduce((acc,theCase)=>[...acc,{value:theCase.id,inputDisplay:external_kbnSharedDeps_React_default.a.createElement("span",null,theCase.title),"data-test-subj":`case-connector-cases-dropdown-${theCase.id}`}],[]),[cases]);const options=Object(external_kbnSharedDeps_React_["useMemo"])(()=>[...caseOptions,addNewCase],[caseOptions]);const onChange=Object(external_kbnSharedDeps_React_["useCallback"])(id=>onCaseChanged(id),[onCaseChanged]);return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{label:case_translations["d"],fullWidth:true},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSuperSelect"],{options:options,"data-test-subj":"case-connector-cases-dropdown",disabled:isLoading,fullWidth:true,isLoading:isLoading,valueOfSelected:selectedCase,onChange:onChange}))};const CasesDropdown=Object(external_kbnSharedDeps_React_["memo"])(CasesDropdownComponent);const ExistingCaseComponent=({onCaseChanged:onCaseChanged,selectedCase:selectedCase})=>{const{data:cases,loading:isLoadingCases,refetchCases:refetchCases}=Object(use_get_cases["c"])(use_get_cases["b"],{...use_get_cases["a"],onlyCollectionType:true});const onCaseCreated=Object(external_kbnSharedDeps_React_["useCallback"])(newCase=>{refetchCases();onCaseChanged(newCase.id)},[onCaseChanged,refetchCases]);const{modal:modal,openModal:openModal}=useCreateCaseModal({onCaseCreated:onCaseCreated,caseType:api["f"].collection,hideConnectorServiceNowSir:true});const onChange=Object(external_kbnSharedDeps_React_["useCallback"])(id=>{if(id===ADD_CASE_BUTTON_ID){openModal();return}onCaseChanged(id)},[onCaseChanged,openModal]);const isCasesLoading=Object(external_kbnSharedDeps_React_["useMemo"])(()=>isLoadingCases.includes("cases")||isLoadingCases.includes("caseUpdate"),[isLoadingCases]);return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_React_default.a.Fragment,null,external_kbnSharedDeps_React_default.a.createElement(CasesDropdown,{isLoading:isCasesLoading,cases:cases.cases,selectedCase:selectedCase!==null&&selectedCase!==void 0?selectedCase:undefined,onCaseChanged:onChange}),modal)};const ExistingCase=Object(external_kbnSharedDeps_React_["memo"])(ExistingCaseComponent);const alert_fields_Container=external_kbnSharedDeps_StyledComponents_default.a.div.withConfig({displayName:"Container",componentId:"sc-16vbcqj-0"})(["",""],({theme:theme})=>{var _theme$eui$euiSizeS,_theme$eui,_theme$eui$euiSizeL,_theme$eui2,_theme$eui$euiSizeL2,_theme$eui3,_theme$eui$euiSizeL3,_theme$eui4;return`\n    padding:  ${(_theme$eui$euiSizeS=(_theme$eui=theme.eui)===null||_theme$eui===void 0?void 0:_theme$eui.euiSizeS)!==null&&_theme$eui$euiSizeS!==void 0?_theme$eui$euiSizeS:"8px"} ${(_theme$eui$euiSizeL=(_theme$eui2=theme.eui)===null||_theme$eui2===void 0?void 0:_theme$eui2.euiSizeL)!==null&&_theme$eui$euiSizeL!==void 0?_theme$eui$euiSizeL:"24px"} ${(_theme$eui$euiSizeL2=(_theme$eui3=theme.eui)===null||_theme$eui3===void 0?void 0:_theme$eui3.euiSizeL)!==null&&_theme$eui$euiSizeL2!==void 0?_theme$eui$euiSizeL2:"24px"} ${(_theme$eui$euiSizeL3=(_theme$eui4=theme.eui)===null||_theme$eui4===void 0?void 0:_theme$eui4.euiSizeL)!==null&&_theme$eui$euiSizeL3!==void 0?_theme$eui$euiSizeL3:"24px"};\n  `});const defaultAlertComment={type:api["k"].generatedAlert,alerts:`[{{#context.alerts}}{"_id": "{{_id}}", "_index": "{{_index}}", "ruleId": "{{signal.rule.id}}", "ruleName": "{{signal.rule.name}}"}__SEPARATOR__{{/context.alerts}}]`};const CaseParamsFields=({actionParams:actionParams,editAction:editAction,index:index,errors:errors,messageVariables:messageVariables,actionConnector:actionConnector})=>{var _actionParams$subActi,_actionParams$subActi4,_actionParams$subActi5;const{caseId:caseId=null,comment:comment=defaultAlertComment}=(_actionParams$subActi=actionParams.subActionParams)!==null&&_actionParams$subActi!==void 0?_actionParams$subActi:{};const[selectedCase,setSelectedCase]=Object(external_kbnSharedDeps_React_["useState"])(null);const editSubActionProperty=Object(external_kbnSharedDeps_React_["useCallback"])((key,value)=>{const newProps={...actionParams.subActionParams,[key]:value};editAction("subActionParams",newProps,index)},[actionParams.subActionParams,index]);const onCaseChanged=Object(external_kbnSharedDeps_React_["useCallback"])(id=>{setSelectedCase(id);editSubActionProperty("caseId",id)},[editSubActionProperty]);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{var _actionParams$subActi2,_actionParams$subActi3;if(!actionParams.subAction){editAction("subAction","addComment",index)}if(!((_actionParams$subActi2=actionParams.subActionParams)!==null&&_actionParams$subActi2!==void 0&&_actionParams$subActi2.caseId)){editSubActionProperty("caseId",caseId)}if(!((_actionParams$subActi3=actionParams.subActionParams)!==null&&_actionParams$subActi3!==void 0&&_actionParams$subActi3.comment)){editSubActionProperty("comment",comment)}if(caseId!=null){setSelectedCase(prevCaseId=>prevCaseId!==caseId?caseId:prevCaseId)}},[actionConnector,index,(_actionParams$subActi4=actionParams.subActionParams)===null||_actionParams$subActi4===void 0?void 0:_actionParams$subActi4.caseId,(_actionParams$subActi5=actionParams.subActionParams)===null||_actionParams$subActi5===void 0?void 0:_actionParams$subActi5.comment,caseId,comment,actionParams.subAction]);return external_kbnSharedDeps_React_default.a.createElement(alert_fields_Container,null,external_kbnSharedDeps_React_default.a.createElement(ExistingCase,{onCaseChanged:onCaseChanged,selectedCase:selectedCase}),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSpacer"],{size:"m"}),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiCallOut"],{size:"s",title:case_translations["c"],iconType:"iInCircle"},external_kbnSharedDeps_React_default.a.createElement("p",null,case_translations["b"])))}}}]);