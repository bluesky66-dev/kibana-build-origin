"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformESConnectorToCaseConnector = exports.transformCaseConnectorToEsConnector = exports.getConnectorFromConfiguration = exports.getNoneCaseConnector = exports.getCaseToUpdate = exports.isTwoArraysDifference = exports.compareArrays = exports.constructQueryOptions = exports.buildFilter = exports.addStatusFilter = void 0;

var _lodash = require("lodash");

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _api = require("../../../../common/api");

var _saved_object_types = require("../../../saved_object_types");

var _utils = require("../utils");

var _common = require("../../../common");

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


const addStatusFilter = ({
  status,
  appendFilter,
  type = _saved_object_types.CASE_SAVED_OBJECT
}) => {
  const filters = [];

  if (status) {
    filters.push(`${type}.attributes.status: ${status}`);
  }

  if (appendFilter) {
    filters.push(appendFilter);
  }

  return (0, _common.combineFilters)(filters, 'AND');
};

exports.addStatusFilter = addStatusFilter;

const buildFilter = ({
  filters,
  field,
  operator,
  type = _saved_object_types.CASE_SAVED_OBJECT
}) => {
  // if it is an empty string, empty array of strings, or undefined just return
  if (!filters || filters.length <= 0) {
    return '';
  }

  const arrayFilters = !Array.isArray(filters) ? [filters] : filters;
  return (0, _common.combineFilters)(arrayFilters.map(filter => `${type}.attributes.${field}: ${filter}`), operator);
};
/**
 * Constructs the filters used for finding cases and sub cases.
 * There are a few scenarios that this function tries to handle when constructing the filters used for finding cases
 * and sub cases.
 *
 * Scenario 1:
 *  Type == Individual
 *  If the API request specifies that it wants only individual cases (aka not collections) then we need to add that
 *  specific filter when call the saved objects find api. This will filter out any collection cases.
 *
 * Scenario 2:
 *  Type == collection
 *  If the API request specifies that it only wants collection cases (cases that have sub cases) then we need to add
 *  the filter for collections AND we need to ignore any status filter for the case find call. This is because a
 *  collection's status is no longer relevant when it has sub cases. The user cannot change the status for a collection
 *  only for its sub cases. The status filter will be applied to the find request when looking for sub cases.
 *
 * Scenario 3:
 *  No Type is specified
 *  If the API request does not want to filter on type but instead get both collections and regular individual cases then
 *  we need to find all cases that match the other filter criteria and sub cases. To do this we construct the following query:
 *
 *    ((status == some_status and type === individual) or type == collection) and (tags == blah) and (reporter == yo)
 *  This forces us to honor the status request for individual cases but gets us ALL collection cases that match the other
 *  filter criteria. When we search for sub cases we will use that status filter in that find call as well.
 */


exports.buildFilter = buildFilter;

const constructQueryOptions = ({
  tags,
  reporters,
  status,
  sortByField,
  caseType
}) => {
  const tagsFilter = buildFilter({
    filters: tags,
    field: 'tags',
    operator: 'OR'
  });
  const reportersFilter = buildFilter({
    filters: reporters,
    field: 'created_by.username',
    operator: 'OR'
  });
  const sortField = (0, _utils.sortToSnake)(sortByField);

  switch (caseType) {
    case _api.CaseType.individual:
      {
        // The cases filter will result in this structure "status === oh and (type === individual) and (tags === blah) and (reporter === yo)"
        // The subCase filter will be undefined because we don't need to find sub cases if type === individual
        // We do not want to support multiple type's being used, so force it to be a single filter value
        const typeFilter = `${_saved_object_types.CASE_SAVED_OBJECT}.attributes.type: ${_api.CaseType.individual}`;
        const caseFilters = addStatusFilter({
          status,
          appendFilter: (0, _common.combineFilters)([tagsFilter, reportersFilter, typeFilter], 'AND')
        });
        return {
          case: {
            filter: caseFilters,
            sortField
          }
        };
      }

    case _api.CaseType.collection:
      {
        // The cases filter will result in this structure "(type == parent) and (tags == blah) and (reporter == yo)"
        // The sub case filter will use the query.status if it exists
        const typeFilter = `${_saved_object_types.CASE_SAVED_OBJECT}.attributes.type: ${_api.CaseType.collection}`;
        const caseFilters = (0, _common.combineFilters)([tagsFilter, reportersFilter, typeFilter], 'AND');
        return {
          case: {
            filter: caseFilters,
            sortField
          },
          subCase: {
            filter: addStatusFilter({
              status,
              type: _saved_object_types.SUB_CASE_SAVED_OBJECT
            }),
            sortField
          }
        };
      }

    default:
      {
        /**
         * In this scenario no type filter was sent, so we want to honor the status filter if one exists.
         * To construct the filter and honor the status portion we need to find all individual cases that
         * have that particular status. We also need to find cases that have sub cases but we want to ignore the
         * case collection's status because it is not relevant. We only care about the status of the sub cases if the
         * case is a collection.
         *
         * The cases filter will result in this structure "((status == open and type === individual) or type == parent) and (tags == blah) and (reporter == yo)"
         * The sub case filter will use the query.status if it exists
         */
        const typeIndividual = `${_saved_object_types.CASE_SAVED_OBJECT}.attributes.type: ${_api.CaseType.individual}`;
        const typeParent = `${_saved_object_types.CASE_SAVED_OBJECT}.attributes.type: ${_api.CaseType.collection}`;
        const statusFilter = (0, _common.combineFilters)([addStatusFilter({
          status
        }), typeIndividual], 'AND');
        const statusAndType = (0, _common.combineFilters)([statusFilter, typeParent], 'OR');
        const caseFilters = (0, _common.combineFilters)([statusAndType, tagsFilter, reportersFilter], 'AND');
        return {
          case: {
            filter: caseFilters,
            sortField
          },
          subCase: {
            filter: addStatusFilter({
              status,
              type: _saved_object_types.SUB_CASE_SAVED_OBJECT
            }),
            sortField
          }
        };
      }
  }
};

exports.constructQueryOptions = constructQueryOptions;

const compareArrays = ({
  originalValue,
  updatedValue
}) => {
  const result = {
    addedItems: [],
    deletedItems: []
  };
  originalValue.forEach(origVal => {
    if (!updatedValue.includes(origVal)) {
      result.deletedItems = [...result.deletedItems, origVal];
    }
  });
  updatedValue.forEach(updatedVal => {
    if (!originalValue.includes(updatedVal)) {
      result.addedItems = [...result.addedItems, updatedVal];
    }
  });
  return result;
};

exports.compareArrays = compareArrays;

const isTwoArraysDifference = (originalValue, updatedValue) => {
  if (originalValue != null && updatedValue != null && Array.isArray(updatedValue) && Array.isArray(originalValue)) {
    const compObj = compareArrays({
      originalValue,
      updatedValue
    });

    if (compObj.addedItems.length > 0 || compObj.deletedItems.length > 0) {
      return compObj;
    }
  }

  return null;
};

exports.isTwoArraysDifference = isTwoArraysDifference;

const getCaseToUpdate = (currentCase, queryCase) => Object.entries(queryCase).reduce((acc, [key, value]) => {
  const currentValue = (0, _lodash.get)(currentCase, key);

  if (Array.isArray(currentValue) && Array.isArray(value)) {
    if (isTwoArraysDifference(value, currentValue)) {
      return { ...acc,
        [key]: value
      };
    }

    return acc;
  } else if ((0, _lodash.isPlainObject)(currentValue) && (0, _lodash.isPlainObject)(value)) {
    if (!(0, _fastDeepEqual.default)(currentValue, value)) {
      return { ...acc,
        [key]: value
      };
    }

    return acc;
  } else if (currentValue != null && value !== currentValue) {
    return { ...acc,
      [key]: value
    };
  }

  return acc;
}, {
  id: queryCase.id,
  version: queryCase.version
});

exports.getCaseToUpdate = getCaseToUpdate;

const getNoneCaseConnector = () => ({
  id: 'none',
  name: 'none',
  type: _api.ConnectorTypes.none,
  fields: null
});

exports.getNoneCaseConnector = getNoneCaseConnector;

const getConnectorFromConfiguration = caseConfigure => {
  let caseConnector = getNoneCaseConnector();

  if (caseConfigure.saved_objects.length > 0 && caseConfigure.saved_objects[0].attributes.connector) {
    caseConnector = {
      id: caseConfigure.saved_objects[0].attributes.connector.id,
      name: caseConfigure.saved_objects[0].attributes.connector.name,
      type: caseConfigure.saved_objects[0].attributes.connector.type,
      fields: null
    };
  }

  return caseConnector;
};

exports.getConnectorFromConfiguration = getConnectorFromConfiguration;

const transformCaseConnectorToEsConnector = connector => {
  var _connector$id, _connector$name, _connector$type;

  return {
    id: (_connector$id = connector === null || connector === void 0 ? void 0 : connector.id) !== null && _connector$id !== void 0 ? _connector$id : 'none',
    name: (_connector$name = connector === null || connector === void 0 ? void 0 : connector.name) !== null && _connector$name !== void 0 ? _connector$name : 'none',
    type: (_connector$type = connector === null || connector === void 0 ? void 0 : connector.type) !== null && _connector$type !== void 0 ? _connector$type : '.none',
    fields: (connector === null || connector === void 0 ? void 0 : connector.fields) != null ? Object.entries(connector.fields).reduce((acc, [key, value]) => [...acc, {
      key,
      value
    }], []) : []
  };
};

exports.transformCaseConnectorToEsConnector = transformCaseConnectorToEsConnector;

const transformESConnectorToCaseConnector = connector => {
  var _connector$type2, _connector$id2, _connector$name2;

  const connectorTypeField = {
    type: (_connector$type2 = connector === null || connector === void 0 ? void 0 : connector.type) !== null && _connector$type2 !== void 0 ? _connector$type2 : '.none',
    fields: connector && connector.fields != null && connector.fields.length > 0 ? connector.fields.reduce((fields, {
      key,
      value
    }) => ({ ...fields,
      [key]: value
    }), {}) : null
  };
  return {
    id: (_connector$id2 = connector === null || connector === void 0 ? void 0 : connector.id) !== null && _connector$id2 !== void 0 ? _connector$id2 : 'none',
    name: (_connector$name2 = connector === null || connector === void 0 ? void 0 : connector.name) !== null && _connector$name2 !== void 0 ? _connector$name2 : 'none',
    ...connectorTypeField
  };
};

exports.transformESConnectorToCaseConnector = transformESConnectorToCaseConnector;