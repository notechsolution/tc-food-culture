import * as _ from 'lodash';
import defaultConfig from './default';

export = _.merge(defaultConfig, {
    config: 'development',
    applicationInsight: {
        baseUrl: 'https://api.applicationinsights.io/v1/apps',
        appKey: 'cg1xjqd4bil3k8kbhmo4x36yb18o1lfq8do34ags',
        appId: '1be4182d-d6e0-4da6-a386-59b78ee0f388'
    },
    strategyOptions: {
        realm: 'shrd-int',
        clientBaseUrl: 'http://localhost:3001',
        loginRedirectUrl: 'http://localhost:3000',
        logoutRedirectUrl: 'http://localhost:3000',
        oauthScope: 'openid'
    }
});
