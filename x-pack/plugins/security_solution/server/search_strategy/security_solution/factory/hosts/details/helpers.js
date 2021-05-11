"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatHostItem = exports.HOST_FIELDS = void 0;

var _fp = require("@elastic/safer-lodash-set/fp");

var _fp2 = require("lodash/fp");

var _ecs_fields = require("../../../../../../common/ecs/ecs_fields");

var _to_array = require("../../../../helpers/to_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const HOST_FIELDS = ['_id', 'host.architecture', 'host.id', 'host.ip', 'host.id', 'host.mac', 'host.name', 'host.os.family', 'host.os.name', 'host.os.platform', 'host.os.version', 'host.type', 'cloud.instance.id', 'cloud.machine.type', 'cloud.provider', 'cloud.region', 'endpoint.endpointPolicy', 'endpoint.policyStatus', 'endpoint.sensorVersion'];
exports.HOST_FIELDS = HOST_FIELDS;

const formatHostItem = bucket => HOST_FIELDS.reduce((flattenedFields, fieldName) => {
  const fieldValue = getHostFieldValue(fieldName, bucket);

  if (fieldValue != null) {
    if (fieldName === '_id') {
      return (0, _fp.set)('_id', fieldValue, flattenedFields);
    }

    return (0, _fp.set)(fieldName, (0, _to_array.toObjectArrayOfStrings)(fieldValue).map(({
      str
    }) => str), flattenedFields);
  }

  return flattenedFields;
}, {});

exports.formatHostItem = formatHostItem;

const getHostFieldValue = (fieldName, bucket) => {
  const aggField = _ecs_fields.hostFieldsMap[fieldName] ? _ecs_fields.hostFieldsMap[fieldName].replace(/\./g, '_') : fieldName.replace(/\./g, '_');

  if (['host.ip', 'host.mac', 'cloud.instance.id', 'cloud.machine.type', 'cloud.provider', 'cloud.region'].includes(fieldName) && (0, _fp2.has)(aggField, bucket)) {
    const data = (0, _fp2.get)(aggField, bucket);
    return data.buckets.map(obj => obj.key);
  } else if ((0, _fp2.has)(`${aggField}.buckets`, bucket)) {
    return getFirstItem((0, _fp2.get)(`${aggField}`, bucket));
  } else if ((0, _fp2.has)(aggField, bucket)) {
    const valueObj = (0, _fp2.get)(aggField, bucket);
    return valueObj.value_as_string;
  } else if (['host.name', 'host.os.name', 'host.os.version'].includes(fieldName)) {
    switch (fieldName) {
      case 'host.name':
        return (0, _fp2.get)('key', bucket) || null;

      case 'host.os.name':
        return (0, _fp2.get)('os.hits.hits[0]._source.host.os.name', bucket) || null;

      case 'host.os.version':
        return (0, _fp2.get)('os.hits.hits[0]._source.host.os.version', bucket) || null;
    }
  } else if (aggField === '_id') {
    const hostName = (0, _fp2.get)(`host_name`, bucket);
    return hostName ? getFirstItem(hostName) : null;
  }

  return null;
};

const getFirstItem = data => {
  const firstItem = (0, _fp2.head)(data.buckets);

  if (firstItem == null) {
    return null;
  }

  return firstItem.key;
};