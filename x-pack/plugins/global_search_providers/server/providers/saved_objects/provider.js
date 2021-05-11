"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSavedObjectsResultProvider = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _map_object_to_result = require("./map_object_to_result");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSavedObjectsResultProvider = () => {
  return {
    id: 'savedObjects',
    find: ({
      term,
      types,
      tags
    }, {
      aborted$,
      maxResults,
      preference
    }, {
      core
    }) => {
      if (!term && !types && !tags) {
        return (0, _rxjs.of)([]);
      }

      const {
        capabilities,
        savedObjects: {
          client,
          typeRegistry
        }
      } = core;
      const searchableTypes = getSearchableTypes(typeRegistry, types);
      const searchFields = uniq(searchableTypes.map(type => type.management.defaultSearchField));
      const references = tags ? tags.map(tagId => ({
        type: 'tag',
        id: tagId
      })) : undefined;
      const responsePromise = client.find({
        page: 1,
        perPage: maxResults,
        search: term ? `${term}*` : undefined,
        ...(references ? {
          hasReference: references
        } : {}),
        preference,
        searchFields,
        type: searchableTypes.map(type => type.name)
      });
      return (0, _rxjs.combineLatest)([(0, _rxjs.from)(responsePromise), capabilities.pipe((0, _operators.first)())]).pipe((0, _operators.takeUntil)(aborted$), (0, _operators.map)(([res, cap]) => (0, _map_object_to_result.mapToResults)(res.saved_objects, typeRegistry, cap)));
    },
    getSearchableTypes: ({
      core
    }) => {
      const {
        savedObjects: {
          typeRegistry
        }
      } = core;
      return getSearchableTypes(typeRegistry).map(type => type.name);
    }
  };
};

exports.createSavedObjectsResultProvider = createSavedObjectsResultProvider;

const getSearchableTypes = (typeRegistry, types) => typeRegistry.getVisibleTypes().filter(types ? type => includeIgnoreCase(types, type.name) : () => true).filter(type => {
  var _type$management, _type$management2;

  return ((_type$management = type.management) === null || _type$management === void 0 ? void 0 : _type$management.defaultSearchField) && ((_type$management2 = type.management) === null || _type$management2 === void 0 ? void 0 : _type$management2.getInAppUrl);
});

const uniq = values => [...new Set(values)];

const includeIgnoreCase = (list, item) => list.find(e => e.toLowerCase() === item.toLowerCase()) !== undefined;