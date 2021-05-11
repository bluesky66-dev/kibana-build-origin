"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPrivilegesWithCluster = registerPrivilegesWithCluster;

var _lodash = require("lodash");

var _privileges_serializer = require("./privileges_serializer");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function registerPrivilegesWithCluster(logger, privileges, application, clusterClient) {
  const arePrivilegesEqual = (existingPrivileges, expectedPrivileges) => {
    // when comparing privileges, the order of the actions doesn't matter, lodash's isEqual
    // doesn't know how to compare Sets
    return (0, _lodash.isEqualWith)(existingPrivileges, expectedPrivileges, (value, other, key) => {
      if (key === 'actions' && Array.isArray(value) && Array.isArray(other)) {
        // Array.sort() is in-place, and we don't want to be modifying the actual order
        // of the arrays permanently, and there's potential they're frozen, so we're copying
        // before comparing.
        return (0, _lodash.isEqual)([...value].sort(), [...other].sort());
      } // Lodash types aren't correct, `undefined` should be supported as a return value here and it
      // has special meaning.


      return undefined;
    });
  };

  const getPrivilegesToDelete = (existingPrivileges, expectedPrivileges) => {
    if (Object.keys(existingPrivileges).length === 0) {
      return [];
    }

    return (0, _lodash.difference)(Object.keys(existingPrivileges[application]), Object.keys(expectedPrivileges[application]));
  };

  const expectedPrivileges = (0, _privileges_serializer.serializePrivileges)(application, privileges.get());
  logger.debug(`Registering Kibana Privileges with Elasticsearch for ${application}`);

  try {
    // we only want to post the privileges when they're going to change as Elasticsearch has
    // to clear the role cache to get these changes reflected in the _has_privileges API
    const {
      body: existingPrivileges
    } = await clusterClient.asInternalUser.security.getPrivileges({
      application
    });

    if (arePrivilegesEqual(existingPrivileges, expectedPrivileges)) {
      logger.debug(`Kibana Privileges already registered with Elasticsearch for ${application}`);
      return;
    }

    const privilegesToDelete = getPrivilegesToDelete(existingPrivileges, expectedPrivileges);

    for (const privilegeToDelete of privilegesToDelete) {
      logger.debug(`Deleting Kibana Privilege ${privilegeToDelete} from Elasticsearch for ${application}`);

      try {
        await clusterClient.asInternalUser.security.deletePrivileges({
          application,
          name: privilegeToDelete
        });
      } catch (err) {
        logger.error(`Error deleting Kibana Privilege ${privilegeToDelete}`);
        throw err;
      }
    }

    await clusterClient.asInternalUser.security.putPrivileges({
      body: expectedPrivileges
    });
    logger.debug(`Updated Kibana Privileges with Elasticsearch for ${application}`);
  } catch (err) {
    logger.error(`Error registering Kibana Privileges with Elasticsearch for ${application}: ${err.message}`);
    throw err;
  }
}