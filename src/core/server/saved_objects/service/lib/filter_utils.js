"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldDefined = exports.hasFilterKeyError = exports.isSavedObjectAttr = exports.validateFilterKueryNode = exports.validateConvertFilterToKueryNode = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _lodash = require("lodash");

var _errors = require("./errors");

var _es_query = require("../../es_query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-expect-error no ts
const astFunctionType = ['is', 'range', 'nested'];

const validateConvertFilterToKueryNode = (allowedTypes, filter, indexMapping) => {
  if (filter && indexMapping) {
    const filterKueryNode = typeof filter === 'string' ? _es_query.esKuery.fromKueryExpression(filter) : filter;
    const validationFilterKuery = validateFilterKueryNode({
      astFilter: filterKueryNode,
      types: allowedTypes,
      indexMapping,
      storeValue: filterKueryNode.type === 'function' && astFunctionType.includes(filterKueryNode.function),
      hasNestedKey: filterKueryNode.type === 'function' && filterKueryNode.function === 'nested'
    });

    if (validationFilterKuery.length === 0) {
      throw _errors.SavedObjectsErrorHelpers.createBadRequestError('If we have a filter options defined, we should always have validationFilterKuery defined too');
    }

    if (validationFilterKuery.some(obj => obj.error != null)) {
      throw _errors.SavedObjectsErrorHelpers.createBadRequestError(validationFilterKuery.filter(obj => obj.error != null).map(obj => obj.error).join('\n'));
    }

    validationFilterKuery.forEach(item => {
      const path = item.astPath.length === 0 ? [] : item.astPath.split('.');
      const existingKueryNode = path.length === 0 ? filterKueryNode : (0, _lodash.get)(filterKueryNode, path);

      if (item.isSavedObjectAttr) {
        existingKueryNode.arguments[0].value = existingKueryNode.arguments[0].value.split('.')[1];
        const itemType = allowedTypes.filter(t => t === item.type);

        if (itemType.length === 1) {
          (0, _saferLodashSet.set)(filterKueryNode, path, _es_query.esKuery.nodeTypes.function.buildNode('and', [_es_query.esKuery.nodeTypes.function.buildNode('is', 'type', itemType[0]), existingKueryNode]));
        }
      } else {
        existingKueryNode.arguments[0].value = existingKueryNode.arguments[0].value.replace('.attributes', '');
        (0, _saferLodashSet.set)(filterKueryNode, path, existingKueryNode);
      }
    });
    return filterKueryNode;
  }
};

exports.validateConvertFilterToKueryNode = validateConvertFilterToKueryNode;

const validateFilterKueryNode = ({
  astFilter,
  types,
  indexMapping,
  hasNestedKey = false,
  nestedKeys,
  storeValue = false,
  path = 'arguments'
}) => {
  let localNestedKeys;
  return astFilter.arguments.reduce((kueryNode, ast, index) => {
    if (hasNestedKey && ast.type === 'literal' && ast.value != null) {
      localNestedKeys = ast.value;
    }

    if (ast.arguments) {
      const myPath = `${path}.${index}`;
      return [...kueryNode, ...validateFilterKueryNode({
        astFilter: ast,
        types,
        indexMapping,
        storeValue: ast.type === 'function' && astFunctionType.includes(ast.function),
        path: `${myPath}.arguments`,
        hasNestedKey: ast.type === 'function' && ast.function === 'nested',
        nestedKeys: localNestedKeys
      })];
    }

    if (storeValue && index === 0) {
      const splitPath = path.split('.');
      return [...kueryNode, {
        astPath: splitPath.slice(0, splitPath.length - 1).join('.'),
        error: hasFilterKeyError(nestedKeys != null ? `${nestedKeys}.${ast.value}` : ast.value, types, indexMapping),
        isSavedObjectAttr: isSavedObjectAttr(nestedKeys != null ? `${nestedKeys}.${ast.value}` : ast.value, indexMapping),
        key: nestedKeys != null ? `${nestedKeys}.${ast.value}` : ast.value,
        type: getType(nestedKeys != null ? `${nestedKeys}.${ast.value}` : ast.value)
      }];
    }

    return kueryNode;
  }, []);
};

exports.validateFilterKueryNode = validateFilterKueryNode;

const getType = key => key != null && key.includes('.') ? key.split('.')[0] : null;
/**
 * Is this filter key referring to a a top-level SavedObject attribute such as
 * `updated_at` or `references`.
 *
 * @param key
 * @param indexMapping
 */


const isSavedObjectAttr = (key, indexMapping) => {
  const keySplit = key != null ? key.split('.') : [];

  if (keySplit.length === 1 && fieldDefined(indexMapping, keySplit[0])) {
    return true;
  } else if (keySplit.length === 2 && fieldDefined(indexMapping, keySplit[1])) {
    return true;
  } else {
    return false;
  }
};

exports.isSavedObjectAttr = isSavedObjectAttr;

const hasFilterKeyError = (key, types, indexMapping) => {
  if (key == null) {
    return `The key is empty and needs to be wrapped by a saved object type like ${types.join()}`;
  }

  if (!key.includes('.')) {
    return `This key '${key}' need to be wrapped by a saved object type like ${types.join()}`;
  } else if (key.includes('.')) {
    const keySplit = key.split('.');

    if (keySplit.length <= 1 || !types.includes(keySplit[0])) {
      return `This type ${keySplit[0]} is not allowed`;
    }

    if (keySplit.length === 2 && fieldDefined(indexMapping, key) || keySplit.length > 2 && keySplit[1] !== 'attributes') {
      return `This key '${key}' does NOT match the filter proposition SavedObjectType.attributes.key`;
    }

    if (keySplit.length === 2 && !fieldDefined(indexMapping, keySplit[1]) || keySplit.length > 2 && !fieldDefined(indexMapping, `${keySplit[0]}.${keySplit.slice(2, keySplit.length).join('.')}`)) {
      return `This key '${key}' does NOT exist in ${types.join()} saved object index patterns`;
    }
  }

  return null;
};

exports.hasFilterKeyError = hasFilterKeyError;

const fieldDefined = (indexMappings, key) => {
  const mappingKey = 'properties.' + key.split('.').join('.properties.');
  const potentialKey = (0, _lodash.get)(indexMappings, mappingKey); // If the `mappingKey` does not match a valid path, before returning null,
  // we want to check and see if the intended path was for a multi-field
  // such as `x.attributes.field.text` where `field` is mapped to both text
  // and keyword

  if (potentialKey == null) {
    const propertiesAttribute = 'properties';
    const indexOfLastProperties = mappingKey.lastIndexOf(propertiesAttribute);
    const fieldMapping = mappingKey.substr(0, indexOfLastProperties);
    const fieldType = mappingKey.substr(mappingKey.lastIndexOf(propertiesAttribute) + `${propertiesAttribute}.`.length);
    const mapping = `${fieldMapping}fields.${fieldType}`;
    return (0, _lodash.get)(indexMappings, mapping) != null;
  } else {
    return true;
  }
};

exports.fieldDefined = fieldDefined;