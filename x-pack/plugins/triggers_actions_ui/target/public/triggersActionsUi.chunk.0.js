/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window["triggersActionsUi_bundle_jsonpfunction"]=window["triggersActionsUi_bundle_jsonpfunction"]||[]).push([[0,5],{114:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.bindTo_=exports.bind_=exports.hole=exports.pipe=exports.untupled=exports.tupled=exports.absurd=exports.decrement=exports.increment=exports.tuple=exports.flow=exports.flip=exports.constVoid=exports.constUndefined=exports.constNull=exports.constFalse=exports.constTrue=exports.constant=exports.not=exports.unsafeCoerce=exports.identity=void 0;function identity(a){return a}exports.identity=identity;exports.unsafeCoerce=identity;function not(predicate){return function(a){return!predicate(a)}}exports.not=not;function constant(a){return function(){return a}}exports.constant=constant;exports.constTrue=function(){return true};exports.constFalse=function(){return false};exports.constNull=function(){return null};exports.constUndefined=function(){return};exports.constVoid=function(){return};function flip(f){return function(b,a){return f(a,b)}}exports.flip=flip;function flow(ab,bc,cd,de,ef,fg,gh,hi,ij){switch(arguments.length){case 1:return ab;case 2:return function(){return bc(ab.apply(this,arguments))};case 3:return function(){return cd(bc(ab.apply(this,arguments)))};case 4:return function(){return de(cd(bc(ab.apply(this,arguments))))};case 5:return function(){return ef(de(cd(bc(ab.apply(this,arguments)))))};case 6:return function(){return fg(ef(de(cd(bc(ab.apply(this,arguments))))))};case 7:return function(){return gh(fg(ef(de(cd(bc(ab.apply(this,arguments)))))))};case 8:return function(){return hi(gh(fg(ef(de(cd(bc(ab.apply(this,arguments))))))))};case 9:return function(){return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this,arguments)))))))))}}return}exports.flow=flow;function tuple(){var t=[];for(var _i=0;_i<arguments.length;_i++){t[_i]=arguments[_i]}return t}exports.tuple=tuple;function increment(n){return n+1}exports.increment=increment;function decrement(n){return n-1}exports.decrement=decrement;function absurd(_){throw new Error("Called `absurd` function which should be uncallable")}exports.absurd=absurd;function tupled(f){return function(a){return f.apply(void 0,a)}}exports.tupled=tupled;function untupled(f){return function(){var a=[];for(var _i=0;_i<arguments.length;_i++){a[_i]=arguments[_i]}return f(a)}}exports.untupled=untupled;function pipe(a,ab,bc,cd,de,ef,fg,gh,hi,ij,jk,kl,lm,mn,no,op,pq,qr,rs,st){switch(arguments.length){case 1:return a;case 2:return ab(a);case 3:return bc(ab(a));case 4:return cd(bc(ab(a)));case 5:return de(cd(bc(ab(a))));case 6:return ef(de(cd(bc(ab(a)))));case 7:return fg(ef(de(cd(bc(ab(a))))));case 8:return gh(fg(ef(de(cd(bc(ab(a)))))));case 9:return hi(gh(fg(ef(de(cd(bc(ab(a))))))));case 10:return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));case 11:return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))));case 12:return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))));case 13:return lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))));case 14:return mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))));case 15:return no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))));case 16:return op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))));case 17:return pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))));case 18:return qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))));case 19:return rs(qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))))));case 20:return st(rs(qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))))))}return}exports.pipe=pipe;exports.hole=absurd;exports.bind_=function(a,name,b){var _a;return Object.assign({},a,(_a={},_a[name]=b,_a))};exports.bindTo_=function(name){return function(b){var _a;return _a={},_a[name]=b,_a}}},87:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"e",(function(){return hasShowActionsCapability}));__webpack_require__.d(__webpack_exports__,"d",(function(){return hasSaveActionsCapability}));__webpack_require__.d(__webpack_exports__,"c",(function(){return hasExecuteActionsCapability}));__webpack_require__.d(__webpack_exports__,"b",(function(){return hasDeleteActionsCapability}));__webpack_require__.d(__webpack_exports__,"a",(function(){return hasAllPrivilege}));const hasShowActionsCapability=capabilities=>{var _capabilities$actions;return capabilities===null||capabilities===void 0?void 0:(_capabilities$actions=capabilities.actions)===null||_capabilities$actions===void 0?void 0:_capabilities$actions.show};const hasSaveActionsCapability=capabilities=>{var _capabilities$actions2;return capabilities===null||capabilities===void 0?void 0:(_capabilities$actions2=capabilities.actions)===null||_capabilities$actions2===void 0?void 0:_capabilities$actions2.save};const hasExecuteActionsCapability=capabilities=>{var _capabilities$actions3;return capabilities===null||capabilities===void 0?void 0:(_capabilities$actions3=capabilities.actions)===null||_capabilities$actions3===void 0?void 0:_capabilities$actions3.execute};const hasDeleteActionsCapability=capabilities=>{var _capabilities$actions4;return capabilities===null||capabilities===void 0?void 0:(_capabilities$actions4=capabilities.actions)===null||_capabilities$actions4===void 0?void 0:_capabilities$actions4.delete};function hasAllPrivilege(alert,alertType){var _alertType$authorized,_alertType$authorized2;return(_alertType$authorized=alertType===null||alertType===void 0?void 0:(_alertType$authorized2=alertType.authorizedConsumers[alert.consumer])===null||_alertType$authorized2===void 0?void 0:_alertType$authorized2.all)!==null&&_alertType$authorized!==void 0?_alertType$authorized:false}function hasReadPrivilege(alert,alertType){var _alertType$authorized3,_alertType$authorized4;return(_alertType$authorized3=alertType===null||alertType===void 0?void 0:(_alertType$authorized4=alertType.authorizedConsumers[alert.consumer])===null||_alertType$authorized4===void 0?void 0:_alertType$authorized4.read)!==null&&_alertType$authorized3!==void 0?_alertType$authorized3:false}},91:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.apS=exports.bind=exports.bindTo=exports.getRefinement=exports.exists=exports.elem=exports.option=exports.MonadThrow=exports.Witherable=exports.Traversable=exports.Filterable=exports.Compactable=exports.Extend=exports.Alternative=exports.Alt=exports.Foldable=exports.Monad=exports.Applicative=exports.Functor=exports.getMonoid=exports.getLastMonoid=exports.getFirstMonoid=exports.getApplyMonoid=exports.getApplySemigroup=exports.getOrd=exports.getEq=exports.getShow=exports.URI=exports.wilt=exports.wither=exports.sequence=exports.traverse=exports.partitionMap=exports.partition=exports.filterMap=exports.filter=exports.separate=exports.compact=exports.reduceRight=exports.foldMap=exports.reduce=exports.duplicate=exports.extend=exports.throwError=exports.zero=exports.alt=exports.flatten=exports.chainFirst=exports.chain=exports.of=exports.apSecond=exports.apFirst=exports.ap=exports.map=exports.mapNullable=exports.getOrElse=exports.getOrElseW=exports.toUndefined=exports.toNullable=exports.fold=exports.fromEither=exports.getRight=exports.getLeft=exports.tryCatch=exports.fromPredicate=exports.fromNullable=exports.some=exports.none=exports.isNone=exports.isSome=void 0;var function_1=__webpack_require__(114);exports.isSome=function(fa){return fa._tag==="Some"};exports.isNone=function(fa){return fa._tag==="None"};exports.none={_tag:"None"};exports.some=function(a){return{_tag:"Some",value:a}};function fromNullable(a){return a==null?exports.none:exports.some(a)}exports.fromNullable=fromNullable;function fromPredicate(predicate){return function(a){return predicate(a)?exports.some(a):exports.none}}exports.fromPredicate=fromPredicate;function tryCatch(f){try{return exports.some(f())}catch(e){return exports.none}}exports.tryCatch=tryCatch;function getLeft(ma){return ma._tag==="Right"?exports.none:exports.some(ma.left)}exports.getLeft=getLeft;function getRight(ma){return ma._tag==="Left"?exports.none:exports.some(ma.right)}exports.getRight=getRight;exports.fromEither=function(ma){return ma._tag==="Left"?exports.none:exports.some(ma.right)};function fold(onNone,onSome){return function(ma){return exports.isNone(ma)?onNone():onSome(ma.value)}}exports.fold=fold;function toNullable(ma){return exports.isNone(ma)?null:ma.value}exports.toNullable=toNullable;function toUndefined(ma){return exports.isNone(ma)?undefined:ma.value}exports.toUndefined=toUndefined;exports.getOrElseW=function(onNone){return function(ma){return exports.isNone(ma)?onNone():ma.value}};exports.getOrElse=exports.getOrElseW;function mapNullable(f){return function(ma){return exports.isNone(ma)?exports.none:fromNullable(f(ma.value))}}exports.mapNullable=mapNullable;var map_=function(fa,f){return function_1.pipe(fa,exports.map(f))};var ap_=function(fab,fa){return function_1.pipe(fab,exports.ap(fa))};var chain_=function(ma,f){return function_1.pipe(ma,exports.chain(f))};var reduce_=function(fa,b,f){return function_1.pipe(fa,exports.reduce(b,f))};var foldMap_=function(M){var foldMapM=exports.foldMap(M);return function(fa,f){return function_1.pipe(fa,foldMapM(f))}};var reduceRight_=function(fa,b,f){return function_1.pipe(fa,exports.reduceRight(b,f))};var traverse_=function(F){var traverseF=exports.traverse(F);return function(ta,f){return function_1.pipe(ta,traverseF(f))}};var alt_=function(fa,that){return function_1.pipe(fa,exports.alt(that))};var filter_=function(fa,predicate){return function_1.pipe(fa,exports.filter(predicate))};var filterMap_=function(fa,f){return function_1.pipe(fa,exports.filterMap(f))};var extend_=function(wa,f){return function_1.pipe(wa,exports.extend(f))};var partition_=function(fa,predicate){return function_1.pipe(fa,exports.partition(predicate))};var partitionMap_=function(fa,f){return function_1.pipe(fa,exports.partitionMap(f))};var wither_=function(F){var witherF=exports.wither(F);return function(fa,f){return function_1.pipe(fa,witherF(f))}};var wilt_=function(F){var wiltF=exports.wilt(F);return function(fa,f){return function_1.pipe(fa,wiltF(f))}};exports.map=function(f){return function(fa){return exports.isNone(fa)?exports.none:exports.some(f(fa.value))}};exports.ap=function(fa){return function(fab){return exports.isNone(fab)?exports.none:exports.isNone(fa)?exports.none:exports.some(fab.value(fa.value))}};exports.apFirst=function(fb){return function_1.flow(exports.map((function(a){return function(){return a}})),exports.ap(fb))};exports.apSecond=function(fb){return function_1.flow(exports.map((function(){return function(b){return b}})),exports.ap(fb))};exports.of=exports.some;exports.chain=function(f){return function(ma){return exports.isNone(ma)?exports.none:f(ma.value)}};exports.chainFirst=function(f){return exports.chain((function(a){return function_1.pipe(f(a),exports.map((function(){return a})))}))};exports.flatten=exports.chain(function_1.identity);exports.alt=function(that){return function(fa){return exports.isNone(fa)?that():fa}};exports.zero=function(){return exports.none};exports.throwError=function(){return exports.none};exports.extend=function(f){return function(wa){return exports.isNone(wa)?exports.none:exports.some(f(wa))}};exports.duplicate=exports.extend(function_1.identity);exports.reduce=function(b,f){return function(fa){return exports.isNone(fa)?b:f(b,fa.value)}};exports.foldMap=function(M){return function(f){return function(fa){return exports.isNone(fa)?M.empty:f(fa.value)}}};exports.reduceRight=function(b,f){return function(fa){return exports.isNone(fa)?b:f(fa.value,b)}};exports.compact=exports.flatten;var defaultSeparate={left:exports.none,right:exports.none};exports.separate=function(ma){var o=function_1.pipe(ma,exports.map((function(e){return{left:getLeft(e),right:getRight(e)}})));return exports.isNone(o)?defaultSeparate:o.value};exports.filter=function(predicate){return function(fa){return exports.isNone(fa)?exports.none:predicate(fa.value)?fa:exports.none}};exports.filterMap=function(f){return function(fa){return exports.isNone(fa)?exports.none:f(fa.value)}};exports.partition=function(predicate){return function(fa){return{left:function_1.pipe(fa,exports.filter((function(a){return!predicate(a)}))),right:function_1.pipe(fa,exports.filter(predicate))}}};exports.partitionMap=function(f){return function(fa){return exports.separate(function_1.pipe(fa,exports.map(f)))}};exports.traverse=function(F){return function(f){return function(ta){return exports.isNone(ta)?F.of(exports.none):F.map(f(ta.value),exports.some)}}};exports.sequence=function(F){return function(ta){return exports.isNone(ta)?F.of(exports.none):F.map(ta.value,exports.some)}};exports.wither=function(F){return function(f){return function(fa){return exports.isNone(fa)?F.of(exports.none):f(fa.value)}}};exports.wilt=function(F){return function(f){return function(fa){var o=function_1.pipe(fa,exports.map((function(a){return F.map(f(a),(function(e){return{left:getLeft(e),right:getRight(e)}}))})));return exports.isNone(o)?F.of({left:exports.none,right:exports.none}):o.value}}};exports.URI="Option";function getShow(S){return{show:function(ma){return exports.isNone(ma)?"none":"some("+S.show(ma.value)+")"}}}exports.getShow=getShow;function getEq(E){return{equals:function(x,y){return x===y||(exports.isNone(x)?exports.isNone(y):exports.isNone(y)?false:E.equals(x.value,y.value))}}}exports.getEq=getEq;function getOrd(O){return{equals:getEq(O).equals,compare:function(x,y){return x===y?0:exports.isSome(x)?exports.isSome(y)?O.compare(x.value,y.value):1:-1}}}exports.getOrd=getOrd;function getApplySemigroup(S){return{concat:function(x,y){return exports.isSome(x)&&exports.isSome(y)?exports.some(S.concat(x.value,y.value)):exports.none}}}exports.getApplySemigroup=getApplySemigroup;function getApplyMonoid(M){return{concat:getApplySemigroup(M).concat,empty:exports.some(M.empty)}}exports.getApplyMonoid=getApplyMonoid;function getFirstMonoid(){return{concat:function(x,y){return exports.isNone(x)?y:x},empty:exports.none}}exports.getFirstMonoid=getFirstMonoid;function getLastMonoid(){return{concat:function(x,y){return exports.isNone(y)?x:y},empty:exports.none}}exports.getLastMonoid=getLastMonoid;function getMonoid(S){return{concat:function(x,y){return exports.isNone(x)?y:exports.isNone(y)?x:exports.some(S.concat(x.value,y.value))},empty:exports.none}}exports.getMonoid=getMonoid;exports.Functor={URI:exports.URI,map:map_};exports.Applicative={URI:exports.URI,map:map_,ap:ap_,of:exports.of};exports.Monad={URI:exports.URI,map:map_,ap:ap_,of:exports.of,chain:chain_};exports.Foldable={URI:exports.URI,reduce:reduce_,foldMap:foldMap_,reduceRight:reduceRight_};exports.Alt={URI:exports.URI,map:map_,alt:alt_};exports.Alternative={URI:exports.URI,map:map_,ap:ap_,of:exports.of,alt:alt_,zero:exports.zero};exports.Extend={URI:exports.URI,map:map_,extend:extend_};exports.Compactable={URI:exports.URI,compact:exports.compact,separate:exports.separate};exports.Filterable={URI:exports.URI,map:map_,compact:exports.compact,separate:exports.separate,filter:filter_,filterMap:filterMap_,partition:partition_,partitionMap:partitionMap_};exports.Traversable={URI:exports.URI,map:map_,reduce:reduce_,foldMap:foldMap_,reduceRight:reduceRight_,traverse:traverse_,sequence:exports.sequence};exports.Witherable={URI:exports.URI,map:map_,reduce:reduce_,foldMap:foldMap_,reduceRight:reduceRight_,traverse:traverse_,sequence:exports.sequence,compact:exports.compact,separate:exports.separate,filter:filter_,filterMap:filterMap_,partition:partition_,partitionMap:partitionMap_,wither:wither_,wilt:wilt_};exports.MonadThrow={URI:exports.URI,map:map_,ap:ap_,of:exports.of,chain:chain_,throwError:exports.throwError};exports.option={URI:exports.URI,map:map_,of:exports.of,ap:ap_,chain:chain_,reduce:reduce_,foldMap:foldMap_,reduceRight:reduceRight_,traverse:traverse_,sequence:exports.sequence,zero:exports.zero,alt:alt_,extend:extend_,compact:exports.compact,separate:exports.separate,filter:filter_,filterMap:filterMap_,partition:partition_,partitionMap:partitionMap_,wither:wither_,wilt:wilt_,throwError:exports.throwError};function elem(E){return function(a,ma){return exports.isNone(ma)?false:E.equals(a,ma.value)}}exports.elem=elem;function exists(predicate){return function(ma){return exports.isNone(ma)?false:predicate(ma.value)}}exports.exists=exists;function getRefinement(getOption){return function(a){return exports.isSome(getOption(a))}}exports.getRefinement=getRefinement;exports.bindTo=function(name){return exports.map(function_1.bindTo_(name))};exports.bind=function(name,f){return exports.chain((function(a){return function_1.pipe(f(a),exports.map((function(b){return function_1.bind_(a,name,b)})))}))};exports.apS=function(name,fb){return function_1.flow(exports.map((function(a){return function(b){return function_1.bind_(a,name,b)}})),exports.ap(fb))}},93:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.pipeable=exports.pipe=void 0;var function_1=__webpack_require__(114);exports.pipe=function_1.pipe;var isFunctor=function(I){return typeof I.map==="function"};var isContravariant=function(I){return typeof I.contramap==="function"};var isFunctorWithIndex=function(I){return typeof I.mapWithIndex==="function"};var isApply=function(I){return typeof I.ap==="function"};var isChain=function(I){return typeof I.chain==="function"};var isBifunctor=function(I){return typeof I.bimap==="function"};var isExtend=function(I){return typeof I.extend==="function"};var isFoldable=function(I){return typeof I.reduce==="function"};var isFoldableWithIndex=function(I){return typeof I.reduceWithIndex==="function"};var isAlt=function(I){return typeof I.alt==="function"};var isCompactable=function(I){return typeof I.compact==="function"};var isFilterable=function(I){return typeof I.filter==="function"};var isFilterableWithIndex=function(I){return typeof I.filterWithIndex==="function"};var isProfunctor=function(I){return typeof I.promap==="function"};var isSemigroupoid=function(I){return typeof I.compose==="function"};var isMonadThrow=function(I){return typeof I.throwError==="function"};function pipeable(I){var r={};if(isFunctor(I)){var map=function(f){return function(fa){return I.map(fa,f)}};r.map=map}if(isContravariant(I)){var contramap=function(f){return function(fa){return I.contramap(fa,f)}};r.contramap=contramap}if(isFunctorWithIndex(I)){var mapWithIndex=function(f){return function(fa){return I.mapWithIndex(fa,f)}};r.mapWithIndex=mapWithIndex}if(isApply(I)){var ap=function(fa){return function(fab){return I.ap(fab,fa)}};var apFirst=function(fb){return function(fa){return I.ap(I.map(fa,(function(a){return function(){return a}})),fb)}};r.ap=ap;r.apFirst=apFirst;r.apSecond=function(fb){return function(fa){return I.ap(I.map(fa,(function(){return function(b){return b}})),fb)}}}if(isChain(I)){var chain=function(f){return function(ma){return I.chain(ma,f)}};var chainFirst=function(f){return function(ma){return I.chain(ma,(function(a){return I.map(f(a),(function(){return a}))}))}};var flatten=function(mma){return I.chain(mma,function_1.identity)};r.chain=chain;r.chainFirst=chainFirst;r.flatten=flatten}if(isBifunctor(I)){var bimap=function(f,g){return function(fa){return I.bimap(fa,f,g)}};var mapLeft=function(f){return function(fa){return I.mapLeft(fa,f)}};r.bimap=bimap;r.mapLeft=mapLeft}if(isExtend(I)){var extend=function(f){return function(wa){return I.extend(wa,f)}};var duplicate=function(wa){return I.extend(wa,function_1.identity)};r.extend=extend;r.duplicate=duplicate}if(isFoldable(I)){var reduce=function(b,f){return function(fa){return I.reduce(fa,b,f)}};var foldMap=function(M){var foldMapM=I.foldMap(M);return function(f){return function(fa){return foldMapM(fa,f)}}};var reduceRight=function(b,f){return function(fa){return I.reduceRight(fa,b,f)}};r.reduce=reduce;r.foldMap=foldMap;r.reduceRight=reduceRight}if(isFoldableWithIndex(I)){var reduceWithIndex=function(b,f){return function(fa){return I.reduceWithIndex(fa,b,f)}};var foldMapWithIndex=function(M){var foldMapM=I.foldMapWithIndex(M);return function(f){return function(fa){return foldMapM(fa,f)}}};var reduceRightWithIndex=function(b,f){return function(fa){return I.reduceRightWithIndex(fa,b,f)}};r.reduceWithIndex=reduceWithIndex;r.foldMapWithIndex=foldMapWithIndex;r.reduceRightWithIndex=reduceRightWithIndex}if(isAlt(I)){var alt=function(that){return function(fa){return I.alt(fa,that)}};r.alt=alt}if(isCompactable(I)){r.compact=I.compact;r.separate=I.separate}if(isFilterable(I)){var filter=function(predicate){return function(fa){return I.filter(fa,predicate)}};var filterMap=function(f){return function(fa){return I.filterMap(fa,f)}};var partition=function(predicate){return function(fa){return I.partition(fa,predicate)}};var partitionMap=function(f){return function(fa){return I.partitionMap(fa,f)}};r.filter=filter;r.filterMap=filterMap;r.partition=partition;r.partitionMap=partitionMap}if(isFilterableWithIndex(I)){var filterWithIndex=function(predicateWithIndex){return function(fa){return I.filterWithIndex(fa,predicateWithIndex)}};var filterMapWithIndex=function(f){return function(fa){return I.filterMapWithIndex(fa,f)}};var partitionWithIndex=function(predicateWithIndex){return function(fa){return I.partitionWithIndex(fa,predicateWithIndex)}};var partitionMapWithIndex=function(f){return function(fa){return I.partitionMapWithIndex(fa,f)}};r.filterWithIndex=filterWithIndex;r.filterMapWithIndex=filterMapWithIndex;r.partitionWithIndex=partitionWithIndex;r.partitionMapWithIndex=partitionMapWithIndex}if(isProfunctor(I)){var promap=function(f,g){return function(fa){return I.promap(fa,f,g)}};r.promap=promap}if(isSemigroupoid(I)){var compose=function(that){return function(fa){return I.compose(fa,that)}};r.compose=compose}if(isMonadThrow(I)){var fromOption=function(onNone){return function(ma){return ma._tag==="None"?I.throwError(onNone()):I.of(ma.value)}};var fromEither=function(ma){return ma._tag==="Left"?I.throwError(ma.left):I.of(ma.right)};var fromPredicate=function(predicate,onFalse){return function(a){return predicate(a)?I.of(a):I.throwError(onFalse(a))}};var filterOrElse=function(predicate,onFalse){return function(ma){return I.chain(ma,(function(a){return predicate(a)?I.of(a):I.throwError(onFalse(a))}))}};r.fromOption=fromOption;r.fromEither=fromEither;r.fromPredicate=fromPredicate;r.filterOrElse=filterOrElse}return r}exports.pipeable=pipeable}}]);