"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendEmail = sendEmail;
exports.JSON_TRANSPORT_SERVICE = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _markdownIt = _interopRequireDefault(require("markdown-it"));

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
// info on nodemailer: https://nodemailer.com/about/
// an email "service" which doesn't actually send, just returns what it would send


const JSON_TRANSPORT_SERVICE = '__json';
exports.JSON_TRANSPORT_SERVICE = JSON_TRANSPORT_SERVICE; // send an email

async function sendEmail(logger, options) {
  const {
    transport,
    routing,
    content,
    configurationUtilities,
    hasAuth
  } = options;
  const {
    service,
    host,
    port,
    secure,
    user,
    password
  } = transport;
  const {
    from,
    to,
    cc,
    bcc
  } = routing;
  const {
    subject,
    message
  } = content;
  const transportConfig = {};
  const proxySettings = configurationUtilities.getProxySettings();
  const rejectUnauthorized = configurationUtilities.isRejectUnauthorizedCertificatesEnabled();

  if (hasAuth && user != null && password != null) {
    transportConfig.auth = {
      user,
      pass: password
    };
  }

  if (service === JSON_TRANSPORT_SERVICE) {
    transportConfig.jsonTransport = true;
    delete transportConfig.auth;
  } else if (service != null) {
    transportConfig.service = service;
  } else {
    transportConfig.host = host;
    transportConfig.port = port;
    transportConfig.secure = !!secure;

    if (proxySettings) {
      transportConfig.tls = {
        // do not fail on invalid certs if value is false
        rejectUnauthorized: proxySettings === null || proxySettings === void 0 ? void 0 : proxySettings.proxyRejectUnauthorizedCertificates
      };
      transportConfig.proxy = proxySettings.proxyUrl;
      transportConfig.headers = proxySettings.proxyHeaders;
    } else if (!transportConfig.secure && user == null && password == null) {
      // special case - if secure:false && user:null && password:null set
      // rejectUnauthorized false, because simple/test servers that don't even
      // authenticate rarely have valid certs; eg cloud proxy, and npm maildev
      transportConfig.tls = {
        rejectUnauthorized: false
      };
    } else {
      transportConfig.tls = {
        rejectUnauthorized
      };
    }
  }

  const nodemailerTransport = _nodemailer.default.createTransport(transportConfig);

  const messageHTML = htmlFromMarkdown(logger, message);
  const email = {
    // email routing
    from,
    to,
    cc,
    bcc,
    // email content
    subject,
    html: messageHTML,
    text: message
  };
  const result = await nodemailerTransport.sendMail(email);

  if (service === JSON_TRANSPORT_SERVICE) {
    try {
      result.message = JSON.parse(result.message);
    } catch (err) {// try parsing the message for ease of debugging, on error, ignore
    }
  }

  return result;
} // try rendering markdown to html, return markdown on any kind of error


function htmlFromMarkdown(logger, markdown) {
  try {
    const md = (0, _markdownIt.default)({
      linkify: true
    });
    return md.render(markdown);
  } catch (err) {
    logger.debug(`error rendering markdown to html: ${err.message}`);
    return markdown;
  }
}