import * as path from 'path';
import * as _ from 'lodash';

let config;
const appDir = process.cwd();

async function loadConfig(logger) {
    config = loadLocalAppConfig();
    config.mongodbURI = process.env.MONGODB_URI || 'mongodb://tcfcowner:tcfcownerpwd!@localhost:27017/tc_food_culture_backend';
    _initStrategyConfig( config, config.strategyConfigName);
    config.clientVersion = _getVersion(logger);
    return config;
}

function loadLocalAppConfig() {
    if (!config) {
        let env = process.env.NODE_ENV;
        if (!env || env === 'test') {
            // ava will set it to 'test' if none is set.
            env = 'development';
        }
        config = require(path.resolve(__dirname, `./env/${env}`));
    }
    return config;
}

/**
 * Get the current version from the package.json
 * @method getPackageVersion
 * @return {String} MAJOR.MINOR.PATCH version
 */
function _getVersion(logger) {
    let version;
    try {
        version = require(path.join(appDir, './package.json')).version;
    } catch (unused) {
        logger.error('Could not load package.json, please make sure it exists');
    }
    logger.log(`The Food Culture Backend version is ${version}.`);
    return version;
}

function _getConfigValue(appEnv, configName, configMap) {
    const underlineConfigName = _.replace(configName, /-/g, '_');
    const strikeThroughConfigName = _.replace(configName, /_/g, '-');
    let configObject = appEnv.getServiceCreds(strikeThroughConfigName) || appEnv.getServiceCreds(underlineConfigName);
    // If this is NOT PCF env. try to get config from process environment first.
    if (appEnv.isLocal && !configObject) {
        configObject = process.env[configName];
        if (typeof configObject === 'string') {
            configObject = JSON.parse(configObject);
        } else {
            configObject = undefined;
        }
    }
    if (!configObject && configMap) {
        configObject = configMap[configName];
    }
    if (!configObject) {
        throw new Error(`Failed to get config ${configName}`);
    }
    return configObject;
}

function _initStrategyConfig(configMap, configName = 'db') {
    // configMap.strategyOptions = _.merge(configMap.strategyOptions, _getConfigValue(appEnv, configName, configMap));
}

function getConfig() {
    return config;
}

export default {
    loadConfig,
    getConfig
};
