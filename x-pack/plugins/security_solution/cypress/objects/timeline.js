"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expectedExportedTimeline = exports.expectedExportedTimelineTemplate = exports.caseTimeline = exports.timeline = exports.filter = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const filter = {
  field: 'host.name',
  operator: 'exists',
  value: 'exists'
};
exports.filter = filter;
const timeline = {
  title: 'Security Timeline',
  description: 'This is the best timeline',
  query: 'host.name: *',
  notes: 'Yes, the best timeline',
  filter
};
exports.timeline = timeline;
const caseTimeline = {
  title: 'SIEM test',
  description: 'description',
  query: 'host.name: *',
  id: '0162c130-78be-11ea-9718-118a926974a4'
};
exports.caseTimeline = caseTimeline;

const expectedExportedTimelineTemplate = templateResponse => {
  const timelineTemplateBody = templateResponse.body.data.persistTimeline.timeline;
  return `{"savedObjectId":"${timelineTemplateBody.savedObjectId}","version":"${timelineTemplateBody.version}","columns":[{"id":"@timestamp"},{"id":"user.name"},{"id":"event.category"},{"id":"event.action"},{"id":"host.name"}],"kqlMode":"filter","kqlQuery":{"filterQuery":{"kuery":{"expression":"${timelineTemplateBody.kqlQuery.filterQuery.kuery.expression}","kind":"kuery"}}},"dateRange":{"start":"${timelineTemplateBody.dateRange.start}","end":"${timelineTemplateBody.dateRange.end}"},"description":"${timelineTemplateBody.description}","title":"${timelineTemplateBody.title}","templateTimelineVersion":1,"timelineType":"template","created":${timelineTemplateBody.created},"createdBy":"elastic","updated":${timelineTemplateBody.updated},"updatedBy":"elastic","sort":[],"eventNotes":[],"globalNotes":[],"pinnedEventIds":[]}
`;
};

exports.expectedExportedTimelineTemplate = expectedExportedTimelineTemplate;

const expectedExportedTimeline = timelineResponse => {
  const timelineBody = timelineResponse.body.data.persistTimeline.timeline;
  return `{"savedObjectId":"${timelineBody.savedObjectId}","version":"${timelineBody.version}","columns":[{"id":"@timestamp"},{"id":"user.name"},{"id":"event.category"},{"id":"event.action"},{"id":"host.name"}],"kqlMode":"filter","kqlQuery":{"filterQuery":{"kuery":{"expression":"${timelineBody.kqlQuery.filterQuery.kuery.expression}","kind":"kuery"}}},"dateRange":{"start":"${timelineBody.dateRange.start}","end":"${timelineBody.dateRange.end}"},"description":"${timelineBody.description}","title":"${timelineBody.title}","created":${timelineBody.created},"createdBy":"elastic","updated":${timelineBody.updated},"updatedBy":"elastic","timelineType":"default","sort":[],"eventNotes":[],"globalNotes":[],"pinnedEventIds":[]}\n`;
};

exports.expectedExportedTimeline = expectedExportedTimeline;