"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDocumentPayloadFactory = getDocumentPayloadFactory;

var _contentDisposition = _interopRequireDefault(require("content-disposition"));

var _lodash = require("lodash");

var _constants = require("../../../common/constants");

var _lib = require("../../lib");

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
// @ts-ignore


const DEFAULT_TITLE = 'report';

const getTitle = (exportType, title) => `${title || DEFAULT_TITLE}.${exportType.jobContentExtension}`;

const getReportingHeaders = (output, exportType) => {
  const metaDataHeaders = {};

  if (exportType.jobType === _constants.CSV_JOB_TYPE_DEPRECATED) {
    const csvContainsFormulas = (0, _lodash.get)(output, 'csv_contains_formulas', false);
    const maxSizedReach = (0, _lodash.get)(output, 'max_size_reached', false);
    metaDataHeaders['kbn-csv-contains-formulas'] = csvContainsFormulas;
    metaDataHeaders['kbn-max-size-reached'] = maxSizedReach;
  }

  return metaDataHeaders;
};

function getDocumentPayloadFactory(exportTypesRegistry) {
  function encodeContent(content, exportType) {
    switch (exportType.jobContentEncoding) {
      case 'base64':
        return content ? Buffer.from(content, 'base64') : '';
      // convert null to empty string

      default:
        return content ? content : '';
      // convert null to empty string
    }
  }

  function getCompleted(output, jobType, title) {
    const exportType = exportTypesRegistry.get(item => item.jobType === jobType);
    const filename = getTitle(exportType, title);
    const headers = getReportingHeaders(output, exportType);
    return {
      statusCode: 200,
      content: encodeContent(output.content, exportType),
      contentType: output.content_type,
      headers: { ...headers,
        'Content-Disposition': (0, _contentDisposition.default)(filename, {
          type: 'inline'
        })
      }
    };
  } // @TODO: These should be semantic HTTP codes as 500/503's indicate
  // error then these are really operating properly.


  function getFailure(output) {
    return {
      statusCode: 500,
      content: {
        message: `Reporting generation failed: ${output.content}`
      },
      contentType: 'application/json',
      headers: {}
    };
  }

  function getIncomplete(status) {
    return {
      statusCode: 503,
      content: status,
      contentType: 'text/plain',
      headers: {
        'retry-after': 30
      }
    };
  }

  return function getDocumentPayload(doc) {
    const {
      status,
      jobtype: jobType,
      payload: {
        title
      } = {
        title: ''
      }
    } = doc._source;
    const {
      output
    } = doc._source;

    if (output) {
      if (status === _lib.statuses.JOB_STATUS_COMPLETED || status === _lib.statuses.JOB_STATUS_WARNINGS) {
        return getCompleted(output, jobType, title);
      }

      if (status === _lib.statuses.JOB_STATUS_FAILED) {
        return getFailure(output);
      }
    } // send a 503 indicating that the report isn't completed yet


    return getIncomplete(status);
  };
}