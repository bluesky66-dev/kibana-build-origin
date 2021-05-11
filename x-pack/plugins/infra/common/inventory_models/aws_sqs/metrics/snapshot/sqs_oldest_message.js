"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sqsOldestMessage = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const sqsOldestMessage = {
  sqsOldestMessage: {
    max: {
      field: 'aws.sqs.oldest_message_age.sec'
    }
  }
};
exports.sqsOldestMessage = sqsOldestMessage;