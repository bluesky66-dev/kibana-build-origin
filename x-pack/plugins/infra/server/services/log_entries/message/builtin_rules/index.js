"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBuiltinRules = void 0;

var _filebeat_apache = require("./filebeat_apache2");

var _filebeat_auditd = require("./filebeat_auditd");

var _filebeat_haproxy = require("./filebeat_haproxy");

var _filebeat_icinga = require("./filebeat_icinga");

var _filebeat_iis = require("./filebeat_iis");

var _filebeat_logstash = require("./filebeat_logstash");

var _filebeat_mongodb = require("./filebeat_mongodb");

var _filebeat_mysql = require("./filebeat_mysql");

var _filebeat_nginx = require("./filebeat_nginx");

var _filebeat_osquery = require("./filebeat_osquery");

var _filebeat_redis = require("./filebeat_redis");

var _filebeat_system = require("./filebeat_system");

var _filebeat_traefik = require("./filebeat_traefik");

var _generic = require("./generic");

var _generic_webserver = require("./generic_webserver");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getBuiltinRules = genericMessageFields => [..._filebeat_apache.filebeatApache2Rules, ..._filebeat_nginx.filebeatNginxRules, ..._filebeat_redis.filebeatRedisRules, ..._filebeat_system.filebeatSystemRules, ..._filebeat_mysql.filebeatMySQLRules, ..._filebeat_auditd.filebeatAuditdRules, ..._filebeat_haproxy.filebeatHaproxyRules, ..._filebeat_icinga.filebeatIcingaRules, ..._filebeat_iis.filebeatIisRules, ..._filebeat_logstash.filebeatLogstashRules, ..._filebeat_mongodb.filebeatMongodbRules, ..._filebeat_osquery.filebeatOsqueryRules, ..._filebeat_traefik.filebeatTraefikRules, ..._generic_webserver.genericWebserverRules, ...(0, _generic.getGenericRules)(genericMessageFields), {
  when: {
    exists: ['log.path']
  },
  format: [{
    constant: 'failed to format message from '
  }, {
    field: 'log.path'
  }]
}, {
  when: {
    exists: []
  },
  format: [{
    constant: 'failed to find message'
  }]
}];

exports.getBuiltinRules = getBuiltinRules;