"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toMetricOpt = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Lowercase versions of all metrics, for when they need to be used in the middle of a sentence;
// these may need to be translated differently depending on language, e.g. still capitalizing "CPU"


const TranslationsLowercase = {
  CPUUsage: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.cpuUsageText', {
    defaultMessage: 'CPU usage'
  }),
  MemoryUsage: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.memoryUsageText', {
    defaultMessage: 'memory usage'
  }),
  InboundTraffic: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.inboundTrafficText', {
    defaultMessage: 'inbound traffic'
  }),
  OutboundTraffic: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.outboundTrafficText', {
    defaultMessage: 'outbound traffic'
  }),
  LogRate: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.hostLogRateText', {
    defaultMessage: 'log rate'
  }),
  Load: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.loadText', {
    defaultMessage: 'load'
  }),
  Count: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.countText', {
    defaultMessage: 'count'
  }),
  DiskIOReadBytes: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.diskIOReadBytes', {
    defaultMessage: 'disk reads'
  }),
  DiskIOWriteBytes: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.diskIOWriteBytes', {
    defaultMessage: 'disk writes'
  }),
  s3BucketSize: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.s3BucketSize', {
    defaultMessage: 'bucket size'
  }),
  s3TotalRequests: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.s3TotalRequests', {
    defaultMessage: 'total requests'
  }),
  s3NumberOfObjects: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.s3NumberOfObjects', {
    defaultMessage: 'number of objects'
  }),
  s3DownloadBytes: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.s3DownloadBytes', {
    defaultMessage: 'downloads (bytes)'
  }),
  s3UploadBytes: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.s3UploadBytes', {
    defaultMessage: 'uploads (bytes)'
  }),
  rdsConnections: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.rdsConnections', {
    defaultMessage: 'connections'
  }),
  rdsQueriesExecuted: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.rdsQueriesExecuted', {
    defaultMessage: 'queries executed'
  }),
  rdsActiveTransactions: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.rdsActiveTransactions', {
    defaultMessage: 'active transactions'
  }),
  rdsLatency: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.rdsLatency', {
    defaultMessage: 'latency'
  }),
  sqsMessagesVisible: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.sqsMessagesVisible', {
    defaultMessage: 'messages available'
  }),
  sqsMessagesDelayed: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.sqsMessagesDelayed', {
    defaultMessage: 'messages delayed'
  }),
  sqsMessagesSent: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.sqsMessagesSent', {
    defaultMessage: 'messages added'
  }),
  sqsMessagesEmpty: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.sqsMessagesEmpty', {
    defaultMessage: 'messages returned empty'
  }),
  sqsOldestMessage: _i18n.i18n.translate('xpack.infra.waffle.metricOptions.sqsOldestMessage', {
    defaultMessage: 'oldest message'
  })
};
const Translations = (0, _lodash.mapValues)(TranslationsLowercase, translation => `${translation[0].toUpperCase()}${translation.slice(1)}`);

const toMetricOpt = metric => {
  switch (metric) {
    case 'cpu':
      return {
        text: Translations.CPUUsage,
        textLC: TranslationsLowercase.CPUUsage,
        value: 'cpu'
      };

    case 'memory':
      return {
        text: Translations.MemoryUsage,
        textLC: TranslationsLowercase.MemoryUsage,
        value: 'memory'
      };

    case 'rx':
      return {
        text: Translations.InboundTraffic,
        textLC: TranslationsLowercase.InboundTraffic,
        value: 'rx'
      };

    case 'tx':
      return {
        text: Translations.OutboundTraffic,
        textLC: TranslationsLowercase.OutboundTraffic,
        value: 'tx'
      };

    case 'logRate':
      return {
        text: Translations.LogRate,
        textLC: TranslationsLowercase.LogRate,
        value: 'logRate'
      };

    case 'load':
      return {
        text: Translations.Load,
        textLC: TranslationsLowercase.Load,
        value: 'load'
      };

    case 'count':
      return {
        text: Translations.Count,
        textLC: TranslationsLowercase.Count,
        value: 'count'
      };

    case 'diskIOReadBytes':
      return {
        text: Translations.DiskIOReadBytes,
        textLC: TranslationsLowercase.DiskIOReadBytes,
        value: 'diskIOReadBytes'
      };

    case 'diskIOWriteBytes':
      return {
        text: Translations.DiskIOWriteBytes,
        textLC: TranslationsLowercase.DiskIOWriteBytes,
        value: 'diskIOWriteBytes'
      };

    case 's3BucketSize':
      return {
        text: Translations.s3BucketSize,
        textLC: TranslationsLowercase.s3BucketSize,
        value: 's3BucketSize'
      };

    case 's3TotalRequests':
      return {
        text: Translations.s3TotalRequests,
        textLC: TranslationsLowercase.s3TotalRequests,
        value: 's3TotalRequests'
      };

    case 's3NumberOfObjects':
      return {
        text: Translations.s3NumberOfObjects,
        textLC: TranslationsLowercase.s3NumberOfObjects,
        value: 's3NumberOfObjects'
      };

    case 's3DownloadBytes':
      return {
        text: Translations.s3DownloadBytes,
        textLC: TranslationsLowercase.s3DownloadBytes,
        value: 's3DownloadBytes'
      };

    case 's3UploadBytes':
      return {
        text: Translations.s3UploadBytes,
        textLC: TranslationsLowercase.s3UploadBytes,
        value: 's3UploadBytes'
      };

    case 'rdsConnections':
      return {
        text: Translations.rdsConnections,
        textLC: TranslationsLowercase.rdsConnections,
        value: 'rdsConnections'
      };

    case 'rdsQueriesExecuted':
      return {
        text: Translations.rdsQueriesExecuted,
        textLC: TranslationsLowercase.rdsQueriesExecuted,
        value: 'rdsQueriesExecuted'
      };

    case 'rdsActiveTransactions':
      return {
        text: Translations.rdsActiveTransactions,
        textLC: TranslationsLowercase.rdsActiveTransactions,
        value: 'rdsActiveTransactions'
      };

    case 'rdsLatency':
      return {
        text: Translations.rdsLatency,
        textLC: TranslationsLowercase.rdsLatency,
        value: 'rdsLatency'
      };

    case 'sqsMessagesVisible':
      return {
        text: Translations.sqsMessagesVisible,
        textLC: TranslationsLowercase.sqsMessagesVisible,
        value: 'sqsMessagesVisible'
      };

    case 'sqsMessagesDelayed':
      return {
        text: Translations.sqsMessagesDelayed,
        textLC: TranslationsLowercase.sqsMessagesDelayed,
        value: 'sqsMessagesDelayed'
      };

    case 'sqsMessagesSent':
      return {
        text: Translations.sqsMessagesSent,
        textLC: TranslationsLowercase.sqsMessagesSent,
        value: 'sqsMessagesSent'
      };

    case 'sqsMessagesEmpty':
      return {
        text: Translations.sqsMessagesEmpty,
        textLC: TranslationsLowercase.sqsMessagesEmpty,
        value: 'sqsMessagesEmpty'
      };

    case 'sqsOldestMessage':
      return {
        text: Translations.sqsOldestMessage,
        textLC: TranslationsLowercase.sqsOldestMessage,
        value: 'sqsOldestMessage'
      };
  }
};

exports.toMetricOpt = toMetricOpt;