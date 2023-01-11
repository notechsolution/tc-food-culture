import axios from 'axios';

const cancelTokens = [];

const service = axios.create({
    timeout: 5 * 60 * 1000
});

service.defaults.headers.common.accept = 'application/json';

service.interceptors.request.use(
  (config) => {
    const source = axios.CancelToken.source();
    cancelTokens.push(source);
    config.cancelToken = source.token;
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);


service.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (axios.isCancel(error)) {
            return;
        }

        return Promise.reject(error.response);
    }
);

export {
    service
};
