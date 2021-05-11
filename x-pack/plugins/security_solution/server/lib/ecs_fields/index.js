"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventFieldsMap = exports.ruleFieldsMap = exports.signalFieldsMap = exports.systemFieldsMap = exports.eventBaseFieldsMap = exports.endgameFieldsMap = exports.dnsFieldsMap = exports.geoFieldsMap = exports.networkFieldsMap = exports.destinationFieldsMap = exports.sourceFieldsMap = exports.zeekFieldsMap = exports.httpFieldsMap = exports.urlFieldsMap = exports.tlsFieldsMap = exports.suricataFieldsMap = exports.winlogFieldsMap = exports.userFieldsMap = exports.agentFieldsMap = exports.processFieldsMap = exports.hostFieldsMap = exports.osFieldsMap = exports.fileMap = exports.cloudFieldsMap = exports.auditdMap = void 0;

var _extend_map = require("./extend_map");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const auditdMap = {
  'auditd.result': 'auditd.result',
  'auditd.session': 'auditd.session',
  'auditd.data.acct': 'auditd.data.acct',
  'auditd.data.terminal': 'auditd.data.terminal',
  'auditd.data.op': 'auditd.data.op',
  'auditd.summary.actor.primary': 'auditd.summary.actor.primary',
  'auditd.summary.actor.secondary': 'auditd.summary.actor.secondary',
  'auditd.summary.object.primary': 'auditd.summary.object.primary',
  'auditd.summary.object.secondary': 'auditd.summary.object.secondary',
  'auditd.summary.object.type': 'auditd.summary.object.type',
  'auditd.summary.how': 'auditd.summary.how',
  'auditd.summary.message_type': 'auditd.summary.message_type',
  'auditd.summary.sequence': 'auditd.summary.sequence'
};
exports.auditdMap = auditdMap;
const cloudFieldsMap = {
  'cloud.account.id': 'cloud.account.id',
  'cloud.availability_zone': 'cloud.availability_zone',
  'cloud.instance.id': 'cloud.instance.id',
  'cloud.instance.name': 'cloud.instance.name',
  'cloud.machine.type': 'cloud.machine.type',
  'cloud.provider': 'cloud.provider',
  'cloud.region': 'cloud.region'
};
exports.cloudFieldsMap = cloudFieldsMap;
const fileMap = {
  'file.name': 'file.name',
  'file.path': 'file.path',
  'file.target_path': 'file.target_path',
  'file.extension': 'file.extension',
  'file.type': 'file.type',
  'file.device': 'file.device',
  'file.inode': 'file.inode',
  'file.uid': 'file.uid',
  'file.owner': 'file.owner',
  'file.gid': 'file.gid',
  'file.group': 'file.group',
  'file.mode': 'file.mode',
  'file.size': 'file.size',
  'file.mtime': 'file.mtime',
  'file.ctime': 'file.ctime'
};
exports.fileMap = fileMap;
const osFieldsMap = {
  'os.platform': 'os.platform',
  'os.name': 'os.name',
  'os.full': 'os.full',
  'os.family': 'os.family',
  'os.version': 'os.version',
  'os.kernel': 'os.kernel'
};
exports.osFieldsMap = osFieldsMap;
const hostFieldsMap = {
  'host.architecture': 'host.architecture',
  'host.id': 'host.id',
  'host.ip': 'host.ip',
  'host.mac': 'host.mac',
  'host.name': 'host.name',
  ...(0, _extend_map.extendMap)('host', osFieldsMap)
};
exports.hostFieldsMap = hostFieldsMap;
const processFieldsMap = {
  'process.hash.md5': 'process.hash.md5',
  'process.hash.sha1': 'process.hash.sha1',
  'process.hash.sha256': 'process.hash.sha256',
  'process.pid': 'process.pid',
  'process.name': 'process.name',
  'process.ppid': 'process.ppid',
  'process.args': 'process.args',
  'process.entity_id': 'process.entity_id',
  'process.executable': 'process.executable',
  'process.title': 'process.title',
  'process.thread': 'process.thread',
  'process.working_directory': 'process.working_directory'
};
exports.processFieldsMap = processFieldsMap;
const agentFieldsMap = {
  'agent.type': 'agent.type',
  'agent.id': 'agent.id'
};
exports.agentFieldsMap = agentFieldsMap;
const userFieldsMap = {
  'user.domain': 'user.domain',
  'user.id': 'user.id',
  'user.name': 'user.name',
  // NOTE: This field is not tested and available from ECS. Please remove this tag once it is
  'user.full_name': 'user.full_name',
  // NOTE: This field is not tested and available from ECS. Please remove this tag once it is
  'user.email': 'user.email',
  // NOTE: This field is not tested and available from ECS. Please remove this tag once it is
  'user.hash': 'user.hash',
  // NOTE: This field is not tested and available from ECS. Please remove this tag once it is
  'user.group': 'user.group'
};
exports.userFieldsMap = userFieldsMap;
const winlogFieldsMap = {
  'winlog.event_id': 'winlog.event_id'
};
exports.winlogFieldsMap = winlogFieldsMap;
const suricataFieldsMap = {
  'suricata.eve.flow_id': 'suricata.eve.flow_id',
  'suricata.eve.proto': 'suricata.eve.proto',
  'suricata.eve.alert.signature': 'suricata.eve.alert.signature',
  'suricata.eve.alert.signature_id': 'suricata.eve.alert.signature_id'
};
exports.suricataFieldsMap = suricataFieldsMap;
const tlsFieldsMap = {
  'tls.client_certificate.fingerprint.sha1': 'tls.client_certificate.fingerprint.sha1',
  'tls.fingerprints.ja3.hash': 'tls.fingerprints.ja3.hash',
  'tls.server_certificate.fingerprint.sha1': 'tls.server_certificate.fingerprint.sha1'
};
exports.tlsFieldsMap = tlsFieldsMap;
const urlFieldsMap = {
  'url.original': 'url.original',
  'url.domain': 'url.domain',
  'user.username': 'user.username',
  'user.password': 'user.password'
};
exports.urlFieldsMap = urlFieldsMap;
const httpFieldsMap = {
  'http.version': 'http.version',
  'http.request': 'http.request',
  'http.request.method': 'http.request.method',
  'http.request.body.bytes': 'http.request.body.bytes',
  'http.request.body.content': 'http.request.body.content',
  'http.request.referrer': 'http.request.referrer',
  'http.response.status_code': 'http.response.status_code',
  'http.response.body': 'http.response.body',
  'http.response.body.bytes': 'http.response.body.bytes',
  'http.response.body.content': 'http.response.body.content'
};
exports.httpFieldsMap = httpFieldsMap;
const zeekFieldsMap = {
  'zeek.session_id': 'zeek.session_id',
  'zeek.connection.local_resp': 'zeek.connection.local_resp',
  'zeek.connection.local_orig': 'zeek.connection.local_orig',
  'zeek.connection.missed_bytes': 'zeek.connection.missed_bytes',
  'zeek.connection.state': 'zeek.connection.state',
  'zeek.connection.history': 'zeek.connection.history',
  'zeek.notice.suppress_for': 'zeek.notice.suppress_for',
  'zeek.notice.msg': 'zeek.notice.msg',
  'zeek.notice.note': 'zeek.notice.note',
  'zeek.notice.sub': 'zeek.notice.sub',
  'zeek.notice.dst': 'zeek.notice.dst',
  'zeek.notice.dropped': 'zeek.notice.dropped',
  'zeek.notice.peer_descr': 'zeek.notice.peer_descr',
  'zeek.dns.AA': 'zeek.dns.AA',
  'zeek.dns.qclass_name': 'zeek.dns.qclass_name',
  'zeek.dns.RD': 'zeek.dns.RD',
  'zeek.dns.qtype_name': 'zeek.dns.qtype_name',
  'zeek.dns.qtype': 'zeek.dns.qtype',
  'zeek.dns.query': 'zeek.dns.query',
  'zeek.dns.trans_id': 'zeek.dns.trans_id',
  'zeek.dns.qclass': 'zeek.dns.qclass',
  'zeek.dns.RA': 'zeek.dns.RA',
  'zeek.dns.TC': 'zeek.dns.TC',
  'zeek.http.resp_mime_types': 'zeek.http.resp_mime_types',
  'zeek.http.trans_depth': 'zeek.http.trans_depth',
  'zeek.http.status_msg': 'zeek.http.status_msg',
  'zeek.http.resp_fuids': 'zeek.http.resp_fuids',
  'zeek.http.tags': 'zeek.http.tags',
  'zeek.files.session_ids': 'zeek.files.session_ids',
  'zeek.files.timedout': 'zeek.files.timedout',
  'zeek.files.local_orig': 'zeek.files.local_orig',
  'zeek.files.tx_host': 'zeek.files.tx_host',
  'zeek.files.source': 'zeek.files.source',
  'zeek.files.is_orig': 'zeek.files.is_orig',
  'zeek.files.overflow_bytes': 'zeek.files.overflow_bytes',
  'zeek.files.sha1': 'zeek.files.sha1',
  'zeek.files.duration': 'zeek.files.duration',
  'zeek.files.depth': 'zeek.files.depth',
  'zeek.files.analyzers': 'zeek.files.analyzers',
  'zeek.files.mime_type': 'zeek.files.mime_type',
  'zeek.files.rx_host': 'zeek.files.rx_host',
  'zeek.files.total_bytes': 'zeek.files.total_bytes',
  'zeek.files.fuid': 'zeek.files.fuid',
  'zeek.files.seen_bytes': 'zeek.files.seen_bytes',
  'zeek.files.missing_bytes': 'zeek.files.missing_bytes',
  'zeek.files.md5': 'zeek.files.md5',
  'zeek.ssl.cipher': 'zeek.ssl.cipher',
  'zeek.ssl.established': 'zeek.ssl.established',
  'zeek.ssl.resumed': 'zeek.ssl.resumed',
  'zeek.ssl.version': 'zeek.ssl.version'
};
exports.zeekFieldsMap = zeekFieldsMap;
const sourceFieldsMap = {
  'source.bytes': 'source.bytes',
  'source.ip': 'source.ip',
  'source.packets': 'source.packets',
  'source.port': 'source.port',
  'source.domain': 'source.domain',
  'source.geo.continent_name': 'source.geo.continent_name',
  'source.geo.country_name': 'source.geo.country_name',
  'source.geo.country_iso_code': 'source.geo.country_iso_code',
  'source.geo.city_name': 'source.geo.city_name',
  'source.geo.region_iso_code': 'source.geo.region_iso_code',
  'source.geo.region_name': 'source.geo.region_name'
};
exports.sourceFieldsMap = sourceFieldsMap;
const destinationFieldsMap = {
  'destination.bytes': 'destination.bytes',
  'destination.ip': 'destination.ip',
  'destination.packets': 'destination.packets',
  'destination.port': 'destination.port',
  'destination.domain': 'destination.domain',
  'destination.geo.continent_name': 'destination.geo.continent_name',
  'destination.geo.country_name': 'destination.geo.country_name',
  'destination.geo.country_iso_code': 'destination.geo.country_iso_code',
  'destination.geo.city_name': 'destination.geo.city_name',
  'destination.geo.region_iso_code': 'destination.geo.region_iso_code',
  'destination.geo.region_name': 'destination.geo.region_name'
};
exports.destinationFieldsMap = destinationFieldsMap;
const networkFieldsMap = {
  'network.bytes': 'network.bytes',
  'network.community_id': 'network.community_id',
  'network.direction': 'network.direction',
  'network.packets': 'network.packets',
  'network.protocol': 'network.protocol',
  'network.transport': 'network.transport'
};
exports.networkFieldsMap = networkFieldsMap;
const geoFieldsMap = {
  'geo.region_name': 'destination.geo.region_name',
  'geo.country_iso_code': 'destination.geo.country_iso_code'
};
exports.geoFieldsMap = geoFieldsMap;
const dnsFieldsMap = {
  'dns.question.name': 'dns.question.name',
  'dns.question.type': 'dns.question.type',
  'dns.resolved_ip': 'dns.resolved_ip',
  'dns.response_code': 'dns.response_code'
};
exports.dnsFieldsMap = dnsFieldsMap;
const endgameFieldsMap = {
  'endgame.exit_code': 'endgame.exit_code',
  'endgame.file_name': 'endgame.file_name',
  'endgame.file_path': 'endgame.file_path',
  'endgame.logon_type': 'endgame.logon_type',
  'endgame.parent_process_name': 'endgame.parent_process_name',
  'endgame.pid': 'endgame.pid',
  'endgame.process_name': 'endgame.process_name',
  'endgame.subject_domain_name': 'endgame.subject_domain_name',
  'endgame.subject_logon_id': 'endgame.subject_logon_id',
  'endgame.subject_user_name': 'endgame.subject_user_name',
  'endgame.target_domain_name': 'endgame.target_domain_name',
  'endgame.target_logon_id': 'endgame.target_logon_id',
  'endgame.target_user_name': 'endgame.target_user_name'
};
exports.endgameFieldsMap = endgameFieldsMap;
const eventBaseFieldsMap = {
  'event.action': 'event.action',
  'event.category': 'event.category',
  'event.code': 'event.code',
  'event.created': 'event.created',
  'event.dataset': 'event.dataset',
  'event.duration': 'event.duration',
  'event.end': 'event.end',
  'event.hash': 'event.hash',
  'event.id': 'event.id',
  'event.kind': 'event.kind',
  'event.module': 'event.module',
  'event.original': 'event.original',
  'event.outcome': 'event.outcome',
  'event.risk_score': 'event.risk_score',
  'event.risk_score_norm': 'event.risk_score_norm',
  'event.severity': 'event.severity',
  'event.start': 'event.start',
  'event.timezone': 'event.timezone',
  'event.type': 'event.type'
};
exports.eventBaseFieldsMap = eventBaseFieldsMap;
const systemFieldsMap = {
  'system.audit.package.arch': 'system.audit.package.arch',
  'system.audit.package.entity_id': 'system.audit.package.entity_id',
  'system.audit.package.name': 'system.audit.package.name',
  'system.audit.package.size': 'system.audit.package.size',
  'system.audit.package.summary': 'system.audit.package.summary',
  'system.audit.package.version': 'system.audit.package.version',
  'system.auth.ssh.signature': 'system.auth.ssh.signature',
  'system.auth.ssh.method': 'system.auth.ssh.method'
};
exports.systemFieldsMap = systemFieldsMap;
const signalFieldsMap = {
  'signal.original_time': 'signal.original_time',
  'signal.rule.id': 'signal.rule.id',
  'signal.rule.saved_id': 'signal.rule.saved_id',
  'signal.rule.timeline_id': 'signal.rule.timeline_id',
  'signal.rule.timeline_title': 'signal.rule.timeline_title',
  'signal.rule.output_index': 'signal.rule.output_index',
  'signal.rule.from': 'signal.rule.from',
  'signal.rule.index': 'signal.rule.index',
  'signal.rule.language': 'signal.rule.language',
  'signal.rule.query': 'signal.rule.query',
  'signal.rule.to': 'signal.rule.to',
  'signal.rule.filters': 'signal.rule.filters',
  'signal.rule.rule_id': 'signal.rule.rule_id',
  'signal.rule.false_positives': 'signal.rule.false_positives',
  'signal.rule.max_signals': 'signal.rule.max_signals',
  'signal.rule.risk_score': 'signal.rule.risk_score',
  'signal.rule.description': 'signal.rule.description',
  'signal.rule.name': 'signal.rule.name',
  'signal.rule.immutable': 'signal.rule.immutable',
  'signal.rule.references': 'signal.rule.references',
  'signal.rule.severity': 'signal.rule.severity',
  'signal.rule.tags': 'signal.rule.tags',
  'signal.rule.threat': 'signal.rule.threat',
  'signal.rule.type': 'signal.rule.type',
  'signal.rule.size': 'signal.rule.size',
  'signal.rule.enabled': 'signal.rule.enabled',
  'signal.rule.created_at': 'signal.rule.created_at',
  'signal.rule.updated_at': 'signal.rule.updated_at',
  'signal.rule.created_by': 'signal.rule.created_by',
  'signal.rule.updated_by': 'signal.rule.updated_by',
  'signal.rule.version': 'signal.rule.version',
  'signal.rule.note': 'signal.rule.note',
  'signal.rule.threshold': 'signal.rule.threshold',
  'signal.rule.exceptions_list': 'signal.rule.exceptions_list',
  'signal.status': 'signal.status'
};
exports.signalFieldsMap = signalFieldsMap;
const ruleFieldsMap = {
  'rule.reference': 'rule.reference'
};
exports.ruleFieldsMap = ruleFieldsMap;
const eventFieldsMap = {
  timestamp: '@timestamp',
  '@timestamp': '@timestamp',
  message: 'message',
  ...{ ...agentFieldsMap
  },
  ...{ ...auditdMap
  },
  ...{ ...destinationFieldsMap
  },
  ...{ ...dnsFieldsMap
  },
  ...{ ...endgameFieldsMap
  },
  ...{ ...eventBaseFieldsMap
  },
  ...{ ...fileMap
  },
  ...{ ...geoFieldsMap
  },
  ...{ ...hostFieldsMap
  },
  ...{ ...networkFieldsMap
  },
  ...{ ...ruleFieldsMap
  },
  ...{ ...signalFieldsMap
  },
  ...{ ...sourceFieldsMap
  },
  ...{ ...suricataFieldsMap
  },
  ...{ ...systemFieldsMap
  },
  ...{ ...tlsFieldsMap
  },
  ...{ ...zeekFieldsMap
  },
  ...{ ...httpFieldsMap
  },
  ...{ ...userFieldsMap
  },
  ...{ ...winlogFieldsMap
  },
  ...{ ...processFieldsMap
  }
};
exports.eventFieldsMap = eventFieldsMap;