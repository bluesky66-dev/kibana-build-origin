"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupResourceNodes = groupResourceNodes;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _service_map = require("../../../common/service_map");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MINIMUM_GROUP_SIZE = 4;

function groupResourceNodes(responseData) {
  const isEdge = el => Boolean(el.data.source && el.data.target);

  const isNode = el => !isEdge(el);

  const isElligibleGroupNode = el => {
    if (isNode(el) && 'span.type' in el.data) {
      return (0, _service_map.isSpanGroupingSupported)(el.data[_elasticsearch_fieldnames.SPAN_TYPE], el.data[_elasticsearch_fieldnames.SPAN_SUBTYPE]);
    }

    return false;
  };

  const nodes = responseData.elements.filter(isNode);
  const edges = responseData.elements.filter(isEdge); // create adjacency list by targets

  const groupNodeCandidates = responseData.elements.filter(isElligibleGroupNode).map(({
    data: {
      id
    }
  }) => id);
  const adjacencyListByTargetMap = new Map();
  edges.forEach(({
    data: {
      source,
      target
    }
  }) => {
    if (groupNodeCandidates.includes(target)) {
      const sources = adjacencyListByTargetMap.get(target);

      if (sources) {
        sources.push(source);
      } else {
        adjacencyListByTargetMap.set(target, [source]);
      }
    }
  });
  const adjacencyListByTarget = [...adjacencyListByTargetMap.entries()].map(([target, sources]) => ({
    target,
    sources,
    groupId: `resourceGroup{${sources.sort().join(';')}}`
  })); // group by members

  const nodeGroupsById = (0, _lodash.groupBy)(adjacencyListByTarget, 'groupId');
  const nodeGroups = Object.keys(nodeGroupsById).map(id => ({
    id,
    sources: nodeGroupsById[id][0].sources,
    targets: nodeGroupsById[id].map(({
      target
    }) => target)
  })).filter(({
    targets
  }) => targets.length > MINIMUM_GROUP_SIZE - 1);
  const ungroupedEdges = [...edges];
  const ungroupedNodes = [...nodes];
  nodeGroups.forEach(({
    sources,
    targets
  }) => {
    targets.forEach(target => {
      // removes grouped nodes from original node set:
      const groupedNodeIndex = ungroupedNodes.findIndex(({
        data
      }) => data.id === target);
      ungroupedNodes.splice(groupedNodeIndex, 1);
      sources.forEach(source => {
        // removes edges of grouped nodes from original edge set:
        const groupedEdgeIndex = ungroupedEdges.findIndex(({
          data
        }) => data.source === source && data.target === target);
        ungroupedEdges.splice(groupedEdgeIndex, 1);
      });
    });
  }); // add in a composite node for each new group

  const groupedNodes = nodeGroups.map(({
    id,
    targets
  }) => ({
    data: {
      id,
      'span.type': 'external',
      label: _i18n.i18n.translate('xpack.apm.serviceMap.resourceCountLabel', {
        defaultMessage: '{count} resources',
        values: {
          count: targets.length
        }
      }),
      groupedConnections: targets.map(targetId => {
        const targetElement = nodes.find(element => element.data.id === targetId);

        if (!targetElement) {
          return;
        }

        const {
          data
        } = targetElement;
        return {
          label: data.label || data.id,
          ...data
        };
      }).filter(node => !!node)
    }
  })); // add new edges from source to new groups

  const groupedEdges = [];
  nodeGroups.forEach(({
    id,
    sources
  }) => {
    sources.forEach(source => {
      groupedEdges.push({
        data: {
          id: `${source}~>${id}`,
          source,
          target: id
        }
      });
    });
  });
  return {
    elements: [...ungroupedNodes, ...groupedNodes, ...ungroupedEdges, ...groupedEdges]
  };
}