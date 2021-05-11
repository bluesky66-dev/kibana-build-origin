"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleEcsFieldResolvers = exports.SignalFieldResolvers = exports.RuleFieldResolvers = exports.SystemEcsFieldResolvers = exports.AuthEcsFieldsResolvers = exports.SshEcsFieldsResolvers = exports.AuditEcsFieldsResolvers = exports.PackageEcsFieldsResolvers = exports.NetworkEcsFieldResolvers = exports.WinlogEcsFieldsResolvers = exports.UserEcsFieldsResolvers = exports.ZeekEcsFieldsResolvers = exports.ZeekSslDataResolvers = exports.ZeekFileDataResolvers = exports.UrlEcsFieldsResolvers = exports.HttpEcsFieldsResolvers = exports.HttpResponseDataResolvers = exports.HttpRequestDataResolvers = exports.HttpBodyDataResolvers = exports.ZeekHttpDataResolvers = exports.FileFieldsResolvers = exports.ZeekDnsDataResolvers = exports.ZeekNoticeDataResolvers = exports.ZeekConnectionDataResolvers = exports.TlsEcsFieldsResolvers = exports.TlsFingerprintsDataResolvers = exports.TlsServerCertificateDataResolvers = exports.TlsClientCertificateDataResolvers = exports.FingerprintDataResolvers = exports.TlsJa3DataResolvers = exports.SuricataEcsFieldsResolvers = exports.SuricataEveDataResolvers = exports.SuricataAlertDataResolvers = exports.EndgameEcsFieldsResolvers = exports.DnsEcsFieldsResolvers = exports.DnsQuestionDataResolvers = exports.DestinationEcsFieldsResolvers = exports.SourceEcsFieldsResolvers = exports.ProcessEcsFieldsResolvers = exports.ProcessHashDataResolvers = exports.ThreadResolvers = exports.AuditdEcsFieldsResolvers = exports.AuditdDataResolvers = exports.AgentEcsFieldResolvers = exports.SummaryResolvers = exports.PrimarySecondaryResolvers = exports.GeoEcsFieldsResolvers = exports.LocationResolvers = exports.EventEcsFieldsResolvers = exports.ResponseFavoriteTimelineResolvers = exports.ResponseTimelineResolvers = exports.ResponseNoteResolvers = exports.MutationResolvers = exports.ResponseTimelinesResolvers = exports.KueryFilterQueryResultResolvers = exports.SerializedKueryQueryResultResolvers = exports.SerializedFilterQueryResultResolvers = exports.FilterMetaTimelineResultResolvers = exports.FilterTimelineResultResolvers = exports.FavoriteTimelineResultResolvers = exports.EqlOptionsResultResolvers = exports.DateRangePickerResultResolvers = exports.QueryMatchResultResolvers = exports.DataProviderResultResolvers = exports.ColumnHeaderResultResolvers = exports.TimelineResultResolvers = exports.FirstLastSeenHostResolvers = exports.PageInfoPaginatedResolvers = exports.CursorTypeResolvers = exports.InspectResolvers = exports.OsEcsFieldsResolvers = exports.HostEcsFieldsResolvers = exports.EndpointFieldsResolvers = exports.CloudMachineResolvers = exports.CloudInstanceResolvers = exports.CloudFieldsResolvers = exports.AgentFieldsResolvers = exports.HostItemResolvers = exports.HostsEdgesResolvers = exports.HostsDataResolvers = exports.SourceStatusResolvers = exports.SourceFieldsResolvers = exports.SourceConfigurationResolvers = exports.SourceResolvers = exports.PinnedEventResolvers = exports.ResponseNotesResolvers = exports.NoteResultResolvers = exports.QueryResolvers = exports.FlowDirection = exports.FlowTargetSourceDest = exports.FlowTarget = exports.SortFieldTimeline = exports.TimelineStatus = exports.RowRendererId = exports.DataProviderType = exports.TimelineType = exports.HostPolicyResponseActionStatus = exports.HostsFields = exports.Direction = exports.SortFieldNote = void 0;
exports.PageInfoResolvers = exports.IndexFieldResolvers = exports.HostFieldsResolvers = exports.OsFieldsResolvers = exports.EcsEdgesResolvers = exports.EcsResolvers = void 0;
/* tslint:disable */

/* eslint-disable */

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let SortFieldNote;
exports.SortFieldNote = SortFieldNote;

(function (SortFieldNote) {
  SortFieldNote["updatedBy"] = "updatedBy";
  SortFieldNote["updated"] = "updated";
})(SortFieldNote || (exports.SortFieldNote = SortFieldNote = {}));

let Direction;
exports.Direction = Direction;

(function (Direction) {
  Direction["asc"] = "asc";
  Direction["desc"] = "desc";
})(Direction || (exports.Direction = Direction = {}));

let HostsFields;
exports.HostsFields = HostsFields;

(function (HostsFields) {
  HostsFields["hostName"] = "hostName";
  HostsFields["lastSeen"] = "lastSeen";
})(HostsFields || (exports.HostsFields = HostsFields = {}));

let HostPolicyResponseActionStatus;
exports.HostPolicyResponseActionStatus = HostPolicyResponseActionStatus;

(function (HostPolicyResponseActionStatus) {
  HostPolicyResponseActionStatus["success"] = "success";
  HostPolicyResponseActionStatus["failure"] = "failure";
  HostPolicyResponseActionStatus["warning"] = "warning";
  HostPolicyResponseActionStatus["unsupported"] = "unsupported";
})(HostPolicyResponseActionStatus || (exports.HostPolicyResponseActionStatus = HostPolicyResponseActionStatus = {}));

let TimelineType;
exports.TimelineType = TimelineType;

(function (TimelineType) {
  TimelineType["default"] = "default";
  TimelineType["template"] = "template";
})(TimelineType || (exports.TimelineType = TimelineType = {}));

let DataProviderType;
exports.DataProviderType = DataProviderType;

(function (DataProviderType) {
  DataProviderType["default"] = "default";
  DataProviderType["template"] = "template";
})(DataProviderType || (exports.DataProviderType = DataProviderType = {}));

let RowRendererId;
exports.RowRendererId = RowRendererId;

(function (RowRendererId) {
  RowRendererId["alerts"] = "alerts";
  RowRendererId["auditd"] = "auditd";
  RowRendererId["auditd_file"] = "auditd_file";
  RowRendererId["library"] = "library";
  RowRendererId["netflow"] = "netflow";
  RowRendererId["plain"] = "plain";
  RowRendererId["registry"] = "registry";
  RowRendererId["suricata"] = "suricata";
  RowRendererId["system"] = "system";
  RowRendererId["system_dns"] = "system_dns";
  RowRendererId["system_endgame_process"] = "system_endgame_process";
  RowRendererId["system_file"] = "system_file";
  RowRendererId["system_fim"] = "system_fim";
  RowRendererId["system_security_event"] = "system_security_event";
  RowRendererId["system_socket"] = "system_socket";
  RowRendererId["zeek"] = "zeek";
})(RowRendererId || (exports.RowRendererId = RowRendererId = {}));

let TimelineStatus;
exports.TimelineStatus = TimelineStatus;

(function (TimelineStatus) {
  TimelineStatus["active"] = "active";
  TimelineStatus["draft"] = "draft";
  TimelineStatus["immutable"] = "immutable";
})(TimelineStatus || (exports.TimelineStatus = TimelineStatus = {}));

let SortFieldTimeline;
exports.SortFieldTimeline = SortFieldTimeline;

(function (SortFieldTimeline) {
  SortFieldTimeline["title"] = "title";
  SortFieldTimeline["description"] = "description";
  SortFieldTimeline["updated"] = "updated";
  SortFieldTimeline["created"] = "created";
})(SortFieldTimeline || (exports.SortFieldTimeline = SortFieldTimeline = {}));

let FlowTarget;
exports.FlowTarget = FlowTarget;

(function (FlowTarget) {
  FlowTarget["client"] = "client";
  FlowTarget["destination"] = "destination";
  FlowTarget["server"] = "server";
  FlowTarget["source"] = "source";
})(FlowTarget || (exports.FlowTarget = FlowTarget = {}));

let FlowTargetSourceDest;
exports.FlowTargetSourceDest = FlowTargetSourceDest;

(function (FlowTargetSourceDest) {
  FlowTargetSourceDest["destination"] = "destination";
  FlowTargetSourceDest["source"] = "source";
})(FlowTargetSourceDest || (exports.FlowTargetSourceDest = FlowTargetSourceDest = {}));

let FlowDirection;
exports.FlowDirection = FlowDirection;

(function (FlowDirection) {
  FlowDirection["uniDirectional"] = "uniDirectional";
  FlowDirection["biDirectional"] = "biDirectional";
})(FlowDirection || (exports.FlowDirection = FlowDirection = {}));

let QueryResolvers;
exports.QueryResolvers = QueryResolvers;

(function (_QueryResolvers) {})(QueryResolvers || (exports.QueryResolvers = QueryResolvers = {}));

let NoteResultResolvers;
exports.NoteResultResolvers = NoteResultResolvers;

(function (_NoteResultResolvers) {})(NoteResultResolvers || (exports.NoteResultResolvers = NoteResultResolvers = {}));

let ResponseNotesResolvers;
exports.ResponseNotesResolvers = ResponseNotesResolvers;

(function (_ResponseNotesResolvers) {})(ResponseNotesResolvers || (exports.ResponseNotesResolvers = ResponseNotesResolvers = {}));

let PinnedEventResolvers;
exports.PinnedEventResolvers = PinnedEventResolvers;

(function (_PinnedEventResolvers) {})(PinnedEventResolvers || (exports.PinnedEventResolvers = PinnedEventResolvers = {}));

let SourceResolvers;
/** A set of configuration options for a security data source */

exports.SourceResolvers = SourceResolvers;

(function (_SourceResolvers) {})(SourceResolvers || (exports.SourceResolvers = SourceResolvers = {}));

let SourceConfigurationResolvers;
/** A mapping of semantic fields to their document counterparts */

exports.SourceConfigurationResolvers = SourceConfigurationResolvers;

(function (_SourceConfigurationResolvers) {})(SourceConfigurationResolvers || (exports.SourceConfigurationResolvers = SourceConfigurationResolvers = {}));

let SourceFieldsResolvers;
/** The status of an infrastructure data source */

exports.SourceFieldsResolvers = SourceFieldsResolvers;

(function (_SourceFieldsResolvers) {})(SourceFieldsResolvers || (exports.SourceFieldsResolvers = SourceFieldsResolvers = {}));

let SourceStatusResolvers;
exports.SourceStatusResolvers = SourceStatusResolvers;

(function (_SourceStatusResolvers) {})(SourceStatusResolvers || (exports.SourceStatusResolvers = SourceStatusResolvers = {}));

let HostsDataResolvers;
exports.HostsDataResolvers = HostsDataResolvers;

(function (_HostsDataResolvers) {})(HostsDataResolvers || (exports.HostsDataResolvers = HostsDataResolvers = {}));

let HostsEdgesResolvers;
exports.HostsEdgesResolvers = HostsEdgesResolvers;

(function (_HostsEdgesResolvers) {})(HostsEdgesResolvers || (exports.HostsEdgesResolvers = HostsEdgesResolvers = {}));

let HostItemResolvers;
exports.HostItemResolvers = HostItemResolvers;

(function (_HostItemResolvers) {})(HostItemResolvers || (exports.HostItemResolvers = HostItemResolvers = {}));

let AgentFieldsResolvers;
exports.AgentFieldsResolvers = AgentFieldsResolvers;

(function (_AgentFieldsResolvers) {})(AgentFieldsResolvers || (exports.AgentFieldsResolvers = AgentFieldsResolvers = {}));

let CloudFieldsResolvers;
exports.CloudFieldsResolvers = CloudFieldsResolvers;

(function (_CloudFieldsResolvers) {})(CloudFieldsResolvers || (exports.CloudFieldsResolvers = CloudFieldsResolvers = {}));

let CloudInstanceResolvers;
exports.CloudInstanceResolvers = CloudInstanceResolvers;

(function (_CloudInstanceResolvers) {})(CloudInstanceResolvers || (exports.CloudInstanceResolvers = CloudInstanceResolvers = {}));

let CloudMachineResolvers;
exports.CloudMachineResolvers = CloudMachineResolvers;

(function (_CloudMachineResolvers) {})(CloudMachineResolvers || (exports.CloudMachineResolvers = CloudMachineResolvers = {}));

let EndpointFieldsResolvers;
exports.EndpointFieldsResolvers = EndpointFieldsResolvers;

(function (_EndpointFieldsResolvers) {})(EndpointFieldsResolvers || (exports.EndpointFieldsResolvers = EndpointFieldsResolvers = {}));

let HostEcsFieldsResolvers;
exports.HostEcsFieldsResolvers = HostEcsFieldsResolvers;

(function (_HostEcsFieldsResolvers) {})(HostEcsFieldsResolvers || (exports.HostEcsFieldsResolvers = HostEcsFieldsResolvers = {}));

let OsEcsFieldsResolvers;
exports.OsEcsFieldsResolvers = OsEcsFieldsResolvers;

(function (_OsEcsFieldsResolvers) {})(OsEcsFieldsResolvers || (exports.OsEcsFieldsResolvers = OsEcsFieldsResolvers = {}));

let InspectResolvers;
exports.InspectResolvers = InspectResolvers;

(function (_InspectResolvers) {})(InspectResolvers || (exports.InspectResolvers = InspectResolvers = {}));

let CursorTypeResolvers;
exports.CursorTypeResolvers = CursorTypeResolvers;

(function (_CursorTypeResolvers) {})(CursorTypeResolvers || (exports.CursorTypeResolvers = CursorTypeResolvers = {}));

let PageInfoPaginatedResolvers;
exports.PageInfoPaginatedResolvers = PageInfoPaginatedResolvers;

(function (_PageInfoPaginatedResolvers) {})(PageInfoPaginatedResolvers || (exports.PageInfoPaginatedResolvers = PageInfoPaginatedResolvers = {}));

let FirstLastSeenHostResolvers;
exports.FirstLastSeenHostResolvers = FirstLastSeenHostResolvers;

(function (_FirstLastSeenHostResolvers) {})(FirstLastSeenHostResolvers || (exports.FirstLastSeenHostResolvers = FirstLastSeenHostResolvers = {}));

let TimelineResultResolvers;
exports.TimelineResultResolvers = TimelineResultResolvers;

(function (_TimelineResultResolvers) {})(TimelineResultResolvers || (exports.TimelineResultResolvers = TimelineResultResolvers = {}));

let ColumnHeaderResultResolvers;
exports.ColumnHeaderResultResolvers = ColumnHeaderResultResolvers;

(function (_ColumnHeaderResultResolvers) {})(ColumnHeaderResultResolvers || (exports.ColumnHeaderResultResolvers = ColumnHeaderResultResolvers = {}));

let DataProviderResultResolvers;
exports.DataProviderResultResolvers = DataProviderResultResolvers;

(function (_DataProviderResultResolvers) {})(DataProviderResultResolvers || (exports.DataProviderResultResolvers = DataProviderResultResolvers = {}));

let QueryMatchResultResolvers;
exports.QueryMatchResultResolvers = QueryMatchResultResolvers;

(function (_QueryMatchResultResolvers) {})(QueryMatchResultResolvers || (exports.QueryMatchResultResolvers = QueryMatchResultResolvers = {}));

let DateRangePickerResultResolvers;
exports.DateRangePickerResultResolvers = DateRangePickerResultResolvers;

(function (_DateRangePickerResultResolvers) {})(DateRangePickerResultResolvers || (exports.DateRangePickerResultResolvers = DateRangePickerResultResolvers = {}));

let EqlOptionsResultResolvers;
exports.EqlOptionsResultResolvers = EqlOptionsResultResolvers;

(function (_EqlOptionsResultResolvers) {})(EqlOptionsResultResolvers || (exports.EqlOptionsResultResolvers = EqlOptionsResultResolvers = {}));

let FavoriteTimelineResultResolvers;
exports.FavoriteTimelineResultResolvers = FavoriteTimelineResultResolvers;

(function (_FavoriteTimelineResultResolvers) {})(FavoriteTimelineResultResolvers || (exports.FavoriteTimelineResultResolvers = FavoriteTimelineResultResolvers = {}));

let FilterTimelineResultResolvers;
exports.FilterTimelineResultResolvers = FilterTimelineResultResolvers;

(function (_FilterTimelineResultResolvers) {})(FilterTimelineResultResolvers || (exports.FilterTimelineResultResolvers = FilterTimelineResultResolvers = {}));

let FilterMetaTimelineResultResolvers;
exports.FilterMetaTimelineResultResolvers = FilterMetaTimelineResultResolvers;

(function (_FilterMetaTimelineResultResolvers) {})(FilterMetaTimelineResultResolvers || (exports.FilterMetaTimelineResultResolvers = FilterMetaTimelineResultResolvers = {}));

let SerializedFilterQueryResultResolvers;
exports.SerializedFilterQueryResultResolvers = SerializedFilterQueryResultResolvers;

(function (_SerializedFilterQueryResultResolvers) {})(SerializedFilterQueryResultResolvers || (exports.SerializedFilterQueryResultResolvers = SerializedFilterQueryResultResolvers = {}));

let SerializedKueryQueryResultResolvers;
exports.SerializedKueryQueryResultResolvers = SerializedKueryQueryResultResolvers;

(function (_SerializedKueryQueryResultResolvers) {})(SerializedKueryQueryResultResolvers || (exports.SerializedKueryQueryResultResolvers = SerializedKueryQueryResultResolvers = {}));

let KueryFilterQueryResultResolvers;
exports.KueryFilterQueryResultResolvers = KueryFilterQueryResultResolvers;

(function (_KueryFilterQueryResultResolvers) {})(KueryFilterQueryResultResolvers || (exports.KueryFilterQueryResultResolvers = KueryFilterQueryResultResolvers = {}));

let ResponseTimelinesResolvers;
exports.ResponseTimelinesResolvers = ResponseTimelinesResolvers;

(function (_ResponseTimelinesResolvers) {})(ResponseTimelinesResolvers || (exports.ResponseTimelinesResolvers = ResponseTimelinesResolvers = {}));

let MutationResolvers;
exports.MutationResolvers = MutationResolvers;

(function (_MutationResolvers) {})(MutationResolvers || (exports.MutationResolvers = MutationResolvers = {}));

let ResponseNoteResolvers;
exports.ResponseNoteResolvers = ResponseNoteResolvers;

(function (_ResponseNoteResolvers) {})(ResponseNoteResolvers || (exports.ResponseNoteResolvers = ResponseNoteResolvers = {}));

let ResponseTimelineResolvers;
exports.ResponseTimelineResolvers = ResponseTimelineResolvers;

(function (_ResponseTimelineResolvers) {})(ResponseTimelineResolvers || (exports.ResponseTimelineResolvers = ResponseTimelineResolvers = {}));

let ResponseFavoriteTimelineResolvers;
exports.ResponseFavoriteTimelineResolvers = ResponseFavoriteTimelineResolvers;

(function (_ResponseFavoriteTimelineResolvers) {})(ResponseFavoriteTimelineResolvers || (exports.ResponseFavoriteTimelineResolvers = ResponseFavoriteTimelineResolvers = {}));

let EventEcsFieldsResolvers;
exports.EventEcsFieldsResolvers = EventEcsFieldsResolvers;

(function (_EventEcsFieldsResolvers) {})(EventEcsFieldsResolvers || (exports.EventEcsFieldsResolvers = EventEcsFieldsResolvers = {}));

let LocationResolvers;
exports.LocationResolvers = LocationResolvers;

(function (_LocationResolvers) {})(LocationResolvers || (exports.LocationResolvers = LocationResolvers = {}));

let GeoEcsFieldsResolvers;
exports.GeoEcsFieldsResolvers = GeoEcsFieldsResolvers;

(function (_GeoEcsFieldsResolvers) {})(GeoEcsFieldsResolvers || (exports.GeoEcsFieldsResolvers = GeoEcsFieldsResolvers = {}));

let PrimarySecondaryResolvers;
exports.PrimarySecondaryResolvers = PrimarySecondaryResolvers;

(function (_PrimarySecondaryResolvers) {})(PrimarySecondaryResolvers || (exports.PrimarySecondaryResolvers = PrimarySecondaryResolvers = {}));

let SummaryResolvers;
exports.SummaryResolvers = SummaryResolvers;

(function (_SummaryResolvers) {})(SummaryResolvers || (exports.SummaryResolvers = SummaryResolvers = {}));

let AgentEcsFieldResolvers;
exports.AgentEcsFieldResolvers = AgentEcsFieldResolvers;

(function (_AgentEcsFieldResolvers) {})(AgentEcsFieldResolvers || (exports.AgentEcsFieldResolvers = AgentEcsFieldResolvers = {}));

let AuditdDataResolvers;
exports.AuditdDataResolvers = AuditdDataResolvers;

(function (_AuditdDataResolvers) {})(AuditdDataResolvers || (exports.AuditdDataResolvers = AuditdDataResolvers = {}));

let AuditdEcsFieldsResolvers;
exports.AuditdEcsFieldsResolvers = AuditdEcsFieldsResolvers;

(function (_AuditdEcsFieldsResolvers) {})(AuditdEcsFieldsResolvers || (exports.AuditdEcsFieldsResolvers = AuditdEcsFieldsResolvers = {}));

let ThreadResolvers;
exports.ThreadResolvers = ThreadResolvers;

(function (_ThreadResolvers) {})(ThreadResolvers || (exports.ThreadResolvers = ThreadResolvers = {}));

let ProcessHashDataResolvers;
exports.ProcessHashDataResolvers = ProcessHashDataResolvers;

(function (_ProcessHashDataResolvers) {})(ProcessHashDataResolvers || (exports.ProcessHashDataResolvers = ProcessHashDataResolvers = {}));

let ProcessEcsFieldsResolvers;
exports.ProcessEcsFieldsResolvers = ProcessEcsFieldsResolvers;

(function (_ProcessEcsFieldsResolvers) {})(ProcessEcsFieldsResolvers || (exports.ProcessEcsFieldsResolvers = ProcessEcsFieldsResolvers = {}));

let SourceEcsFieldsResolvers;
exports.SourceEcsFieldsResolvers = SourceEcsFieldsResolvers;

(function (_SourceEcsFieldsResolvers) {})(SourceEcsFieldsResolvers || (exports.SourceEcsFieldsResolvers = SourceEcsFieldsResolvers = {}));

let DestinationEcsFieldsResolvers;
exports.DestinationEcsFieldsResolvers = DestinationEcsFieldsResolvers;

(function (_DestinationEcsFieldsResolvers) {})(DestinationEcsFieldsResolvers || (exports.DestinationEcsFieldsResolvers = DestinationEcsFieldsResolvers = {}));

let DnsQuestionDataResolvers;
exports.DnsQuestionDataResolvers = DnsQuestionDataResolvers;

(function (_DnsQuestionDataResolvers) {})(DnsQuestionDataResolvers || (exports.DnsQuestionDataResolvers = DnsQuestionDataResolvers = {}));

let DnsEcsFieldsResolvers;
exports.DnsEcsFieldsResolvers = DnsEcsFieldsResolvers;

(function (_DnsEcsFieldsResolvers) {})(DnsEcsFieldsResolvers || (exports.DnsEcsFieldsResolvers = DnsEcsFieldsResolvers = {}));

let EndgameEcsFieldsResolvers;
exports.EndgameEcsFieldsResolvers = EndgameEcsFieldsResolvers;

(function (_EndgameEcsFieldsResolvers) {})(EndgameEcsFieldsResolvers || (exports.EndgameEcsFieldsResolvers = EndgameEcsFieldsResolvers = {}));

let SuricataAlertDataResolvers;
exports.SuricataAlertDataResolvers = SuricataAlertDataResolvers;

(function (_SuricataAlertDataResolvers) {})(SuricataAlertDataResolvers || (exports.SuricataAlertDataResolvers = SuricataAlertDataResolvers = {}));

let SuricataEveDataResolvers;
exports.SuricataEveDataResolvers = SuricataEveDataResolvers;

(function (_SuricataEveDataResolvers) {})(SuricataEveDataResolvers || (exports.SuricataEveDataResolvers = SuricataEveDataResolvers = {}));

let SuricataEcsFieldsResolvers;
exports.SuricataEcsFieldsResolvers = SuricataEcsFieldsResolvers;

(function (_SuricataEcsFieldsResolvers) {})(SuricataEcsFieldsResolvers || (exports.SuricataEcsFieldsResolvers = SuricataEcsFieldsResolvers = {}));

let TlsJa3DataResolvers;
exports.TlsJa3DataResolvers = TlsJa3DataResolvers;

(function (_TlsJa3DataResolvers) {})(TlsJa3DataResolvers || (exports.TlsJa3DataResolvers = TlsJa3DataResolvers = {}));

let FingerprintDataResolvers;
exports.FingerprintDataResolvers = FingerprintDataResolvers;

(function (_FingerprintDataResolvers) {})(FingerprintDataResolvers || (exports.FingerprintDataResolvers = FingerprintDataResolvers = {}));

let TlsClientCertificateDataResolvers;
exports.TlsClientCertificateDataResolvers = TlsClientCertificateDataResolvers;

(function (_TlsClientCertificateDataResolvers) {})(TlsClientCertificateDataResolvers || (exports.TlsClientCertificateDataResolvers = TlsClientCertificateDataResolvers = {}));

let TlsServerCertificateDataResolvers;
exports.TlsServerCertificateDataResolvers = TlsServerCertificateDataResolvers;

(function (_TlsServerCertificateDataResolvers) {})(TlsServerCertificateDataResolvers || (exports.TlsServerCertificateDataResolvers = TlsServerCertificateDataResolvers = {}));

let TlsFingerprintsDataResolvers;
exports.TlsFingerprintsDataResolvers = TlsFingerprintsDataResolvers;

(function (_TlsFingerprintsDataResolvers) {})(TlsFingerprintsDataResolvers || (exports.TlsFingerprintsDataResolvers = TlsFingerprintsDataResolvers = {}));

let TlsEcsFieldsResolvers;
exports.TlsEcsFieldsResolvers = TlsEcsFieldsResolvers;

(function (_TlsEcsFieldsResolvers) {})(TlsEcsFieldsResolvers || (exports.TlsEcsFieldsResolvers = TlsEcsFieldsResolvers = {}));

let ZeekConnectionDataResolvers;
exports.ZeekConnectionDataResolvers = ZeekConnectionDataResolvers;

(function (_ZeekConnectionDataResolvers) {})(ZeekConnectionDataResolvers || (exports.ZeekConnectionDataResolvers = ZeekConnectionDataResolvers = {}));

let ZeekNoticeDataResolvers;
exports.ZeekNoticeDataResolvers = ZeekNoticeDataResolvers;

(function (_ZeekNoticeDataResolvers) {})(ZeekNoticeDataResolvers || (exports.ZeekNoticeDataResolvers = ZeekNoticeDataResolvers = {}));

let ZeekDnsDataResolvers;
exports.ZeekDnsDataResolvers = ZeekDnsDataResolvers;

(function (_ZeekDnsDataResolvers) {})(ZeekDnsDataResolvers || (exports.ZeekDnsDataResolvers = ZeekDnsDataResolvers = {}));

let FileFieldsResolvers;
exports.FileFieldsResolvers = FileFieldsResolvers;

(function (_FileFieldsResolvers) {})(FileFieldsResolvers || (exports.FileFieldsResolvers = FileFieldsResolvers = {}));

let ZeekHttpDataResolvers;
exports.ZeekHttpDataResolvers = ZeekHttpDataResolvers;

(function (_ZeekHttpDataResolvers) {})(ZeekHttpDataResolvers || (exports.ZeekHttpDataResolvers = ZeekHttpDataResolvers = {}));

let HttpBodyDataResolvers;
exports.HttpBodyDataResolvers = HttpBodyDataResolvers;

(function (_HttpBodyDataResolvers) {})(HttpBodyDataResolvers || (exports.HttpBodyDataResolvers = HttpBodyDataResolvers = {}));

let HttpRequestDataResolvers;
exports.HttpRequestDataResolvers = HttpRequestDataResolvers;

(function (_HttpRequestDataResolvers) {})(HttpRequestDataResolvers || (exports.HttpRequestDataResolvers = HttpRequestDataResolvers = {}));

let HttpResponseDataResolvers;
exports.HttpResponseDataResolvers = HttpResponseDataResolvers;

(function (_HttpResponseDataResolvers) {})(HttpResponseDataResolvers || (exports.HttpResponseDataResolvers = HttpResponseDataResolvers = {}));

let HttpEcsFieldsResolvers;
exports.HttpEcsFieldsResolvers = HttpEcsFieldsResolvers;

(function (_HttpEcsFieldsResolvers) {})(HttpEcsFieldsResolvers || (exports.HttpEcsFieldsResolvers = HttpEcsFieldsResolvers = {}));

let UrlEcsFieldsResolvers;
exports.UrlEcsFieldsResolvers = UrlEcsFieldsResolvers;

(function (_UrlEcsFieldsResolvers) {})(UrlEcsFieldsResolvers || (exports.UrlEcsFieldsResolvers = UrlEcsFieldsResolvers = {}));

let ZeekFileDataResolvers;
exports.ZeekFileDataResolvers = ZeekFileDataResolvers;

(function (_ZeekFileDataResolvers) {})(ZeekFileDataResolvers || (exports.ZeekFileDataResolvers = ZeekFileDataResolvers = {}));

let ZeekSslDataResolvers;
exports.ZeekSslDataResolvers = ZeekSslDataResolvers;

(function (_ZeekSslDataResolvers) {})(ZeekSslDataResolvers || (exports.ZeekSslDataResolvers = ZeekSslDataResolvers = {}));

let ZeekEcsFieldsResolvers;
exports.ZeekEcsFieldsResolvers = ZeekEcsFieldsResolvers;

(function (_ZeekEcsFieldsResolvers) {})(ZeekEcsFieldsResolvers || (exports.ZeekEcsFieldsResolvers = ZeekEcsFieldsResolvers = {}));

let UserEcsFieldsResolvers;
exports.UserEcsFieldsResolvers = UserEcsFieldsResolvers;

(function (_UserEcsFieldsResolvers) {})(UserEcsFieldsResolvers || (exports.UserEcsFieldsResolvers = UserEcsFieldsResolvers = {}));

let WinlogEcsFieldsResolvers;
exports.WinlogEcsFieldsResolvers = WinlogEcsFieldsResolvers;

(function (_WinlogEcsFieldsResolvers) {})(WinlogEcsFieldsResolvers || (exports.WinlogEcsFieldsResolvers = WinlogEcsFieldsResolvers = {}));

let NetworkEcsFieldResolvers;
exports.NetworkEcsFieldResolvers = NetworkEcsFieldResolvers;

(function (_NetworkEcsFieldResolvers) {})(NetworkEcsFieldResolvers || (exports.NetworkEcsFieldResolvers = NetworkEcsFieldResolvers = {}));

let PackageEcsFieldsResolvers;
exports.PackageEcsFieldsResolvers = PackageEcsFieldsResolvers;

(function (_PackageEcsFieldsResolvers) {})(PackageEcsFieldsResolvers || (exports.PackageEcsFieldsResolvers = PackageEcsFieldsResolvers = {}));

let AuditEcsFieldsResolvers;
exports.AuditEcsFieldsResolvers = AuditEcsFieldsResolvers;

(function (_AuditEcsFieldsResolvers) {})(AuditEcsFieldsResolvers || (exports.AuditEcsFieldsResolvers = AuditEcsFieldsResolvers = {}));

let SshEcsFieldsResolvers;
exports.SshEcsFieldsResolvers = SshEcsFieldsResolvers;

(function (_SshEcsFieldsResolvers) {})(SshEcsFieldsResolvers || (exports.SshEcsFieldsResolvers = SshEcsFieldsResolvers = {}));

let AuthEcsFieldsResolvers;
exports.AuthEcsFieldsResolvers = AuthEcsFieldsResolvers;

(function (_AuthEcsFieldsResolvers) {})(AuthEcsFieldsResolvers || (exports.AuthEcsFieldsResolvers = AuthEcsFieldsResolvers = {}));

let SystemEcsFieldResolvers;
exports.SystemEcsFieldResolvers = SystemEcsFieldResolvers;

(function (_SystemEcsFieldResolvers) {})(SystemEcsFieldResolvers || (exports.SystemEcsFieldResolvers = SystemEcsFieldResolvers = {}));

let RuleFieldResolvers;
exports.RuleFieldResolvers = RuleFieldResolvers;

(function (_RuleFieldResolvers) {})(RuleFieldResolvers || (exports.RuleFieldResolvers = RuleFieldResolvers = {}));

let SignalFieldResolvers;
exports.SignalFieldResolvers = SignalFieldResolvers;

(function (_SignalFieldResolvers) {})(SignalFieldResolvers || (exports.SignalFieldResolvers = SignalFieldResolvers = {}));

let RuleEcsFieldResolvers;
exports.RuleEcsFieldResolvers = RuleEcsFieldResolvers;

(function (_RuleEcsFieldResolvers) {})(RuleEcsFieldResolvers || (exports.RuleEcsFieldResolvers = RuleEcsFieldResolvers = {}));

let EcsResolvers;
exports.EcsResolvers = EcsResolvers;

(function (_EcsResolvers) {})(EcsResolvers || (exports.EcsResolvers = EcsResolvers = {}));

let EcsEdgesResolvers;
exports.EcsEdgesResolvers = EcsEdgesResolvers;

(function (_EcsEdgesResolvers) {})(EcsEdgesResolvers || (exports.EcsEdgesResolvers = EcsEdgesResolvers = {}));

let OsFieldsResolvers;
exports.OsFieldsResolvers = OsFieldsResolvers;

(function (_OsFieldsResolvers) {})(OsFieldsResolvers || (exports.OsFieldsResolvers = OsFieldsResolvers = {}));

let HostFieldsResolvers;
/** A descriptor of a field in an index */

exports.HostFieldsResolvers = HostFieldsResolvers;

(function (_HostFieldsResolvers) {})(HostFieldsResolvers || (exports.HostFieldsResolvers = HostFieldsResolvers = {}));

let IndexFieldResolvers;
exports.IndexFieldResolvers = IndexFieldResolvers;

(function (_IndexFieldResolvers) {})(IndexFieldResolvers || (exports.IndexFieldResolvers = IndexFieldResolvers = {}));

let PageInfoResolvers;
/** Directs the executor to skip this field or fragment when the `if` argument is true. */

exports.PageInfoResolvers = PageInfoResolvers;

(function (_PageInfoResolvers) {})(PageInfoResolvers || (exports.PageInfoResolvers = PageInfoResolvers = {}));