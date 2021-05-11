"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ENDPOINT_TRUSTED_APPS_LIST_DESCRIPTION = exports.ENDPOINT_TRUSTED_APPS_LIST_NAME = exports.ENDPOINT_TRUSTED_APPS_LIST_ID = exports.MAX_EXCEPTION_LIST_SIZE = exports.ENDPOINT_LIST_DESCRIPTION = exports.ENDPOINT_LIST_NAME = exports.ENDPOINT_LIST_ID = exports.ENDPOINT_LIST_ITEM_URL = exports.ENDPOINT_LIST_URL = exports.EXCEPTION_LIST_NAMESPACE = exports.EXCEPTION_LIST_NAMESPACE_AGNOSTIC = exports.EXCEPTION_LIST_ITEM_URL = exports.EXCEPTION_LIST_URL = exports.LIST_PRIVILEGES_URL = exports.LIST_ITEM_URL = exports.LIST_INDEX = exports.LIST_URL = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Value list routes
 */

const LIST_URL = '/api/lists';
exports.LIST_URL = LIST_URL;
const LIST_INDEX = `${LIST_URL}/index`;
exports.LIST_INDEX = LIST_INDEX;
const LIST_ITEM_URL = `${LIST_URL}/items`;
exports.LIST_ITEM_URL = LIST_ITEM_URL;
const LIST_PRIVILEGES_URL = `${LIST_URL}/privileges`;
/**
 * Exception list routes
 */

exports.LIST_PRIVILEGES_URL = LIST_PRIVILEGES_URL;
const EXCEPTION_LIST_URL = '/api/exception_lists';
exports.EXCEPTION_LIST_URL = EXCEPTION_LIST_URL;
const EXCEPTION_LIST_ITEM_URL = '/api/exception_lists/items';
/**
 * Exception list spaces
 */

exports.EXCEPTION_LIST_ITEM_URL = EXCEPTION_LIST_ITEM_URL;
const EXCEPTION_LIST_NAMESPACE_AGNOSTIC = 'exception-list-agnostic';
exports.EXCEPTION_LIST_NAMESPACE_AGNOSTIC = EXCEPTION_LIST_NAMESPACE_AGNOSTIC;
const EXCEPTION_LIST_NAMESPACE = 'exception-list';
/**
 * Specific routes for the single global space agnostic endpoint list
 */

exports.EXCEPTION_LIST_NAMESPACE = EXCEPTION_LIST_NAMESPACE;
const ENDPOINT_LIST_URL = '/api/endpoint_list';
/**
 * Specific routes for the single global space agnostic endpoint list. These are convenience
 * routes where they are going to try and create the global space agnostic endpoint list if it
 * does not exist yet or if it was deleted at some point and re-create it before adding items to
 * the list
 */

exports.ENDPOINT_LIST_URL = ENDPOINT_LIST_URL;
const ENDPOINT_LIST_ITEM_URL = '/api/endpoint_list/items';
/**
 * This ID is used for _both_ the Saved Object ID and for the list_id
 * for the single global space agnostic endpoint list
 */

exports.ENDPOINT_LIST_ITEM_URL = ENDPOINT_LIST_ITEM_URL;
const ENDPOINT_LIST_ID = 'endpoint_list';
/** The name of the single global space agnostic endpoint list */

exports.ENDPOINT_LIST_ID = ENDPOINT_LIST_ID;
const ENDPOINT_LIST_NAME = 'Endpoint Security Exception List';
/** The description of the single global space agnostic endpoint list */

exports.ENDPOINT_LIST_NAME = ENDPOINT_LIST_NAME;
const ENDPOINT_LIST_DESCRIPTION = 'Endpoint Security Exception List';
exports.ENDPOINT_LIST_DESCRIPTION = ENDPOINT_LIST_DESCRIPTION;
const MAX_EXCEPTION_LIST_SIZE = 10000;
/** ID of trusted apps agnostic list */

exports.MAX_EXCEPTION_LIST_SIZE = MAX_EXCEPTION_LIST_SIZE;
const ENDPOINT_TRUSTED_APPS_LIST_ID = 'endpoint_trusted_apps';
/** Name of trusted apps agnostic list */

exports.ENDPOINT_TRUSTED_APPS_LIST_ID = ENDPOINT_TRUSTED_APPS_LIST_ID;
const ENDPOINT_TRUSTED_APPS_LIST_NAME = 'Endpoint Security Trusted Apps List';
/** Description of trusted apps agnostic list */

exports.ENDPOINT_TRUSTED_APPS_LIST_NAME = ENDPOINT_TRUSTED_APPS_LIST_NAME;
const ENDPOINT_TRUSTED_APPS_LIST_DESCRIPTION = 'Endpoint Security Trusted Apps List';
exports.ENDPOINT_TRUSTED_APPS_LIST_DESCRIPTION = ENDPOINT_TRUSTED_APPS_LIST_DESCRIPTION;