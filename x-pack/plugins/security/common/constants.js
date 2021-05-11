"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_NAME_LENGTH = exports.NAME_REGEX = exports.NEXT_URL_QUERY_STRING_PARAMETER = exports.LOGOUT_REASON_QUERY_STRING_PARAMETER = exports.LOGOUT_PROVIDER_QUERY_STRING_PARAMETER = exports.AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER = exports.RESERVED_PRIVILEGES_APPLICATION_WILDCARD = exports.APPLICATION_PREFIX = exports.GLOBAL_RESOURCE = exports.UNKNOWN_SPACE = exports.ALL_SPACES_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The identifier in a saved object's `namespaces` array when it is shared globally to all spaces.
 */

const ALL_SPACES_ID = '*';
/**
 * The identifier in a saved object's `namespaces` array when it is shared to an unknown space (e.g., one that the end user is not authorized to see).
 */

exports.ALL_SPACES_ID = ALL_SPACES_ID;
const UNKNOWN_SPACE = '?';
exports.UNKNOWN_SPACE = UNKNOWN_SPACE;
const GLOBAL_RESOURCE = '*';
exports.GLOBAL_RESOURCE = GLOBAL_RESOURCE;
const APPLICATION_PREFIX = 'kibana-';
exports.APPLICATION_PREFIX = APPLICATION_PREFIX;
const RESERVED_PRIVILEGES_APPLICATION_WILDCARD = 'kibana-*';
exports.RESERVED_PRIVILEGES_APPLICATION_WILDCARD = RESERVED_PRIVILEGES_APPLICATION_WILDCARD;
const AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER = 'auth_provider_hint';
exports.AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER = AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER;
const LOGOUT_PROVIDER_QUERY_STRING_PARAMETER = 'provider';
exports.LOGOUT_PROVIDER_QUERY_STRING_PARAMETER = LOGOUT_PROVIDER_QUERY_STRING_PARAMETER;
const LOGOUT_REASON_QUERY_STRING_PARAMETER = 'msg';
exports.LOGOUT_REASON_QUERY_STRING_PARAMETER = LOGOUT_REASON_QUERY_STRING_PARAMETER;
const NEXT_URL_QUERY_STRING_PARAMETER = 'next';
/**
 * Matches valid usernames and role names.
 *
 * - Must contain only letters, numbers, spaces, punctuation and printable symbols.
 * - Must not contain leading or trailing spaces.
 */

exports.NEXT_URL_QUERY_STRING_PARAMETER = NEXT_URL_QUERY_STRING_PARAMETER;
const NAME_REGEX = /^(?! )[a-zA-Z0-9 !"#$%&'()*+,\-./\\:;<=>?@\[\]^_`{|}~]*[a-zA-Z0-9!"#$%&'()*+,\-./\\:;<=>?@\[\]^_`{|}~]$/;
/**
 * Maximum length of usernames and role names.
 */

exports.NAME_REGEX = NAME_REGEX;
const MAX_NAME_LENGTH = 1024;
exports.MAX_NAME_LENGTH = MAX_NAME_LENGTH;