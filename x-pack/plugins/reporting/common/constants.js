"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JOB_STATUSES = exports.REPORTING_MANAGEMENT_HOME = exports.API_GENERATE_IMMEDIATE = exports.API_BASE_URL_V1 = exports.API_DIAGNOSE_URL = exports.API_LIST_URL = exports.API_BASE_GENERATE = exports.API_BASE_URL = exports.LICENSE_TYPE_ENTERPRISE = exports.LICENSE_TYPE_PLATINUM = exports.LICENSE_TYPE_GOLD = exports.LICENSE_TYPE_STANDARD = exports.LICENSE_TYPE_BASIC = exports.LICENSE_TYPE_TRIAL = exports.USES_HEADLESS_JOB_TYPES = exports.CSV_JOB_TYPE_DEPRECATED = exports.CSV_REPORT_TYPE_DEPRECATED = exports.CSV_FROM_SAVEDOBJECT_JOB_TYPE = exports.PNG_JOB_TYPE = exports.PNG_REPORT_TYPE = exports.PDF_JOB_TYPE = exports.PDF_REPORT_TYPE = exports.LAYOUT_TYPES = exports.UI_SETTINGS_CSV_QUOTE_VALUES = exports.UI_SETTINGS_CSV_SEPARATOR = exports.UI_SETTINGS_CUSTOM_PDF_LOGO = exports.KBN_SCREENSHOT_HEADER_BLOCK_LIST_STARTS_WITH_PATTERN = exports.KBN_SCREENSHOT_HEADER_BLOCK_LIST = exports.ALLOWED_JOB_CONTENT_TYPES = exports.CSV_FORMULA_CHARS = exports.CSV_BOM_CHARS = exports.CSV_REPORTING_ACTION = exports.CONTENT_TYPE_CSV = exports.JOB_COMPLETION_NOTIFICATIONS_SESSION_KEY = exports.BROWSER_TYPE = exports.PLUGIN_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PLUGIN_ID = 'reporting';
exports.PLUGIN_ID = PLUGIN_ID;
const BROWSER_TYPE = 'chromium';
exports.BROWSER_TYPE = BROWSER_TYPE;
const JOB_COMPLETION_NOTIFICATIONS_SESSION_KEY = 'xpack.reporting.jobCompletionNotifications';
exports.JOB_COMPLETION_NOTIFICATIONS_SESSION_KEY = JOB_COMPLETION_NOTIFICATIONS_SESSION_KEY;
const CONTENT_TYPE_CSV = 'text/csv';
exports.CONTENT_TYPE_CSV = CONTENT_TYPE_CSV;
const CSV_REPORTING_ACTION = 'downloadCsvReport';
exports.CSV_REPORTING_ACTION = CSV_REPORTING_ACTION;
const CSV_BOM_CHARS = '\ufeff';
exports.CSV_BOM_CHARS = CSV_BOM_CHARS;
const CSV_FORMULA_CHARS = ['=', '+', '-', '@'];
exports.CSV_FORMULA_CHARS = CSV_FORMULA_CHARS;
const ALLOWED_JOB_CONTENT_TYPES = ['application/json', 'application/pdf', CONTENT_TYPE_CSV, 'image/png', 'text/plain']; // See:
// https://github.com/chromium/chromium/blob/3611052c055897e5ebbc5b73ea295092e0c20141/services/network/public/cpp/header_util_unittest.cc#L50
// For a list of headers that chromium doesn't like

exports.ALLOWED_JOB_CONTENT_TYPES = ALLOWED_JOB_CONTENT_TYPES;
const KBN_SCREENSHOT_HEADER_BLOCK_LIST = ['accept-encoding', 'connection', 'content-length', 'content-type', 'host', 'referer', // `Transfer-Encoding` is hop-by-hop header that is meaningful
// only for a single transport-level connection, and shouldn't
// be stored by caches or forwarded by proxies.
'transfer-encoding', 'trailer', 'te', 'upgrade', 'keep-alive'];
exports.KBN_SCREENSHOT_HEADER_BLOCK_LIST = KBN_SCREENSHOT_HEADER_BLOCK_LIST;
const KBN_SCREENSHOT_HEADER_BLOCK_LIST_STARTS_WITH_PATTERN = ['proxy-'];
exports.KBN_SCREENSHOT_HEADER_BLOCK_LIST_STARTS_WITH_PATTERN = KBN_SCREENSHOT_HEADER_BLOCK_LIST_STARTS_WITH_PATTERN;
const UI_SETTINGS_CUSTOM_PDF_LOGO = 'xpackReporting:customPdfLogo';
exports.UI_SETTINGS_CUSTOM_PDF_LOGO = UI_SETTINGS_CUSTOM_PDF_LOGO;
const UI_SETTINGS_CSV_SEPARATOR = 'csv:separator';
exports.UI_SETTINGS_CSV_SEPARATOR = UI_SETTINGS_CSV_SEPARATOR;
const UI_SETTINGS_CSV_QUOTE_VALUES = 'csv:quoteValues';
exports.UI_SETTINGS_CSV_QUOTE_VALUES = UI_SETTINGS_CSV_QUOTE_VALUES;
const LAYOUT_TYPES = {
  PRESERVE_LAYOUT: 'preserve_layout',
  PRINT: 'print'
}; // Export Type Definitions

exports.LAYOUT_TYPES = LAYOUT_TYPES;
const PDF_REPORT_TYPE = 'printablePdf';
exports.PDF_REPORT_TYPE = PDF_REPORT_TYPE;
const PDF_JOB_TYPE = 'printable_pdf';
exports.PDF_JOB_TYPE = PDF_JOB_TYPE;
const PNG_REPORT_TYPE = 'PNG';
exports.PNG_REPORT_TYPE = PNG_REPORT_TYPE;
const PNG_JOB_TYPE = 'PNG';
exports.PNG_JOB_TYPE = PNG_JOB_TYPE;
const CSV_FROM_SAVEDOBJECT_JOB_TYPE = 'csv_from_savedobject'; // This is deprecated because it lacks support for runtime fields
// but the extension points are still needed for pre-existing scripted automation, until 8.0

exports.CSV_FROM_SAVEDOBJECT_JOB_TYPE = CSV_FROM_SAVEDOBJECT_JOB_TYPE;
const CSV_REPORT_TYPE_DEPRECATED = 'CSV';
exports.CSV_REPORT_TYPE_DEPRECATED = CSV_REPORT_TYPE_DEPRECATED;
const CSV_JOB_TYPE_DEPRECATED = 'csv';
exports.CSV_JOB_TYPE_DEPRECATED = CSV_JOB_TYPE_DEPRECATED;
const USES_HEADLESS_JOB_TYPES = [PDF_JOB_TYPE, PNG_JOB_TYPE]; // Licenses

exports.USES_HEADLESS_JOB_TYPES = USES_HEADLESS_JOB_TYPES;
const LICENSE_TYPE_TRIAL = 'trial';
exports.LICENSE_TYPE_TRIAL = LICENSE_TYPE_TRIAL;
const LICENSE_TYPE_BASIC = 'basic';
exports.LICENSE_TYPE_BASIC = LICENSE_TYPE_BASIC;
const LICENSE_TYPE_STANDARD = 'standard';
exports.LICENSE_TYPE_STANDARD = LICENSE_TYPE_STANDARD;
const LICENSE_TYPE_GOLD = 'gold';
exports.LICENSE_TYPE_GOLD = LICENSE_TYPE_GOLD;
const LICENSE_TYPE_PLATINUM = 'platinum';
exports.LICENSE_TYPE_PLATINUM = LICENSE_TYPE_PLATINUM;
const LICENSE_TYPE_ENTERPRISE = 'enterprise'; // Routes

exports.LICENSE_TYPE_ENTERPRISE = LICENSE_TYPE_ENTERPRISE;
const API_BASE_URL = '/api/reporting'; // "Generation URL" from share menu

exports.API_BASE_URL = API_BASE_URL;
const API_BASE_GENERATE = `${API_BASE_URL}/generate`;
exports.API_BASE_GENERATE = API_BASE_GENERATE;
const API_LIST_URL = `${API_BASE_URL}/jobs`;
exports.API_LIST_URL = API_LIST_URL;
const API_DIAGNOSE_URL = `${API_BASE_URL}/diagnose`; // hacky endpoint

exports.API_DIAGNOSE_URL = API_DIAGNOSE_URL;
const API_BASE_URL_V1 = '/api/reporting/v1'; //

exports.API_BASE_URL_V1 = API_BASE_URL_V1;
const API_GENERATE_IMMEDIATE = `${API_BASE_URL_V1}/generate/immediate/csv/saved-object`; // Management UI route

exports.API_GENERATE_IMMEDIATE = API_GENERATE_IMMEDIATE;
const REPORTING_MANAGEMENT_HOME = '/app/management/insightsAndAlerting/reporting'; // Statuses

exports.REPORTING_MANAGEMENT_HOME = REPORTING_MANAGEMENT_HOME;
let JOB_STATUSES;
exports.JOB_STATUSES = JOB_STATUSES;

(function (JOB_STATUSES) {
  JOB_STATUSES["PENDING"] = "pending";
  JOB_STATUSES["PROCESSING"] = "processing";
  JOB_STATUSES["COMPLETED"] = "completed";
  JOB_STATUSES["FAILED"] = "failed";
  JOB_STATUSES["CANCELLED"] = "cancelled";
  JOB_STATUSES["WARNINGS"] = "completed_with_warnings";
})(JOB_STATUSES || (exports.JOB_STATUSES = JOB_STATUSES = {}));