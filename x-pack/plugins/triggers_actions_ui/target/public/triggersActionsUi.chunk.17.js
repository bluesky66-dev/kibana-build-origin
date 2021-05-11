/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["triggersActionsUi_bundle_jsonpfunction"]=window["triggersActionsUi_bundle_jsonpfunction"]||[]).push([[17],{278:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"default",(function(){return JiraParamsFields}));var external_kbnSharedDeps_React_=__webpack_require__(0);var external_kbnSharedDeps_React_default=__webpack_require__.n(external_kbnSharedDeps_React_);var external_kbnSharedDeps_KbnI18n_=__webpack_require__(1);var external_kbnSharedDeps_ElasticEui_=__webpack_require__(2);var text_area_with_message_variables=__webpack_require__(88);var text_field_with_message_variables=__webpack_require__(89);var constants=__webpack_require__(3);async function getIssueTypes({http:http,signal:signal,connectorId:connectorId}){return await http.post(`${constants["a"]}/action/${connectorId}/_execute`,{body:JSON.stringify({params:{subAction:"issueTypes",subActionParams:{}}}),signal:signal})}async function getFieldsByIssueType({http:http,signal:signal,connectorId:connectorId,id:id}){return await http.post(`${constants["a"]}/action/${connectorId}/_execute`,{body:JSON.stringify({params:{subAction:"fieldsByIssueType",subActionParams:{id:id}}}),signal:signal})}async function getIssues({http:http,signal:signal,connectorId:connectorId,title:title}){return await http.post(`${constants["a"]}/action/${connectorId}/_execute`,{body:JSON.stringify({params:{subAction:"issues",subActionParams:{title:title}}}),signal:signal})}async function getIssue({http:http,signal:signal,connectorId:connectorId,id:id}){return await http.post(`${constants["a"]}/action/${connectorId}/_execute`,{body:JSON.stringify({params:{subAction:"issue",subActionParams:{id:id}}}),signal:signal})}var translations=__webpack_require__(13);const useGetIssueTypes=({http:http,actionConnector:actionConnector,toastNotifications:toastNotifications})=>{const[isLoading,setIsLoading]=Object(external_kbnSharedDeps_React_["useState"])(true);const[issueTypes,setIssueTypes]=Object(external_kbnSharedDeps_React_["useState"])([]);const abortCtrl=Object(external_kbnSharedDeps_React_["useRef"])(new AbortController);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{let didCancel=false;const fetchData=async()=>{if(!actionConnector){setIsLoading(false);return}abortCtrl.current=new AbortController;setIsLoading(true);try{const res=await getIssueTypes({http:http,signal:abortCtrl.current.signal,connectorId:actionConnector.id});if(!didCancel){var _res$data;setIsLoading(false);setIssueTypes((_res$data=res.data)!==null&&_res$data!==void 0?_res$data:[]);if(res.status&&res.status==="error"){var _res$serviceMessage;toastNotifications.addDanger({title:translations["h"],text:`${(_res$serviceMessage=res.serviceMessage)!==null&&_res$serviceMessage!==void 0?_res$serviceMessage:res.message}`})}}}catch(error){if(!didCancel){setIsLoading(false);toastNotifications.addDanger({title:translations["h"],text:error.message})}}};abortCtrl.current.abort();fetchData();return()=>{didCancel=true;setIsLoading(false);abortCtrl.current.abort()}},[http,actionConnector,toastNotifications]);return{issueTypes:issueTypes,isLoading:isLoading}};const useGetFieldsByIssueType=({http:http,toastNotifications:toastNotifications,actionConnector:actionConnector,issueType:issueType})=>{const[isLoading,setIsLoading]=Object(external_kbnSharedDeps_React_["useState"])(true);const[fields,setFields]=Object(external_kbnSharedDeps_React_["useState"])({});const abortCtrl=Object(external_kbnSharedDeps_React_["useRef"])(new AbortController);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{let didCancel=false;const fetchData=async()=>{if(!actionConnector||!issueType){setIsLoading(false);return}abortCtrl.current=new AbortController;setIsLoading(true);try{const res=await getFieldsByIssueType({http:http,signal:abortCtrl.current.signal,connectorId:actionConnector.id,id:issueType});if(!didCancel){var _res$data;setIsLoading(false);setFields((_res$data=res.data)!==null&&_res$data!==void 0?_res$data:{});if(res.status&&res.status==="error"){var _res$serviceMessage;toastNotifications.addDanger({title:translations["e"],text:`${(_res$serviceMessage=res.serviceMessage)!==null&&_res$serviceMessage!==void 0?_res$serviceMessage:res.message}`})}}}catch(error){if(!didCancel){setIsLoading(false);toastNotifications.addDanger({title:translations["e"],text:error.message})}}};abortCtrl.current.abort();fetchData();return()=>{didCancel=true;setIsLoading(false);abortCtrl.current.abort()}},[http,actionConnector,issueType,toastNotifications]);return{isLoading:isLoading,fields:fields}};var external_kbnSharedDeps_LodashFp_=__webpack_require__(69);const useGetIssues=({http:http,actionConnector:actionConnector,toastNotifications:toastNotifications,query:query})=>{const[isLoading,setIsLoading]=Object(external_kbnSharedDeps_React_["useState"])(false);const[issues,setIssues]=Object(external_kbnSharedDeps_React_["useState"])([]);const abortCtrl=Object(external_kbnSharedDeps_React_["useRef"])(new AbortController);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{let didCancel=false;const fetchData=Object(external_kbnSharedDeps_LodashFp_["debounce"])(500,async()=>{if(!actionConnector||Object(external_kbnSharedDeps_LodashFp_["isEmpty"])(query)){setIsLoading(false);return}abortCtrl.current=new AbortController;setIsLoading(true);try{const res=await getIssues({http:http,signal:abortCtrl.current.signal,connectorId:actionConnector.id,title:query!==null&&query!==void 0?query:""});if(!didCancel){var _res$data;setIsLoading(false);setIssues((_res$data=res.data)!==null&&_res$data!==void 0?_res$data:[]);if(res.status&&res.status==="error"){var _res$serviceMessage;toastNotifications.addDanger({title:translations["g"],text:`${(_res$serviceMessage=res.serviceMessage)!==null&&_res$serviceMessage!==void 0?_res$serviceMessage:res.message}`})}}}catch(error){if(!didCancel){setIsLoading(false);toastNotifications.addDanger({title:translations["g"],text:error.message})}}});abortCtrl.current.abort();fetchData();return()=>{didCancel=true;setIsLoading(false);abortCtrl.current.abort()}},[http,actionConnector,toastNotifications,query]);return{issues:issues,isLoading:isLoading}};const useGetSingleIssue=({http:http,toastNotifications:toastNotifications,actionConnector:actionConnector,id:id})=>{const[isLoading,setIsLoading]=Object(external_kbnSharedDeps_React_["useState"])(false);const[issue,setIssue]=Object(external_kbnSharedDeps_React_["useState"])(null);const abortCtrl=Object(external_kbnSharedDeps_React_["useRef"])(new AbortController);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{let didCancel=false;const fetchData=async()=>{if(!actionConnector||!id){setIsLoading(false);return}abortCtrl.current=new AbortController;setIsLoading(true);try{const res=await getIssue({http:http,signal:abortCtrl.current.signal,connectorId:actionConnector.id,id:id});if(!didCancel){var _res$data;setIsLoading(false);setIssue((_res$data=res.data)!==null&&_res$data!==void 0?_res$data:null);if(res.status&&res.status==="error"){var _res$serviceMessage;toastNotifications.addDanger({title:translations["f"](id),text:`${(_res$serviceMessage=res.serviceMessage)!==null&&_res$serviceMessage!==void 0?_res$serviceMessage:res.message}`})}}}catch(error){if(!didCancel){setIsLoading(false);toastNotifications.addDanger({title:translations["f"](id),text:error.message})}}};abortCtrl.current.abort();fetchData();return()=>{didCancel=true;setIsLoading(false);abortCtrl.current.abort()}},[http,actionConnector,id,toastNotifications]);return{isLoading:isLoading,issue:issue}};const SearchIssuesComponent=({selectedValue:selectedValue,http:http,toastNotifications:toastNotifications,actionConnector:actionConnector,onChange:onChange})=>{const[query,setQuery]=Object(external_kbnSharedDeps_React_["useState"])(null);const[selectedOptions,setSelectedOptions]=Object(external_kbnSharedDeps_React_["useState"])([]);const[options,setOptions]=Object(external_kbnSharedDeps_React_["useState"])([]);const{isLoading:isLoadingIssues,issues:issues}=useGetIssues({http:http,toastNotifications:toastNotifications,actionConnector:actionConnector,query:query});const{isLoading:isLoadingSingleIssue,issue:singleIssue}=useGetSingleIssue({http:http,toastNotifications:toastNotifications,actionConnector:actionConnector,id:selectedValue});Object(external_kbnSharedDeps_React_["useEffect"])(()=>setOptions(issues.map(issue=>({label:issue.title,value:issue.key}))),[issues]);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{if(isLoadingSingleIssue||singleIssue==null){return}const singleIssueAsOptions=[{label:singleIssue.title,value:singleIssue.key}];setOptions(singleIssueAsOptions);setSelectedOptions(singleIssueAsOptions)},[singleIssue,isLoadingSingleIssue]);const onSearchChange=Object(external_kbnSharedDeps_React_["useCallback"])(searchVal=>{setQuery(searchVal)},[]);const onChangeComboBox=Object(external_kbnSharedDeps_React_["useCallback"])(changedOptions=>{setSelectedOptions(changedOptions);onChange(changedOptions[0].value)},[onChange]);const inputPlaceholder=Object(external_kbnSharedDeps_React_["useMemo"])(()=>isLoadingIssues||isLoadingSingleIssue?translations["v"]:translations["w"],[isLoadingIssues,isLoadingSingleIssue]);return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiComboBox"],{singleSelection:true,fullWidth:true,placeholder:inputPlaceholder,"data-test-sub":"search-parent-issues","aria-label":translations["u"],options:options,isLoading:isLoadingIssues||isLoadingSingleIssue,onSearchChange:onSearchChange,selectedOptions:selectedOptions,onChange:onChangeComboBox})};const SearchIssues=Object(external_kbnSharedDeps_React_["memo"])(SearchIssuesComponent);var kibana=__webpack_require__(34);const JiraParamsFields=({actionConnector:actionConnector,actionParams:actionParams,editAction:editAction,errors:errors,index:index,messageVariables:messageVariables})=>{var _actionConnector$id,_incident$issueType,_incident$issueType2,_incident$priority,_incident$summary,_incident$description;const{http:http,notifications:{toasts:toasts}}=Object(kibana["b"])().services;const{incident:incident,comments:comments}=Object(external_kbnSharedDeps_React_["useMemo"])(()=>{var _actionParams$subActi;return(_actionParams$subActi=actionParams.subActionParams)!==null&&_actionParams$subActi!==void 0?_actionParams$subActi:{incident:{},comments:[]}},[actionParams.subActionParams]);const actionConnectorRef=Object(external_kbnSharedDeps_React_["useRef"])((_actionConnector$id=actionConnector===null||actionConnector===void 0?void 0:actionConnector.id)!==null&&_actionConnector$id!==void 0?_actionConnector$id:"");const{isLoading:isLoadingIssueTypes,issueTypes:issueTypes}=useGetIssueTypes({http:http,toastNotifications:toasts,actionConnector:actionConnector});const{isLoading:isLoadingFields,fields:fields}=useGetFieldsByIssueType({http:http,toastNotifications:toasts,actionConnector:actionConnector,issueType:(_incident$issueType=incident.issueType)!==null&&_incident$issueType!==void 0?_incident$issueType:""});const editSubActionProperty=Object(external_kbnSharedDeps_React_["useCallback"])((key,value)=>{if(key==="issueType"){return editAction("subActionParams",{incident:{issueType:value},comments:comments},index)}if(key==="comments"){return editAction("subActionParams",{incident:incident,comments:value},index)}return editAction("subActionParams",{incident:{...incident,[key]:value},comments:comments},index)},[comments,editAction,incident,index]);const editComment=Object(external_kbnSharedDeps_React_["useCallback"])((key,value)=>{if(value.length>0){editSubActionProperty(key,[{commentId:"1",comment:value}])}},[editSubActionProperty]);const{hasLabels:hasLabels,hasDescription:hasDescription,hasPriority:hasPriority,hasParent:hasParent}=Object(external_kbnSharedDeps_React_["useMemo"])(()=>fields!=null?{hasLabels:Object.prototype.hasOwnProperty.call(fields,"labels"),hasDescription:Object.prototype.hasOwnProperty.call(fields,"description"),hasPriority:Object.prototype.hasOwnProperty.call(fields,"priority"),hasParent:Object.prototype.hasOwnProperty.call(fields,"parent")}:{hasLabels:false,hasDescription:false,hasPriority:false,hasParent:false},[fields]);const issueTypesSelectOptions=Object(external_kbnSharedDeps_React_["useMemo"])(()=>{const doesIssueTypeExist=incident.issueType!=null&&issueTypes.length?issueTypes.some(t=>t.id===incident.issueType):true;if((!incident.issueType||!doesIssueTypeExist)&&issueTypes.length>0){var _issueTypes$0$id;editSubActionProperty("issueType",(_issueTypes$0$id=issueTypes[0].id)!==null&&_issueTypes$0$id!==void 0?_issueTypes$0$id:"")}return issueTypes.map(type=>{var _type$id,_type$name;return{value:(_type$id=type.id)!==null&&_type$id!==void 0?_type$id:"",text:(_type$name=type.name)!==null&&_type$name!==void 0?_type$name:""}})},[editSubActionProperty,incident,issueTypes]);const prioritiesSelectOptions=Object(external_kbnSharedDeps_React_["useMemo"])(()=>{if(incident.issueType!=null&&fields!=null){const priorities=fields.priority!=null?fields.priority.allowedValues:[];const doesPriorityExist=priorities.some(p=>p.name===incident.priority);if((!incident.priority||!doesPriorityExist)&&priorities.length>0){var _priorities$0$name;editSubActionProperty("priority",(_priorities$0$name=priorities[0].name)!==null&&_priorities$0$name!==void 0?_priorities$0$name:"")}return priorities.map(p=>({value:p.name,text:p.name}))}return[]},[editSubActionProperty,fields,incident.issueType,incident.priority]);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{if(!hasPriority&&incident.priority!=null){editSubActionProperty("priority",null)}},[hasPriority]);const labelOptions=Object(external_kbnSharedDeps_React_["useMemo"])(()=>incident.labels?incident.labels.map(label=>({label:label})):[],[incident.labels]);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{if(actionConnector!=null&&actionConnectorRef.current!==actionConnector.id){actionConnectorRef.current=actionConnector.id;editAction("subActionParams",{incident:{},comments:[]},index)}},[actionConnector]);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{if(!actionParams.subAction){editAction("subAction","pushToService",index)}if(!actionParams.subActionParams){editAction("subActionParams",{incident:{},comments:[]},index)}},[actionParams]);const areLabelsInvalid=errors["subActionParams.incident.labels"]!=null&&errors["subActionParams.incident.labels"].length>0&&incident.labels!==undefined;return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_React_["Fragment"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_React_default.a.Fragment,null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{fullWidth:true,label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.triggersActionsUI.components.builtinActionTypes.jira.urgencySelectFieldLabel",{defaultMessage:"Issue type"})},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSelect"],{fullWidth:true,isLoading:isLoadingIssueTypes,disabled:isLoadingIssueTypes||isLoadingFields,"data-test-subj":"issueTypeSelect",options:issueTypesSelectOptions,value:(_incident$issueType2=incident.issueType)!==null&&_incident$issueType2!==void 0?_incident$issueType2:undefined,onChange:e=>editSubActionProperty("issueType",e.target.value)})),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiHorizontalRule"],null),hasParent&&external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_React_default.a.Fragment,null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexGroup"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{fullWidth:true,label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.triggersActionsUI.components.builtinActionTypes.jira.parentIssueSearchLabel",{defaultMessage:"Parent issue"})},external_kbnSharedDeps_React_default.a.createElement(SearchIssues,{"data-test-subj":"parent-search",selectedValue:incident.parent,http:http,toastNotifications:toasts,actionConnector:actionConnector,onChange:parentIssueKey=>{editSubActionProperty("parent",parentIssueKey)}})))),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSpacer"],{size:"m"})),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_React_default.a.Fragment,null,hasPriority&&external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_React_default.a.Fragment,null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexGroup"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{fullWidth:true,label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.triggersActionsUI.components.builtinActionTypes.jira.severitySelectFieldLabel",{defaultMessage:"Priority"})},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSelect"],{fullWidth:true,isLoading:isLoadingFields,disabled:isLoadingIssueTypes||isLoadingFields,"data-test-subj":"prioritySelect",options:prioritiesSelectOptions,value:(_incident$priority=incident.priority)!==null&&_incident$priority!==void 0?_incident$priority:undefined,onChange:e=>{editSubActionProperty("priority",e.target.value)}})))),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSpacer"],{size:"m"})),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{"data-test-subj":"summary-row",fullWidth:true,error:errors["subActionParams.incident.summary"],isInvalid:errors["subActionParams.incident.summary"].length>0&&incident.summary!==undefined,label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.triggersActionsUI.components.builtinActionTypes.jira.summaryFieldLabel",{defaultMessage:"Summary (required)"})},external_kbnSharedDeps_React_default.a.createElement(text_field_with_message_variables["a"],{index:index,editAction:editSubActionProperty,messageVariables:messageVariables,paramsProperty:"summary",inputTargetValue:(_incident$summary=incident.summary)!==null&&_incident$summary!==void 0?_incident$summary:undefined,errors:errors["subActionParams.incident.summary"]})),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSpacer"],{size:"m"}),hasLabels&&external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_React_default.a.Fragment,null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexGroup"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{fullWidth:true,label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.triggersActionsUI.components.builtinActionTypes.jira.impactSelectFieldLabel",{defaultMessage:"Labels"}),error:errors["subActionParams.incident.labels"],isInvalid:areLabelsInvalid},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiComboBox"],{noSuggestions:true,fullWidth:true,isLoading:isLoadingFields,isDisabled:isLoadingIssueTypes||isLoadingFields,selectedOptions:labelOptions,onCreateOption:searchValue=>{const newOptions=[...labelOptions,{label:searchValue}];editSubActionProperty("labels",newOptions.map(newOption=>newOption.label))},onChange:selectedOptions=>{editSubActionProperty("labels",selectedOptions.map(selectedOption=>selectedOption.label))},onBlur:()=>{if(!incident.labels){editSubActionProperty("labels",[])}},isClearable:true,"data-test-subj":"labelsComboBox",isInvalid:areLabelsInvalid})))),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSpacer"],{size:"m"})),hasDescription&&external_kbnSharedDeps_React_default.a.createElement(text_area_with_message_variables["a"],{index:index,editAction:editSubActionProperty,messageVariables:messageVariables,paramsProperty:"description",inputTargetValue:(_incident$description=incident.description)!==null&&_incident$description!==void 0?_incident$description:undefined,label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.triggersActionsUI.components.builtinActionTypes.jira.descriptionTextAreaFieldLabel",{defaultMessage:"Description"})}),external_kbnSharedDeps_React_default.a.createElement(text_area_with_message_variables["a"],{index:index,editAction:editComment,messageVariables:messageVariables,paramsProperty:"comments",inputTargetValue:comments&&comments.length>0?comments[0].comment:undefined,label:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.triggersActionsUI.components.builtinActionTypes.jira.commentsTextAreaFieldLabel",{defaultMessage:"Additional comments"})}))))}},76:function(module,exports,__webpack_require__){switch(window.__kbnThemeTag__){case"v7dark":return __webpack_require__(79);case"v7light":return __webpack_require__(81);case"v8dark":return __webpack_require__(83);case"v8light":return __webpack_require__(85)}},77:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return templateActionVariable}));function templateActionVariable(variable){return variable.useWithTripleBracesInTemplates?`{{{${variable.name}}}}`:`{{${variable.name}}}`}},78:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return AddMessageVariables}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(0);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(1);var _kbn_i18n__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_kbn_i18n__WEBPACK_IMPORTED_MODULE_1__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(2);var _elastic_eui__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__);var _add_message_variables_scss__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(76);var _add_message_variables_scss__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_add_message_variables_scss__WEBPACK_IMPORTED_MODULE_3__);var _lib__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(77);const AddMessageVariables=({messageVariables:messageVariables,paramsProperty:paramsProperty,onSelectEventHandler:onSelectEventHandler})=>{var _messageVariables$len;const[isVariablesPopoverOpen,setIsVariablesPopoverOpen]=Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);const getMessageVariables=()=>messageVariables===null||messageVariables===void 0?void 0:messageVariables.map((variable,i)=>react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiContextMenuItem"],{key:variable.name,"data-test-subj":`variableMenuButton-${variable.name}`,icon:"empty",onClick:()=>{onSelectEventHandler(variable);setIsVariablesPopoverOpen(false)}},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiText"],{size:"m","data-test-subj":`variableMenuButton-${i}-templated-name`},Object(_lib__WEBPACK_IMPORTED_MODULE_4__["a"])(variable)),react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiText"],{size:"m",color:"subdued"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div",{className:"euiTextColor--subdued"},variable.description)))));const addVariableButtonTitle=_kbn_i18n__WEBPACK_IMPORTED_MODULE_1__["i18n"].translate("xpack.triggersActionsUI.components.addMessageVariables.addVariableTitle",{defaultMessage:"Add alert variable"});return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiPopover"],{button:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiButtonIcon"],{id:`${paramsProperty}AddVariableButton`,"data-test-subj":`${paramsProperty}AddVariableButton`,isDisabled:((_messageVariables$len=messageVariables===null||messageVariables===void 0?void 0:messageVariables.length)!==null&&_messageVariables$len!==void 0?_messageVariables$len:0)===0,title:addVariableButtonTitle,onClick:()=>setIsVariablesPopoverOpen(true),iconType:"indexOpen","aria-label":_kbn_i18n__WEBPACK_IMPORTED_MODULE_1__["i18n"].translate("xpack.triggersActionsUI.components.addMessageVariables.addVariablePopoverButton",{defaultMessage:"Add variable"})}),isOpen:isVariablesPopoverOpen,closePopover:()=>setIsVariablesPopoverOpen(false),panelPaddingSize:"none",anchorPosition:"downLeft"},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiContextMenuPanel"],{className:"messageVariablesPanel",items:getMessageVariables()}))}},79:function(module,exports,__webpack_require__){var api=__webpack_require__(25);var content=__webpack_require__(80);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},80:function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(26);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".messageVariablesPanel {\n  scrollbar-width: thin;\n  height: 100%;\n  overflow-y: auto;\n  -webkit-mask-image: linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 0%, red 7.5px, red calc(100% - 7.5px), rgba(255, 0, 0, 0.1) 100%);\n          mask-image: linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 0%, red 7.5px, red calc(100% - 7.5px), rgba(255, 0, 0, 0.1) 100%);\n  max-height: 320px;\n  max-width: 320px; }\n  .messageVariablesPanel::-webkit-scrollbar {\n    width: 16px;\n    height: 16px; }\n  .messageVariablesPanel::-webkit-scrollbar-thumb {\n    background-color: rgba(152, 162, 179, 0.5);\n    border: 6px solid transparent;\n    background-clip: content-box; }\n  .messageVariablesPanel::-webkit-scrollbar-corner, .messageVariablesPanel::-webkit-scrollbar-track {\n    background-color: transparent; }\n",""]);module.exports=exports},81:function(module,exports,__webpack_require__){var api=__webpack_require__(25);var content=__webpack_require__(82);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},82:function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(26);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".messageVariablesPanel {\n  scrollbar-width: thin;\n  height: 100%;\n  overflow-y: auto;\n  -webkit-mask-image: linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 0%, red 7.5px, red calc(100% - 7.5px), rgba(255, 0, 0, 0.1) 100%);\n          mask-image: linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 0%, red 7.5px, red calc(100% - 7.5px), rgba(255, 0, 0, 0.1) 100%);\n  max-height: 320px;\n  max-width: 320px; }\n  .messageVariablesPanel::-webkit-scrollbar {\n    width: 16px;\n    height: 16px; }\n  .messageVariablesPanel::-webkit-scrollbar-thumb {\n    background-color: rgba(105, 112, 125, 0.5);\n    border: 6px solid transparent;\n    background-clip: content-box; }\n  .messageVariablesPanel::-webkit-scrollbar-corner, .messageVariablesPanel::-webkit-scrollbar-track {\n    background-color: transparent; }\n",""]);module.exports=exports},83:function(module,exports,__webpack_require__){var api=__webpack_require__(25);var content=__webpack_require__(84);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},84:function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(26);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".messageVariablesPanel {\n  scrollbar-width: thin;\n  height: 100%;\n  overflow-y: auto;\n  -webkit-mask-image: linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 0%, red 7.5px, red calc(100% - 7.5px), rgba(255, 0, 0, 0.1) 100%);\n          mask-image: linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 0%, red 7.5px, red calc(100% - 7.5px), rgba(255, 0, 0, 0.1) 100%);\n  max-height: 320px;\n  max-width: 320px; }\n  .messageVariablesPanel::-webkit-scrollbar {\n    width: 16px;\n    height: 16px; }\n  .messageVariablesPanel::-webkit-scrollbar-thumb {\n    background-color: rgba(152, 162, 179, 0.5);\n    border: 6px solid transparent;\n    background-clip: content-box; }\n  .messageVariablesPanel::-webkit-scrollbar-corner, .messageVariablesPanel::-webkit-scrollbar-track {\n    background-color: transparent; }\n",""]);module.exports=exports},85:function(module,exports,__webpack_require__){var api=__webpack_require__(25);var content=__webpack_require__(86);content=content.__esModule?content.default:content;if(typeof content==="string"){content=[[module.i,content,""]]}var options={};options.insert="head";options.singleton=false;var update=api(content,options);module.exports=content.locals||{}},86:function(module,exports,__webpack_require__){var ___CSS_LOADER_API_IMPORT___=__webpack_require__(26);exports=___CSS_LOADER_API_IMPORT___(false);exports.push([module.i,".messageVariablesPanel {\n  scrollbar-width: thin;\n  height: 100%;\n  overflow-y: auto;\n  -webkit-mask-image: linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 0%, red 7.5px, red calc(100% - 7.5px), rgba(255, 0, 0, 0.1) 100%);\n          mask-image: linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 0%, red 7.5px, red calc(100% - 7.5px), rgba(255, 0, 0, 0.1) 100%);\n  max-height: 320px;\n  max-width: 320px; }\n  .messageVariablesPanel::-webkit-scrollbar {\n    width: 16px;\n    height: 16px; }\n  .messageVariablesPanel::-webkit-scrollbar-thumb {\n    background-color: rgba(105, 112, 125, 0.5);\n    border: 6px solid transparent;\n    background-clip: content-box; }\n  .messageVariablesPanel::-webkit-scrollbar-corner, .messageVariablesPanel::-webkit-scrollbar-track {\n    background-color: transparent; }\n",""]);module.exports=exports},88:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return TextAreaWithMessageVariables}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(0);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);var _add_message_variables_scss__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(76);var _add_message_variables_scss__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_add_message_variables_scss__WEBPACK_IMPORTED_MODULE_2__);var _add_message_variables__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(78);var _lib__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(77);const TextAreaWithMessageVariables=({messageVariables:messageVariables,paramsProperty:paramsProperty,index:index,inputTargetValue:inputTargetValue,editAction:editAction,label:label,errors:errors})=>{const[currentTextElement,setCurrentTextElement]=Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null);const onSelectMessageVariable=variable=>{var _currentTextElement$s,_currentTextElement$s2;const templatedVar=Object(_lib__WEBPACK_IMPORTED_MODULE_4__["a"])(variable);const startPosition=(_currentTextElement$s=currentTextElement===null||currentTextElement===void 0?void 0:currentTextElement.selectionStart)!==null&&_currentTextElement$s!==void 0?_currentTextElement$s:0;const endPosition=(_currentTextElement$s2=currentTextElement===null||currentTextElement===void 0?void 0:currentTextElement.selectionEnd)!==null&&_currentTextElement$s2!==void 0?_currentTextElement$s2:0;const newValue=(inputTargetValue!==null&&inputTargetValue!==void 0?inputTargetValue:"").substring(0,startPosition)+templatedVar+(inputTargetValue!==null&&inputTargetValue!==void 0?inputTargetValue:"").substring(endPosition,(inputTargetValue!==null&&inputTargetValue!==void 0?inputTargetValue:"").length);editAction(paramsProperty,newValue,index)};const onChangeWithMessageVariable=e=>{editAction(paramsProperty,e.target.value,index)};return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"],{fullWidth:true,error:errors,isInvalid:errors&&errors.length>0&&inputTargetValue!==undefined,label:label,labelAppend:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_add_message_variables__WEBPACK_IMPORTED_MODULE_3__["a"],{messageVariables:messageVariables,onSelectEventHandler:onSelectMessageVariable,paramsProperty:paramsProperty})},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTextArea"],{fullWidth:true,isInvalid:errors&&errors.length>0&&inputTargetValue!==undefined,name:paramsProperty,value:inputTargetValue||"","data-test-subj":`${paramsProperty}TextArea`,onChange:e=>onChangeWithMessageVariable(e),onFocus:e=>{setCurrentTextElement(e.target)},onBlur:()=>{if(!inputTargetValue){editAction(paramsProperty,"",index)}}}))}},89:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return TextFieldWithMessageVariables}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(0);var react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2);var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);var _add_message_variables_scss__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(76);var _add_message_variables_scss__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_add_message_variables_scss__WEBPACK_IMPORTED_MODULE_2__);var _add_message_variables__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(78);var _lib__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(77);const TextFieldWithMessageVariables=({messageVariables:messageVariables,paramsProperty:paramsProperty,index:index,inputTargetValue:inputTargetValue,editAction:editAction,errors:errors,defaultValue:defaultValue})=>{const[currentTextElement,setCurrentTextElement]=Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null);const onSelectMessageVariable=variable=>{var _currentTextElement$s,_currentTextElement$s2;const templatedVar=Object(_lib__WEBPACK_IMPORTED_MODULE_4__["a"])(variable);const startPosition=(_currentTextElement$s=currentTextElement===null||currentTextElement===void 0?void 0:currentTextElement.selectionStart)!==null&&_currentTextElement$s!==void 0?_currentTextElement$s:0;const endPosition=(_currentTextElement$s2=currentTextElement===null||currentTextElement===void 0?void 0:currentTextElement.selectionEnd)!==null&&_currentTextElement$s2!==void 0?_currentTextElement$s2:0;const newValue=(inputTargetValue!==null&&inputTargetValue!==void 0?inputTargetValue:"").substring(0,startPosition)+templatedVar+(inputTargetValue!==null&&inputTargetValue!==void 0?inputTargetValue:"").substring(endPosition,(inputTargetValue!==null&&inputTargetValue!==void 0?inputTargetValue:"").length);editAction(paramsProperty,newValue,index)};const onChangeWithMessageVariable=e=>{editAction(paramsProperty,e.target.value,index)};return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldText"],{fullWidth:true,name:paramsProperty,id:`${paramsProperty}Id`,isInvalid:errors&&errors.length>0&&inputTargetValue!==undefined,"data-test-subj":`${paramsProperty}Input`,value:inputTargetValue||"",defaultValue:defaultValue,onChange:e=>onChangeWithMessageVariable(e),onFocus:e=>{setCurrentTextElement(e.target)},onBlur:e=>{if(!inputTargetValue){editAction(paramsProperty,"",index)}},append:react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_add_message_variables__WEBPACK_IMPORTED_MODULE_3__["a"],{messageVariables:messageVariables,onSelectEventHandler:onSelectMessageVariable,paramsProperty:paramsProperty})})}}}]);