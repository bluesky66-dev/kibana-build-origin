"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorMappingsRt = exports.ConnectorMappingsAttributesRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

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


const ActionTypeRT = rt.union([rt.literal('append'), rt.literal('nothing'), rt.literal('overwrite')]);
const CaseFieldRT = rt.union([rt.literal('title'), rt.literal('description'), rt.literal('comments')]);
const ThirdPartyFieldRT = rt.union([rt.string, rt.literal('not_mapped')]);
const ConnectorMappingsAttributesRT = rt.type({
  action_type: ActionTypeRT,
  source: CaseFieldRT,
  target: ThirdPartyFieldRT
});
exports.ConnectorMappingsAttributesRT = ConnectorMappingsAttributesRT;
const ConnectorMappingsRt = rt.type({
  mappings: rt.array(ConnectorMappingsAttributesRT)
});
exports.ConnectorMappingsRt = ConnectorMappingsRt;
const FieldTypeRT = rt.union([rt.literal('text'), rt.literal('textarea')]);
const ConnectorFieldRt = rt.type({
  id: rt.string,
  name: rt.string,
  required: rt.boolean,
  type: FieldTypeRT
});
const GetFieldsResponseRt = rt.type({
  defaultMappings: rt.array(ConnectorMappingsAttributesRT),
  fields: rt.array(ConnectorFieldRt)
});