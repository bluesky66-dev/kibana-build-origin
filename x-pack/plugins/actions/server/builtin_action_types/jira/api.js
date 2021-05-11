"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const handshakeHandler = async ({
  externalService,
  params
}) => {};

const getIncidentHandler = async ({
  externalService,
  params
}) => {
  const res = await externalService.getIncident(params.externalId);
  return res;
};

const getIssueTypesHandler = async ({
  externalService
}) => {
  const res = await externalService.getIssueTypes();
  return res;
};

const getFieldsHandler = async ({
  externalService
}) => {
  const res = await externalService.getFields();
  return res;
};

const getFieldsByIssueTypeHandler = async ({
  externalService,
  params
}) => {
  const {
    id
  } = params;
  const res = await externalService.getFieldsByIssueType(id);
  return res;
};

const getIssuesHandler = async ({
  externalService,
  params
}) => {
  const {
    title
  } = params;
  const res = await externalService.getIssues(title);
  return res;
};

const getIssueHandler = async ({
  externalService,
  params
}) => {
  const {
    id
  } = params;
  const res = await externalService.getIssue(id);
  return res;
};

const pushToServiceHandler = async ({
  externalService,
  params
}) => {
  const {
    comments
  } = params;
  let res;
  const {
    externalId,
    ...rest
  } = params.incident;
  const incident = rest;

  if (externalId != null) {
    res = await externalService.updateIncident({
      incidentId: externalId,
      incident
    });
  } else {
    res = await externalService.createIncident({
      incident
    });
  }

  if (comments && Array.isArray(comments) && comments.length > 0) {
    res.comments = [];

    for (const currentComment of comments) {
      var _res$comments;

      const comment = await externalService.createComment({
        incidentId: res.id,
        comment: currentComment
      });
      res.comments = [...((_res$comments = res.comments) !== null && _res$comments !== void 0 ? _res$comments : []), {
        commentId: comment.commentId,
        pushedDate: comment.pushedDate
      }];
    }
  }

  return res;
};

const api = {
  getFields: getFieldsHandler,
  handshake: handshakeHandler,
  pushToService: pushToServiceHandler,
  getIncident: getIncidentHandler,
  issueTypes: getIssueTypesHandler,
  fieldsByIssueType: getFieldsByIssueTypeHandler,
  issues: getIssuesHandler,
  issue: getIssueHandler
};
exports.api = api;