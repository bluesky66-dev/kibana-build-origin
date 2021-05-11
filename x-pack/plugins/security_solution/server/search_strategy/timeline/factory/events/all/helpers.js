"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatTimelineData = void 0;

var _fp = require("lodash/fp");

var _to_array = require("../../../../helpers/to_array");

var _helpers = require("../details/helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTimestamp = hit => {
  if (hit.fields && hit.fields['@timestamp']) {
    var _hit$fields$Timestam;

    return `${(_hit$fields$Timestam = hit.fields['@timestamp'][0]) !== null && _hit$fields$Timestam !== void 0 ? _hit$fields$Timestam : ''}`;
  } else if (hit._source && hit._source['@timestamp']) {
    return hit._source['@timestamp'];
  }

  return '';
};

const formatTimelineData = async (dataFields, ecsFields, hit) => (0, _fp.uniq)([...ecsFields, ...dataFields]).reduce(async (acc, fieldName) => {
  const flattenedFields = await acc;
  flattenedFields.node._id = hit._id;
  flattenedFields.node._index = hit._index;
  flattenedFields.node.ecs._id = hit._id;
  flattenedFields.node.ecs.timestamp = getTimestamp(hit);
  flattenedFields.node.ecs._index = hit._index;

  if (hit.sort && hit.sort.length > 1) {
    flattenedFields.cursor.value = hit.sort[0];
    flattenedFields.cursor.tiebreaker = hit.sort[1];
  }

  const waitForIt = await mergeTimelineFieldsWithHit(fieldName, flattenedFields, hit, dataFields, ecsFields);
  return Promise.resolve(waitForIt);
}, Promise.resolve({
  node: {
    ecs: {
      _id: ''
    },
    data: [],
    _id: '',
    _index: ''
  },
  cursor: {
    value: '',
    tiebreaker: null
  }
}));

exports.formatTimelineData = formatTimelineData;
const specialFields = ['_id', '_index', '_type', '_score'];

const getValuesFromFields = async (fieldName, hit, nestedParentFieldName) => {
  if (specialFields.includes(fieldName)) {
    return [{
      field: fieldName,
      value: (0, _to_array.toStringArray)((0, _fp.get)(fieldName, hit))
    }];
  }

  let fieldToEval;

  if ((0, _fp.has)(fieldName, hit._source)) {
    fieldToEval = {
      [fieldName]: (0, _fp.get)(fieldName, hit._source)
    };
  } else {
    if (nestedParentFieldName == null || nestedParentFieldName === fieldName) {
      fieldToEval = {
        [fieldName]: hit.fields[fieldName]
      };
    } else if (nestedParentFieldName != null) {
      fieldToEval = {
        [nestedParentFieldName]: hit.fields[nestedParentFieldName]
      };
    } else {
      // fallback, should never hit
      fieldToEval = {
        [fieldName]: []
      };
    }
  }

  const formattedData = await (0, _helpers.getDataSafety)(_helpers.getDataFromFieldsHits, fieldToEval);
  return formattedData.reduce((acc, {
    field,
    values
  }) => // nested fields return all field values, pick only the one we asked for
  field.includes(fieldName) ? [...acc, {
    field,
    value: values
  }] : acc, []);
};

const mergeTimelineFieldsWithHit = async (fieldName, flattenedFields, hit, dataFields, ecsFields) => {
  if (fieldName != null || dataFields.includes(fieldName)) {
    var _hit$fields;

    const fieldNameAsArray = fieldName.split('.');
    const nestedParentFieldName = Object.keys((_hit$fields = hit.fields) !== null && _hit$fields !== void 0 ? _hit$fields : []).find(f => {
      return f === fieldNameAsArray.slice(0, f.split('.').length).join('.');
    });

    if ((0, _fp.has)(fieldName, hit._source) || (0, _fp.has)(fieldName, hit.fields) || nestedParentFieldName != null || specialFields.includes(fieldName)) {
      const objectWithProperty = {
        node: { ...(0, _fp.get)('node', flattenedFields),
          data: dataFields.includes(fieldName) ? [...(0, _fp.get)('node.data', flattenedFields), ...(await getValuesFromFields(fieldName, hit, nestedParentFieldName))] : (0, _fp.get)('node.data', flattenedFields),
          ecs: ecsFields.includes(fieldName) ? { ...(0, _fp.get)('node.ecs', flattenedFields),
            // @ts-expect-error
            ...fieldName.split('.').reduceRight( // @ts-expect-error
            (obj, next) => ({
              [next]: obj
            }), (0, _to_array.toStringArray)((0, _fp.has)(fieldName, hit._source) ? (0, _fp.get)(fieldName, hit._source) : hit.fields[fieldName]))
          } : (0, _fp.get)('node.ecs', flattenedFields)
        }
      };
      return (0, _fp.merge)(flattenedFields, objectWithProperty);
    } else {
      return flattenedFields;
    }
  } else {
    return flattenedFields;
  }
};