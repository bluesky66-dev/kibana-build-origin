"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildDataTelemetryPayload = buildDataTelemetryPayload;
exports.getDataTelemetry = getDataTelemetry;

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function findMatchingDescriptors({
  name,
  shipper,
  packageName,
  managedBy,
  dataStreamDataset,
  dataStreamType
}) {
  // If we already have the data from the indices' mappings...
  if ([shipper, packageName].some(Boolean) || managedBy === 'ingest-manager' && [dataStreamType, dataStreamDataset].some(Boolean)) {
    return [{ ...(shipper && {
        shipper
      }),
      ...(packageName && {
        packageName
      }),
      ...(dataStreamDataset && {
        dataStreamDataset
      }),
      ...(dataStreamType && {
        dataStreamType
      })
    } // Using casting here because TS doesn't infer at least one exists from the if clause
    ];
  } // Otherwise, try with the list of known index patterns


  return _constants.DATA_DATASETS_INDEX_PATTERNS_UNIQUE.filter(({
    pattern
  }) => {
    if (!pattern.startsWith('.') && name.startsWith('.')) {
      // avoid system indices caught by very fuzzy index patterns (i.e.: *log* would catch `.kibana-log-...`)
      return false;
    }

    return new RegExp(`^${pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`).test(name);
  });
}

function increaseCounters(previousValue = {
  index_count: 0
}, {
  isECS,
  docCount,
  sizeInBytes
}) {
  return { ...previousValue,
    index_count: previousValue.index_count + 1,
    ...(typeof isECS === 'boolean' ? {
      ecs_index_count: (previousValue.ecs_index_count || 0) + (isECS ? 1 : 0)
    } : {}),
    ...(typeof docCount === 'number' ? {
      doc_count: (previousValue.doc_count || 0) + docCount
    } : {}),
    ...(typeof sizeInBytes === 'number' ? {
      size_in_bytes: (previousValue.size_in_bytes || 0) + sizeInBytes
    } : {})
  };
}

function buildDataTelemetryPayload(indices) {
  const startingDotPatternsUntilTheFirstAsterisk = _constants.DATA_DATASETS_INDEX_PATTERNS_UNIQUE.map(({
    pattern
  }) => pattern.replace(/^\.(.+)\*.*$/g, '.$1')).filter(Boolean); // Filter out the system indices unless they are required by the patterns


  const indexCandidates = indices.filter(({
    name
  }) => !(name.startsWith('.') && !name.startsWith('.ds-') && // data_stream-related indices can be included
  !startingDotPatternsUntilTheFirstAsterisk.find(pattern => name.startsWith(pattern))));
  const acc = new Map();

  for (const indexCandidate of indexCandidates) {
    const matchingDescriptors = findMatchingDescriptors(indexCandidate);

    for (const {
      dataStreamDataset,
      dataStreamType,
      packageName,
      shipper,
      patternName
    } of matchingDescriptors) {
      const key = `${dataStreamDataset}-${dataStreamType}-${packageName}-${shipper}-${patternName}`;
      acc.set(key, { ...((dataStreamDataset || dataStreamType) && {
          data_stream: {
            dataset: dataStreamDataset,
            type: dataStreamType
          }
        }),
        ...(packageName && {
          package: {
            name: packageName
          }
        }),
        ...(shipper && {
          shipper
        }),
        ...(patternName && {
          pattern_name: patternName
        }),
        ...increaseCounters(acc.get(key), indexCandidate)
      });
    }
  }

  return [...acc.values()];
}

async function getDataTelemetry(esClient) {
  try {
    const index = [..._constants.DATA_DATASETS_INDEX_PATTERNS_UNIQUE.map(({
      pattern
    }) => pattern), '*-*-*' // Include data-streams aliases `{type}-{dataset}-{namespace}`
    ];
    const indexMappingsParams = {
      // GET */_mapping?filter_path=*.mappings._meta.beat,*.mappings.properties.ecs.properties.version.type,*.mappings.properties.dataset.properties.type.value,*.mappings.properties.dataset.properties.name.value
      index: '*',
      // Request all indices because filter_path already filters out the indices without any of those fields
      filter_path: [// _meta.beat tells the shipper
      '*.mappings._meta.beat', // _meta.package.name tells the Ingest Manager's package
      '*.mappings._meta.package.name', // _meta.managed_by is usually populated by Ingest Manager for the UI to identify it
      '*.mappings._meta.managed_by', // Does it have `ecs.version` in the mappings? => It follows the ECS conventions
      '*.mappings.properties.ecs.properties.version.type', // If `data_stream.type` is a `constant_keyword`, it can be reported as a type
      '*.mappings.properties.data_stream.properties.type.value', // If `data_stream.dataset` is a `constant_keyword`, it can be reported as the dataset
      '*.mappings.properties.data_stream.properties.dataset.value']
    };
    const indicesStatsParams = {
      // GET <index>/_stats/docs,store?level=indices&filter_path=indices.*.total
      index,
      level: 'indices',
      metric: ['docs', 'store'],
      filter_path: ['indices.*.total']
    };
    const [{
      body: indexMappings
    }, {
      body: indexStats
    }] = await Promise.all([esClient.indices.getMapping(indexMappingsParams), esClient.indices.stats(indicesStatsParams)]);
    const indexNames = Object.keys({ ...indexMappings,
      ...(indexStats === null || indexStats === void 0 ? void 0 : indexStats.indices)
    });
    const indices = indexNames.map(name => {
      var _indexMappings$name, _indexMappings$name$m, _indexMappings$name$m2, _indexMappings$name$m3, _indexMappings$name2, _indexMappings$name2$, _indexMappings$name2$2, _indexMappings$name3, _indexMappings$name3$, _indexMappings$name3$2, _indexMappings$name3$3, _indexMappings$name4, _indexMappings$name4$, _indexMappings$name4$2, _indexMappings$name5, _indexMappings$name5$, _indexMappings$name5$2, _indexMappings$name5$3, _indexMappings$name6, _indexMappings$name6$, _indexMappings$name6$2, _indexMappings$name6$3;

      const baseIndexInfo = {
        name,
        isECS: !!((_indexMappings$name = indexMappings[name]) !== null && _indexMappings$name !== void 0 && (_indexMappings$name$m = _indexMappings$name.mappings) !== null && _indexMappings$name$m !== void 0 && (_indexMappings$name$m2 = _indexMappings$name$m.properties.ecs) !== null && _indexMappings$name$m2 !== void 0 && (_indexMappings$name$m3 = _indexMappings$name$m2.properties.version) !== null && _indexMappings$name$m3 !== void 0 && _indexMappings$name$m3.type),
        shipper: (_indexMappings$name2 = indexMappings[name]) === null || _indexMappings$name2 === void 0 ? void 0 : (_indexMappings$name2$ = _indexMappings$name2.mappings) === null || _indexMappings$name2$ === void 0 ? void 0 : (_indexMappings$name2$2 = _indexMappings$name2$._meta) === null || _indexMappings$name2$2 === void 0 ? void 0 : _indexMappings$name2$2.beat,
        packageName: (_indexMappings$name3 = indexMappings[name]) === null || _indexMappings$name3 === void 0 ? void 0 : (_indexMappings$name3$ = _indexMappings$name3.mappings) === null || _indexMappings$name3$ === void 0 ? void 0 : (_indexMappings$name3$2 = _indexMappings$name3$._meta) === null || _indexMappings$name3$2 === void 0 ? void 0 : (_indexMappings$name3$3 = _indexMappings$name3$2.package) === null || _indexMappings$name3$3 === void 0 ? void 0 : _indexMappings$name3$3.name,
        managedBy: (_indexMappings$name4 = indexMappings[name]) === null || _indexMappings$name4 === void 0 ? void 0 : (_indexMappings$name4$ = _indexMappings$name4.mappings) === null || _indexMappings$name4$ === void 0 ? void 0 : (_indexMappings$name4$2 = _indexMappings$name4$._meta) === null || _indexMappings$name4$2 === void 0 ? void 0 : _indexMappings$name4$2.managed_by,
        dataStreamDataset: (_indexMappings$name5 = indexMappings[name]) === null || _indexMappings$name5 === void 0 ? void 0 : (_indexMappings$name5$ = _indexMappings$name5.mappings) === null || _indexMappings$name5$ === void 0 ? void 0 : (_indexMappings$name5$2 = _indexMappings$name5$.properties.data_stream) === null || _indexMappings$name5$2 === void 0 ? void 0 : (_indexMappings$name5$3 = _indexMappings$name5$2.properties.dataset) === null || _indexMappings$name5$3 === void 0 ? void 0 : _indexMappings$name5$3.value,
        dataStreamType: (_indexMappings$name6 = indexMappings[name]) === null || _indexMappings$name6 === void 0 ? void 0 : (_indexMappings$name6$ = _indexMappings$name6.mappings) === null || _indexMappings$name6$ === void 0 ? void 0 : (_indexMappings$name6$2 = _indexMappings$name6$.properties.data_stream) === null || _indexMappings$name6$2 === void 0 ? void 0 : (_indexMappings$name6$3 = _indexMappings$name6$2.properties.type) === null || _indexMappings$name6$3 === void 0 ? void 0 : _indexMappings$name6$3.value
      };
      const stats = ((indexStats === null || indexStats === void 0 ? void 0 : indexStats.indices) || {})[name];

      if (stats) {
        var _stats$total, _stats$total$docs, _stats$total2, _stats$total2$store;

        return { ...baseIndexInfo,
          docCount: (_stats$total = stats.total) === null || _stats$total === void 0 ? void 0 : (_stats$total$docs = _stats$total.docs) === null || _stats$total$docs === void 0 ? void 0 : _stats$total$docs.count,
          sizeInBytes: (_stats$total2 = stats.total) === null || _stats$total2 === void 0 ? void 0 : (_stats$total2$store = _stats$total2.store) === null || _stats$total2$store === void 0 ? void 0 : _stats$total2$store.size_in_bytes
        };
      }

      return baseIndexInfo;
    });
    return buildDataTelemetryPayload(indices);
  } catch (e) {
    return [];
  }
}