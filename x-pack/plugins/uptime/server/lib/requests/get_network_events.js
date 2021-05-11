"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNetworkEvents = exports.secondsToMillis = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const secondsToMillis = seconds => // -1 is a special case where a value was unavailable
seconds === -1 ? -1 : seconds * 1000;

exports.secondsToMillis = secondsToMillis;

const getNetworkEvents = async ({
  uptimeEsClient,
  checkGroup,
  stepIndex
}) => {
  const params = {
    track_total_hits: true,
    query: {
      bool: {
        filter: [{
          term: {
            'synthetics.type': 'journey/network_info'
          }
        }, {
          term: {
            'monitor.check_group': checkGroup
          }
        }, {
          term: {
            'synthetics.step.index': Number(stepIndex)
          }
        }]
      }
    },
    // NOTE: This limit may need tweaking in the future. Users can technically perform multiple
    // navigations within one step, and may push up against this limit, however this manner
    // of usage isn't advised.
    size: 1000
  };
  const {
    body: result
  } = await uptimeEsClient.search({
    body: params
  });
  return {
    total: result.hits.total.value,
    events: result.hits.hits.map(event => {
      var _event$_source$synthe, _event$_source$synthe2, _event$_source$synthe3, _event$_source$synthe4, _event$_source$synthe5, _event$_source$synthe6, _event$_source$synthe7, _event$_source$synthe8, _event$_source$synthe9, _event$_source$synthe10;

      const requestSentTime = secondsToMillis(event._source.synthetics.payload.request_sent_time);
      const loadEndTime = secondsToMillis(event._source.synthetics.payload.load_end_time);
      const requestStartTime = event._source.synthetics.payload.response && event._source.synthetics.payload.response.timing ? secondsToMillis(event._source.synthetics.payload.response.timing.request_time) : undefined;
      const securityDetails = (_event$_source$synthe = event._source.synthetics.payload.response) === null || _event$_source$synthe === void 0 ? void 0 : _event$_source$synthe.security_details;
      return {
        timestamp: event._source['@timestamp'],
        method: (_event$_source$synthe2 = event._source.synthetics.payload) === null || _event$_source$synthe2 === void 0 ? void 0 : _event$_source$synthe2.method,
        url: (_event$_source$synthe3 = event._source.synthetics.payload) === null || _event$_source$synthe3 === void 0 ? void 0 : _event$_source$synthe3.url,
        status: (_event$_source$synthe4 = event._source.synthetics.payload) === null || _event$_source$synthe4 === void 0 ? void 0 : _event$_source$synthe4.status,
        mimeType: (_event$_source$synthe5 = event._source.synthetics.payload) === null || _event$_source$synthe5 === void 0 ? void 0 : (_event$_source$synthe6 = _event$_source$synthe5.response) === null || _event$_source$synthe6 === void 0 ? void 0 : _event$_source$synthe6.mime_type,
        requestSentTime,
        requestStartTime,
        loadEndTime,
        timings: event._source.synthetics.payload.timings,
        bytesDownloadedCompressed: (_event$_source$synthe7 = event._source.synthetics.payload.response) === null || _event$_source$synthe7 === void 0 ? void 0 : _event$_source$synthe7.encoded_data_length,
        certificates: securityDetails ? {
          issuer: securityDetails.issuer,
          subjectName: securityDetails.subject_name,
          validFrom: securityDetails.valid_from ? secondsToMillis(securityDetails.valid_from) : undefined,
          validTo: securityDetails.valid_to ? secondsToMillis(securityDetails.valid_to) : undefined
        } : undefined,
        requestHeaders: (_event$_source$synthe8 = event._source.synthetics.payload.request) === null || _event$_source$synthe8 === void 0 ? void 0 : _event$_source$synthe8.headers,
        responseHeaders: (_event$_source$synthe9 = event._source.synthetics.payload.response) === null || _event$_source$synthe9 === void 0 ? void 0 : _event$_source$synthe9.headers,
        ip: (_event$_source$synthe10 = event._source.synthetics.payload.response) === null || _event$_source$synthe10 === void 0 ? void 0 : _event$_source$synthe10.remote_i_p_address
      };
    })
  };
};

exports.getNetworkEvents = getNetworkEvents;