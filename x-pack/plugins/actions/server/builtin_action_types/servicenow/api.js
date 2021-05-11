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
}) => {};

const pushToServiceHandler = async ({
  externalService,
  params,
  secrets,
  commentFieldKey
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
      incident: { ...incident,
        caller_id: secrets.username
      }
    });
  }

  if (comments && Array.isArray(comments) && comments.length > 0) {
    res.comments = [];

    for (const currentComment of comments) {
      var _res$comments;

      await externalService.updateIncident({
        incidentId: res.id,
        incident: { ...incident,
          [commentFieldKey]: currentComment.comment
        }
      });
      res.comments = [...((_res$comments = res.comments) !== null && _res$comments !== void 0 ? _res$comments : []), {
        commentId: currentComment.commentId,
        pushedDate: res.pushedDate
      }];
    }
  }

  return res;
};

const getFieldsHandler = async ({
  externalService
}) => {
  const res = await externalService.getFields();
  return res;
};

const getChoicesHandler = async ({
  externalService,
  params
}) => {
  const res = await externalService.getChoices(params.fields);
  return res;
};

const api = {
  getChoices: getChoicesHandler,
  getFields: getFieldsHandler,
  getIncident: getIncidentHandler,
  handshake: handshakeHandler,
  pushToService: pushToServiceHandler
};
exports.api = api;