"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWebCoreVitals = getWebCoreVitals;

var _rum_page_load_transactions = require("../../projections/rum_page_load_transactions");

var _merge_projection = require("../../projections/util/merge_projection");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getWebCoreVitals({
  setup,
  urlQuery,
  percentile = 50
}) {
  var _response$aggregation, _coreVitalPages$doc_c, _cls$values$pkey, _tbt$values$pkey;

  const projection = (0, _rum_page_load_transactions.getRumPageLoadTransactionsProjection)({
    setup,
    urlQuery
  });
  const params = (0, _merge_projection.mergeProjection)(projection, {
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...projection.body.query.bool.filter]
        }
      },
      aggs: {
        coreVitalPages: {
          filter: {
            exists: {
              field: 'transaction.experience'
            }
          }
        },
        lcp: {
          percentiles: {
            field: _elasticsearch_fieldnames.LCP_FIELD,
            percents: [percentile]
          }
        },
        fid: {
          percentiles: {
            field: _elasticsearch_fieldnames.FID_FIELD,
            percents: [percentile]
          }
        },
        cls: {
          percentiles: {
            field: _elasticsearch_fieldnames.CLS_FIELD,
            percents: [percentile]
          }
        },
        tbt: {
          percentiles: {
            field: _elasticsearch_fieldnames.TBT_FIELD,
            percents: [percentile]
          }
        },
        fcp: {
          percentiles: {
            field: _elasticsearch_fieldnames.FCP_FIELD,
            percents: [percentile]
          }
        },
        lcpRanks: {
          percentile_ranks: {
            field: _elasticsearch_fieldnames.LCP_FIELD,
            values: [2500, 4000],
            keyed: false
          }
        },
        fidRanks: {
          percentile_ranks: {
            field: _elasticsearch_fieldnames.FID_FIELD,
            values: [100, 300],
            keyed: false
          }
        },
        clsRanks: {
          percentile_ranks: {
            field: _elasticsearch_fieldnames.CLS_FIELD,
            values: [0.1, 0.25],
            keyed: false
          }
        }
      }
    }
  });
  const {
    apmEventClient
  } = setup;
  const response = await apmEventClient.search(params);
  const {
    lcp,
    cls,
    fid,
    tbt,
    fcp,
    lcpRanks,
    fidRanks,
    clsRanks,
    coreVitalPages
  } = (_response$aggregation = response.aggregations) !== null && _response$aggregation !== void 0 ? _response$aggregation : {};

  const getRanksPercentages = ranks => {
    var _ranks$map;

    const ranksVal = (_ranks$map = ranks === null || ranks === void 0 ? void 0 : ranks.map(({
      value
    }) => {
      var _value$toFixed;

      return (_value$toFixed = value === null || value === void 0 ? void 0 : value.toFixed(0)) !== null && _value$toFixed !== void 0 ? _value$toFixed : 0;
    })) !== null && _ranks$map !== void 0 ? _ranks$map : [];
    return [Number(ranksVal === null || ranksVal === void 0 ? void 0 : ranksVal[0]), Number(ranksVal === null || ranksVal === void 0 ? void 0 : ranksVal[1]) - Number(ranksVal === null || ranksVal === void 0 ? void 0 : ranksVal[0]), 100 - Number(ranksVal === null || ranksVal === void 0 ? void 0 : ranksVal[1])];
  };

  const defaultRanks = [100, 0, 0];
  const pkey = percentile.toFixed(1);
  return {
    coreVitalPages: (_coreVitalPages$doc_c = coreVitalPages === null || coreVitalPages === void 0 ? void 0 : coreVitalPages.doc_count) !== null && _coreVitalPages$doc_c !== void 0 ? _coreVitalPages$doc_c : 0,

    /* Because cls is required in the type UXMetrics, and defined as number | null,
     * we need to default to null in the case where cls is undefined in order to satisfy the UXMetrics type */
    cls: (_cls$values$pkey = cls === null || cls === void 0 ? void 0 : cls.values[pkey]) !== null && _cls$values$pkey !== void 0 ? _cls$values$pkey : null,
    fid: fid === null || fid === void 0 ? void 0 : fid.values[pkey],
    lcp: lcp === null || lcp === void 0 ? void 0 : lcp.values[pkey],
    tbt: (_tbt$values$pkey = tbt === null || tbt === void 0 ? void 0 : tbt.values[pkey]) !== null && _tbt$values$pkey !== void 0 ? _tbt$values$pkey : 0,
    fcp: fcp === null || fcp === void 0 ? void 0 : fcp.values[pkey],
    lcpRanks: lcp !== null && lcp !== void 0 && lcp.values[pkey] ? getRanksPercentages(lcpRanks === null || lcpRanks === void 0 ? void 0 : lcpRanks.values) : defaultRanks,
    fidRanks: fid !== null && fid !== void 0 && fid.values[pkey] ? getRanksPercentages(fidRanks === null || fidRanks === void 0 ? void 0 : fidRanks.values) : defaultRanks,
    clsRanks: cls !== null && cls !== void 0 && cls.values[pkey] ? getRanksPercentages(clsRanks === null || clsRanks === void 0 ? void 0 : clsRanks.values) : defaultRanks
  };
}