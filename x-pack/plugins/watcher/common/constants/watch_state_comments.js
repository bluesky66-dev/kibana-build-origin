"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WATCH_STATE_COMMENTS = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const WATCH_STATE_COMMENTS = {
  OK: '',
  PARTIALLY_THROTTLED: _i18n.i18n.translate('xpack.watcher.constants.watchStateComments.partiallyThrottledStateCommentText', {
    defaultMessage: 'Partially throttled'
  }),
  THROTTLED: _i18n.i18n.translate('xpack.watcher.constants.watchStateComments.throttledStateCommentText', {
    defaultMessage: 'Throttled'
  }),
  PARTIALLY_ACKNOWLEDGED: _i18n.i18n.translate('xpack.watcher.constants.watchStateComments.partiallyAcknowledgedStateCommentText', {
    defaultMessage: 'Partially acked'
  }),
  ACKNOWLEDGED: _i18n.i18n.translate('xpack.watcher.constants.watchStateComments.acknowledgedStateCommentText', {
    defaultMessage: 'Acked'
  }),
  FAILING: _i18n.i18n.translate('xpack.watcher.constants.watchStateComments.executionFailingStateCommentText', {
    defaultMessage: 'Execution failing'
  })
};
exports.WATCH_STATE_COMMENTS = WATCH_STATE_COMMENTS;