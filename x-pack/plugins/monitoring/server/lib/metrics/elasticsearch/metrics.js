"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _classes = require("../classes");

var _classes2 = require("./classes");

var _formatting = require("../../../../common/formatting");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const indexingRateTitle = _i18n.i18n.translate('xpack.monitoring.metrics.es.indexingRateTitle', {
  defaultMessage: 'Indexing Rate' // title to use for the chart

});

const nodeLatencyTitle = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.latencyTitle', {
  defaultMessage: 'Latency'
});

const indexRequestTimeTitle = _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestTimeTitle', {
  defaultMessage: 'Request Time'
});

const indexIndexingRateTitle = _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexingRateTitle', {
  defaultMessage: 'Indexing Rate'
});

const nodeIoRateTitle = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.ioRateTitle', {
  defaultMessage: 'I/O Operations Rate'
});

const indexSegmentCountTitle = _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.segmentCountTitle', {
  defaultMessage: 'Segment Count'
});

const indexDiskTitle = _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.diskTitle', {
  defaultMessage: 'Disk'
});

const indexRefreshTimeTitle = _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.refreshTimeTitle', {
  defaultMessage: 'Refresh Time'
});

const indexThrottleTimeTitle = _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.throttleTimeTitle', {
  defaultMessage: 'Throttle Time'
});

const nodeCgroupCfsStats = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cgroupCfsStatsTitle', {
  defaultMessage: 'Cgroup CFS Stats'
});

const nodeCgroupCpuPerformance = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cgroupCpuPerformanceTitle', {
  defaultMessage: 'Cgroup CPU Performance'
});

const nodeCpuUtilizationLabel = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cpuUtilizationLabel', {
  defaultMessage: 'CPU Utilization'
});

const nodeGcCount = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.gsCountTitle', {
  defaultMessage: 'GC Count'
});

const nodeGcDuration = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.gsDurationTitle', {
  defaultMessage: 'GC Duration'
});

const nodeJvmHeap = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.jvmHeapTitle', {
  defaultMessage: '{javaVirtualMachine} Heap',
  values: {
    javaVirtualMachine: 'JVM'
  }
});

const nodeUsedHeapLabel = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.jvmHeap.usedHeapLabel', {
  defaultMessage: 'Used Heap'
});

const nodeUsedHeapDescription = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.jvmHeap.usedHeapDescription', {
  defaultMessage: 'Total heap used by Elasticsearch running in the JVM.'
});

const nodeReadThreads = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.readThreadsTitle', {
  defaultMessage: 'Read Threads'
});

const nodeIndexingThreads = _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingThreadsTitle', {
  defaultMessage: 'Indexing Threads'
});

const msTimeUnitLabel = _i18n.i18n.translate('xpack.monitoring.metrics.es.msTimeUnitLabel', {
  defaultMessage: 'ms'
});

const nsTimeUnitLabel = _i18n.i18n.translate('xpack.monitoring.metrics.es.nsTimeUnitLabel', {
  defaultMessage: 'ns'
});

const perSecondUnitLabel = _i18n.i18n.translate('xpack.monitoring.metrics.es.perSecondTimeUnitLabel', {
  defaultMessage: '/s'
});

const metrics = {
  cluster_index_request_rate_primary: new _classes2.RequestRateMetric({
    title: indexingRateTitle,
    // title to use for the chart
    label: _i18n.i18n.translate('xpack.monitoring.metrics.es.indexingRate.primaryShardsLabel', {
      defaultMessage: 'Primary Shards' // label to use for this line in the chart

    }),
    field: 'indices_stats._all.primaries.indexing.index_total',
    description: _i18n.i18n.translate('xpack.monitoring.metrics.es.indexingRate.primaryShardsDescription', {
      defaultMessage: 'Number of documents being indexed for primary shards.'
    }),
    type: 'index'
  }),
  cluster_index_request_rate_total: new _classes2.RequestRateMetric({
    field: 'indices_stats._all.total.indexing.index_total',
    title: indexingRateTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.es.indexingRate.totalShardsLabel', {
      defaultMessage: 'Total Shards'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.es.indexingRate.totalShardsDescription', {
      defaultMessage: 'Number of documents being indexed for primary and replica shards.'
    }),
    type: 'index'
  }),
  cluster_search_request_rate: new _classes2.RequestRateMetric({
    field: 'indices_stats._all.total.search.query_total',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.es.searchRateTitle', {
      defaultMessage: 'Search Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.es.searchRate.totalShardsLabel', {
      defaultMessage: 'Total Shards'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.es.searchRate.totalShardsDescription', {
      defaultMessage: 'Number of search requests being executed across primary and replica shards. A single search can run against multiple shards!'
    }),
    type: 'cluster'
  }),
  cluster_index_latency: new _classes2.LatencyMetric({
    metric: 'index',
    fieldSource: 'indices_stats._all.primaries',
    field: 'indices_stats._all.primaries.indexing.index_total',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.es.indexingLatencyLabel', {
      defaultMessage: 'Indexing Latency'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.es.indexingLatencyDescription', {
      defaultMessage: 'Average latency for indexing documents, which is time it takes to index documents divided by number ' + 'that were indexed. This only considers primary shards.'
    }),
    type: 'cluster'
  }),
  node_index_latency: new _classes2.LatencyMetric({
    metric: 'index',
    fieldSource: 'node_stats.indices',
    field: 'node_stats.indices.indexing.index_total',
    title: nodeLatencyTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.latency.indexingLabel', {
      defaultMessage: 'Indexing'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.latency.indexingDescription', {
      defaultMessage: 'Average latency for indexing documents, which is time it takes to index documents divided by number ' + 'that were indexed. This considers any shard located on this node, including replicas.'
    }),
    type: 'node'
  }),
  index_index_latency: new _classes2.LatencyMetric({
    metric: 'index',
    fieldSource: 'index_stats.primaries',
    field: 'index_stats.primaries.indexing.index_total',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.latencyTitle', {
      defaultMessage: 'Latency'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.latency.indexingLatencyLabel', {
      defaultMessage: 'Indexing Latency'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.latency.indexingLatencyDescription', {
      defaultMessage: 'Average latency for indexing documents, which is time it takes to index documents divided by number ' + 'that were indexed. This only considers primary shards.'
    }),
    type: 'cluster'
  }),
  cluster_query_latency: new _classes2.LatencyMetric({
    metric: 'query',
    fieldSource: 'indices_stats._all.total',
    field: 'indices_stats._all.total.search.query_total',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.es.searchLatencyLabel', {
      defaultMessage: 'Search Latency'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.es.searchLatencyDescription', {
      defaultMessage: 'Average latency for searching, which is time it takes to execute searches divided by number of ' + 'searches submitted. This considers primary and replica shards.'
    }),
    type: 'cluster'
  }),
  node_query_latency: new _classes2.LatencyMetric({
    metric: 'query',
    fieldSource: 'node_stats.indices',
    field: 'node_stats.indices.search.query_total',
    title: nodeLatencyTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.latency.searchLabel', {
      defaultMessage: 'Search'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.latency.searchDescription', {
      defaultMessage: 'Average latency for searching, which is time it takes to execute searches divided by number of searches ' + 'submitted. This considers primary and replica shards.'
    }),
    type: 'node'
  }),
  index_query_latency: new _classes2.LatencyMetric({
    metric: 'query',
    fieldSource: 'index_stats.total',
    field: 'index_stats.total.search.query_total',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.latency.searchLatencyLabel', {
      defaultMessage: 'Search Latency'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.latency.searchLatencyDescription', {
      defaultMessage: 'Average latency for searching, which is time it takes to execute searches divided by number of searches ' + 'submitted. This considers primary and replica shards.'
    }),
    type: 'cluster'
  }),
  index_indexing_primaries_time: new _classes2.ElasticsearchMetric({
    field: 'index_stats.primaries.indexing.index_time_in_millis',
    title: indexRequestTimeTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestTime.indexingPrimariesLabel', {
      defaultMessage: 'Indexing (Primaries)'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestTime.indexingPrimariesDescription', {
      defaultMessage: 'Amount of time spent performing index operations on primary shards only.'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel
  }),
  index_indexing_total_time: new _classes2.ElasticsearchMetric({
    field: 'index_stats.total.indexing.index_time_in_millis',
    title: indexRequestTimeTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestTime.indexingLabel', {
      defaultMessage: 'Indexing'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestTime.indexingDescription', {
      defaultMessage: 'Amount of time spent performing index operations on primary and replica shards.'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel
  }),
  index_indexing_total: new _classes2.ElasticsearchMetric({
    field: 'index_stats.primaries.indexing.index_total',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestRateTitle', {
      defaultMessage: 'Request Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestRate.indexTotalLabel', {
      defaultMessage: 'Index Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestRate.indexTotalDescription', {
      defaultMessage: 'Amount of indexing operations.'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  index_mem_overall: new _classes2.SingleIndexMemoryMetric({
    field: 'memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.luceneTotalLabel', {
      defaultMessage: 'Lucene Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.luceneTotalDescription', {
      defaultMessage: 'Total heap memory used by Lucene for current index. This is the sum of other fields for primary and replica shards.'
    })
  }),
  index_mem_overall_1: new _classes2.SingleIndexMemoryMetric({
    field: 'memory_in_bytes',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryLucene1Title', {
      defaultMessage: 'Index Memory - Lucene 1'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryLucene1.luceneTotalLabel', {
      defaultMessage: 'Lucene Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryLucene1.luceneTotalDescription', {
      defaultMessage: 'Total heap memory used by Lucene for current index. This is the sum of other fields for primary and replica shards.'
    })
  }),
  index_mem_overall_2: new _classes2.SingleIndexMemoryMetric({
    field: 'memory_in_bytes',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryLucene2Title', {
      defaultMessage: 'Index Memory - Lucene 2'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryLucene2.luceneTotalLabel', {
      defaultMessage: 'Lucene Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryLucene2.luceneTotalDescription', {
      defaultMessage: 'Total heap memory used by Lucene for current index. This is the sum of other fields for primary and replica shards.'
    })
  }),
  index_mem_overall_3: new _classes2.SingleIndexMemoryMetric({
    field: 'memory_in_bytes',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryLucene3Title', {
      defaultMessage: 'Index Memory - Lucene 3'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryLucene3.luceneTotalLabel', {
      defaultMessage: 'Lucene Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryLucene3.luceneTotalDescription', {
      defaultMessage: 'Total heap memory used by Lucene for current index. This is the sum of other fields for primary and replica shards.'
    })
  }),
  index_mem_doc_values: new _classes2.SingleIndexMemoryMetric({
    field: 'doc_values_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.docValuesLabel', {
      defaultMessage: 'Doc Values'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.docValuesDescription', {
      defaultMessage: 'Heap memory used by Doc Values. This is a part of Lucene Total.'
    })
  }),
  // Note: This is not segment memory, unlike SingleIndexMemoryMetrics
  index_mem_fielddata: new _classes2.IndexMemoryMetric({
    field: 'index_stats.total.fielddata.memory_size_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.fielddataLabel', {
      defaultMessage: 'Fielddata'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.fielddataDescription', {
      defaultMessage: 'Heap memory used by Fielddata (e.g., global ordinals or explicitly enabled fielddata on text fields). ' + 'This is for the same shards, but not a part of Lucene Total.'
    }),
    type: 'index'
  }),
  index_mem_fixed_bit_set: new _classes2.SingleIndexMemoryMetric({
    field: 'fixed_bit_set_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.fixedBitsetsLabel', {
      defaultMessage: 'Fixed Bitsets'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.fixedBitsetsDescription', {
      defaultMessage: 'Heap memory used by Fixed Bit Sets (e.g., deeply nested documents). This is a part of Lucene Total.'
    })
  }),
  index_mem_norms: new _classes2.SingleIndexMemoryMetric({
    field: 'norms_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.normsLabel', {
      defaultMessage: 'Norms'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.normsDescription', {
      defaultMessage: 'Heap memory used by Norms (normalization factors for query-time, text scoring). This is a part of Lucene Total.'
    })
  }),
  index_mem_points: new _classes2.SingleIndexMemoryMetric({
    field: 'points_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.pointsLabel', {
      defaultMessage: 'Points'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.pointsDescription', {
      defaultMessage: 'Heap memory used by Points (e.g., numbers, IPs, and geo data). This is a part of Lucene Total.'
    })
  }),
  // Note: This is not segment memory, unlike SingleIndexMemoryMetrics
  index_mem_query_cache: new _classes2.IndexMemoryMetric({
    field: 'index_stats.total.query_cache.memory_size_in_bytes',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryEsTitle', {
      defaultMessage: 'Index Memory - {elasticsearch}',
      values: {
        elasticsearch: 'Elasticsearch'
      }
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryEs.queryCacheLabel', {
      defaultMessage: 'Query Cache'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexMemoryEs.queryCacheDescription', {
      defaultMessage: 'Heap memory used by Query Cache (e.g., cached filters). This is for the same shards, but not a part of Lucene Total.'
    }),
    type: 'index'
  }),
  // Note: This is not segment memory, unlike SingleIndexMemoryMetrics
  index_mem_request_cache: new _classes2.IndexMemoryMetric({
    field: 'index_stats.total.request_cache.memory_size_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestCacheLabel', {
      defaultMessage: 'Request Cache'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestCacheDescription', {
      defaultMessage: 'Heap memory used by Request Cache (e.g., instant aggregations). This is for the same shards, but not a part of Lucene Total.'
    }),
    type: 'index'
  }),
  index_mem_stored_fields: new _classes2.SingleIndexMemoryMetric({
    field: 'stored_fields_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.storedFieldsLabel', {
      defaultMessage: 'Stored Fields'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.storedFieldsDescription', {
      defaultMessage: 'Heap memory used by Stored Fields (e.g., _source). This is a part of Lucene Total.'
    })
  }),
  index_mem_term_vectors: new _classes2.SingleIndexMemoryMetric({
    field: 'term_vectors_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.termVectorsLabel', {
      defaultMessage: 'Term Vectors'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.termVectorsDescription', {
      defaultMessage: 'Heap memory used by Term Vectors. This is a part of Lucene Total.'
    })
  }),
  index_mem_terms: new _classes2.SingleIndexMemoryMetric({
    field: 'terms_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.termsLabel', {
      defaultMessage: 'Terms'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.termsDescription', {
      defaultMessage: 'Heap memory used by Terms (e.g., text). This is a part of Lucene Total.'
    })
  }),
  index_mem_versions: new _classes2.SingleIndexMemoryMetric({
    field: 'version_map_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.versionMapLabel', {
      defaultMessage: 'Version Map'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.versionMapDescription', {
      defaultMessage: 'Heap memory used by Versioning (e.g., updates and deletes). This is NOT a part of Lucene Total.'
    })
  }),
  index_mem_writer: new _classes2.SingleIndexMemoryMetric({
    field: 'index_writer_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexWriterLabel', {
      defaultMessage: 'Index Writer'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexWriterDescription', {
      defaultMessage: 'Heap memory used by the Index Writer. This is NOT a part of Lucene Total.'
    })
  }),
  node_total_cumul_io: new _classes2.RequestRateMetric({
    field: 'node_stats.fs.io_stats.total.operations',
    title: nodeIoRateTitle,
    format: _formatting.LARGE_FLOAT,
    units: 'ops',
    type: 'node',
    derivative: true,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.totalIoLabel', {
      defaultMessage: 'Total I/O'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.totalIoDescription', {
      defaultMessage: 'Total I/O. (This metric is not supported on all platforms and may display N/A if I/O data is unavailable.)'
    })
  }),
  node_total_read_io: new _classes2.RequestRateMetric({
    field: 'node_stats.fs.io_stats.total.read_operations',
    title: nodeIoRateTitle,
    format: _formatting.LARGE_FLOAT,
    units: 'ops',
    type: 'node',
    derivative: true,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.totalIoReadLabel', {
      defaultMessage: 'Total Read I/O'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.totalIoReadDescription', {
      defaultMessage: 'Total Read I/O. (This metric is not supported on all platforms and may display N/A if I/O data is unavailable.)'
    })
  }),
  node_total_write_io: new _classes2.RequestRateMetric({
    field: 'node_stats.fs.io_stats.total.write_operations',
    title: nodeIoRateTitle,
    format: _formatting.LARGE_FLOAT,
    units: 'ops',
    type: 'node',
    derivative: true,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.totalIoWriteLabel', {
      defaultMessage: 'Total Write I/O'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.totalIoWriteDescription', {
      defaultMessage: 'Total Write I/O. (This metric is not supported on all platforms and may display N/A if I/O data is unavailable.)'
    })
  }),
  index_request_rate_primary: new _classes2.ElasticsearchMetric({
    field: 'index_stats.primaries.indexing.index_total',
    title: indexIndexingRateTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexingRate.primaryShardsLabel', {
      defaultMessage: 'Primary Shards'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexingRate.primaryShardsDescription', {
      defaultMessage: 'Number of documents being indexed for primary shards.'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: perSecondUnitLabel,
    type: 'index',
    derivative: true
  }),
  index_request_rate_total: new _classes2.RequestRateMetric({
    field: 'index_stats.total.indexing.index_total',
    title: indexIndexingRateTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexingRate.totalShardsLabel', {
      defaultMessage: 'Total Shards'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.indexingRate.totalShardsDescription', {
      defaultMessage: 'Number of documents being indexed for primary and replica shards.'
    }),
    type: 'index'
  }),
  index_searching_time: new _classes2.ElasticsearchMetric({
    field: 'index_stats.total.search.query_time_in_millis',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestTimeTitle', {
      defaultMessage: 'Request Time'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestTime.searchLabel', {
      defaultMessage: 'Search'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestTime.searchDescription', {
      defaultMessage: 'Amount of time spent performing search operations (per shard).'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel
  }),
  index_searching_total: new _classes2.ElasticsearchMetric({
    field: 'index_stats.total.search.query_total',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestRateTitle', {
      defaultMessage: 'Request Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestRate.searchTotalLabel', {
      defaultMessage: 'Search Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.requestRate.searchTotalDescription', {
      defaultMessage: 'Amount of search operations (per shard).'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  index_segment_count_primaries: new _classes2.ElasticsearchMetric({
    field: 'index_stats.primaries.segments.count',
    title: indexSegmentCountTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.segmentCount.primariesLabel', {
      defaultMessage: 'Primaries'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.segmentCount.primariesDescription', {
      defaultMessage: 'Number of segments for primary shards.'
    }),
    type: 'index',
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  index_segment_count_total: new _classes2.ElasticsearchMetric({
    field: 'index_stats.total.segments.count',
    title: indexSegmentCountTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.segmentCount.totalLabel', {
      defaultMessage: 'Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.segmentCount.totalDescription', {
      defaultMessage: 'Number of segments for primary and replica shards.'
    }),
    type: 'index',
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  index_segment_merge_primaries_size: new _classes2.ElasticsearchMetric({
    field: 'index_stats.primaries.merges.total_size_in_bytes',
    title: indexDiskTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.disk.mergesPrimariesLabel', {
      defaultMessage: 'Merges (Primaries)'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.disk.mergesPrimariesDescription', {
      defaultMessage: 'Size of merges on primary shards.'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  index_segment_merge_total_size: new _classes2.ElasticsearchMetric({
    field: 'index_stats.total.merges.total_size_in_bytes',
    title: indexDiskTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.disk.mergesLabel', {
      defaultMessage: 'Merges'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.disk.mergesDescription', {
      defaultMessage: 'Size of merges on primary and replica shards.'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  index_segment_refresh_primaries_time: new _classes2.ElasticsearchMetric({
    field: 'index_stats.primaries.refresh.total_time_in_millis',
    title: indexRefreshTimeTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.refreshTime.primariesLabel', {
      defaultMessage: 'Primaries'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.refreshTime.primariesDescription', {
      defaultMessage: 'Amount of time spent to perform refresh operations on primary shards.'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel
  }),
  index_segment_refresh_total_time: new _classes2.ElasticsearchMetric({
    field: 'index_stats.total.refresh.total_time_in_millis',
    title: indexRefreshTimeTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.refreshTime.totalLabel', {
      defaultMessage: 'Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.refreshTime.totalDescription', {
      defaultMessage: 'Amount of time spent to perform refresh operations on primary and replica shards.'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel
  }),
  index_throttling_indexing_primaries_time: new _classes2.ElasticsearchMetric({
    field: 'index_stats.primaries.indexing.throttle_time_in_millis',
    title: indexThrottleTimeTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.throttleTime.indexingPrimariesLabel', {
      defaultMessage: 'Indexing (Primaries)'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.throttleTime.indexingPrimariesDescription', {
      defaultMessage: 'Amount of time spent throttling index operations on primary shards.'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel
  }),
  index_throttling_indexing_total_time: new _classes2.ElasticsearchMetric({
    field: 'index_stats.total.indexing.throttle_time_in_millis',
    title: indexThrottleTimeTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.throttleTime.indexingLabel', {
      defaultMessage: 'Indexing'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.throttleTime.indexingDescription', {
      defaultMessage: 'Amount of time spent throttling index operations on primary and replica shards.'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel
  }),
  index_store_primaries_size: new _classes2.ElasticsearchMetric({
    field: 'index_stats.primaries.store.size_in_bytes',
    title: indexDiskTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.disk.storePrimariesLabel', {
      defaultMessage: 'Store (Primaries)'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.disk.storePrimariesDescription', {
      defaultMessage: 'Size of primary shards on disk.'
    }),
    type: 'index',
    derivative: false,
    format: _formatting.LARGE_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  index_store_total_size: new _classes2.ElasticsearchMetric({
    field: 'index_stats.total.store.size_in_bytes',
    title: indexDiskTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.disk.storeLabel', {
      defaultMessage: 'Store'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.disk.storeDescription', {
      defaultMessage: 'Size of primary and replica shards on disk.'
    }),
    type: 'index',
    derivative: false,
    format: _formatting.LARGE_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  search_request_rate: new _classes2.RequestRateMetric({
    field: 'index_stats.total.search.query_total',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.searchRateTitle', {
      defaultMessage: 'Search Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.searchRate.totalShardsLabel', {
      defaultMessage: 'Total Shards'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esIndex.searchRate.totalShardsDescription', {
      defaultMessage: 'Number of search requests being executed across primary and replica shards. A single search can run against multiple shards!'
    }),
    type: 'cluster'
  }),
  node_cgroup_periods: new _classes2.ElasticsearchMetric({
    field: 'node_stats.os.cgroup.cpu.stat.number_of_elapsed_periods',
    title: nodeCgroupCfsStats,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cgroupCfsStats.cgroupElapsedPeriodsLabel', {
      defaultMessage: 'Cgroup Elapsed Periods'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cgroupCfsStats.cgroupElapsedPeriodsDescription', {
      defaultMessage: 'The number of sampling periods from the Completely Fair Scheduler (CFS). Compare against the number of times throttled.'
    }),
    type: 'node',
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    derivative: true,
    units: ''
  }),
  node_cgroup_throttled: new _classes2.ElasticsearchMetric({
    field: 'node_stats.os.cgroup.cpu.stat.time_throttled_nanos',
    title: nodeCgroupCpuPerformance,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cgroupCpuPerformance.cgroupThrottlingLabel', {
      defaultMessage: 'Cgroup Throttling'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cgroupCpuPerformance.cgroupThrottlingDescription', {
      defaultMessage: 'The amount of throttled time, reported in nanoseconds, of the Cgroup.'
    }),
    type: 'node',
    format: _formatting.LARGE_ABBREVIATED,
    metricAgg: 'max',
    derivative: true,
    units: nsTimeUnitLabel
  }),
  node_cgroup_throttled_count: new _classes2.ElasticsearchMetric({
    field: 'node_stats.os.cgroup.cpu.stat.number_of_times_throttled',
    title: nodeCgroupCfsStats,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cgroupCfsStats.cgroupThrottledCountLabel', {
      defaultMessage: 'Cgroup Throttled Count'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cgroupCfsStats.cgroupThrottledCountDescription', {
      defaultMessage: 'The number of times that the CPU was throttled by the Cgroup.'
    }),
    type: 'node',
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    derivative: true,
    units: ''
  }),
  node_cgroup_usage: new _classes2.ElasticsearchMetric({
    field: 'node_stats.os.cgroup.cpuacct.usage_nanos',
    title: nodeCgroupCpuPerformance,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cgroupCpuPerformance.cgroupUsageLabel', {
      defaultMessage: 'Cgroup Usage'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cgroupCpuPerformance.cgroupUsageDescription', {
      defaultMessage: 'The usage, reported in nanoseconds, of the Cgroup. Compare this with the throttling to discover issues.'
    }),
    type: 'node',
    format: _formatting.LARGE_ABBREVIATED,
    metricAgg: 'max',
    derivative: true,
    units: nsTimeUnitLabel
  }),
  ...(() => {
    // CGroup CPU Utilization Fields
    const quotaMetricConfig = {
      app: 'elasticsearch',
      uuidField: 'source_node.uuid',
      timestampField: 'timestamp',
      fieldSource: 'node_stats.os.cgroup',
      usageField: 'cpuacct.usage_nanos',
      periodsField: 'cpu.stat.number_of_elapsed_periods',
      quotaField: 'cpu.cfs_quota_micros',
      field: 'node_stats.process.cpu.percent',
      // backup field if quota is not configured
      label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cpuUtilization.cgroupCpuUtilizationLabel', {
        defaultMessage: 'Cgroup CPU Utilization'
      }),
      description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cpuUtilization.cgroupCpuUtilizationDescription', {
        defaultMessage: 'CPU Usage time compared to the CPU quota shown in percentage. If CPU quotas are not set, then no data will be shown.'
      }),
      type: 'node'
    };
    return {
      node_cgroup_quota: new _classes.QuotaMetric({ ...quotaMetricConfig,
        title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cpuUtilizationTitle', {
          defaultMessage: 'CPU Utilization'
        })
      }),
      node_cgroup_quota_as_cpu_utilization: new _classes.QuotaMetric({ ...quotaMetricConfig,
        label: nodeCpuUtilizationLabel //  override the "Cgroup CPU..." label

      })
    };
  })(),
  node_cpu_utilization: new _classes2.ElasticsearchMetric({
    field: 'node_stats.process.cpu.percent',
    label: nodeCpuUtilizationLabel,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.cpuUtilizationDescription', {
      defaultMessage: 'Percentage of CPU usage for the Elasticsearch process.'
    }),
    type: 'node',
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: '%'
  }),
  node_segment_count: new _classes2.ElasticsearchMetric({
    field: 'node_stats.indices.segments.count',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.segmentCountLabel', {
      defaultMessage: 'Segment Count'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.segmentCountDescription', {
      defaultMessage: 'Maximum segment count for primary and replica shards on this node.'
    }),
    type: 'node',
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  node_jvm_gc_old_count: new _classes2.ElasticsearchMetric({
    field: 'node_stats.jvm.gc.collectors.old.collection_count',
    title: nodeGcCount,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.gcCount.oldLabel', {
      defaultMessage: 'Old'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.gcCount.oldDescription', {
      defaultMessage: 'Number of old Garbage Collections.'
    }),
    derivative: true,
    format: _formatting.SMALL_FLOAT,
    metricAgg: 'max',
    units: '',
    type: 'node'
  }),
  node_jvm_gc_old_time: new _classes2.ElasticsearchMetric({
    field: 'node_stats.jvm.gc.collectors.old.collection_time_in_millis',
    title: nodeGcDuration,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.gcDuration.oldLabel', {
      defaultMessage: 'Old'
    }),
    derivative: true,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.gcDuration.oldDescription', {
      defaultMessage: 'Time spent performing old Garbage Collections.'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel,
    type: 'node'
  }),
  node_jvm_gc_young_count: new _classes2.ElasticsearchMetric({
    field: 'node_stats.jvm.gc.collectors.young.collection_count',
    title: nodeGcCount,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.gcCount.youngLabel', {
      defaultMessage: 'Young'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.gcCount.youngDescription', {
      defaultMessage: 'Number of young Garbage Collections.'
    }),
    derivative: true,
    format: _formatting.SMALL_FLOAT,
    metricAgg: 'max',
    units: '',
    type: 'node'
  }),
  node_jvm_gc_young_time: new _classes2.ElasticsearchMetric({
    field: 'node_stats.jvm.gc.collectors.young.collection_time_in_millis',
    title: nodeGcDuration,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.gcDuration.youngLabel', {
      defaultMessage: 'Young'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.gcDuration.youngDescription', {
      defaultMessage: 'Time spent performing young Garbage Collections.'
    }),
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel,
    type: 'node'
  }),
  node_jvm_mem_max_in_bytes: new _classes2.ElasticsearchMetric({
    field: 'node_stats.jvm.mem.heap_max_in_bytes',
    title: nodeJvmHeap,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.jvmHeap.maxHeapLabel', {
      defaultMessage: 'Max Heap'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.jvmHeap.maxHeapDescription', {
      defaultMessage: 'Total heap available to Elasticsearch running in the JVM.'
    }),
    type: 'node',
    format: _formatting.SMALL_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  node_jvm_mem_used_in_bytes: new _classes2.ElasticsearchMetric({
    field: 'node_stats.jvm.mem.heap_used_in_bytes',
    title: nodeJvmHeap,
    label: nodeUsedHeapLabel,
    description: nodeUsedHeapDescription,
    type: 'node',
    format: _formatting.SMALL_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  node_jvm_mem_percent: new _classes2.ElasticsearchMetric({
    field: 'node_stats.jvm.mem.heap_used_percent',
    title: nodeJvmHeap,
    label: nodeUsedHeapLabel,
    description: nodeUsedHeapDescription,
    type: 'node',
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: '%'
  }),
  node_load_average: new _classes2.ElasticsearchMetric({
    field: 'node_stats.os.cpu.load_average.1m',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.systemLoadTitle', {
      defaultMessage: 'System Load'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.systemLoad.last1MinuteLabel', {
      defaultMessage: '1m'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.systemLoad.last1MinuteDescription', {
      defaultMessage: 'Load average over the last minute.'
    }),
    type: 'node',
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  node_index_mem_overall: new _classes2.NodeIndexMemoryMetric({
    field: 'memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.luceneTotalLabel', {
      defaultMessage: 'Lucene Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.luceneTotalDescription', {
      defaultMessage: 'Total heap memory used by Lucene for current index. This is the sum of other fields for primary and replica shards on this node.'
    })
  }),
  node_index_mem_overall_1: new _classes2.NodeIndexMemoryMetric({
    field: 'memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryLucene1.lucenceTotalLabel', {
      defaultMessage: 'Lucene Total'
    }),
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryLucene1Title', {
      defaultMessage: 'Index Memory - Lucene 1'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryLucene1.lucenceTotalDescription', {
      defaultMessage: 'Total heap memory used by Lucene for current index. This is the sum of other fields for primary and replica shards on this node.'
    })
  }),
  node_index_mem_overall_2: new _classes2.NodeIndexMemoryMetric({
    field: 'memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryLucene2.lucenceTotalLabel', {
      defaultMessage: 'Lucene Total'
    }),
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryLucene2Title', {
      defaultMessage: 'Index Memory - Lucene 2'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryLucene2.lucenceTotalDescription', {
      defaultMessage: 'Total heap memory used by Lucene for current index. This is the sum of other fields for primary and replica shards on this node.'
    })
  }),
  node_index_mem_overall_3: new _classes2.NodeIndexMemoryMetric({
    field: 'memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryLucene3.lucenceTotalLabel', {
      defaultMessage: 'Lucene Total'
    }),
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryLucene3Title', {
      defaultMessage: 'Index Memory - Lucene 3'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryLucene3.lucenceTotalDescription', {
      defaultMessage: 'Total heap memory used by Lucene for current index. This is the sum of other fields for primary and replica shards on this node.'
    })
  }),
  node_index_mem_doc_values: new _classes2.NodeIndexMemoryMetric({
    field: 'doc_values_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.docValuesLabel', {
      defaultMessage: 'Doc Values'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.docValuesDescription', {
      defaultMessage: 'Heap memory used by Doc Values. This is a part of Lucene Total.'
    })
  }),
  // Note: This is not segment memory, unlike the rest of the SingleIndexMemoryMetrics
  node_index_mem_fielddata: new _classes2.IndexMemoryMetric({
    field: 'node_stats.indices.fielddata.memory_size_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.fielddataLabel', {
      defaultMessage: 'Fielddata'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.fielddataDescription', {
      defaultMessage: 'Heap memory used by Fielddata (e.g., global ordinals or explicitly enabled fielddata on text fields). ' + 'This is for the same shards, but not a part of Lucene Total.'
    }),
    type: 'node'
  }),
  node_index_mem_fixed_bit_set: new _classes2.NodeIndexMemoryMetric({
    field: 'fixed_bit_set_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.fixedBitsetsLabel', {
      defaultMessage: 'Fixed Bitsets'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.fixedBitsetsDescription', {
      defaultMessage: 'Heap memory used by Fixed Bit Sets (e.g., deeply nested documents). This is a part of Lucene Total.'
    })
  }),
  node_index_mem_norms: new _classes2.NodeIndexMemoryMetric({
    field: 'norms_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.normsLabel', {
      defaultMessage: 'Norms'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.normsDescription', {
      defaultMessage: 'Heap memory used by Norms (normalization factors for query-time, text scoring). This is a part of Lucene Total.'
    })
  }),
  node_index_mem_points: new _classes2.NodeIndexMemoryMetric({
    field: 'points_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.pointsLabel', {
      defaultMessage: 'Points'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.pointsDescription', {
      defaultMessage: 'Heap memory used by Points (e.g., numbers, IPs, and geo data). This is a part of Lucene Total.'
    })
  }),
  // Note: This is not segment memory, unlike SingleIndexMemoryMetrics
  node_index_mem_query_cache: new _classes2.IndexMemoryMetric({
    field: 'node_stats.indices.query_cache.memory_size_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryEs.queryCacheLabel', {
      defaultMessage: 'Query Cache'
    }),
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryEsTitle', {
      defaultMessage: 'Index Memory - {elasticsearch}',
      values: {
        elasticsearch: 'Elasticsearch'
      }
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexMemoryEs.queryCacheDescription', {
      defaultMessage: 'Heap memory used by Query Cache (e.g., cached filters). This is for the same shards, but not a part of Lucene Total.'
    }),
    type: 'node'
  }),
  // Note: This is not segment memory, unlike SingleIndexMemoryMetrics
  node_index_mem_request_cache: new _classes2.IndexMemoryMetric({
    field: 'node_stats.indices.request_cache.memory_size_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.requestCacheLabel', {
      defaultMessage: 'Request Cache'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.requestCacheDescription', {
      defaultMessage: 'Heap memory used by Request Cache (e.g., instant aggregations). This is for the same shards, but not a part of Lucene Total.'
    }),
    type: 'node'
  }),
  node_index_mem_stored_fields: new _classes2.NodeIndexMemoryMetric({
    field: 'stored_fields_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.storedFieldsLabel', {
      defaultMessage: 'Stored Fields'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.storedFieldsDescription', {
      defaultMessage: 'Heap memory used by Stored Fields (e.g., _source). This is a part of Lucene Total.'
    })
  }),
  node_index_mem_term_vectors: new _classes2.NodeIndexMemoryMetric({
    field: 'term_vectors_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.termVectorsLabel', {
      defaultMessage: 'Term Vectors'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.termVectorsDescription', {
      defaultMessage: 'Heap memory used by Term Vectors. This is a part of Lucene Total.'
    })
  }),
  node_index_mem_terms: new _classes2.NodeIndexMemoryMetric({
    field: 'terms_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.termsLabel', {
      defaultMessage: 'Terms'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.termsDescription', {
      defaultMessage: 'Heap memory used by Terms (e.g., text). This is a part of Lucene Total.'
    })
  }),
  node_index_mem_versions: new _classes2.NodeIndexMemoryMetric({
    field: 'version_map_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.versionMapLabel', {
      defaultMessage: 'Version Map'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.versionMapDescription', {
      defaultMessage: 'Heap memory used by Versioning (e.g., updates and deletes). This is NOT a part of Lucene Total.'
    })
  }),
  node_index_mem_writer: new _classes2.NodeIndexMemoryMetric({
    field: 'index_writer_memory_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexWriterLabel', {
      defaultMessage: 'Index Writer'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexWriterDescription', {
      defaultMessage: 'Heap memory used by the Index Writer. This is NOT a part of Lucene Total.'
    })
  }),
  node_index_threads_get_queue: new _classes2.ElasticsearchMetric({
    field: 'node_stats.thread_pool.get.queue',
    title: nodeReadThreads,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.readThreads.getQueueLabel', {
      defaultMessage: 'GET Queue'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.readThreads.getQueueDescription', {
      defaultMessage: 'Number of GET operations in the queue.'
    }),
    type: 'node',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: '',
    min: 0
  }),
  node_index_threads_get_rejected: new _classes2.ElasticsearchMetric({
    field: 'node_stats.thread_pool.get.rejected',
    title: nodeReadThreads,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.readThreads.getRejectionsLabel', {
      defaultMessage: 'GET Rejections'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.readThreads.getRejectionsDescription', {
      defaultMessage: 'Number of GET operations that have been rejected, which occurs when the queue is full.'
    }),
    type: 'node',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: '',
    min: 0
  }),
  node_index_threads_write_queue: new _classes2.WriteThreadPoolQueueMetric({
    title: nodeIndexingThreads,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingThreads.writeQueueLabel', {
      defaultMessage: 'Write Queue'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingThreads.writeQueueDescription', {
      defaultMessage: 'Number of index, bulk, and write operations in the queue. ' + 'The bulk threadpool was renamed to write in 6.3, and the index threadpool is deprecated.'
    })
  }),
  node_index_threads_write_rejected: new _classes2.WriteThreadPoolRejectedMetric({
    field: 'node_stats.thread_pool.bulk.rejected',
    title: nodeIndexingThreads,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingThreads.writeRejectionsLabel', {
      defaultMessage: 'Write Rejections'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingThreads.writeRejectionsDescription', {
      defaultMessage: 'Number of index, bulk, and write operations that have been rejected, which occurs when the queue is full. ' + 'The bulk threadpool was renamed to write in 6.3, and the index threadpool is deprecated.'
    })
  }),
  node_index_threads_search_queue: new _classes2.ElasticsearchMetric({
    field: 'node_stats.thread_pool.search.queue',
    title: nodeReadThreads,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.readThreads.searchQueueLabel', {
      defaultMessage: 'Search Queue'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.readThreads.searchQueueDescription', {
      defaultMessage: 'Number of search operations in the queue (e.g., shard level searches).'
    }),
    type: 'node',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: '',
    min: 0
  }),
  node_index_threads_search_rejected: new _classes2.ElasticsearchMetric({
    field: 'node_stats.thread_pool.search.rejected',
    title: nodeReadThreads,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingThreads.searchRejectionsLabel', {
      defaultMessage: 'Search Rejections'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingThreads.searchRejectionsDescription', {
      defaultMessage: 'Number of search operations that have been rejected, which occurs when the queue is full.'
    }),
    type: 'node',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: '',
    min: 0
  }),
  node_index_total: new _classes2.ElasticsearchMetric({
    field: 'node_stats.indices.indexing.index_total',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.requestRateTitle', {
      defaultMessage: 'Request Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.requestRate.indexingTotalLabel', {
      defaultMessage: 'Indexing Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.requestRate.indexingTotalDescription', {
      defaultMessage: 'Amount of indexing operations.'
    }),
    type: 'node',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  node_index_time: new _classes2.ElasticsearchMetric({
    field: 'node_stats.indices.indexing.index_time_in_millis',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingTimeTitle', {
      defaultMessage: 'Indexing Time'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingTime.indexTimeLabel', {
      defaultMessage: 'Index Time'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingTime.indexTimeDescription', {
      defaultMessage: 'Amount of time spent on indexing operations.'
    }),
    type: 'node',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel
  }),
  node_free_space: new _classes2.ElasticsearchMetric({
    field: 'node_stats.fs.total.available_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.diskFreeSpaceLabel', {
      defaultMessage: 'Disk Free Space'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.diskFreeSpaceDescription', {
      defaultMessage: 'Free disk space available on the node.'
    }),
    type: 'node',
    format: _formatting.SMALL_BYTES,
    metricAgg: 'max',
    units: ''
  }),
  node_search_total: new _classes2.ElasticsearchMetric({
    field: 'node_stats.indices.search.query_total',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.requestRateTitle', {
      defaultMessage: 'Request Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.requestRate.searchTotalLabel', {
      defaultMessage: 'Search Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.requestRate.searchTotalDescription', {
      defaultMessage: 'Amount of search operations (per shard).'
    }),
    type: 'node',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  node_threads_queued_bulk: new _classes2.ThreadPoolQueueMetric({
    field: 'node_stats.thread_pool.bulk.queue',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.bulkLabel', {
      defaultMessage: 'Bulk'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.bulkDescription', {
      defaultMessage: 'Number of bulk indexing operations waiting to be processed on this node. A single bulk request can create multiple bulk operations.'
    })
  }),
  node_threads_queued_generic: new _classes2.ThreadPoolQueueMetric({
    field: 'node_stats.thread_pool.generic.queue',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.genericLabel', {
      defaultMessage: 'Generic'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.genericDescription', {
      defaultMessage: 'Number of generic (internal) operations waiting to be processed on this node.'
    })
  }),
  node_threads_queued_get: new _classes2.ThreadPoolQueueMetric({
    field: 'node_stats.thread_pool.get.queue',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadQueueTitle', {
      defaultMessage: 'Thread Queue'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadQueue.getLabel', {
      defaultMessage: 'Get'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadQueue.getDescription', {
      defaultMessage: 'Number of get operations waiting to be processed on this node.'
    })
  }),
  node_threads_queued_index: new _classes2.ThreadPoolQueueMetric({
    field: 'node_stats.thread_pool.index.queue',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.indexLabel', {
      defaultMessage: 'Index'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.indexDescription', {
      defaultMessage: 'Number of non-bulk, index operations waiting to be processed on this node.'
    })
  }),
  node_threads_queued_management: new _classes2.ThreadPoolQueueMetric({
    field: 'node_stats.thread_pool.management.queue',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.managementLabel', {
      defaultMessage: 'Management'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.managementDescription', {
      defaultMessage: 'Number of management (internal) operations waiting to be processed on this node.'
    })
  }),
  node_threads_queued_search: new _classes2.ThreadPoolQueueMetric({
    field: 'node_stats.thread_pool.search.queue',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.searchLabel', {
      defaultMessage: 'Search'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.searchDescription', {
      defaultMessage: 'Number of search operations waiting to be processed on this node. A single search request can create multiple search operations.'
    })
  }),
  node_threads_queued_watcher: new _classes2.ThreadPoolQueueMetric({
    field: 'node_stats.thread_pool.watcher.queue',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.watcherLabel', {
      defaultMessage: 'Watcher'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsQueued.watcherDescription', {
      defaultMessage: 'Number of Watcher operations waiting to be processed on this node.'
    })
  }),
  node_threads_rejected_bulk: new _classes2.ThreadPoolRejectedMetric({
    field: 'node_stats.thread_pool.bulk.rejected',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.bulkLabel', {
      defaultMessage: 'Bulk'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.bulkDescription', {
      defaultMessage: 'Bulk rejections. These occur when the queue is full.'
    })
  }),
  node_threads_rejected_generic: new _classes2.ThreadPoolRejectedMetric({
    field: 'node_stats.thread_pool.generic.rejected',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.genericLabel', {
      defaultMessage: 'Generic'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.genericDescription', {
      defaultMessage: 'Generic (internal) rejections. These occur when the queue is full.'
    })
  }),
  node_threads_rejected_get: new _classes2.ThreadPoolRejectedMetric({
    field: 'node_stats.thread_pool.get.rejected',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.getLabel', {
      defaultMessage: 'Get'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.getDescription', {
      defaultMessage: 'Get rejections. These occur when the queue is full.'
    })
  }),
  node_threads_rejected_index: new _classes2.ThreadPoolRejectedMetric({
    field: 'node_stats.thread_pool.index.rejected',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.indexLabel', {
      defaultMessage: 'Index'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.indexDescription', {
      defaultMessage: 'Index rejections. These occur when the queue is full. You should look at bulk indexing.'
    })
  }),
  node_threads_rejected_management: new _classes2.ThreadPoolRejectedMetric({
    field: 'node_stats.thread_pool.management.rejected',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.managementLabel', {
      defaultMessage: 'Management'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.managementDescription', {
      defaultMessage: 'Get (internal) rejections. These occur when the queue is full.'
    })
  }),
  node_threads_rejected_search: new _classes2.ThreadPoolRejectedMetric({
    field: 'node_stats.thread_pool.search.rejected',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.searchLabel', {
      defaultMessage: 'Search'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.searchDescription', {
      defaultMessage: 'Search rejections. These occur when the queue is full. This can indicate over-sharding.'
    })
  }),
  node_threads_rejected_watcher: new _classes2.ThreadPoolRejectedMetric({
    field: 'node_stats.thread_pool.watcher.rejected',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.watcherLabel', {
      defaultMessage: 'Watcher'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.threadsRejected.watcherDescription', {
      defaultMessage: 'Watch rejections. These occur when the queue is full. This can indicate stuck-Watches.'
    })
  }),
  node_throttle_index_time: new _classes2.ElasticsearchMetric({
    field: 'node_stats.indices.indexing.throttle_time_in_millis',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingTimeTitle', {
      defaultMessage: 'Indexing Time'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingTime.indexThrottlingTimeLabel', {
      defaultMessage: 'Index Throttling Time'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexingTime.indexThrottlingTimeDescription', {
      defaultMessage: 'Amount of time spent with index throttling, which indicates slow disks on a node.'
    }),
    type: 'node',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel,
    min: 0
  }),
  index_throttle_time: new _classes2.ElasticsearchMetric({
    field: 'index_stats.primaries.indexing.throttle_time_in_millis',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexThrottlingTimeLabel', {
      defaultMessage: 'Index Throttling Time'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.indexThrottlingTimeDescription', {
      defaultMessage: 'Amount of time spent with index throttling, which indicates slow merging.'
    }),
    type: 'index',
    derivative: true,
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel
  }),
  index_document_count: new _classes2.ElasticsearchMetric({
    field: 'index_stats.primaries.docs.count',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.documentCountLabel', {
      defaultMessage: 'Document Count'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.documentCountDescription', {
      defaultMessage: 'Total number of documents, only including primary shards.'
    }),
    type: 'index',
    format: _formatting.LARGE_ABBREVIATED,
    metricAgg: 'max',
    units: ''
  }),
  index_search_request_rate: new _classes2.RequestRateMetric({
    field: 'index_stats.total.search.query_total',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.searchRateTitle', {
      defaultMessage: 'Search Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.searchRate.totalShardsLabel', {
      defaultMessage: 'Total Shards'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.searchRate.totalShardsDescription', {
      defaultMessage: 'Number of search requests being executed across primary and replica shards. A single search can run against multiple shards!'
    }),
    type: 'index'
  }),
  index_merge_rate: new _classes2.RequestRateMetric({
    field: 'index_stats.total.merges.total_size_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.mergeRateLabel', {
      defaultMessage: 'Merge Rate'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.mergeRateDescription', {
      defaultMessage: 'Amount in bytes of merged segments. Larger numbers indicate heavier disk activity.'
    }),
    type: 'index'
  }),
  index_refresh_time: new _classes2.ElasticsearchMetric({
    field: 'index_stats.total.refresh.total_time_in_millis',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.totalRefreshTimeLabel', {
      defaultMessage: 'Total Refresh Time'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esNode.totalRefreshTimeDescription', {
      defaultMessage: 'Time spent on Elasticsearch refresh for primary and replica shards.'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: '',
    type: 'index',
    derivative: true
  }),
  // CCR
  ccr_sync_lag_time: new _classes2.MillisecondsToSecondsMetric({
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esCcr.fetchDelayTitle', {
      defaultMessage: 'Fetch delay' // title to use for the chart

    }),
    type: 'ccr',
    field: 'ccr_stats.time_since_last_read_millis',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esCcr.fetchDelayLabel', {
      defaultMessage: 'Fetch delay'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esCcr.fetchDelayDescription', {
      defaultMessage: 'The amount of time the follower index is lagging behind the leader.'
    }),
    format: _formatting.SMALL_FLOAT,
    metricAgg: 'max',
    units: msTimeUnitLabel
  }),
  ccr_sync_lag_ops: new _classes2.DifferenceMetric({
    title: _i18n.i18n.translate('xpack.monitoring.metrics.esCcr.opsDelayTitle', {
      defaultMessage: 'Ops delay' // title to use for the chart

    }),
    type: 'ccr',
    fieldSource: 'ccr_stats',
    metric: 'leader_max_seq_no',
    metric2: 'follower_global_checkpoint',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.esCcr.opsDelayLabel', {
      defaultMessage: 'Ops delay'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.esCcr.opsDelayDescription', {
      defaultMessage: 'The number of operations the follower index is lagging behind the leader.'
    }),
    format: _formatting.SMALL_FLOAT,
    metricAgg: 'max',
    units: ''
  })
};
exports.metrics = metrics;