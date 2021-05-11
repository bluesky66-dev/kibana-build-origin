"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllowedListForPrefix = exports.AWS_METRICS_ALLOWED_LIST = exports.AWS_S3_ALLOWED_LIST = exports.DOCKER_ALLOWED_LIST = exports.PROMETHEUS_ALLOWED_LIST = exports.K8S_ALLOWED_LIST = exports.ECS_ALLOWED_LIST = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ECS_ALLOWED_LIST = ['host', 'cloud', 'event', 'agent', 'fields', 'service', 'ecs', 'metricset', 'tags', 'message', 'labels', '@timestamp', 'source', 'container'];
exports.ECS_ALLOWED_LIST = ECS_ALLOWED_LIST;
const K8S_ALLOWED_LIST = ['kubernetes.pod.name', 'kubernetes.pod.uid', 'kubernetes.namespace', 'kubernetes.node.name', 'kubernetes.labels', 'kubernetes.annotations', 'kubernetes.replicaset.name', 'kubernetes.deployment.name', 'kubernetes.statefulset.name', 'kubernetes.container.name', 'kubernetes.container.image'];
exports.K8S_ALLOWED_LIST = K8S_ALLOWED_LIST;
const PROMETHEUS_ALLOWED_LIST = ['prometheus.labels', 'prometheus.metrics'];
exports.PROMETHEUS_ALLOWED_LIST = PROMETHEUS_ALLOWED_LIST;
const DOCKER_ALLOWED_LIST = ['docker.container.id', 'docker.container.image', 'docker.container.name', 'docker.container.labels'];
exports.DOCKER_ALLOWED_LIST = DOCKER_ALLOWED_LIST;
const AWS_S3_ALLOWED_LIST = ['aws.s3'];
exports.AWS_S3_ALLOWED_LIST = AWS_S3_ALLOWED_LIST;
const AWS_METRICS_ALLOWED_LIST = ['aws.dimensions'];
exports.AWS_METRICS_ALLOWED_LIST = AWS_METRICS_ALLOWED_LIST;
const getAllowedListForPrefix = (0, _lodash.memoize)(prefix => {
  const firstPart = (0, _lodash.first)(prefix.split(/\./));
  const defaultAllowedList = prefix ? [...ECS_ALLOWED_LIST, prefix] : ECS_ALLOWED_LIST;

  switch (firstPart) {
    case 'docker':
      return [...defaultAllowedList, ...DOCKER_ALLOWED_LIST];

    case 'prometheus':
      return [...defaultAllowedList, ...PROMETHEUS_ALLOWED_LIST];

    case 'kubernetes':
      return [...defaultAllowedList, ...K8S_ALLOWED_LIST];

    case 'aws':
      if (prefix === 'aws.s3_daily_storage') {
        return [...defaultAllowedList, ...AWS_S3_ALLOWED_LIST, ...AWS_METRICS_ALLOWED_LIST];
      }

      return [...defaultAllowedList, ...AWS_METRICS_ALLOWED_LIST];

    default:
      return defaultAllowedList;
  }
});
exports.getAllowedListForPrefix = getAllowedListForPrefix;