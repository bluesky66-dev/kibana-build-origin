"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uptimeAlertTypeFactories = void 0;

var _status_check = require("./status_check");

var _tls = require("./tls");

var _duration_anomaly = require("./duration_anomaly");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const uptimeAlertTypeFactories = [_status_check.statusCheckAlertFactory, _tls.tlsAlertFactory, _duration_anomaly.durationAnomalyAlertFactory];
exports.uptimeAlertTypeFactories = uptimeAlertTypeFactories;