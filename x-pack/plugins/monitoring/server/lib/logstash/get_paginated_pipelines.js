"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPaginatedPipelines = getPaginatedPipelines;

var _lodash = require("lodash");

var _filter = require("../pagination/filter");

var _get_pipeline_ids = require("./get_pipeline_ids");

var _sort_pipelines = require("./sort_pipelines");

var _paginate = require("../pagination/paginate");

var _get_metrics = require("../details/get_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This function performs an optimization around the pipeline listing tables in the UI. To avoid
 * query performances in Elasticsearch (mainly thinking of `search.max_buckets` overflows), we do
 * not want to fetch all time-series data for all pipelines. Instead, we only want to fetch the
 * time-series data for the pipelines visible in the listing table. This function accepts
 * pagination/sorting/filtering data to determine which pipelines will be visible in the table
 * and returns that so the caller can perform their normal call to get the time-series data.
 *
 * @param {*} req - Server request object
 * @param {*} lsIndexPattern - The index pattern to search against (`.monitoring-logstash-*`)
 * @param {*} uuids - The optional `clusterUuid` and `logstashUuid` to filter the results from
 * @param {*} metricSet - The array of metrics that are sortable in the UI
 * @param {*} pagination - ({ index, size })
 * @param {*} sort - ({ field, direction })
 * @param {*} queryText - Text that will be used to filter out pipelines
 */


async function getPaginatedPipelines(req, lsIndexPattern, {
  clusterUuid,
  logstashUuid
}, {
  throughputMetric,
  nodesCountMetric
}, pagination, sort = {
  field: null
}, queryText) {
  const sortField = sort.field;
  const config = req.server.config();
  const size = config.get('monitoring.ui.max_bucket_size');
  const pipelines = await (0, _get_pipeline_ids.getLogstashPipelineIds)(req, lsIndexPattern, {
    clusterUuid,
    logstashUuid
  }, size);

  if (sortField === throughputMetric) {
    await getPaginatedThroughputData(pipelines, req, lsIndexPattern, throughputMetric);
  } else if (sortField === nodesCountMetric) {
    await getPaginatedNodesData(pipelines, req, lsIndexPattern, nodesCountMetric);
  } // Filtering


  const filteredPipelines = (0, _filter.filter)(pipelines, queryText, ['id']); // We only support filtering by id right now
  // Sorting

  const sortedPipelines = (0, _sort_pipelines.sortPipelines)(filteredPipelines, sort); // Pagination

  const pageOfPipelines = (0, _paginate.paginate)(pagination, sortedPipelines);
  const response = {
    pipelines: await getPipelines(req, lsIndexPattern, pageOfPipelines, throughputMetric, nodesCountMetric),
    totalPipelineCount: filteredPipelines.length
  };
  return processPipelinesAPIResponse(response, throughputMetric, nodesCountMetric);
}

function processPipelinesAPIResponse(response, throughputMetricKey, nodesCountMetricKey) {
  // Clone to avoid mutating original response
  const processedResponse = (0, _lodash.cloneDeep)(response); // Normalize metric names for shared component code
  // Calculate latest throughput and node count for each pipeline

  processedResponse.pipelines.forEach(pipeline => {
    pipeline.metrics = {
      throughput: pipeline.metrics[throughputMetricKey],
      nodesCount: pipeline.metrics[nodesCountMetricKey]
    };
    pipeline.latestThroughput = ((0, _lodash.last)(pipeline.metrics.throughput.data) || [])[1];
    pipeline.latestNodesCount = ((0, _lodash.last)(pipeline.metrics.nodesCount.data) || [])[1];
  });
  return processedResponse;
}

async function getPaginatedThroughputData(pipelines, req, lsIndexPattern, throughputMetric) {
  const metricSeriesData = Object.values(await Promise.all(pipelines.map(pipeline => {
    return new Promise(async resolve => {
      const data = await (0, _get_metrics.getMetrics)(req, lsIndexPattern, [throughputMetric], [], {
        pipeline
      }, 2);
      resolve(reduceData(pipeline, data));
    });
  })));

  for (const pipelineAggregationData of metricSeriesData) {
    for (const pipeline of pipelines) {
      if (pipelineAggregationData.id === pipeline.id) {
        const dataSeries = (0, _lodash.get)(pipelineAggregationData, `metrics.${throughputMetric}.data`, [[]]);

        if (dataSeries.length === 0) {
          continue;
        }

        pipeline[throughputMetric] = dataSeries.pop()[1];
      }
    }
  }
}

async function getPaginatedNodesData(pipelines, req, lsIndexPattern, nodesCountMetric) {
  const metricSeriesData = await (0, _get_metrics.getMetrics)(req, lsIndexPattern, [nodesCountMetric], [], {
    pageOfPipelines: pipelines
  }, 2);
  const {
    data
  } = metricSeriesData[nodesCountMetric][0] || [[]];
  const pipelinesMap = (data.pop() || [])[1] || {};

  if (!Object.keys(pipelinesMap).length) {
    return;
  }

  pipelines.forEach(pipeline => void (pipeline[nodesCountMetric] = pipelinesMap[pipeline.id]));
}

async function getPipelines(req, lsIndexPattern, pipelines, throughputMetric, nodesCountMetric) {
  const throughputPipelines = await getThroughputPipelines(req, lsIndexPattern, pipelines, throughputMetric);
  const nodePipelines = await getNodePipelines(req, lsIndexPattern, pipelines, nodesCountMetric);
  const finalPipelines = pipelines.map(({
    id
  }) => {
    const pipeline = {
      id,
      metrics: {
        [throughputMetric]: throughputPipelines.find(p => p.id === id).metrics[throughputMetric],
        [nodesCountMetric]: nodePipelines.find(p => p.id === id).metrics[nodesCountMetric]
      }
    };
    return pipeline;
  });
  return finalPipelines;
}

async function getThroughputPipelines(req, lsIndexPattern, pipelines, throughputMetric) {
  const metricsResponse = await Promise.all(pipelines.map(pipeline => {
    return new Promise(async resolve => {
      const data = await (0, _get_metrics.getMetrics)(req, lsIndexPattern, [throughputMetric], [], {
        pipeline
      });
      resolve(reduceData(pipeline, data));
    });
  }));
  return Object.values(metricsResponse);
}

async function getNodePipelines(req, lsIndexPattern, pipelines, nodesCountMetric) {
  const metricData = await (0, _get_metrics.getMetrics)(req, lsIndexPattern, [nodesCountMetric], [], {
    pageOfPipelines: pipelines
  });
  const metricObject = metricData[nodesCountMetric][0];
  const pipelinesData = pipelines.map(({
    id
  }) => {
    return {
      id,
      metrics: {
        [nodesCountMetric]: { ...metricObject,
          data: metricObject.data.map(([timestamp, valueMap]) => [timestamp, valueMap[id]])
        }
      }
    };
  });
  return pipelinesData;
}

function reduceData({
  id
}, data) {
  return {
    id,
    metrics: Object.keys(data).reduce((accum, metricName) => {
      accum[metricName] = data[metricName][0];
      return accum;
    }, {})
  };
}