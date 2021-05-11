"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFullUrls = getFullUrls;

var _url = require("url");

var _get_absolute_url = require("./get_absolute_url");

var _validate_urls = require("./validate_urls");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isPngJob(job) {
  return job.relativeUrl !== undefined;
}

function isPdfJob(job) {
  return job.objects !== undefined; // 7.x only
}

function getFullUrls(config, job) {
  const [basePath, protocol, hostname, port] = [config.kbnConfig.get('server', 'basePath'), config.get('kibanaServer', 'protocol'), config.get('kibanaServer', 'hostname'), config.get('kibanaServer', 'port')];
  const getAbsoluteUrl = (0, _get_absolute_url.getAbsoluteUrlFactory)({
    basePath,
    protocol,
    hostname,
    port
  }); // PDF and PNG job params put in the url differently

  let relativeUrls = [];

  if (isPngJob(job)) {
    relativeUrls = [job.relativeUrl];
  } else if (isPdfJob(job)) {
    relativeUrls = job.objects.map(obj => obj.relativeUrl);
  } else {
    throw new Error(`No valid URL fields found in Job Params! Expected \`job.relativeUrl\` or \`job.objects[{ relativeUrl }]\``);
  }

  (0, _validate_urls.validateUrls)(relativeUrls);
  const urls = relativeUrls.map(relativeUrl => {
    const parsedRelative = (0, _url.parse)(relativeUrl);
    const jobUrl = getAbsoluteUrl({
      path: parsedRelative.pathname === null ? undefined : parsedRelative.pathname,
      hash: parsedRelative.hash === null ? undefined : parsedRelative.hash,
      search: parsedRelative.search === null ? undefined : parsedRelative.search
    }); // capture the route to the visualization

    const parsed = (0, _url.parse)(jobUrl, true);

    if (parsed.hash == null) {
      throw new Error('No valid hash in the URL! A hash is expected for the application to route to the intended visualization.');
    } // allow the hash check to perform first


    if (!job.forceNow) {
      return jobUrl;
    }

    const visualizationRoute = (0, _url.parse)(parsed.hash.replace(/^#/, ''), true); // combine the visualization route and forceNow parameter into a URL

    const transformedHash = (0, _url.format)({
      pathname: visualizationRoute.pathname,
      query: { ...visualizationRoute.query,
        forceNow: job.forceNow
      }
    });
    return (0, _url.format)({ ...parsed,
      hash: transformedHash
    });
  });
  return urls;
}