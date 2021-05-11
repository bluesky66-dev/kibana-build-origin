"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deserializeCluster = deserializeCluster;
exports.serializeCluster = serializeCluster;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function deserializeCluster(name, esClusterObject, deprecatedProxyAddress, isCloudEnabled) {
  if (!name || !esClusterObject || typeof esClusterObject !== 'object') {
    throw new Error('Unable to deserialize cluster');
  }

  const {
    seeds,
    mode,
    connected: isConnected,
    num_nodes_connected: connectedNodesCount,
    max_connections_per_cluster: maxConnectionsPerCluster,
    initial_connect_timeout: initialConnectTimeout,
    skip_unavailable: skipUnavailable,
    transport,
    proxy_address: proxyAddress,
    max_proxy_socket_connections: proxySocketConnections,
    num_proxy_sockets_connected: connectedSocketsCount,
    server_name: serverName
  } = esClusterObject;
  let deserializedClusterObject = {
    name,
    mode,
    isConnected,
    connectedNodesCount,
    maxConnectionsPerCluster,
    initialConnectTimeout,
    skipUnavailable,
    seeds,
    proxyAddress,
    proxySocketConnections,
    connectedSocketsCount,
    serverName
  };

  if (transport) {
    const {
      ping_schedule: transportPingSchedule,
      compress: transportCompress
    } = transport;
    deserializedClusterObject = { ...deserializedClusterObject,
      transportPingSchedule,
      transportCompress
    };
  } // If a user has a remote cluster with the deprecated proxy setting,
  // we transform the data to support the new implementation and also flag the deprecation


  if (deprecatedProxyAddress) {
    // Cloud-specific logic: Create default server name, since field doesn't exist in deprecated implementation
    const defaultServerName = deprecatedProxyAddress.split(':')[0];
    deserializedClusterObject = { ...deserializedClusterObject,
      proxyAddress: deprecatedProxyAddress,
      seeds: undefined,
      hasDeprecatedProxySetting: true,
      mode: _constants.PROXY_MODE,
      serverName: isCloudEnabled ? defaultServerName : undefined
    };
  } // It's unnecessary to send undefined values back to the client, so we can remove them.


  Object.keys(deserializedClusterObject).forEach(key => {
    if (deserializedClusterObject[key] === undefined) {
      delete deserializedClusterObject[key];
    }
  });
  return deserializedClusterObject;
}

function serializeCluster(deserializedClusterObject) {
  if (!deserializedClusterObject || typeof deserializedClusterObject !== 'object') {
    throw new Error('Unable to serialize cluster');
  }

  const {
    name,
    seeds,
    skipUnavailable,
    mode,
    nodeConnections,
    proxyAddress,
    proxySocketConnections,
    serverName,
    hasDeprecatedProxySetting
  } = deserializedClusterObject;
  const clusterData = {
    skip_unavailable: typeof skipUnavailable === 'boolean' ? skipUnavailable : null,
    mode: mode || null,
    proxy_address: proxyAddress || null,
    proxy_socket_connections: proxySocketConnections || null,
    server_name: serverName || null,
    seeds: seeds || null,
    node_connections: nodeConnections || null
  }; // This is only applicable in edit mode
  // In order to "upgrade" an existing remote cluster to use the new proxy mode settings, we need to set the old proxy setting to null

  if (hasDeprecatedProxySetting) {
    clusterData.proxy = null;
  }

  return {
    // Background on why we only save as persistent settings detailed here: https://github.com/elastic/kibana/pull/26067#issuecomment-441848124
    persistent: {
      cluster: {
        remote: {
          [name]: clusterData
        }
      }
    }
  };
}