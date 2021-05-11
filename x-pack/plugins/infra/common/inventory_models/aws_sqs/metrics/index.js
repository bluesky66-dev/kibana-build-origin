"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _sqs_messages_visible = require("./snapshot/sqs_messages_visible");

var _sqs_messages_delayed = require("./snapshot/sqs_messages_delayed");

var _sqs_messages_empty = require("./snapshot/sqs_messages_empty");

var _sqs_messages_sent = require("./snapshot/sqs_messages_sent");

var _sqs_oldest_message = require("./snapshot/sqs_oldest_message");

var _aws_sqs_messages_visible = require("./tsvb/aws_sqs_messages_visible");

var _aws_sqs_messages_delayed = require("./tsvb/aws_sqs_messages_delayed");

var _aws_sqs_messages_sent = require("./tsvb/aws_sqs_messages_sent");

var _aws_sqs_messages_empty = require("./tsvb/aws_sqs_messages_empty");

var _aws_sqs_oldest_message = require("./tsvb/aws_sqs_oldest_message");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const metrics = {
  tsvb: {
    awsSQSMessagesVisible: _aws_sqs_messages_visible.awsSQSMessagesVisible,
    awsSQSMessagesDelayed: _aws_sqs_messages_delayed.awsSQSMessagesDelayed,
    awsSQSMessagesSent: _aws_sqs_messages_sent.awsSQSMessagesSent,
    awsSQSMessagesEmpty: _aws_sqs_messages_empty.awsSQSMessagesEmpty,
    awsSQSOldestMessage: _aws_sqs_oldest_message.awsSQSOldestMessage
  },
  snapshot: {
    sqsMessagesVisible: _sqs_messages_visible.sqsMessagesVisible,
    sqsMessagesDelayed: _sqs_messages_delayed.sqsMessagesDelayed,
    sqsMessagesEmpty: _sqs_messages_empty.sqsMessagesEmpty,
    sqsMessagesSent: _sqs_messages_sent.sqsMessagesSent,
    sqsOldestMessage: _sqs_oldest_message.sqsOldestMessage
  },
  defaultSnapshot: 'sqsMessagesVisible',
  defaultTimeRangeInSeconds: 14400 // 4 hours

};
exports.metrics = metrics;