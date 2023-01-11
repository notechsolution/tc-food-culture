import * as _ from 'lodash';
import defaultConfig from './default';

export = _.merge(defaultConfig, {
    config: 'production',
    applicationInsight: {
        baseUrl: 'https://api.applicationinsights.io/v1/apps',
        appKey: '705y3rwxfyfrdkig1h4zpg0a7yy3nfjjoyr7nt6x',
        appId: '67fffe51-e1f3-48a9-8de5-dba7dad3d816'
    },
    strategyOptions: {
        realm: 'shrd-prd',
        oauthScope: 'openid'
    }
});
