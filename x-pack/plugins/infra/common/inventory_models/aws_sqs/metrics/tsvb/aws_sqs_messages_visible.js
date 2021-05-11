"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsSQSMessagesVisible = void 0;

var _create_tsvb_model = require("../../../create_tsvb_model");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const awsSQSMessagesVisible = (0, _create_tsvb_model.createTSVBModel)('awsSQSMessagesVisible', ['aws.sqs'], [{
  id: 'visible',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.sqs.messages.visible',
    id: 'avg-visible',
    type: 'avg'
  }]
}], '>=300s');
exports.awsSQSMessagesVisible = awsSQSMessagesVisible;