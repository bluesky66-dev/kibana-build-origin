"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elasticsearchJsPlugin = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const elasticsearchJsPlugin = (Client, config, components) => {
  const ca = components.clientAction.factory;
  Client.prototype.ccr = components.clientAction.namespaceFactory();
  const ccr = Client.prototype.ccr.prototype;
  ccr.permissions = ca({
    urls: [{
      fmt: '/_security/user/_has_privileges'
    }],
    needBody: true,
    method: 'POST'
  });
  ccr.autoFollowPatterns = ca({
    urls: [{
      fmt: '/_ccr/auto_follow'
    }],
    method: 'GET'
  });
  ccr.autoFollowPattern = ca({
    urls: [{
      fmt: '/_ccr/auto_follow/<%=id%>',
      req: {
        id: {
          type: 'string'
        }
      }
    }],
    method: 'GET'
  });
  ccr.saveAutoFollowPattern = ca({
    urls: [{
      fmt: '/_ccr/auto_follow/<%=id%>',
      req: {
        id: {
          type: 'string'
        }
      }
    }],
    needBody: true,
    method: 'PUT'
  });
  ccr.deleteAutoFollowPattern = ca({
    urls: [{
      fmt: '/_ccr/auto_follow/<%=id%>',
      req: {
        id: {
          type: 'string'
        }
      }
    }],
    needBody: true,
    method: 'DELETE'
  });
  ccr.pauseAutoFollowPattern = ca({
    urls: [{
      fmt: '/_ccr/auto_follow/<%=id%>/pause',
      req: {
        id: {
          type: 'string'
        }
      }
    }],
    method: 'POST'
  });
  ccr.resumeAutoFollowPattern = ca({
    urls: [{
      fmt: '/_ccr/auto_follow/<%=id%>/resume',
      req: {
        id: {
          type: 'string'
        }
      }
    }],
    method: 'POST'
  });
  ccr.info = ca({
    urls: [{
      fmt: '/<%=id%>/_ccr/info',
      req: {
        id: {
          type: 'string'
        }
      }
    }],
    method: 'GET'
  });
  ccr.stats = ca({
    urls: [{
      fmt: '/_ccr/stats'
    }],
    method: 'GET'
  });
  ccr.followerIndexStats = ca({
    urls: [{
      fmt: '/<%=id%>/_ccr/stats',
      req: {
        id: {
          type: 'string'
        }
      }
    }],
    method: 'GET'
  });
  ccr.saveFollowerIndex = ca({
    urls: [{
      fmt: '/<%=name%>/_ccr/follow',
      req: {
        name: {
          type: 'string'
        }
      }
    }],
    needBody: true,
    method: 'PUT'
  });
  ccr.pauseFollowerIndex = ca({
    urls: [{
      fmt: '/<%=id%>/_ccr/pause_follow',
      req: {
        id: {
          type: 'string'
        }
      }
    }],
    method: 'POST'
  });
  ccr.resumeFollowerIndex = ca({
    urls: [{
      fmt: '/<%=id%>/_ccr/resume_follow',
      req: {
        id: {
          type: 'string'
        }
      }
    }],
    needBody: true,
    method: 'POST'
  });
  ccr.unfollowLeaderIndex = ca({
    urls: [{
      fmt: '/<%=id%>/_ccr/unfollow',
      req: {
        id: {
          type: 'string'
        }
      }
    }],
    method: 'POST'
  });
};

exports.elasticsearchJsPlugin = elasticsearchJsPlugin;