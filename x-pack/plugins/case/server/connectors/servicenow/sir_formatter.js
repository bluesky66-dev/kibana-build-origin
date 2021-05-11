"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceNowSIRExternalServiceFormatter = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const format = (theCase, alerts) => {
  var _ref;

  const {
    destIp = null,
    sourceIp = null,
    category = null,
    subcategory = null,
    malwareHash = null,
    malwareUrl = null,
    priority = null
  } = (_ref = theCase.connector.fields) !== null && _ref !== void 0 ? _ref : {};
  const alertFieldMapping = {
    destIp: {
      alertPath: 'destination.ip',
      sirFieldKey: 'dest_ip',
      add: !!destIp
    },
    sourceIp: {
      alertPath: 'source.ip',
      sirFieldKey: 'source_ip',
      add: !!sourceIp
    },
    malwareHash: {
      alertPath: 'file.hash.sha256',
      sirFieldKey: 'malware_hash',
      add: !!malwareHash
    },
    malwareUrl: {
      alertPath: 'url.full',
      sirFieldKey: 'malware_url',
      add: !!malwareUrl
    }
  };
  const manageDuplicate = {
    dest_ip: new Set(),
    source_ip: new Set(),
    malware_hash: new Set(),
    malware_url: new Set()
  };
  let sirFields = {
    dest_ip: null,
    source_ip: null,
    malware_hash: null,
    malware_url: null
  };
  const fieldsToAdd = Object.keys(alertFieldMapping).filter(key => alertFieldMapping[key].add);

  if (fieldsToAdd.length > 0) {
    sirFields = alerts.reduce((acc, alert) => {
      fieldsToAdd.forEach(alertField => {
        const field = (0, _fp.get)(alertFieldMapping[alertField].alertPath, alert);

        if (field && !manageDuplicate[alertFieldMapping[alertField].sirFieldKey].has(field)) {
          manageDuplicate[alertFieldMapping[alertField].sirFieldKey].add(field);
          acc = { ...acc,
            [alertFieldMapping[alertField].sirFieldKey]: `${acc[alertFieldMapping[alertField].sirFieldKey] != null ? `${acc[alertFieldMapping[alertField].sirFieldKey]},${field}` : field}`
          };
        }
      });
      return acc;
    }, sirFields);
  }

  return { ...sirFields,
    category,
    subcategory,
    priority
  };
};

const serviceNowSIRExternalServiceFormatter = {
  format
};
exports.serviceNowSIRExternalServiceFormatter = serviceNowSIRExternalServiceFormatter;