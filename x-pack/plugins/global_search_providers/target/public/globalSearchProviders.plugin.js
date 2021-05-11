/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{enumerable:true,get:getter})}};__webpack_require__.r=function(exports){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(exports,"__esModule",{value:true})};__webpack_require__.t=function(value,mode){if(mode&1)value=__webpack_require__(value);if(mode&8)return value;if(mode&4&&typeof value==="object"&&value&&value.__esModule)return value;var ns=Object.create(null);__webpack_require__.r(ns);Object.defineProperty(ns,"default",{enumerable:true,value:value});if(mode&2&&typeof value!="string")for(var key in value)__webpack_require__.d(ns,key,function(key){return value[key]}.bind(null,key));return ns};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";return __webpack_require__(__webpack_require__.s=3)})([function(module,exports){module.exports=__kbnSharedDeps__.RxjsOperators},function(module,exports){module.exports=__kbnSharedDeps__.Rxjs},function(module,exports,__webpack_require__){"use strict";module.exports=function(){function _min(d0,d1,d2,bx,ay){return d0<d1||d2<d1?d0>d2?d2+1:d0+1:bx===ay?d1:d1+1}return function(a,b){if(a===b){return 0}if(a.length>b.length){var tmp=a;a=b;b=tmp}var la=a.length;var lb=b.length;while(la>0&&a.charCodeAt(la-1)===b.charCodeAt(lb-1)){la--;lb--}var offset=0;while(offset<la&&a.charCodeAt(offset)===b.charCodeAt(offset)){offset++}la-=offset;lb-=offset;if(la===0||lb<3){return lb}var x=0;var y;var d0;var d1;var d2;var d3;var dd;var dy;var ay;var bx0;var bx1;var bx2;var bx3;var vector=[];for(y=0;y<la;y++){vector.push(y+1);vector.push(a.charCodeAt(offset+y))}var len=vector.length-1;for(;x<lb-3;){bx0=b.charCodeAt(offset+(d0=x));bx1=b.charCodeAt(offset+(d1=x+1));bx2=b.charCodeAt(offset+(d2=x+2));bx3=b.charCodeAt(offset+(d3=x+3));dd=x+=4;for(y=0;y<len;y+=2){dy=vector[y];ay=vector[y+1];d0=_min(dy,d0,d1,bx0,ay);d1=_min(d0,d1,d2,bx1,ay);d2=_min(d1,d2,d3,bx2,ay);dd=_min(d2,d3,dd,bx3,ay);vector[y]=dd;d3=d2;d2=d1;d1=d0;d0=dy}}for(;x<lb;){bx0=b.charCodeAt(offset+(d0=x));dd=++x;for(y=0;y<len;y+=2){dy=vector[y];vector[y]=dd=_min(dy,d0,dd,bx0,vector[y+1]);d0=dy}}return dd}}()},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_val_loader_dist_cjs_js_key_globalSearchProviders_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(4);var _node_modules_val_loader_dist_cjs_js_key_globalSearchProviders_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_val_loader_dist_cjs_js_key_globalSearchProviders_kbn_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__);__kbnBundles__.define("plugin/globalSearchProviders/public",__webpack_require__,5)},function(module,exports,__webpack_require__){__webpack_require__.p=window.__kbnPublicPath__["globalSearchProviders"]},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,"plugin",(function(){return public_plugin}));var external_kbnSharedDeps_Rxjs_=__webpack_require__(1);var external_kbnSharedDeps_RxjsOperators_=__webpack_require__(0);var js_levenshtein=__webpack_require__(2);var js_levenshtein_default=__webpack_require__.n(js_levenshtein);const keywordScoreWeighting=.8;const getAppResults=(term,apps)=>apps.flatMap(app=>{var _app$meta$keywords,_app$meta;return term.length>0?flattenDeepLinks(app):[{id:app.id,app:app,path:app.appRoute,subLinkTitles:[],keywords:(_app$meta$keywords=(_app$meta=app.meta)===null||_app$meta===void 0?void 0:_app$meta.keywords)!==null&&_app$meta$keywords!==void 0?_app$meta$keywords:[]}]}).map(appLink=>({appLink:appLink,score:scoreApp(term,appLink)})).filter(({score:score})=>score>0).map(({appLink:appLink,score:score})=>appToResult(appLink,score));const scoreApp=(term,appLink)=>{term=term.toLowerCase();const title=[appLink.app.title,...appLink.subLinkTitles].join(" ").toLowerCase();const appScoreByTerms=scoreAppByTerms(term,title);const keywords=[...appLink.app.meta.keywords.map(keyword=>keyword.toLowerCase()),...appLink.keywords.map(keyword=>keyword.toLowerCase())];const appScoreByKeywords=scoreAppByKeywords(term,keywords);return Math.max(appScoreByTerms,appScoreByKeywords*keywordScoreWeighting)};const scoreAppByTerms=(term,title)=>{if(title===term){return 100}if(title.startsWith(term)){return 90}if(title.includes(term)){return 75}const length=Math.max(term.length,title.length);const distance=js_levenshtein_default()(term,title);const ratio=Math.floor((1-distance/length)*100);if(ratio>=60){return ratio}return 0};const scoreAppByKeywords=(term,keywords)=>{const scores=keywords.map(keyword=>scoreAppByTerms(term,keyword));return Math.max(...scores)};const appToResult=(appLink,score)=>{var _appLink$app$category,_appLink$app$category2,_appLink$app$category3,_appLink$app$category4;const titleParts=appLink.app.id==="management"&&appLink.subLinkTitles.length>0?appLink.subLinkTitles:[appLink.app.title,...appLink.subLinkTitles];return{id:appLink.id,title:titleParts.join(" / "),type:"application",icon:appLink.app.euiIconType,url:appLink.path,meta:{categoryId:(_appLink$app$category=(_appLink$app$category2=appLink.app.category)===null||_appLink$app$category2===void 0?void 0:_appLink$app$category2.id)!==null&&_appLink$app$category!==void 0?_appLink$app$category:null,categoryLabel:(_appLink$app$category3=(_appLink$app$category4=appLink.app.category)===null||_appLink$app$category4===void 0?void 0:_appLink$app$category4.label)!==null&&_appLink$app$category3!==void 0?_appLink$app$category3:null},score:score}};const flattenDeepLinks=(app,deepLink)=>{var _deepLink$keywords;if(!deepLink){var _app$meta$keywords2,_app$meta2;return[{id:app.id,app:app,path:app.appRoute,subLinkTitles:[],keywords:(_app$meta$keywords2=(_app$meta2=app.meta)===null||_app$meta2===void 0?void 0:_app$meta2.keywords)!==null&&_app$meta$keywords2!==void 0?_app$meta$keywords2:[]},...app.meta.searchDeepLinks.flatMap(appDeepLink=>flattenDeepLinks(app,appDeepLink))]}return[...deepLink.path?[{id:`${app.id}-${deepLink.id}`,app:app,path:`${app.appRoute}${deepLink.path}`,subLinkTitles:[deepLink.title],keywords:[...(_deepLink$keywords=deepLink.keywords)!==null&&_deepLink$keywords!==void 0?_deepLink$keywords:[]]}]:[],...deepLink.searchDeepLinks.flatMap(deepDeepLink=>flattenDeepLinks(app,deepDeepLink)).map(deepAppLink=>({...deepAppLink,subLinkTitles:[deepLink.title,...deepAppLink.subLinkTitles],keywords:[...deepLink.keywords,...deepAppLink.keywords]}))]};const applicationType="application";const createApplicationResultProvider=applicationPromise=>{const searchableApps$=Object(external_kbnSharedDeps_Rxjs_["from"])(applicationPromise).pipe(Object(external_kbnSharedDeps_RxjsOperators_["mergeMap"])(application=>application.applications$),Object(external_kbnSharedDeps_RxjsOperators_["map"])(apps=>[...apps.values()].filter(app=>app.status===0&&app.navLinkStatus===1&&app.chromeless!==true)),Object(external_kbnSharedDeps_RxjsOperators_["shareReplay"])(1));return{id:"application",find:({term:term,types:types,tags:tags},{aborted$:aborted$,maxResults:maxResults})=>{if(tags||types&&!types.includes(applicationType)){return Object(external_kbnSharedDeps_Rxjs_["of"])([])}return searchableApps$.pipe(Object(external_kbnSharedDeps_RxjsOperators_["takeUntil"])(aborted$),Object(external_kbnSharedDeps_RxjsOperators_["take"])(1),Object(external_kbnSharedDeps_RxjsOperators_["map"])(apps=>{const results=getAppResults(term!==null&&term!==void 0?term:"",[...apps.values()]);return results.sort((a,b)=>b.score-a.score).slice(0,maxResults)}))},getSearchableTypes:()=>[applicationType]}};class plugin_GlobalSearchProvidersPlugin{setup({getStartServices:getStartServices},{globalSearch:globalSearch}){const applicationPromise=getStartServices().then(([core])=>core.application);globalSearch.registerResultProvider(createApplicationResultProvider(applicationPromise));return{}}start(){return{}}}const public_plugin=()=>new plugin_GlobalSearchProvidersPlugin}]);