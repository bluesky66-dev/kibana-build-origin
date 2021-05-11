"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadJobResponseHandlerFactory = downloadJobResponseHandlerFactory;
exports.deleteJobResponseHandlerFactory = deleteJobResponseHandlerFactory;

var _constants = require("../../../common/constants");

var _get_document_payload = require("./get_document_payload");

var _jobs_query = require("./jobs_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function downloadJobResponseHandlerFactory(reporting) {
  const jobsQuery = (0, _jobs_query.jobsQueryFactory)(reporting);
  const exportTypesRegistry = reporting.getExportTypesRegistry();
  const getDocumentPayload = (0, _get_document_payload.getDocumentPayloadFactory)(exportTypesRegistry);
  return async function jobResponseHandler(res, validJobTypes, user, params, opts = {}) {
    const {
      docId
    } = params;
    const doc = await jobsQuery.get(user, docId, {
      includeContent: !opts.excludeContent
    });

    if (!doc) {
      return res.notFound();
    }

    const {
      jobtype: jobType
    } = doc._source;

    if (!validJobTypes.includes(jobType)) {
      return res.unauthorized({
        body: `Sorry, you are not authorized to download ${jobType} reports`
      });
    }

    const payload = getDocumentPayload(doc);

    if (!payload.contentType || !_constants.ALLOWED_JOB_CONTENT_TYPES.includes(payload.contentType)) {
      return res.badRequest({
        body: `Unsupported content-type of ${payload.contentType} specified by job output`
      });
    }

    return res.custom({
      body: typeof payload.content === 'string' ? Buffer.from(payload.content) : payload.content,
      statusCode: payload.statusCode,
      headers: { ...payload.headers,
        'content-type': payload.contentType || ''
      }
    });
  };
}

function deleteJobResponseHandlerFactory(reporting) {
  const jobsQuery = (0, _jobs_query.jobsQueryFactory)(reporting);
  return async function deleteJobResponseHander(res, validJobTypes, user, params) {
    const {
      docId
    } = params;
    const doc = await jobsQuery.get(user, docId, {
      includeContent: false
    });

    if (!doc) {
      return res.notFound();
    }

    const {
      jobtype: jobType
    } = doc._source;

    if (!validJobTypes.includes(jobType)) {
      return res.unauthorized({
        body: `Sorry, you are not authorized to delete ${jobType} reports`
      });
    }

    try {
      const docIndex = doc._index;
      await jobsQuery.delete(docIndex, docId);
      return res.ok({
        body: {
          deleted: true
        }
      });
    } catch (error) {
      return res.customError({
        statusCode: error.statusCode,
        body: error.message
      });
    }
  };
}