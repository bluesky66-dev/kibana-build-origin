"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUser = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getUser = ({
  security,
  request
}) => {
  if (security != null) {
    const authenticatedUser = security.authc.getCurrentUser(request);

    if (authenticatedUser != null) {
      return authenticatedUser.username;
    } else {
      return 'elastic';
    }
  } else {
    return 'elastic';
  }
};

exports.getUser = getUser;