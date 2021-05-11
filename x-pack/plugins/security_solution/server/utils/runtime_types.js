"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.excess = exports.decodeOrThrow = exports.throwErrors = exports.createPlainError = void 0;

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _pipeable = require("fp-ts/lib/pipeable");

var rt = _interopRequireWildcard(require("io-ts"));

var _PathReporter = require("io-ts/lib/PathReporter");

var _get = _interopRequireDefault(require("lodash/get"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createPlainError = message => new Error(message);

exports.createPlainError = createPlainError;

const throwErrors = createError => errors => {
  throw createError((0, _PathReporter.failure)(errors).join('\n'));
};

exports.throwErrors = throwErrors;

const decodeOrThrow = (runtimeType, createError = createPlainError) => inputValue => (0, _pipeable.pipe)(runtimeType.decode(inputValue), (0, _Either.fold)(throwErrors(createError), _function.identity));

exports.decodeOrThrow = decodeOrThrow;

const getProps = codec => {
  if (codec == null) {
    return null;
  }

  switch (codec._tag) {
    case 'DictionaryType':
      if (codec.codomain.props != null) {
        return codec.codomain.props;
      }

      const dTypes = codec.codomain.types;
      return dTypes.reduce((props, type) => Object.assign(props, getProps(type)), {});

    case 'RefinementType':
    case 'ReadonlyType':
      return getProps(codec.type);

    case 'InterfaceType':
    case 'StrictType':
    case 'PartialType':
      return codec.props;

    case 'IntersectionType':
      const iTypes = codec.types;
      return iTypes.reduce((props, type) => {
        return Object.assign(props, getProps(type));
      }, {});

    default:
      return null;
  }
};

const getExcessProps = (props, r) => {
  return Object.keys(r).reduce((acc, k) => {
    const codecChildren = (0, _get.default)(props, [k]);
    const childrenProps = getProps(codecChildren);
    const childrenObject = r[k];

    if (codecChildren != null && childrenProps != null && codecChildren._tag === 'DictionaryType') {
      const keys = Object.keys(childrenObject);
      return [...acc, ...keys.reduce((kAcc, i) => [...kAcc, ...getExcessProps(childrenProps, childrenObject[i])], [])];
    }

    if (codecChildren != null && childrenProps != null) {
      return [...acc, ...getExcessProps(childrenProps, childrenObject)];
    } else if (codecChildren == null) {
      return [...acc, k];
    }

    return acc;
  }, []);
};

const excess = codec => {
  const codecProps = getProps(codec);
  const r = new rt.InterfaceType(codec.name, codec.is, (i, c) => _Either.either.chain(rt.UnknownRecord.validate(i, c), s => {
    if (codecProps == null) {
      return rt.failure(i, c, 'unknown codec');
    }

    const ex = getExcessProps(codecProps, s);
    return ex.length > 0 ? rt.failure(i, c, `Invalid value ${JSON.stringify(i)}, excess properties: ${JSON.stringify(ex)}`) : codec.validate(i, c);
  }), codec.encode, codecProps);
  return r;
};

exports.excess = excess;