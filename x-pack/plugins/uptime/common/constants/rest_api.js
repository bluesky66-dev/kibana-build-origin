"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API_URLS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let API_URLS;
exports.API_URLS = API_URLS;

(function (API_URLS) {
  API_URLS["CERTS"] = "/api/uptime/certs";
  API_URLS["INDEX_PATTERN"] = "/api/uptime/index_pattern";
  API_URLS["INDEX_STATUS"] = "/api/uptime/index_status";
  API_URLS["MONITOR_LIST"] = "/api/uptime/monitor/list";
  API_URLS["MONITOR_LOCATIONS"] = "/api/uptime/monitor/locations";
  API_URLS["MONITOR_DURATION"] = "/api/uptime/monitor/duration";
  API_URLS["MONITOR_DETAILS"] = "/api/uptime/monitor/details";
  API_URLS["MONITOR_STATUS"] = "/api/uptime/monitor/status";
  API_URLS["PINGS"] = "/api/uptime/pings";
  API_URLS["PING_HISTOGRAM"] = "/api/uptime/ping/histogram";
  API_URLS["SNAPSHOT_COUNT"] = "/api/uptime/snapshot/count";
  API_URLS["FILTERS"] = "/api/uptime/filters";
  API_URLS["LOG_PAGE_VIEW"] = "/api/uptime/log_page_view";
  API_URLS["ML_MODULE_JOBS"] = "/api/ml/modules/jobs_exist/";
  API_URLS["ML_SETUP_MODULE"] = "/api/ml/modules/setup/";
  API_URLS["ML_DELETE_JOB"] = "/api/ml/jobs/delete_jobs";
  API_URLS["ML_CAPABILITIES"] = "/api/ml/ml_capabilities";
  API_URLS["ML_ANOMALIES_RESULT"] = "/api/ml/results/anomalies_table_data";
  API_URLS["ALERT_ACTIONS"] = "/api/actions";
  API_URLS["CREATE_ALERT"] = "/api/alerts/alert";
  API_URLS["ALERT"] = "/api/alerts/alert/";
  API_URLS["ALERTS_FIND"] = "/api/alerts/_find";
  API_URLS["ACTION_TYPES"] = "/api/actions/list_action_types";
})(API_URLS || (exports.API_URLS = API_URLS = {}));