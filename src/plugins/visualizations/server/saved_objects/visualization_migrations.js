"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visualizationSavedObjectTypeMigrations = void 0;

var _lodash = require("lodash");

var _common = require("../../../data/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const migrateIndexPattern = doc => {
  const searchSourceJSON = (0, _lodash.get)(doc, 'attributes.kibanaSavedObjectMeta.searchSourceJSON');

  if (typeof searchSourceJSON !== 'string') {
    return doc;
  }

  let searchSource;

  try {
    searchSource = JSON.parse(searchSourceJSON);
  } catch (e) {
    // Let it go, the data is invalid and we'll leave it as is
    return doc;
  }

  if (searchSource.index && Array.isArray(doc.references)) {
    searchSource.indexRefName = 'kibanaSavedObjectMeta.searchSourceJSON.index';
    doc.references.push({
      name: searchSource.indexRefName,
      type: 'index-pattern',
      id: searchSource.index
    });
    delete searchSource.index;
  }

  if (searchSource.filter) {
    searchSource.filter.forEach((filterRow, i) => {
      if (!filterRow.meta || !filterRow.meta.index || !Array.isArray(doc.references)) {
        return;
      }

      filterRow.meta.indexRefName = `kibanaSavedObjectMeta.searchSourceJSON.filter[${i}].meta.index`;
      doc.references.push({
        name: filterRow.meta.indexRefName,
        type: 'index-pattern',
        id: filterRow.meta.index
      });
      delete filterRow.meta.index;
    });
  }

  doc.attributes.kibanaSavedObjectMeta.searchSourceJSON = JSON.stringify(searchSource);
  return doc;
}; // [TSVB] Migrate percentile-rank aggregation (value -> values)


const migratePercentileRankAggregation = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');
  let visState;

  if (visStateJSON) {
    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }

    if (visState && visState.type === 'metrics') {
      const series = (0, _lodash.get)(visState, 'params.series') || [];
      series.forEach(part => {
        (part.metrics || []).forEach(metric => {
          if (metric.type === 'percentile_rank' && (0, _lodash.has)(metric, 'value')) {
            metric.values = [metric.value];
            delete metric.value;
          }
        });
      });
      return { ...doc,
        attributes: { ...doc.attributes,
          visState: JSON.stringify(visState)
        }
      };
    }
  }

  return doc;
}; // [TSVB] Replace string query with object


const migrateFilterRatioQuery = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');
  let visState;

  if (visStateJSON) {
    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }

    if (visState && visState.type === 'metrics') {
      const series = (0, _lodash.get)(visState, 'params.series') || [];
      series.forEach(part => {
        (part.metrics || []).forEach(metric => {
          if (metric.type === 'filter_ratio') {
            if (typeof metric.numerator === 'string') {
              metric.numerator = {
                query: metric.numerator,
                language: 'lucene'
              };
            }

            if (typeof metric.denominator === 'string') {
              metric.denominator = {
                query: metric.denominator,
                language: 'lucene'
              };
            }
          }
        });
      });
      return { ...doc,
        attributes: { ...doc.attributes,
          visState: JSON.stringify(visState)
        }
      };
    }
  }

  return doc;
}; // [TSVB] Remove stale opperator key


const migrateOperatorKeyTypo = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');
  let visState;

  if (visStateJSON) {
    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }

    if (visState && visState.type === 'metrics') {
      const gaugeColorRules = (0, _lodash.get)(visState, 'params.gauge_color_rules') || [];
      gaugeColorRules.forEach(colorRule => {
        if (colorRule.opperator) {
          delete colorRule.opperator;
        }
      });
      return { ...doc,
        attributes: { ...doc.attributes,
          visState: JSON.stringify(visState)
        }
      };
    }
  }

  return doc;
};
/**
 * Moving setting wether to do a row or column split to vis.params
 *
 * @see https://github.com/elastic/kibana/pull/58462/files#diff-ae69fe15b20a5099d038e9bbe2ed3849
 **/


const migrateSplitByChartRow = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');
  let visState;

  if (visStateJSON) {
    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }

    if (visState && visState.aggs && visState.params) {
      let row;
      visState.aggs.forEach(agg => {
        if (agg.type === 'terms' && agg.schema === 'split' && 'row' in agg.params) {
          row = agg.params.row;
          delete agg.params.row;
        }
      });

      if (row !== undefined) {
        visState.params.row = row;
      }

      return { ...doc,
        attributes: { ...doc.attributes,
          visState: JSON.stringify(visState)
        }
      };
    }
  }

  return doc;
}; // Migrate date histogram aggregation (remove customInterval)


const migrateDateHistogramAggregation = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');
  let visState;

  if (visStateJSON) {
    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }

    if (visState && visState.aggs) {
      visState.aggs.forEach(agg => {
        if (agg.type === 'date_histogram' && agg.params) {
          if (agg.params.interval === 'custom') {
            agg.params.interval = agg.params.customInterval;
          }

          delete agg.params.customInterval;
        }

        if ((0, _lodash.get)(agg, 'params.customBucket.type', null) === 'date_histogram' && agg.params.customBucket.params) {
          if (agg.params.customBucket.params.interval === 'custom') {
            agg.params.customBucket.params.interval = agg.params.customBucket.params.customInterval;
          }

          delete agg.params.customBucket.params.customInterval;
        }
      });
      return { ...doc,
        attributes: { ...doc.attributes,
          visState: JSON.stringify(visState)
        }
      };
    }
  }

  return doc;
}; // Migrate schemas inside aggregation (replace 'schema' object to name of the schema)


const migrateSchema = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');
  let visState;

  if (visStateJSON) {
    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }

    function replaceSchema(agg) {
      (0, _lodash.forOwn)(agg, (value, key) => {
        if (typeof value === 'object') {
          if (key === 'schema') {
            agg[key] = value.name;
          } else {
            replaceSchema(value);
          }
        }
      });
    }

    if (visState && visState.aggs) {
      for (const agg of visState.aggs) {
        if (typeof agg === 'object') {
          replaceSchema(agg);
        }
      }

      return { ...doc,
        attributes: { ...doc.attributes,
          visState: JSON.stringify(visState)
        }
      };
    }
  }

  return doc;
};

const removeDateHistogramTimeZones = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');

  if (visStateJSON) {
    let visState;

    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }

    if (visState && visState.aggs) {
      visState.aggs.forEach(agg => {
        // We're checking always for the existance of agg.params here. This should always exist, but better
        // be safe then sorry during migrations.
        if (agg.type === 'date_histogram' && agg.params) {
          delete agg.params.time_zone;
        }

        if ((0, _lodash.get)(agg, 'params.customBucket.type', null) === 'date_histogram' && agg.params.customBucket.params) {
          delete agg.params.customBucket.params.time_zone;
        }
      });
      doc.attributes.visState = JSON.stringify(visState);
    }
  }

  return doc;
}; // migrate gauge verticalSplit to alignment
// https://github.com/elastic/kibana/issues/34636


const migrateGaugeVerticalSplitToAlignment = (doc, logger) => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');

  if (visStateJSON) {
    try {
      const visState = JSON.parse(visStateJSON);

      if (visState && visState.type === 'gauge' && !visState.params.gauge.alignment) {
        visState.params.gauge.alignment = visState.params.gauge.verticalSplit ? 'vertical' : 'horizontal';
        delete visState.params.gauge.verticalSplit;
        return { ...doc,
          attributes: { ...doc.attributes,
            visState: JSON.stringify(visState)
          }
        };
      }
    } catch (e) {
      logger.log.warn(`Exception @ migrateGaugeVerticalSplitToAlignment! ${e}`);
      logger.log.warn(`Exception @ migrateGaugeVerticalSplitToAlignment! Payload: ${visStateJSON}`);
    }
  }

  return doc;
}; // Migrate filters (string -> { query: string, language: lucene })

/*
  Enabling KQL in TSVB causes problems with savedObject visualizations when these are saved with filters.
  In a visualisation type of saved object, if the visState param is of type metric, the filter is saved as a string that is not interpretted correctly as a lucene query in the visualization itself.
  We need to transform the filter string into an object containing the original string as a query and specify the query language as lucene.
  For Metrics visualizations (param.type === "metric"), filters can be applied to each series object in the series array within the SavedObject.visState.params object.
  Path to the series array is thus:
  attributes.visState.
*/


const transformFilterStringToQueryObject = (doc, logger) => {
  // Migrate filters
  // If any filters exist and they are a string, we assume it to be lucene and transform the filter into an object accordingly
  const newDoc = (0, _lodash.cloneDeep)(doc);
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');

  if (visStateJSON) {
    let visState;

    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// let it go, the data is invalid and we'll leave it as is
    }

    if (visState) {
      const visType = (0, _lodash.get)(visState, 'params.type');
      const tsvbTypes = ['metric', 'markdown', 'top_n', 'gauge', 'table', 'timeseries'];

      if (tsvbTypes.indexOf(visType) === -1) {
        // skip
        return doc;
      } // migrate the params fitler


      const params = (0, _lodash.get)(visState, 'params');

      if (params.filter && typeof params.filter === 'string') {
        const paramsFilterObject = {
          query: params.filter,
          language: 'lucene'
        };
        params.filter = paramsFilterObject;
      } // migrate the annotations query string:


      const annotations = (0, _lodash.get)(visState, 'params.annotations') || [];
      annotations.forEach(item => {
        if (!item.query_string) {
          // we don't need to transform anything if there isn't a filter at all
          return;
        }

        if (typeof item.query_string === 'string') {
          const itemQueryStringObject = {
            query: item.query_string,
            language: 'lucene'
          };
          item.query_string = itemQueryStringObject;
        }
      }); // migrate the series filters

      const series = (0, _lodash.get)(visState, 'params.series') || [];
      series.forEach(item => {
        if (!item.filter) {
          // we don't need to transform anything if there isn't a filter at all
          return;
        } // series item filter


        if (typeof item.filter === 'string') {
          const itemfilterObject = {
            query: item.filter,
            language: 'lucene'
          };
          item.filter = itemfilterObject;
        } // series item split filters filter


        if (item.split_filters) {
          const splitFilters = (0, _lodash.get)(item, 'split_filters') || [];
          splitFilters.forEach(filter => {
            if (!filter.filter) {
              // we don't need to transform anything if there isn't a filter at all
              return;
            }

            if (typeof filter.filter === 'string') {
              const filterfilterObject = {
                query: filter.filter,
                language: 'lucene'
              };
              filter.filter = filterfilterObject;
            }
          });
        }
      });
      newDoc.attributes.visState = JSON.stringify(visState);
    }
  }

  return newDoc;
};

const transformSplitFiltersStringToQueryObject = doc => {
  // Migrate split_filters in TSVB objects that weren't migrated in 7.3
  // If any filters exist and they are a string, we assume them to be lucene syntax and transform the filter into an object accordingly
  const newDoc = (0, _lodash.cloneDeep)(doc);
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');

  if (visStateJSON) {
    let visState;

    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// let it go, the data is invalid and we'll leave it as is
    }

    if (visState) {
      const visType = (0, _lodash.get)(visState, 'params.type');
      const tsvbTypes = ['metric', 'markdown', 'top_n', 'gauge', 'table', 'timeseries'];

      if (tsvbTypes.indexOf(visType) === -1) {
        // skip
        return doc;
      } // migrate the series split_filter filters


      const series = (0, _lodash.get)(visState, 'params.series') || [];
      series.forEach(item => {
        // series item split filters filter
        if (item.split_filters) {
          const splitFilters = (0, _lodash.get)(item, 'split_filters') || [];

          if (splitFilters.length > 0) {
            // only transform split_filter filters if we have filters
            splitFilters.forEach(filter => {
              if (typeof filter.filter === 'string') {
                const filterfilterObject = {
                  query: filter.filter,
                  language: 'lucene'
                };
                filter.filter = filterfilterObject;
              }
            });
          }
        }
      });
      newDoc.attributes.visState = JSON.stringify(visState);
    }
  }

  return newDoc;
};

const migrateFiltersAggQuery = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');

  if (visStateJSON) {
    try {
      const visState = JSON.parse(visStateJSON);

      if (visState && visState.aggs) {
        visState.aggs.forEach(agg => {
          if (agg.type !== 'filters') return;
          agg.params.filters.forEach(filter => {
            if (filter.input.language) return filter;
            filter.input.language = 'lucene';
          });
        });
        return { ...doc,
          attributes: { ...doc.attributes,
            visState: JSON.stringify(visState)
          }
        };
      }
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }
  }

  return doc;
};

const replaceMovAvgToMovFn = (doc, logger) => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');
  let visState;

  if (visStateJSON) {
    try {
      visState = JSON.parse(visStateJSON);

      if (visState && visState.type === 'metrics') {
        const series = (0, _lodash.get)(visState, 'params.series', []);
        series.forEach(part => {
          if (part.metrics && Array.isArray(part.metrics)) {
            part.metrics.forEach(metric => {
              if (metric.type === 'moving_average') {
                metric.model_type = metric.model;
                metric.alpha = (0, _lodash.get)(metric, 'settings.alpha', 0.3);
                metric.beta = (0, _lodash.get)(metric, 'settings.beta', 0.1);
                metric.gamma = (0, _lodash.get)(metric, 'settings.gamma', 0.3);
                metric.period = (0, _lodash.get)(metric, 'settings.period', 1);
                metric.multiplicative = (0, _lodash.get)(metric, 'settings.type') === 'mult';
                delete metric.minimize;
                delete metric.model;
                delete metric.settings;
                delete metric.predict;
              }
            });
          }
        });
        return { ...doc,
          attributes: { ...doc.attributes,
            visState: JSON.stringify(visState)
          }
        };
      }
    } catch (e) {
      logger.log.warn(`Exception @ replaceMovAvgToMovFn! ${e}`);
      logger.log.warn(`Exception @ replaceMovAvgToMovFn! Payload: ${visStateJSON}`);
    }
  }

  return doc;
};

const migrateFiltersAggQueryStringQueries = (doc, logger) => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');

  if (visStateJSON) {
    try {
      const visState = JSON.parse(visStateJSON);

      if (visState && visState.aggs) {
        visState.aggs.forEach(agg => {
          if (agg.type !== 'filters') return doc;
          agg.params.filters.forEach(filter => {
            if (filter.input.query.query_string) {
              filter.input.query = filter.input.query.query_string.query;
            }
          });
        });
        return { ...doc,
          attributes: { ...doc.attributes,
            visState: JSON.stringify(visState)
          }
        };
      }
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }
  }

  return doc;
};

const addDocReferences = doc => ({ ...doc,
  references: doc.references || []
});

const migrateSavedSearch = doc => {
  const savedSearchId = (0, _lodash.get)(doc, 'attributes.savedSearchId');

  if (savedSearchId && doc.references) {
    doc.references.push({
      type: 'search',
      name: 'search_0',
      id: savedSearchId
    });
    doc.attributes.savedSearchRefName = 'search_0';
  }

  delete doc.attributes.savedSearchId;
  return doc;
};

const migrateControls = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');

  if (visStateJSON) {
    let visState;

    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }

    if (visState) {
      const controls = (0, _lodash.get)(visState, 'params.controls') || [];
      controls.forEach((control, i) => {
        if (!control.indexPattern || !doc.references) {
          return;
        }

        control.indexPatternRefName = `control_${i}_index_pattern`;
        doc.references.push({
          name: control.indexPatternRefName,
          type: 'index-pattern',
          id: control.indexPattern
        });
        delete control.indexPattern;
      });
      doc.attributes.visState = JSON.stringify(visState);
    }
  }

  return doc;
};

const migrateTableSplits = doc => {
  try {
    const visState = JSON.parse(doc.attributes.visState);

    if ((0, _lodash.get)(visState, 'type') !== 'table') {
      return doc; // do nothing; we only want to touch tables
    }

    let splitCount = 0;
    visState.aggs = visState.aggs.map(agg => {
      if (agg.schema !== 'split') {
        return agg;
      }

      splitCount++;

      if (splitCount === 1) {
        return agg; // leave the first split agg unchanged
      }

      agg.schema = 'bucket'; // the `row` param is exclusively used by split aggs, so we remove it

      agg.params = (0, _lodash.omit)(agg.params, ['row']);
      return agg;
    });

    if (splitCount <= 1) {
      return doc; // do nothing; we only want to touch tables with multiple split aggs
    }

    const newDoc = (0, _lodash.cloneDeep)(doc);
    newDoc.attributes.visState = JSON.stringify(visState);
    return newDoc;
  } catch (e) {
    throw new Error(`Failure attempting to migrate saved object '${doc.attributes.title}' - ${e}`);
  }
};
/**
 * This migration script is related to:
 *   @link https://github.com/elastic/kibana/pull/62194
 *   @link https://github.com/elastic/kibana/pull/14644
 * This is only a problem when you import an object from 5.x into 6.x but to be sure that all saved objects migrated we should execute it twice in 6.7.2 and 7.9.3
 */


const migrateMatchAllQuery = doc => {
  const searchSourceJSON = (0, _lodash.get)(doc, 'attributes.kibanaSavedObjectMeta.searchSourceJSON');

  if (searchSourceJSON) {
    var _searchSource$query;

    let searchSource;

    try {
      searchSource = JSON.parse(searchSourceJSON);
    } catch (e) {
      // Let it go, the data is invalid and we'll leave it as is
      return doc;
    }

    if ((_searchSource$query = searchSource.query) !== null && _searchSource$query !== void 0 && _searchSource$query.match_all) {
      return { ...doc,
        attributes: { ...doc.attributes,
          kibanaSavedObjectMeta: {
            searchSourceJSON: JSON.stringify({ ...searchSource,
              query: {
                query: '',
                language: _common.DEFAULT_QUERY_LANGUAGE
              }
            })
          }
        }
      };
    }
  }

  return doc;
}; // [TSVB] Default color palette is changing, keep the default for older viz


const migrateTsvbDefaultColorPalettes = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');
  let visState;

  if (visStateJSON) {
    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }

    if (visState && visState.type === 'metrics') {
      const series = (0, _lodash.get)(visState, 'params.series') || [];
      series.forEach(part => {
        // The default value was not saved before
        if (!part.split_color_mode) {
          part.split_color_mode = 'gradient';
        }
      });
      return { ...doc,
        attributes: { ...doc.attributes,
          visState: JSON.stringify(visState)
        }
      };
    }
  }

  return doc;
}; // [TSVB] Remove serialized search source as it's not used in TSVB visualizations


const removeTSVBSearchSource = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');
  let visState;
  const searchSourceJSON = (0, _lodash.get)(doc, 'attributes.kibanaSavedObjectMeta.searchSourceJSON');

  if (visStateJSON) {
    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }

    if (visState && visState.type === 'metrics' && searchSourceJSON !== '{}') {
      return { ...doc,
        attributes: { ...doc.attributes,
          kibanaSavedObjectMeta: { ...(0, _lodash.get)(doc, 'attributes.kibanaSavedObjectMeta'),
            searchSourceJSON: '{}'
          }
        }
      };
    }
  }

  return doc;
}; // [Data table visualization] Enable toolbar by default


const enableDataTableVisToolbar = doc => {
  var _visState;

  let visState;

  try {
    visState = JSON.parse(doc.attributes.visState);
  } catch (e) {// Let it go, the data is invalid and we'll leave it as is
  }

  if (((_visState = visState) === null || _visState === void 0 ? void 0 : _visState.type) === 'table') {
    return { ...doc,
      attributes: { ...doc.attributes,
        visState: JSON.stringify({ ...visState,
          params: { ...visState.params,
            showToolbar: true
          }
        })
      }
    };
  }

  return doc;
};
/**
 * Decorate axes with default label filter value
 */


const decorateAxes = (axes, fallback) => axes.map(axis => {
  var _axis$labels$filter;

  return { ...axis,
    labels: { ...axis.labels,
      filter: (_axis$labels$filter = axis.labels.filter) !== null && _axis$labels$filter !== void 0 ? _axis$labels$filter : fallback
    }
  };
}); // Inlined from vis_type_xy


const CHART_TYPE_AREA = 'area';
const CHART_TYPE_LINE = 'line';
const CHART_TYPE_HISTOGRAM = 'histogram';
/**
 * Migrate vislib bar, line and area charts to use new vis_type_xy plugin
 */

const migrateVislibAreaLineBarTypes = doc => {
  const visStateJSON = (0, _lodash.get)(doc, 'attributes.visState');
  let visState;

  if (visStateJSON) {
    var _visState2, _visState2$params;

    try {
      visState = JSON.parse(visStateJSON);
    } catch (e) {// Let it go, the data is invalid and we'll leave it as is
    }

    if (visState && [CHART_TYPE_AREA, CHART_TYPE_LINE, CHART_TYPE_HISTOGRAM].includes((_visState2 = visState) === null || _visState2 === void 0 ? void 0 : (_visState2$params = _visState2.params) === null || _visState2$params === void 0 ? void 0 : _visState2$params.type)) {
      var _visState3, _visState3$params, _visState4, _visState4$params;

      const isHorizontalBar = visState.type === 'horizontal_bar';
      const isLineOrArea = ((_visState3 = visState) === null || _visState3 === void 0 ? void 0 : (_visState3$params = _visState3.params) === null || _visState3$params === void 0 ? void 0 : _visState3$params.type) === CHART_TYPE_AREA || ((_visState4 = visState) === null || _visState4 === void 0 ? void 0 : (_visState4$params = _visState4.params) === null || _visState4$params === void 0 ? void 0 : _visState4$params.type) === CHART_TYPE_LINE;
      return { ...doc,
        attributes: { ...doc.attributes,
          visState: JSON.stringify({ ...visState,
            params: { ...visState.params,
              palette: {
                type: 'palette',
                name: 'kibana_palette'
              },
              categoryAxes: visState.params.categoryAxes && decorateAxes(visState.params.categoryAxes, !isHorizontalBar),
              valueAxes: visState.params.valueAxes && decorateAxes(visState.params.valueAxes, isHorizontalBar),
              isVislibVis: true,
              detailedTooltip: true,
              ...(isLineOrArea && {
                fittingFunction: 'zero'
              })
            }
          })
        }
      };
    }
  }

  return doc;
};

const visualizationSavedObjectTypeMigrations = {
  /**
   * We need to have this migration twice, once with a version prior to 7.0.0 once with a version
   * after it. The reason for that is, that this migration has been introduced once 7.0.0 was already
   * released. Thus a user who already had 7.0.0 installed already got the 7.0.0 migrations below running,
   * so we need a version higher than that. But this fix was backported to the 6.7 release, meaning if we
   * would only have the 7.0.1 migration in here a user on the 6.7 release will migrate their saved objects
   * to the 7.0.1 state, and thus when updating their Kibana to 7.0, will never run the 7.0.0 migrations introduced
   * in that version. So we apply this twice, once with 6.7.2 and once with 7.0.1 while the backport to 6.7
   * only contained the 6.7.2 migration and not the 7.0.1 migration.
   */
  '6.7.2': (0, _lodash.flow)(migrateMatchAllQuery, removeDateHistogramTimeZones),
  '7.0.0': (0, _lodash.flow)(addDocReferences, migrateIndexPattern, migrateSavedSearch, migrateControls, migrateTableSplits),
  '7.0.1': (0, _lodash.flow)(removeDateHistogramTimeZones),
  '7.2.0': (0, _lodash.flow)(migratePercentileRankAggregation, migrateDateHistogramAggregation),
  '7.3.0': (0, _lodash.flow)(migrateGaugeVerticalSplitToAlignment, transformFilterStringToQueryObject, migrateFiltersAggQuery, replaceMovAvgToMovFn),
  '7.3.1': (0, _lodash.flow)(migrateFiltersAggQueryStringQueries),
  '7.4.2': (0, _lodash.flow)(transformSplitFiltersStringToQueryObject),
  '7.7.0': (0, _lodash.flow)(migrateOperatorKeyTypo, migrateSplitByChartRow),
  '7.8.0': (0, _lodash.flow)(migrateTsvbDefaultColorPalettes),
  '7.9.3': (0, _lodash.flow)(migrateMatchAllQuery),
  '7.10.0': (0, _lodash.flow)(migrateFilterRatioQuery, removeTSVBSearchSource),
  '7.11.0': (0, _lodash.flow)(enableDataTableVisToolbar),
  '7.12.0': (0, _lodash.flow)(migrateVislibAreaLineBarTypes, migrateSchema)
};
exports.visualizationSavedObjectTypeMigrations = visualizationSavedObjectTypeMigrations;