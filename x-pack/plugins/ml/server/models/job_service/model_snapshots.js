"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelSnapshotProvider = modelSnapshotProvider;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var _datafeeds = require("./datafeeds");

var _calendar = require("../calendar");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function modelSnapshotProvider(mlClient) {
  const {
    forceStartDatafeeds,
    getDatafeedIdsByJobId
  } = (0, _datafeeds.datafeedsProvider)(mlClient);

  async function revertModelSnapshot(jobId, snapshotId, replay, end, deleteInterveningResults = true, calendarEvents) {
    let datafeedId = `datafeed-${jobId}`; // ensure job exists

    await mlClient.getJobs({
      job_id: jobId
    });

    try {
      // ensure the datafeed exists
      // the datafeed is probably called datafeed-<jobId>
      await mlClient.getDatafeeds({
        datafeed_id: datafeedId
      });
    } catch (e) {
      // if the datafeed isn't called datafeed-<jobId>
      // check all datafeeds to see if one exists that is matched to this job id
      const datafeedIds = await getDatafeedIdsByJobId();
      datafeedId = datafeedIds[jobId];

      if (datafeedId === undefined) {
        throw _boom.default.notFound(`Cannot find datafeed for job ${jobId}`);
      }
    } // ensure the snapshot exists


    const {
      body: snapshot
    } = await mlClient.getModelSnapshots({
      job_id: jobId,
      snapshot_id: snapshotId
    }); // apply the snapshot revert

    const {
      body: {
        model
      }
    } = await mlClient.revertModelSnapshot({
      job_id: jobId,
      snapshot_id: snapshotId,
      body: {
        delete_intervening_results: deleteInterveningResults
      }
    }); // create calendar (if specified) and replay datafeed

    if (replay && model.snapshot_id === snapshotId && snapshot.model_snapshots.length) {
      // create calendar before starting restarting the datafeed
      if (calendarEvents !== undefined && calendarEvents.length) {
        const calendar = {
          calendarId: String(Date.now()),
          job_ids: [jobId],
          description: _i18n.i18n.translate('xpack.ml.models.jobService.revertModelSnapshot.autoCreatedCalendar.description', {
            defaultMessage: 'Auto created'
          }),
          events: calendarEvents.map(s => ({
            description: s.description,
            start_time: s.start,
            end_time: s.end
          }))
        };
        const cm = new _calendar.CalendarManager(mlClient);
        await cm.newCalendar(calendar);
      }

      forceStartDatafeeds([datafeedId], snapshot.model_snapshots[0].latest_record_time_stamp, end);
    }

    return {
      success: true
    };
  }

  return {
    revertModelSnapshot
  };
}