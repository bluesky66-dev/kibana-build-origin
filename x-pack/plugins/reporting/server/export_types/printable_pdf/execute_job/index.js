"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTaskFnFactory = void 0;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

var _constants = require("../../../../common/constants");

var _common = require("../../common");

var _generate_pdf = require("../lib/generate_pdf");

var _get_custom_logo = require("../lib/get_custom_logo");

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

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const runTaskFnFactory = function executeJobFactoryFn(reporting, parentLogger) {
  const config = reporting.getConfig();
  const encryptionKey = config.get('encryptionKey');
  return async function runTask(jobId, job, cancellationToken) {
    const logger = parentLogger.clone([_constants.PDF_JOB_TYPE, 'execute-job', jobId]);

    const apmTrans = _elasticApmNode.default.startTransaction('reporting execute_job pdf', 'reporting');

    const apmGetAssets = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('get_assets', 'setup');
    let apmGeneratePdf;
    const generatePdfObservable = await (0, _generate_pdf.generatePdfObservableFactory)(reporting);
    const jobLogger = logger.clone([jobId]);
    const process$ = Rx.of(1).pipe((0, _operators.mergeMap)(() => (0, _common.decryptJobHeaders)(encryptionKey, job.headers, logger)), (0, _operators.map)(decryptedHeaders => (0, _common.omitBlockedHeaders)(decryptedHeaders)), (0, _operators.map)(filteredHeaders => (0, _common.getConditionalHeaders)(config, filteredHeaders)), (0, _operators.mergeMap)(conditionalHeaders => (0, _get_custom_logo.getCustomLogo)(reporting, conditionalHeaders, job.spaceId, logger)), (0, _operators.mergeMap)(({
      logo,
      conditionalHeaders
    }) => {
      const urls = (0, _common.getFullUrls)(config, job);
      const {
        browserTimezone,
        layout,
        title
      } = job;
      if (apmGetAssets) apmGetAssets.end();
      apmGeneratePdf = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('generate_pdf_pipeline', 'execute');
      return generatePdfObservable(jobLogger, title, urls, browserTimezone, conditionalHeaders, layout, logo);
    }), (0, _operators.map)(({
      buffer,
      warnings
    }) => {
      if (apmGeneratePdf) apmGeneratePdf.end();
      const apmEncode = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('encode_pdf', 'output');
      const content = (buffer === null || buffer === void 0 ? void 0 : buffer.toString('base64')) || null;
      if (apmEncode) apmEncode.end();
      return {
        content_type: 'application/pdf',
        content,
        size: (buffer === null || buffer === void 0 ? void 0 : buffer.byteLength) || 0,
        warnings
      };
    }), (0, _operators.catchError)(err => {
      jobLogger.error(err);
      return Rx.throwError(err);
    }));
    const stop$ = Rx.fromEventPattern(cancellationToken.on);
    if (apmTrans) apmTrans.end();
    return process$.pipe((0, _operators.takeUntil)(stop$)).toPromise();
  };
};

exports.runTaskFnFactory = runTaskFnFactory;