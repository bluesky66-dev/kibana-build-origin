"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrations = void 0;

var _lodash = require("lodash");

var _common = require("@kbn/interpreter/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Removes the `lens_auto_date` subexpression from a stored expression
 * string. For example: aggConfigs={lens_auto_date aggConfigs="JSON string"}
 */


const removeLensAutoDate = (doc, context) => {
  const expression = doc.attributes.expression;

  if (!expression) {
    return doc;
  }

  try {
    const ast = (0, _common.fromExpression)(expression);
    const newChain = ast.chain.map(topNode => {
      if (topNode.function !== 'lens_merge_tables') {
        return topNode;
      }

      return { ...topNode,
        arguments: { ...topNode.arguments,
          tables: topNode.arguments.tables.map(middleNode => {
            return {
              type: 'expression',
              chain: middleNode.chain.map(node => {
                // Check for sub-expression in aggConfigs
                if (node.function === 'esaggs' && typeof node.arguments.aggConfigs[0] !== 'string') {
                  return { ...node,
                    arguments: { ...node.arguments,
                      aggConfigs: node.arguments.aggConfigs[0].chain[0].arguments.aggConfigs
                    }
                  };
                }

                return node;
              })
            };
          })
        }
      };
    });
    return { ...doc,
      attributes: { ...doc.attributes,
        expression: (0, _common.toExpression)({ ...ast,
          chain: newChain
        })
      }
    };
  } catch (e) {
    context.log.warning(e.message);
    return { ...doc
    };
  }
};
/**
 * Adds missing timeField arguments to esaggs in the Lens expression
 */


const addTimeFieldToEsaggs = (doc, context) => {
  const expression = doc.attributes.expression;

  if (!expression) {
    return doc;
  }

  try {
    const ast = (0, _common.fromExpression)(expression);
    const newChain = ast.chain.map(topNode => {
      if (topNode.function !== 'lens_merge_tables') {
        return topNode;
      }

      return { ...topNode,
        arguments: { ...topNode.arguments,
          tables: topNode.arguments.tables.map(middleNode => {
            return {
              type: 'expression',
              chain: middleNode.chain.map(node => {
                // Skip if there are any timeField arguments already, because that indicates
                // the fix is already applied
                if (node.function !== 'esaggs' || node.arguments.timeFields) {
                  return node;
                }

                const timeFields = [];
                JSON.parse(node.arguments.aggConfigs[0]).forEach(agg => {
                  if (agg.type !== 'date_histogram') {
                    return;
                  }

                  timeFields.push(agg.params.field);
                });
                return { ...node,
                  arguments: { ...node.arguments,
                    timeFields
                  }
                };
              })
            };
          })
        }
      };
    });
    return { ...doc,
      attributes: { ...doc.attributes,
        expression: (0, _common.toExpression)({ ...ast,
          chain: newChain
        })
      }
    };
  } catch (e) {
    context.log.warning(e.message);
    return { ...doc
    };
  }
};

const removeInvalidAccessors = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);

  if (newDoc.attributes.visualizationType === 'lnsXY') {
    const datasourceLayers = newDoc.attributes.state.datasourceStates.indexpattern.layers || {};
    const xyState = newDoc.attributes.state.visualization;
    newDoc.attributes.state.visualization.layers = xyState.layers.map(layer => {
      const layerId = layer.layerId;
      const datasource = datasourceLayers[layerId];
      return { ...layer,
        xAccessor: datasource !== null && datasource !== void 0 && datasource.columns[layer.xAccessor] ? layer.xAccessor : undefined,
        splitAccessor: datasource !== null && datasource !== void 0 && datasource.columns[layer.splitAccessor] ? layer.splitAccessor : undefined,
        accessors: layer.accessors.filter(accessor => !!(datasource !== null && datasource !== void 0 && datasource.columns[accessor]))
      };
    });
  }

  return newDoc;
};

const extractReferences = ({
  attributes,
  references,
  ...docMeta
}) => {
  const savedObjectReferences = []; // add currently selected index pattern to reference list

  savedObjectReferences.push({
    type: 'index-pattern',
    id: attributes.state.datasourceStates.indexpattern.currentIndexPatternId,
    name: 'indexpattern-datasource-current-indexpattern'
  }); // add layer index patterns to list and remove index pattern ids from layers

  const persistableLayers = {};
  Object.entries(attributes.state.datasourceStates.indexpattern.layers).forEach(([layerId, {
    indexPatternId,
    ...persistableLayer
  }]) => {
    savedObjectReferences.push({
      type: 'index-pattern',
      id: indexPatternId,
      name: `indexpattern-datasource-layer-${layerId}`
    });
    persistableLayers[layerId] = persistableLayer;
  }); // add filter index patterns to reference list and remove index pattern ids from filter definitions

  const persistableFilters = attributes.state.filters.map((filterRow, i) => {
    if (!filterRow.meta || !filterRow.meta.index) {
      return filterRow;
    }

    const refName = `filter-index-pattern-${i}`;
    savedObjectReferences.push({
      name: refName,
      type: 'index-pattern',
      id: filterRow.meta.index
    });
    return { ...filterRow,
      meta: { ...filterRow.meta,
        indexRefName: refName,
        index: undefined
      }
    };
  }); // put together new saved object format

  const newDoc = { ...docMeta,
    references: savedObjectReferences,
    attributes: {
      visualizationType: attributes.visualizationType,
      title: attributes.title,
      state: {
        datasourceStates: {
          indexpattern: {
            layers: persistableLayers
          }
        },
        visualization: attributes.state.visualization,
        query: attributes.state.query,
        filters: persistableFilters
      }
    }
  };
  return newDoc;
};

const removeSuggestedPriority = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  const datasourceLayers = newDoc.attributes.state.datasourceStates.indexpattern.layers || {};
  newDoc.attributes.state.datasourceStates.indexpattern.layers = Object.fromEntries(Object.entries(datasourceLayers).map(([layerId, layer]) => {
    return [layerId, { ...layer,
      columns: Object.fromEntries(Object.entries(layer.columns).map(([columnId, column]) => {
        const copy = { ...column
        };
        delete copy.suggestedPriority;
        return [columnId, copy];
      }))
    }];
  }));
  return newDoc;
};

const transformTableState = doc => {
  // nothing to do for non-datatable visualizations
  if (doc.attributes.visualizationType !== 'lnsDatatable') return doc;
  const oldState = doc.attributes.state.visualization;
  const layer = oldState.layers[0] || {
    layerId: '',
    columns: []
  }; // put together new saved object format

  const newDoc = { ...doc,
    attributes: { ...doc.attributes,
      state: { ...doc.attributes.state,
        visualization: {
          sorting: oldState.sorting,
          layerId: layer.layerId,
          columns: layer.columns.map(columnId => ({
            columnId
          }))
        }
      }
    }
  };
  return newDoc;
};

const migrations = {
  '7.7.0': removeInvalidAccessors,
  // The order of these migrations matter, since the timefield migration relies on the aggConfigs
  // sitting directly on the esaggs as an argument and not a nested function (which lens_auto_date was).
  '7.8.0': (doc, context) => addTimeFieldToEsaggs(removeLensAutoDate(doc, context), context),
  '7.10.0': extractReferences,
  '7.11.0': removeSuggestedPriority,
  '7.12.0': transformTableState
};
exports.migrations = migrations;