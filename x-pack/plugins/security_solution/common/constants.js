"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showAllOthersBucket = exports.NOTIFICATION_THROTTLE_RULE = exports.NOTIFICATION_THROTTLE_NO_ACTIONS = exports.NOTIFICATION_SUPPORTED_ACTION_TYPES_IDS = exports.ENABLE_CASE_CONNECTOR = exports.ML_GROUP_IDS = exports.LEGACY_ML_GROUP_ID = exports.ML_GROUP_ID = exports.MINIMUM_ML_LICENSE = exports.UNAUTHENTICATED_USER = exports.DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL = exports.DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL = exports.DETECTION_ENGINE_SIGNALS_MIGRATION_URL = exports.DETECTION_ENGINE_QUERY_SIGNALS_URL = exports.DETECTION_ENGINE_SIGNALS_STATUS_URL = exports.DETECTION_ENGINE_SIGNALS_URL = exports.SIGNALS_INDEX_KEY = exports.TIMELINE_PREPACKAGED_URL = exports.TIMELINE_IMPORT_URL = exports.TIMELINE_EXPORT_URL = exports.TIMELINE_DRAFT_URL = exports.TIMELINE_URL = exports.DETECTION_ENGINE_PREPACKAGED_RULES_STATUS_URL = exports.DETECTION_ENGINE_RULES_STATUS_URL = exports.DETECTION_ENGINE_TAGS_URL = exports.DETECTION_ENGINE_INDEX_URL = exports.DETECTION_ENGINE_PRIVILEGES_URL = exports.DETECTION_ENGINE_PREPACKAGED_URL = exports.DETECTION_ENGINE_RULES_URL = exports.DETECTION_ENGINE_URL = exports.INTERNAL_IMMUTABLE_KEY = exports.INTERNAL_RULE_ALERT_ID_KEY = exports.INTERNAL_RULE_ID_KEY = exports.INTERNAL_IDENTIFIER = exports.NOTIFICATIONS_ID = exports.SIGNALS_ID = exports.IP_REPUTATION_LINKS_SETTING_DEFAULT = exports.IP_REPUTATION_LINKS_SETTING = exports.NEWS_FEED_URL_SETTING_DEFAULT = exports.NEWS_FEED_URL_SETTING = exports.DEFAULT_RULES_TABLE_REFRESH_SETTING = exports.ENABLE_NEWS_FEED_SETTING = exports.DEFAULT_INDEX_PATTERN = exports.DETECTIONS_SUB_PLUGIN_ID = exports.APP_MANAGEMENT_PATH = exports.APP_CASES_PATH = exports.APP_TIMELINES_PATH = exports.APP_NETWORK_PATH = exports.APP_HOSTS_PATH = exports.APP_DETECTIONS_PATH = exports.APP_OVERVIEW_PATH = exports.SecurityPageName = exports.INDICATOR_DESTINATION_PATH = exports.DEFAULT_INDICATOR_SOURCE_PATH = exports.DEFAULT_RULE_NOTIFICATION_QUERY_SIZE = exports.DEFAULT_RULE_REFRESH_IDLE_VALUE = exports.DEFAULT_RULE_REFRESH_INTERVAL_VALUE = exports.DEFAULT_RULE_REFRESH_INTERVAL_ON = exports.ENDPOINT_METADATA_INDEX = exports.NO_ALERT_INDEX = exports.FULL_SCREEN_TOGGLED_CLASS_NAME = exports.FILTERS_GLOBAL_HEIGHT = exports.GLOBAL_HEADER_HEIGHT = exports.SCROLLING_DISABLED_CLASS_NAME = exports.DEFAULT_TIMEPICKER_QUICK_RANGES = exports.DEFAULT_INTERVAL_VALUE = exports.DEFAULT_INTERVAL_TYPE = exports.DEFAULT_INTERVAL_PAUSE = exports.DEFAULT_TO = exports.DEFAULT_FROM = exports.DEFAULT_SCALE_DATE_FORMAT = exports.DEFAULT_MAX_TABLE_QUERY_SIZE = exports.DEFAULT_ANOMALY_SCORE = exports.DEFAULT_SEARCH_AFTER_PAGE_SIZE = exports.DEFAULT_MAX_SIGNALS = exports.DEFAULT_SIGNALS_INDEX = exports.DEFAULT_APP_REFRESH_INTERVAL = exports.DEFAULT_APP_TIME_RANGE = exports.DEFAULT_REFRESH_RATE_INTERVAL = exports.DEFAULT_TIME_RANGE = exports.DEFAULT_NUMBER_FORMAT = exports.DEFAULT_INDEX_KEY = exports.DEFAULT_DARK_MODE = exports.DEFAULT_DATE_FORMAT_TZ = exports.DEFAULT_DATE_FORMAT = exports.DEFAULT_BYTES_FORMAT = exports.ADD_DATA_PATH = exports.APP_PATH = exports.APP_ICON_SOLUTION = exports.APP_ICON = exports.APP_NAME = exports.SERVER_APP_ID = exports.APP_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const APP_ID = 'securitySolution';
exports.APP_ID = APP_ID;
const SERVER_APP_ID = 'siem';
exports.SERVER_APP_ID = SERVER_APP_ID;
const APP_NAME = 'Security';
exports.APP_NAME = APP_NAME;
const APP_ICON = 'securityAnalyticsApp';
exports.APP_ICON = APP_ICON;
const APP_ICON_SOLUTION = 'logoSecurity';
exports.APP_ICON_SOLUTION = APP_ICON_SOLUTION;
const APP_PATH = `/app/security`;
exports.APP_PATH = APP_PATH;
const ADD_DATA_PATH = `/app/home#/tutorial_directory/security`;
exports.ADD_DATA_PATH = ADD_DATA_PATH;
const DEFAULT_BYTES_FORMAT = 'format:bytes:defaultPattern';
exports.DEFAULT_BYTES_FORMAT = DEFAULT_BYTES_FORMAT;
const DEFAULT_DATE_FORMAT = 'dateFormat';
exports.DEFAULT_DATE_FORMAT = DEFAULT_DATE_FORMAT;
const DEFAULT_DATE_FORMAT_TZ = 'dateFormat:tz';
exports.DEFAULT_DATE_FORMAT_TZ = DEFAULT_DATE_FORMAT_TZ;
const DEFAULT_DARK_MODE = 'theme:darkMode';
exports.DEFAULT_DARK_MODE = DEFAULT_DARK_MODE;
const DEFAULT_INDEX_KEY = 'securitySolution:defaultIndex';
exports.DEFAULT_INDEX_KEY = DEFAULT_INDEX_KEY;
const DEFAULT_NUMBER_FORMAT = 'format:number:defaultPattern';
exports.DEFAULT_NUMBER_FORMAT = DEFAULT_NUMBER_FORMAT;
const DEFAULT_TIME_RANGE = 'timepicker:timeDefaults';
exports.DEFAULT_TIME_RANGE = DEFAULT_TIME_RANGE;
const DEFAULT_REFRESH_RATE_INTERVAL = 'timepicker:refreshIntervalDefaults';
exports.DEFAULT_REFRESH_RATE_INTERVAL = DEFAULT_REFRESH_RATE_INTERVAL;
const DEFAULT_APP_TIME_RANGE = 'securitySolution:timeDefaults';
exports.DEFAULT_APP_TIME_RANGE = DEFAULT_APP_TIME_RANGE;
const DEFAULT_APP_REFRESH_INTERVAL = 'securitySolution:refreshIntervalDefaults';
exports.DEFAULT_APP_REFRESH_INTERVAL = DEFAULT_APP_REFRESH_INTERVAL;
const DEFAULT_SIGNALS_INDEX = '.siem-signals';
exports.DEFAULT_SIGNALS_INDEX = DEFAULT_SIGNALS_INDEX;
const DEFAULT_MAX_SIGNALS = 100;
exports.DEFAULT_MAX_SIGNALS = DEFAULT_MAX_SIGNALS;
const DEFAULT_SEARCH_AFTER_PAGE_SIZE = 100;
exports.DEFAULT_SEARCH_AFTER_PAGE_SIZE = DEFAULT_SEARCH_AFTER_PAGE_SIZE;
const DEFAULT_ANOMALY_SCORE = 'securitySolution:defaultAnomalyScore';
exports.DEFAULT_ANOMALY_SCORE = DEFAULT_ANOMALY_SCORE;
const DEFAULT_MAX_TABLE_QUERY_SIZE = 10000;
exports.DEFAULT_MAX_TABLE_QUERY_SIZE = DEFAULT_MAX_TABLE_QUERY_SIZE;
const DEFAULT_SCALE_DATE_FORMAT = 'dateFormat:scaled';
exports.DEFAULT_SCALE_DATE_FORMAT = DEFAULT_SCALE_DATE_FORMAT;
const DEFAULT_FROM = 'now-24h';
exports.DEFAULT_FROM = DEFAULT_FROM;
const DEFAULT_TO = 'now';
exports.DEFAULT_TO = DEFAULT_TO;
const DEFAULT_INTERVAL_PAUSE = true;
exports.DEFAULT_INTERVAL_PAUSE = DEFAULT_INTERVAL_PAUSE;
const DEFAULT_INTERVAL_TYPE = 'manual';
exports.DEFAULT_INTERVAL_TYPE = DEFAULT_INTERVAL_TYPE;
const DEFAULT_INTERVAL_VALUE = 300000; // ms

exports.DEFAULT_INTERVAL_VALUE = DEFAULT_INTERVAL_VALUE;
const DEFAULT_TIMEPICKER_QUICK_RANGES = 'timepicker:quickRanges';
exports.DEFAULT_TIMEPICKER_QUICK_RANGES = DEFAULT_TIMEPICKER_QUICK_RANGES;
const SCROLLING_DISABLED_CLASS_NAME = 'scrolling-disabled';
exports.SCROLLING_DISABLED_CLASS_NAME = SCROLLING_DISABLED_CLASS_NAME;
const GLOBAL_HEADER_HEIGHT = 98; // px

exports.GLOBAL_HEADER_HEIGHT = GLOBAL_HEADER_HEIGHT;
const FILTERS_GLOBAL_HEIGHT = 109; // px

exports.FILTERS_GLOBAL_HEIGHT = FILTERS_GLOBAL_HEIGHT;
const FULL_SCREEN_TOGGLED_CLASS_NAME = 'fullScreenToggled';
exports.FULL_SCREEN_TOGGLED_CLASS_NAME = FULL_SCREEN_TOGGLED_CLASS_NAME;
const NO_ALERT_INDEX = 'no-alert-index-049FC71A-4C2C-446F-9901-37XMC5024C51';
exports.NO_ALERT_INDEX = NO_ALERT_INDEX;
const ENDPOINT_METADATA_INDEX = 'metrics-endpoint.metadata-*';
exports.ENDPOINT_METADATA_INDEX = ENDPOINT_METADATA_INDEX;
const DEFAULT_RULE_REFRESH_INTERVAL_ON = true;
exports.DEFAULT_RULE_REFRESH_INTERVAL_ON = DEFAULT_RULE_REFRESH_INTERVAL_ON;
const DEFAULT_RULE_REFRESH_INTERVAL_VALUE = 60000; // ms

exports.DEFAULT_RULE_REFRESH_INTERVAL_VALUE = DEFAULT_RULE_REFRESH_INTERVAL_VALUE;
const DEFAULT_RULE_REFRESH_IDLE_VALUE = 2700000; // ms

exports.DEFAULT_RULE_REFRESH_IDLE_VALUE = DEFAULT_RULE_REFRESH_IDLE_VALUE;
const DEFAULT_RULE_NOTIFICATION_QUERY_SIZE = 100; // Document path where threat indicator fields are expected. Fields are used
// to enrich signals, and are copied to threat.indicator.

exports.DEFAULT_RULE_NOTIFICATION_QUERY_SIZE = DEFAULT_RULE_NOTIFICATION_QUERY_SIZE;
const DEFAULT_INDICATOR_SOURCE_PATH = 'threatintel.indicator';
exports.DEFAULT_INDICATOR_SOURCE_PATH = DEFAULT_INDICATOR_SOURCE_PATH;
const INDICATOR_DESTINATION_PATH = 'threat.indicator';
exports.INDICATOR_DESTINATION_PATH = INDICATOR_DESTINATION_PATH;
let SecurityPageName;
exports.SecurityPageName = SecurityPageName;

(function (SecurityPageName) {
  SecurityPageName["detections"] = "detections";
  SecurityPageName["overview"] = "overview";
  SecurityPageName["hosts"] = "hosts";
  SecurityPageName["network"] = "network";
  SecurityPageName["timelines"] = "timelines";
  SecurityPageName["case"] = "case";
  SecurityPageName["administration"] = "administration";
})(SecurityPageName || (exports.SecurityPageName = SecurityPageName = {}));

const APP_OVERVIEW_PATH = `${APP_PATH}/overview`;
exports.APP_OVERVIEW_PATH = APP_OVERVIEW_PATH;
const APP_DETECTIONS_PATH = `${APP_PATH}/detections`;
exports.APP_DETECTIONS_PATH = APP_DETECTIONS_PATH;
const APP_HOSTS_PATH = `${APP_PATH}/hosts`;
exports.APP_HOSTS_PATH = APP_HOSTS_PATH;
const APP_NETWORK_PATH = `${APP_PATH}/network`;
exports.APP_NETWORK_PATH = APP_NETWORK_PATH;
const APP_TIMELINES_PATH = `${APP_PATH}/timelines`;
exports.APP_TIMELINES_PATH = APP_TIMELINES_PATH;
const APP_CASES_PATH = `${APP_PATH}/cases`;
exports.APP_CASES_PATH = APP_CASES_PATH;
const APP_MANAGEMENT_PATH = `${APP_PATH}/administration`;
exports.APP_MANAGEMENT_PATH = APP_MANAGEMENT_PATH;
const DETECTIONS_SUB_PLUGIN_ID = `${APP_ID}:${SecurityPageName.detections}`;
/** The comma-delimited list of Elasticsearch indices from which the SIEM app collects events */

exports.DETECTIONS_SUB_PLUGIN_ID = DETECTIONS_SUB_PLUGIN_ID;
const DEFAULT_INDEX_PATTERN = ['apm-*-transaction*', 'auditbeat-*', 'endgame-*', 'filebeat-*', 'logs-*', 'packetbeat-*', 'winlogbeat-*'];
/** This Kibana Advanced Setting enables the `Security news` feed widget */

exports.DEFAULT_INDEX_PATTERN = DEFAULT_INDEX_PATTERN;
const ENABLE_NEWS_FEED_SETTING = 'securitySolution:enableNewsFeed';
/** This Kibana Advanced Setting sets the auto refresh interval for the detections all rules table */

exports.ENABLE_NEWS_FEED_SETTING = ENABLE_NEWS_FEED_SETTING;
const DEFAULT_RULES_TABLE_REFRESH_SETTING = 'securitySolution:rulesTableRefresh';
/** This Kibana Advanced Setting specifies the URL of the News feed widget */

exports.DEFAULT_RULES_TABLE_REFRESH_SETTING = DEFAULT_RULES_TABLE_REFRESH_SETTING;
const NEWS_FEED_URL_SETTING = 'securitySolution:newsFeedUrl';
/** The default value for News feed widget */

exports.NEWS_FEED_URL_SETTING = NEWS_FEED_URL_SETTING;
const NEWS_FEED_URL_SETTING_DEFAULT = 'https://feeds.elastic.co/security-solution';
/** This Kibana Advanced Setting specifies the URLs of `IP Reputation Links`*/

exports.NEWS_FEED_URL_SETTING_DEFAULT = NEWS_FEED_URL_SETTING_DEFAULT;
const IP_REPUTATION_LINKS_SETTING = 'securitySolution:ipReputationLinks';
/** The default value for `IP Reputation Links` */

exports.IP_REPUTATION_LINKS_SETTING = IP_REPUTATION_LINKS_SETTING;
const IP_REPUTATION_LINKS_SETTING_DEFAULT = `[
  { "name": "virustotal.com", "url_template": "https://www.virustotal.com/gui/search/{{ip}}" },
  { "name": "talosIntelligence.com", "url_template": "https://talosintelligence.com/reputation_center/lookup?search={{ip}}" }
]`;
/**
 * Id for the signals alerting type
 */

exports.IP_REPUTATION_LINKS_SETTING_DEFAULT = IP_REPUTATION_LINKS_SETTING_DEFAULT;
const SIGNALS_ID = `siem.signals`;
/**
 * Id for the notifications alerting type
 */

exports.SIGNALS_ID = SIGNALS_ID;
const NOTIFICATIONS_ID = `siem.notifications`;
/**
 * Special internal structure for tags for signals. This is used
 * to filter out tags that have internal structures within them.
 */

exports.NOTIFICATIONS_ID = NOTIFICATIONS_ID;
const INTERNAL_IDENTIFIER = '__internal';
exports.INTERNAL_IDENTIFIER = INTERNAL_IDENTIFIER;
const INTERNAL_RULE_ID_KEY = `${INTERNAL_IDENTIFIER}_rule_id`;
exports.INTERNAL_RULE_ID_KEY = INTERNAL_RULE_ID_KEY;
const INTERNAL_RULE_ALERT_ID_KEY = `${INTERNAL_IDENTIFIER}_rule_alert_id`;
exports.INTERNAL_RULE_ALERT_ID_KEY = INTERNAL_RULE_ALERT_ID_KEY;
const INTERNAL_IMMUTABLE_KEY = `${INTERNAL_IDENTIFIER}_immutable`;
/**
 * Detection engine routes
 */

exports.INTERNAL_IMMUTABLE_KEY = INTERNAL_IMMUTABLE_KEY;
const DETECTION_ENGINE_URL = '/api/detection_engine';
exports.DETECTION_ENGINE_URL = DETECTION_ENGINE_URL;
const DETECTION_ENGINE_RULES_URL = `${DETECTION_ENGINE_URL}/rules`;
exports.DETECTION_ENGINE_RULES_URL = DETECTION_ENGINE_RULES_URL;
const DETECTION_ENGINE_PREPACKAGED_URL = `${DETECTION_ENGINE_RULES_URL}/prepackaged`;
exports.DETECTION_ENGINE_PREPACKAGED_URL = DETECTION_ENGINE_PREPACKAGED_URL;
const DETECTION_ENGINE_PRIVILEGES_URL = `${DETECTION_ENGINE_URL}/privileges`;
exports.DETECTION_ENGINE_PRIVILEGES_URL = DETECTION_ENGINE_PRIVILEGES_URL;
const DETECTION_ENGINE_INDEX_URL = `${DETECTION_ENGINE_URL}/index`;
exports.DETECTION_ENGINE_INDEX_URL = DETECTION_ENGINE_INDEX_URL;
const DETECTION_ENGINE_TAGS_URL = `${DETECTION_ENGINE_URL}/tags`;
exports.DETECTION_ENGINE_TAGS_URL = DETECTION_ENGINE_TAGS_URL;
const DETECTION_ENGINE_RULES_STATUS_URL = `${DETECTION_ENGINE_RULES_URL}/_find_statuses`;
exports.DETECTION_ENGINE_RULES_STATUS_URL = DETECTION_ENGINE_RULES_STATUS_URL;
const DETECTION_ENGINE_PREPACKAGED_RULES_STATUS_URL = `${DETECTION_ENGINE_RULES_URL}/prepackaged/_status`;
exports.DETECTION_ENGINE_PREPACKAGED_RULES_STATUS_URL = DETECTION_ENGINE_PREPACKAGED_RULES_STATUS_URL;
const TIMELINE_URL = '/api/timeline';
exports.TIMELINE_URL = TIMELINE_URL;
const TIMELINE_DRAFT_URL = `${TIMELINE_URL}/_draft`;
exports.TIMELINE_DRAFT_URL = TIMELINE_DRAFT_URL;
const TIMELINE_EXPORT_URL = `${TIMELINE_URL}/_export`;
exports.TIMELINE_EXPORT_URL = TIMELINE_EXPORT_URL;
const TIMELINE_IMPORT_URL = `${TIMELINE_URL}/_import`;
exports.TIMELINE_IMPORT_URL = TIMELINE_IMPORT_URL;
const TIMELINE_PREPACKAGED_URL = `${TIMELINE_URL}/_prepackaged`;
/**
 * Default signals index key for kibana.dev.yml
 */

exports.TIMELINE_PREPACKAGED_URL = TIMELINE_PREPACKAGED_URL;
const SIGNALS_INDEX_KEY = 'signalsIndex';
exports.SIGNALS_INDEX_KEY = SIGNALS_INDEX_KEY;
const DETECTION_ENGINE_SIGNALS_URL = `${DETECTION_ENGINE_URL}/signals`;
exports.DETECTION_ENGINE_SIGNALS_URL = DETECTION_ENGINE_SIGNALS_URL;
const DETECTION_ENGINE_SIGNALS_STATUS_URL = `${DETECTION_ENGINE_SIGNALS_URL}/status`;
exports.DETECTION_ENGINE_SIGNALS_STATUS_URL = DETECTION_ENGINE_SIGNALS_STATUS_URL;
const DETECTION_ENGINE_QUERY_SIGNALS_URL = `${DETECTION_ENGINE_SIGNALS_URL}/search`;
exports.DETECTION_ENGINE_QUERY_SIGNALS_URL = DETECTION_ENGINE_QUERY_SIGNALS_URL;
const DETECTION_ENGINE_SIGNALS_MIGRATION_URL = `${DETECTION_ENGINE_SIGNALS_URL}/migration`;
exports.DETECTION_ENGINE_SIGNALS_MIGRATION_URL = DETECTION_ENGINE_SIGNALS_MIGRATION_URL;
const DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL = `${DETECTION_ENGINE_SIGNALS_URL}/migration_status`;
exports.DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL = DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL;
const DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL = `${DETECTION_ENGINE_SIGNALS_URL}/finalize_migration`;
/**
 * Common naming convention for an unauthenticated user
 */

exports.DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL = DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL;
const UNAUTHENTICATED_USER = 'Unauthenticated';
/*
  Licensing requirements
 */

exports.UNAUTHENTICATED_USER = UNAUTHENTICATED_USER;
const MINIMUM_ML_LICENSE = 'platinum';
/*
  Machine Learning constants
 */

exports.MINIMUM_ML_LICENSE = MINIMUM_ML_LICENSE;
const ML_GROUP_ID = 'security';
exports.ML_GROUP_ID = ML_GROUP_ID;
const LEGACY_ML_GROUP_ID = 'siem';
exports.LEGACY_ML_GROUP_ID = LEGACY_ML_GROUP_ID;
const ML_GROUP_IDS = [ML_GROUP_ID, LEGACY_ML_GROUP_ID];
/*
  Rule notifications options
*/

exports.ML_GROUP_IDS = ML_GROUP_IDS;
const ENABLE_CASE_CONNECTOR = false;
exports.ENABLE_CASE_CONNECTOR = ENABLE_CASE_CONNECTOR;
const NOTIFICATION_SUPPORTED_ACTION_TYPES_IDS = ['.email', '.slack', '.pagerduty', '.webhook', '.servicenow', '.jira', '.resilient', '.teams'];
exports.NOTIFICATION_SUPPORTED_ACTION_TYPES_IDS = NOTIFICATION_SUPPORTED_ACTION_TYPES_IDS;

if (ENABLE_CASE_CONNECTOR) {
  NOTIFICATION_SUPPORTED_ACTION_TYPES_IDS.push('.case');
}

const NOTIFICATION_THROTTLE_NO_ACTIONS = 'no_actions';
exports.NOTIFICATION_THROTTLE_NO_ACTIONS = NOTIFICATION_THROTTLE_NO_ACTIONS;
const NOTIFICATION_THROTTLE_RULE = 'rule';
/**
 * Histograms for fields named in this list should be displayed with an
 * "All others" bucket, to count events that don't specify a value for
 * the field being counted
 */

exports.NOTIFICATION_THROTTLE_RULE = NOTIFICATION_THROTTLE_RULE;
const showAllOthersBucket = ['destination.ip', 'event.action', 'event.category', 'event.dataset', 'event.module', 'signal.rule.threat.tactic.name', 'source.ip', 'destination.ip', 'user.name'];
exports.showAllOthersBucket = showAllOthersBucket;