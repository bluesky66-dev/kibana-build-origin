"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatHostEdgesData = exports.HOSTS_FIELDS = void 0;

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


const HOSTS_FIELDS = ['_id', 'lastSeen', 'host.id', 'host.name', 'host.os.name', 'host.os.version'];
exports.HOSTS_FIELDS = HOSTS_FIELDS;

const formatHostEdgesData = (fields = HOSTS_FIELDS, bucket) => fields.reduce((flattenedFields, fieldName) => {
  const hostId = (0, _fp2.get)('key', bucket);
  flattenedFields.node._id = hostId || null;
  flattenedFields.cursor.value = hostId || '';
  const fieldValue = getHostFieldValue(fieldName, bucket);

  if (fieldValue != null) {
    return (0, _fp.set)(`node.${fieldName}`, (0, _to_array.toObjectArrayOfStrings)(fieldValue).map(({
      str
    }) => str), flattenedFields);
  }

  return flattenedFields;
}, {
  node: {},
  cursor: {
    value: '',
    tiebreaker: null
  }
});

exports.formatHostEdgesData = formatHostEdgesData;

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