"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapToResult = exports.mapToResults = void 0;

var _get2 = _interopRequireDefault(require("lodash/get"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const mapToResults = (objects, registry, capabilities) => {
  return objects.filter(obj => isAccessible(obj, registry.getType(obj.type), capabilities)).map(obj => mapToResult(obj, registry.getType(obj.type)));
};

exports.mapToResults = mapToResults;

const isAccessible = (object, type, capabilities) => {
  var _type$management, _get;

  const {
    getInAppUrl
  } = (_type$management = type.management) !== null && _type$management !== void 0 ? _type$management : {};

  if (getInAppUrl === undefined) {
    throw new Error('Trying to map an object from a type without management metadata');
  }

  const {
    uiCapabilitiesPath
  } = getInAppUrl(object);
  return Boolean((_get = (0, _get2.default)(capabilities, uiCapabilitiesPath)) !== null && _get !== void 0 ? _get : false);
};

const mapToResult = (object, type) => {
  var _type$management2, _type$management$icon, _type$management3;

  const {
    defaultSearchField,
    getInAppUrl
  } = (_type$management2 = type.management) !== null && _type$management2 !== void 0 ? _type$management2 : {};

  if (defaultSearchField === undefined || getInAppUrl === undefined) {
    throw new Error('Trying to map an object from a type without management metadata');
  }

  return {
    id: object.id,
    // defaultSearchField is dynamic and not 'directly' bound to the generic type of the SavedObject
    // so we are forced to cast the attributes to any to access the properties associated with it.
    title: object.attributes[defaultSearchField],
    type: object.type,
    icon: (_type$management$icon = (_type$management3 = type.management) === null || _type$management3 === void 0 ? void 0 : _type$management3.icon) !== null && _type$management$icon !== void 0 ? _type$management$icon : undefined,
    url: getInAppUrl(object).path,
    score: object.score,
    meta: {
      tagIds: object.references.filter(ref => ref.type === 'tag').map(({
        id
      }) => id)
    }
  };
};

exports.mapToResult = mapToResult;