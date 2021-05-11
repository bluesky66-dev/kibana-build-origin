"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnapshotMetricTypeRT = exports.SnapshotMetricTypeKeys = exports.MetricsUIAggregationRT = exports.ESAggregationRT = exports.ESTermsWithAggregationRT = exports.ESTopHitsAggRT = exports.ESSumBucketAggRT = exports.ESDerivativeAggRT = exports.ESCumulativeSumAggRT = exports.ESBucketScriptAggRT = exports.ESCaridnalityAggRT = exports.ESPercentileAggRT = exports.ESBasicMetricAggRT = exports.TSVBMetricModelRT = exports.TSVBSeriesRT = exports.TSVBMetricRT = exports.TSVBMetricModePercentileAggRT = exports.TSVBPercentileItemRT = exports.TSVBMetricModelSeriesAggRT = exports.TSVBMetricModelDerivativeRT = exports.TSVBMetricModelBucketScriptRT = exports.TSVBMetricModelVariableRT = exports.TSVBMetricModelBasicMetricRT = exports.TSVBMetricModelCountRT = exports.TSVBMetricTypeRT = exports.InventoryMetricRT = exports.InventoryFormatterTypeRT = exports.InventoryVisTypeRT = exports.ItemTypeRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ItemTypeRT = rt.keyof({
  host: null,
  pod: null,
  container: null,
  awsEC2: null,
  awsS3: null,
  awsSQS: null,
  awsRDS: null
});
exports.ItemTypeRT = ItemTypeRT;
const InventoryVisTypeRT = rt.keyof({
  line: null,
  area: null,
  bar: null
});
exports.InventoryVisTypeRT = InventoryVisTypeRT;
const InventoryFormatterTypeRT = rt.keyof({
  abbreviatedNumber: null,
  bits: null,
  bytes: null,
  number: null,
  percent: null,
  highPercision: null
});
exports.InventoryFormatterTypeRT = InventoryFormatterTypeRT;
const InventoryMetricRT = rt.keyof({
  hostSystemOverview: null,
  hostCpuUsage: null,
  hostFilesystem: null,
  hostK8sOverview: null,
  hostK8sCpuCap: null,
  hostK8sDiskCap: null,
  hostK8sMemoryCap: null,
  hostK8sPodCap: null,
  hostLoad: null,
  hostMemoryUsage: null,
  hostNetworkTraffic: null,
  hostDockerOverview: null,
  hostDockerInfo: null,
  hostDockerTop5ByCpu: null,
  hostDockerTop5ByMemory: null,
  podOverview: null,
  podCpuUsage: null,
  podMemoryUsage: null,
  podLogUsage: null,
  podNetworkTraffic: null,
  containerOverview: null,
  containerCpuKernel: null,
  containerCpuUsage: null,
  containerDiskIOOps: null,
  containerDiskIOBytes: null,
  containerMemory: null,
  containerNetworkTraffic: null,
  nginxHits: null,
  nginxRequestRate: null,
  nginxActiveConnections: null,
  nginxRequestsPerConnection: null,
  awsOverview: null,
  awsCpuUtilization: null,
  awsNetworkBytes: null,
  awsNetworkPackets: null,
  awsDiskioBytes: null,
  awsDiskioOps: null,
  awsEC2CpuUtilization: null,
  awsEC2NetworkTraffic: null,
  awsEC2DiskIOBytes: null,
  awsS3TotalRequests: null,
  awsS3NumberOfObjects: null,
  awsS3BucketSize: null,
  awsS3DownloadBytes: null,
  awsS3UploadBytes: null,
  awsRDSCpuTotal: null,
  awsRDSConnections: null,
  awsRDSQueriesExecuted: null,
  awsRDSActiveTransactions: null,
  awsRDSLatency: null,
  awsSQSMessagesVisible: null,
  awsSQSMessagesDelayed: null,
  awsSQSMessagesSent: null,
  awsSQSMessagesEmpty: null,
  awsSQSOldestMessage: null,
  custom: null
});
exports.InventoryMetricRT = InventoryMetricRT;
const TSVBMetricTypeRT = rt.keyof({
  avg: null,
  max: null,
  min: null,
  calculation: null,
  cardinality: null,
  series_agg: null,
  positive_only: null,
  derivative: null,
  count: null,
  sum: null,
  cumulative_sum: null
});
exports.TSVBMetricTypeRT = TSVBMetricTypeRT;
const TSVBMetricModelCountRT = rt.type({
  id: rt.string,
  type: rt.literal('count')
});
exports.TSVBMetricModelCountRT = TSVBMetricModelCountRT;
const TSVBMetricModelBasicMetricRT = rt.intersection([rt.type({
  id: rt.string,
  type: TSVBMetricTypeRT
}), rt.partial({
  field: rt.string
})]);
exports.TSVBMetricModelBasicMetricRT = TSVBMetricModelBasicMetricRT;
const TSVBMetricModelVariableRT = rt.type({
  field: rt.string,
  id: rt.string,
  name: rt.string
});
exports.TSVBMetricModelVariableRT = TSVBMetricModelVariableRT;
const TSVBMetricModelBucketScriptRT = rt.type({
  id: rt.string,
  script: rt.string,
  type: rt.literal('calculation'),
  variables: rt.array(TSVBMetricModelVariableRT)
});
exports.TSVBMetricModelBucketScriptRT = TSVBMetricModelBucketScriptRT;
const TSVBMetricModelDerivativeRT = rt.type({
  id: rt.string,
  field: rt.string,
  unit: rt.string,
  type: rt.literal('derivative')
});
exports.TSVBMetricModelDerivativeRT = TSVBMetricModelDerivativeRT;
const TSVBMetricModelSeriesAggRT = rt.type({
  id: rt.string,
  function: rt.string,
  type: rt.literal('series_agg')
});
exports.TSVBMetricModelSeriesAggRT = TSVBMetricModelSeriesAggRT;
const TSVBPercentileItemRT = rt.type({
  id: rt.string,
  value: rt.number
});
exports.TSVBPercentileItemRT = TSVBPercentileItemRT;
const TSVBMetricModePercentileAggRT = rt.intersection([rt.type({
  id: rt.string,
  type: rt.literal('percentile'),
  percentiles: rt.array(TSVBPercentileItemRT)
}), rt.partial({
  field: rt.string
})]);
exports.TSVBMetricModePercentileAggRT = TSVBMetricModePercentileAggRT;
const TSVBMetricRT = rt.union([TSVBMetricModelCountRT, TSVBMetricModelBasicMetricRT, TSVBMetricModelBucketScriptRT, TSVBMetricModelDerivativeRT, TSVBMetricModePercentileAggRT, TSVBMetricModelSeriesAggRT]);
exports.TSVBMetricRT = TSVBMetricRT;
const TSVBSeriesRT = rt.intersection([rt.type({
  id: rt.string,
  metrics: rt.array(TSVBMetricRT),
  split_mode: rt.string
}), rt.partial({
  terms_field: rt.string,
  terms_size: rt.number,
  terms_order_by: rt.string,
  filter: rt.type({
    query: rt.string,
    language: rt.keyof({
      lucene: null,
      kuery: null
    })
  })
})]);
exports.TSVBSeriesRT = TSVBSeriesRT;
const TSVBMetricModelRT = rt.intersection([rt.type({
  id: InventoryMetricRT,
  requires: rt.array(rt.string),
  index_pattern: rt.union([rt.string, rt.array(rt.string)]),
  interval: rt.string,
  time_field: rt.string,
  type: rt.string,
  series: rt.array(TSVBSeriesRT)
}), rt.partial({
  filter: rt.string,
  map_field_to: rt.string,
  id_type: rt.keyof({
    cloud: null,
    node: null
  }),
  drop_last_bucket: rt.boolean
})]);
exports.TSVBMetricModelRT = TSVBMetricModelRT;
const ESBasicMetricAggRT = rt.record(rt.string, rt.union([rt.undefined, rt.type({
  field: rt.string
})]));
exports.ESBasicMetricAggRT = ESBasicMetricAggRT;
const ESPercentileAggRT = rt.type({
  percentiles: rt.type({
    field: rt.string,
    percents: rt.array(rt.number)
  })
});
exports.ESPercentileAggRT = ESPercentileAggRT;
const ESCaridnalityAggRT = rt.type({
  cardinality: rt.partial({
    field: rt.string,
    script: rt.string
  })
});
exports.ESCaridnalityAggRT = ESCaridnalityAggRT;
const ESBucketScriptAggRT = rt.type({
  bucket_script: rt.intersection([rt.type({
    buckets_path: rt.record(rt.string, rt.union([rt.undefined, rt.string])),
    script: rt.type({
      source: rt.string,
      lang: rt.keyof({
        painless: null,
        expression: null
      })
    })
  }), rt.partial({
    gap_policy: rt.keyof({
      skip: null,
      insert_zeros: null
    })
  })])
});
exports.ESBucketScriptAggRT = ESBucketScriptAggRT;
const ESCumulativeSumAggRT = rt.type({
  cumulative_sum: rt.type({
    buckets_path: rt.string
  })
});
exports.ESCumulativeSumAggRT = ESCumulativeSumAggRT;
const ESDerivativeAggRT = rt.type({
  derivative: rt.type({
    buckets_path: rt.string,
    gap_policy: rt.keyof({
      skip: null,
      insert_zeros: null
    }),
    unit: rt.string
  })
});
exports.ESDerivativeAggRT = ESDerivativeAggRT;
const ESSumBucketAggRT = rt.type({
  sum_bucket: rt.type({
    buckets_path: rt.string
  })
});
exports.ESSumBucketAggRT = ESSumBucketAggRT;
const ESTopHitsAggRT = rt.type({
  top_hits: rt.object
});
exports.ESTopHitsAggRT = ESTopHitsAggRT;
const ESTermsWithAggregationRT = rt.recursion('SnapshotModelRT', () => rt.type({
  terms: rt.type({
    field: rt.string
  }),
  aggregations: MetricsUIAggregationRT
}));
exports.ESTermsWithAggregationRT = ESTermsWithAggregationRT;
const ESAggregationRT = rt.union([ESBasicMetricAggRT, ESPercentileAggRT, ESBucketScriptAggRT, ESCumulativeSumAggRT, ESDerivativeAggRT, ESSumBucketAggRT, ESTermsWithAggregationRT, ESCaridnalityAggRT, ESTopHitsAggRT]);
exports.ESAggregationRT = ESAggregationRT;
const MetricsUIAggregationRT = rt.record(rt.string, ESAggregationRT);
exports.MetricsUIAggregationRT = MetricsUIAggregationRT;
const SnapshotMetricTypeKeys = {
  count: null,
  cpu: null,
  load: null,
  memory: null,
  tx: null,
  rx: null,
  logRate: null,
  diskIOReadBytes: null,
  diskIOWriteBytes: null,
  s3TotalRequests: null,
  s3NumberOfObjects: null,
  s3BucketSize: null,
  s3DownloadBytes: null,
  s3UploadBytes: null,
  rdsConnections: null,
  rdsQueriesExecuted: null,
  rdsActiveTransactions: null,
  rdsLatency: null,
  sqsMessagesVisible: null,
  sqsMessagesDelayed: null,
  sqsMessagesSent: null,
  sqsMessagesEmpty: null,
  sqsOldestMessage: null,
  custom: null
};
exports.SnapshotMetricTypeKeys = SnapshotMetricTypeKeys;
const SnapshotMetricTypeRT = rt.keyof(SnapshotMetricTypeKeys);
exports.SnapshotMetricTypeRT = SnapshotMetricTypeRT;