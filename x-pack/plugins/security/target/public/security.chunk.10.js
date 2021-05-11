/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["security_bundle_jsonpfunction"]=window["security_bundle_jsonpfunction"]||[]).push([[10],{303:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"AccountManagementPage",(function(){return AccountManagementPage}));__webpack_require__.d(__webpack_exports__,"renderAccountManagementPage",(function(){return renderAccountManagementPage}));var external_kbnSharedDeps_React_=__webpack_require__(0);var external_kbnSharedDeps_React_default=__webpack_require__.n(external_kbnSharedDeps_React_);var external_kbnSharedDeps_ReactDom_=__webpack_require__(4);var external_kbnSharedDeps_ReactDom_default=__webpack_require__.n(external_kbnSharedDeps_ReactDom_);var external_kbnSharedDeps_ElasticEui_=__webpack_require__(2);var model=__webpack_require__(13);var external_kbnSharedDeps_KbnI18nReact_=__webpack_require__(5);var change_password_form=__webpack_require__(91);function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}class change_password_ChangePassword extends external_kbnSharedDeps_React_["Component"]{constructor(...args){super(...args);_defineProperty(this,"getChangePasswordForm",changePasswordTitle=>external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiDescribedFormGroup"],{fullWidth:true,title:external_kbnSharedDeps_React_default.a.createElement("h2",null,changePasswordTitle),description:external_kbnSharedDeps_React_default.a.createElement("p",null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.changePasswordDescription",defaultMessage:"Change the password for your account."}))},external_kbnSharedDeps_React_default.a.createElement(change_password_form["a"],{user:this.props.user,isUserChangingOwnPassword:true,userAPIClient:this.props.userAPIClient,notifications:this.props.notifications})))}render(){const canChangePassword=Object(model["b"])(this.props.user);const changePasswordTitle=external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.changePasswordTitle",defaultMessage:"Password"});if(canChangePassword){return this.getChangePasswordForm(changePasswordTitle)}return this.getChangePasswordUnavailable(changePasswordTitle)}getChangePasswordUnavailable(changePasswordTitle){return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiDescribedFormGroup"],{fullWidth:true,title:external_kbnSharedDeps_React_default.a.createElement("h3",null,changePasswordTitle),description:external_kbnSharedDeps_React_default.a.createElement("p",null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.changePasswordNotSupportedText",defaultMessage:"You cannot change the password for this account."}))},external_kbnSharedDeps_React_default.a.createElement("div",null))}}const PersonalInfo=props=>external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiDescribedFormGroup"],{fullWidth:true,title:external_kbnSharedDeps_React_default.a.createElement("h2",null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.usernameGroupTitle",defaultMessage:"Username and email"})),description:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.usernameGroupDescription",defaultMessage:"You can't change this information."})},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],{fullWidth:true},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiText"],{size:"s"},external_kbnSharedDeps_React_default.a.createElement("dl",null,external_kbnSharedDeps_React_default.a.createElement("dt",{title:"username","data-test-subj":"username"},props.user.username),external_kbnSharedDeps_React_default.a.createElement("dd",{title:"email","data-test-subj":"email"},props.user.email||external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.noEmailMessage",defaultMessage:"no email address"}))))));const AccountManagementPage=({userAPIClient:userAPIClient,authc:authc,notifications:notifications})=>{const[currentUser,setCurrentUser]=Object(external_kbnSharedDeps_React_["useState"])(null);Object(external_kbnSharedDeps_React_["useEffect"])(()=>{authc.getCurrentUser().then(setCurrentUser)},[authc]);if(!currentUser){return null}return external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiPage"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiPageBody"],{restrictWidth:true},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiPanel"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiText"],{"data-test-subj":"userDisplayName"},external_kbnSharedDeps_React_default.a.createElement("h1",null,Object(model["e"])(currentUser))),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiSpacer"],{size:"xl"}),external_kbnSharedDeps_React_default.a.createElement(PersonalInfo,{user:currentUser}),external_kbnSharedDeps_React_default.a.createElement(change_password_ChangePassword,{user:currentUser,userAPIClient:userAPIClient,notifications:notifications}))))};function renderAccountManagementPage(i18nStart,element,props){external_kbnSharedDeps_ReactDom_default.a.render(external_kbnSharedDeps_React_default.a.createElement(i18nStart.Context,null,external_kbnSharedDeps_React_default.a.createElement(AccountManagementPage,props)),element);return()=>external_kbnSharedDeps_ReactDom_default.a.unmountComponentAtNode(element)}},91:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return change_password_form_ChangePasswordForm}));var external_kbnSharedDeps_ElasticEui_=__webpack_require__(2);var external_kbnSharedDeps_Lodash_=__webpack_require__(14);var external_kbnSharedDeps_Lodash_default=__webpack_require__.n(external_kbnSharedDeps_Lodash_);var external_kbnSharedDeps_KbnI18n_=__webpack_require__(1);var external_kbnSharedDeps_KbnI18nReact_=__webpack_require__(5);var external_kbnSharedDeps_React_=__webpack_require__(0);var external_kbnSharedDeps_React_default=__webpack_require__.n(external_kbnSharedDeps_React_);function _extends(){_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};return _extends.apply(this,arguments)}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}function getInitialState(){return{shouldValidate:false,currentPassword:"",newPassword:"",confirmPassword:"",currentPasswordError:false,changeInProgress:false}}class change_password_form_ChangePasswordForm extends external_kbnSharedDeps_React_["Component"]{constructor(props){super(props);_defineProperty(this,"getForm",()=>external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiForm"],null,this.props.isUserChangingOwnPassword&&external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],_extends({},this.validateCurrentPassword(),{fullWidth:true,label:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.changePasswordForm.currentPasswordLabel",defaultMessage:"Current password"})}),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFieldPassword"],{autoComplete:"off","data-test-subj":"currentPassword",type:"dual",value:this.state.currentPassword,onChange:this.onCurrentPasswordChange,disabled:this.state.changeInProgress,fullWidth:true})),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],_extends({helpText:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.changePasswordForm.passwordRequirements",defaultMessage:"Use at least 6 characters."})},this.validateNewPassword(),{fullWidth:true,label:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.changePasswordForm.newPasswordLabel",defaultMessage:"New password"})}),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFieldPassword"],{autoComplete:"new-password","data-test-subj":"newPassword",type:"dual",value:this.state.newPassword,onChange:this.onNewPasswordChange,disabled:this.state.changeInProgress,fullWidth:true})),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],_extends({},this.validateConfirmPassword(),{fullWidth:true,label:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.changePasswordForm.confirmPasswordLabel",defaultMessage:"Confirm new password"})}),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFieldPassword"],{autoComplete:"new-password","data-test-subj":"confirmNewPassword",type:"dual",value:this.state.confirmPassword,onChange:this.onConfirmPasswordChange,disabled:this.state.changeInProgress,fullWidth:true})),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFormRow"],null,external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexGroup"],{alignItems:"center",responsive:false},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],{grow:false},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiButton"],{onClick:this.onChangePasswordClick,fill:true,isLoading:this.state.changeInProgress,"data-test-subj":"changePasswordButton"},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.changePasswordForm.saveChangesButtonLabel",defaultMessage:"Change password"}))),external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiFlexItem"],{grow:false},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_ElasticEui_["EuiButtonEmpty"],{onClick:this.onCancelClick,isDisabled:this.state.changeInProgress},external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.changePasswordForm.cancelButtonLabel",defaultMessage:"Reset"})))))));_defineProperty(this,"onCurrentPasswordChange",e=>{this.setState({currentPassword:e.target.value,currentPasswordError:false})});_defineProperty(this,"onNewPasswordChange",e=>{this.setState({newPassword:e.target.value})});_defineProperty(this,"onConfirmPasswordChange",e=>{this.setState({confirmPassword:e.target.value})});_defineProperty(this,"onCancelClick",()=>{this.setState(getInitialState())});_defineProperty(this,"onChangePasswordClick",async()=>{this.setState({shouldValidate:true,currentPasswordError:false},()=>{const{isInvalid:isInvalid}=this.validateForm();if(isInvalid){return}this.setState({changeInProgress:true},()=>this.performPasswordChange())})});_defineProperty(this,"validateCurrentPassword",(shouldValidate=this.state.shouldValidate)=>{if(!shouldValidate||!this.props.isUserChangingOwnPassword){return{isInvalid:false}}if(this.state.currentPasswordError){return{isInvalid:true,error:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.changePasswordForm.invalidPassword",defaultMessage:"Current password is incorrect."})}}if(!this.state.currentPassword){return{isInvalid:true,error:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.currentPasswordRequired",defaultMessage:"Current password is required."})}}return{isInvalid:false}});_defineProperty(this,"validateNewPassword",(shouldValidate=this.state.shouldValidate)=>{const{newPassword:newPassword}=this.state;const minPasswordLength=6;if(shouldValidate&&newPassword.length<minPasswordLength){return{isInvalid:true,error:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.passwordLengthDescription",defaultMessage:"Password is too short."})}}return{isInvalid:false}});_defineProperty(this,"validateConfirmPassword",(shouldValidate=this.state.shouldValidate)=>{const{newPassword:newPassword,confirmPassword:confirmPassword}=this.state;if(shouldValidate&&newPassword!==confirmPassword){return{isInvalid:true,error:external_kbnSharedDeps_React_default.a.createElement(external_kbnSharedDeps_KbnI18nReact_["FormattedMessage"],{id:"xpack.security.account.passwordsDoNotMatch",defaultMessage:"Passwords do not match."})}}return{isInvalid:false}});_defineProperty(this,"validateForm",()=>{const validation=[this.validateCurrentPassword(true),this.validateNewPassword(true),this.validateConfirmPassword(true)];const firstFailure=validation.find(result=>result.isInvalid);if(firstFailure){return firstFailure}return{isInvalid:false}});_defineProperty(this,"performPasswordChange",async()=>{try{await this.props.userAPIClient.changePassword(this.props.user.username,this.state.newPassword,this.state.currentPassword);this.handleChangePasswordSuccess()}catch(e){this.handleChangePasswordFailure(e)}finally{this.setState({changeInProgress:false})}});_defineProperty(this,"handleChangePasswordSuccess",()=>{this.props.notifications.toasts.addSuccess({title:external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.security.account.changePasswordSuccess",{defaultMessage:"Your password has been changed."}),"data-test-subj":"passwordUpdateSuccess"});this.setState({currentPasswordError:false,shouldValidate:false,newPassword:"",currentPassword:"",confirmPassword:""});if(this.props.onChangePassword){this.props.onChangePassword()}});_defineProperty(this,"handleChangePasswordFailure",error=>{if(error.body&&error.body.statusCode===403){this.setState({currentPasswordError:true})}else{this.props.notifications.toasts.addDanger(external_kbnSharedDeps_KbnI18n_["i18n"].translate("xpack.security.management.users.editUser.settingPasswordErrorMessage",{defaultMessage:"Error setting password: {message}",values:{message:external_kbnSharedDeps_Lodash_default.a.get(error,"body.message")}}))}});this.state=getInitialState()}render(){return this.getForm()}}}}]);