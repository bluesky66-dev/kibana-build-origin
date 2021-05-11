"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClauseForReference = getClauseForReference;
exports.getQueryParams = getQueryParams;

var _es_query = require("../../../es_query");

var _utils = require("../utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-expect-error no ts

/**
 * Gets the types based on the type. Uses mappings to support
 * null type (all types), a single type string or an array
 */
function getTypes(registry, type) {
  if (!type) {
    return registry.getAllTypes().map(registeredType => registeredType.name);
  }

  return Array.isArray(type) ? type : [type];
}
/**
 *  Get the field params based on the types, searchFields, and rootSearchFields
 */


function getSimpleQueryStringTypeFields(types, searchFields = [], rootSearchFields = []) {
  if (!searchFields.length && !rootSearchFields.length) {
    return {
      lenient: true,
      fields: ['*']
    };
  }

  let fields = [...rootSearchFields];
  fields.forEach(field => {
    if (field.indexOf('.') !== -1) {
      throw new Error(`rootSearchFields entry "${field}" is invalid: cannot contain "." character`);
    }
  });

  for (const field of searchFields) {
    fields = fields.concat(types.map(prefix => `${prefix}.${field}`));
  }

  return {
    fields
  };
}
/**
 *  Gets the clause that will filter for the type in the namespace.
 *  Some types are namespace agnostic, so they must be treated differently.
 */


function getClauseForType(registry, namespaces = [_utils.DEFAULT_NAMESPACE_STRING], type) {
  if (namespaces.length === 0) {
    throw new Error('cannot specify empty namespaces array');
  }

  const searchAcrossAllNamespaces = namespaces.includes(_utils.ALL_NAMESPACES_STRING);

  if (registry.isMultiNamespace(type)) {
    const typeFilterClause = {
      term: {
        type
      }
    };
    const namespacesFilterClause = {
      terms: {
        namespaces: [...namespaces, _utils.ALL_NAMESPACES_STRING]
      }
    };
    const must = searchAcrossAllNamespaces ? [typeFilterClause] : [typeFilterClause, namespacesFilterClause];
    return {
      bool: {
        must,
        must_not: [{
          exists: {
            field: 'namespace'
          }
        }]
      }
    };
  } else if (registry.isSingleNamespace(type)) {
    const should = [];
    const eligibleNamespaces = namespaces.filter(x => x !== _utils.DEFAULT_NAMESPACE_STRING);

    if (eligibleNamespaces.length > 0 && !searchAcrossAllNamespaces) {
      should.push({
        terms: {
          namespace: eligibleNamespaces
        }
      });
    }

    if (namespaces.includes(_utils.DEFAULT_NAMESPACE_STRING)) {
      should.push({
        bool: {
          must_not: [{
            exists: {
              field: 'namespace'
            }
          }]
        }
      });
    }

    const shouldClauseProps = should.length > 0 ? {
      should,
      minimum_should_match: 1
    } : {};
    return {
      bool: {
        must: [{
          term: {
            type
          }
        }],
        ...shouldClauseProps,
        must_not: [{
          exists: {
            field: 'namespaces'
          }
        }]
      }
    };
  } // isNamespaceAgnostic


  return {
    bool: {
      must: [{
        term: {
          type
        }
      }],
      must_not: [{
        exists: {
          field: 'namespace'
        }
      }, {
        exists: {
          field: 'namespaces'
        }
      }]
    }
  };
}

function getReferencesFilter(references, operator = 'OR') {
  if (operator === 'AND') {
    return {
      bool: {
        must: references.map(getClauseForReference)
      }
    };
  } else {
    return {
      bool: {
        should: references.map(getClauseForReference),
        minimum_should_match: 1
      }
    };
  }
}

function getClauseForReference(reference) {
  return {
    nested: {
      path: 'references',
      query: {
        bool: {
          must: [{
            term: {
              'references.id': reference.id
            }
          }, {
            term: {
              'references.type': reference.type
            }
          }]
        }
      }
    }
  };
} // A de-duplicated set of namespaces makes for a more effecient query.


const uniqNamespaces = namespacesToNormalize => namespacesToNormalize ? Array.from(new Set(namespacesToNormalize)) : undefined;
/**
 *  Get the "query" related keys for the search body
 */


function getQueryParams({
  registry,
  namespaces,
  type,
  typeToNamespacesMap,
  search,
  searchFields,
  rootSearchFields,
  defaultSearchOperator,
  hasReference,
  hasReferenceOperator,
  kueryNode
}) {
  var _hasReference;

  const types = getTypes(registry, typeToNamespacesMap ? Array.from(typeToNamespacesMap.keys()) : type);

  if (hasReference && !Array.isArray(hasReference)) {
    hasReference = [hasReference];
  }

  const bool = {
    filter: [...(kueryNode != null ? [_es_query.esKuery.toElasticsearchQuery(kueryNode)] : []), ...((_hasReference = hasReference) !== null && _hasReference !== void 0 && _hasReference.length ? [getReferencesFilter(hasReference, hasReferenceOperator)] : []), {
      bool: {
        should: types.map(shouldType => {
          const deduplicatedNamespaces = uniqNamespaces(typeToNamespacesMap ? typeToNamespacesMap.get(shouldType) : namespaces);
          return getClauseForType(registry, deduplicatedNamespaces, shouldType);
        }),
        minimum_should_match: 1
      }
    }]
  };

  if (search) {
    const useMatchPhrasePrefix = shouldUseMatchPhrasePrefix(search);
    const simpleQueryStringClause = getSimpleQueryStringClause({
      search,
      types,
      searchFields,
      rootSearchFields,
      defaultSearchOperator
    });

    if (useMatchPhrasePrefix) {
      bool.should = [simpleQueryStringClause, ...getMatchPhrasePrefixClauses({
        search,
        searchFields,
        types,
        registry
      })];
      bool.minimum_should_match = 1;
    } else {
      bool.must = [simpleQueryStringClause];
    }
  }

  return {
    query: {
      bool
    }
  };
} // we only want to add match_phrase_prefix clauses
// if the search is a prefix search


const shouldUseMatchPhrasePrefix = search => {
  return search.trim().endsWith('*');
};

const getMatchPhrasePrefixClauses = ({
  search,
  searchFields,
  registry,
  types
}) => {
  // need to remove the prefix search operator
  const query = search.replace(/[*]$/, '');
  const mppFields = getMatchPhrasePrefixFields({
    searchFields,
    types,
    registry
  });
  return mppFields.map(({
    field,
    boost
  }) => {
    return {
      match_phrase_prefix: {
        [field]: {
          query,
          boost
        }
      }
    };
  });
};

const getMatchPhrasePrefixFields = ({
  searchFields = [],
  types,
  registry
}) => {
  const output = [];
  searchFields = searchFields.filter(field => field !== '*');
  let fields;

  if (searchFields.length === 0) {
    fields = types.reduce((typeFields, type) => {
      var _registry$getType, _registry$getType$man;

      const defaultSearchField = (_registry$getType = registry.getType(type)) === null || _registry$getType === void 0 ? void 0 : (_registry$getType$man = _registry$getType.management) === null || _registry$getType$man === void 0 ? void 0 : _registry$getType$man.defaultSearchField;

      if (defaultSearchField) {
        return [...typeFields, `${type}.${defaultSearchField}`];
      }

      return typeFields;
    }, []);
  } else {
    fields = [];

    for (const field of searchFields) {
      fields = fields.concat(types.map(type => `${type}.${field}`));
    }
  }

  fields.forEach(rawField => {
    const [field, rawBoost] = rawField.split('^');
    let boost = 1;

    if (rawBoost) {
      try {
        boost = parseInt(rawBoost, 10);
      } catch (e) {
        boost = 1;
      }
    }

    if (isNaN(boost)) {
      boost = 1;
    }

    output.push({
      field,
      boost
    });
  });
  return output;
};

const getSimpleQueryStringClause = ({
  search,
  types,
  searchFields,
  rootSearchFields,
  defaultSearchOperator
}) => {
  return {
    simple_query_string: {
      query: search,
      ...getSimpleQueryStringTypeFields(types, searchFields, rootSearchFields),
      ...(defaultSearchOperator ? {
        default_operator: defaultSearchOperator
      } : {})
    }
  };
};