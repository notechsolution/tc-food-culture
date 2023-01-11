import csurf from 'csurf';


const csrfWhiteList = [
  '/api/billing',
  '/api/billing/chargedItems',
  '/api/auth/login',
  '/api/auth/custom/callback'
];

const csrfOptions = {
  cookie: false,
  value: (req) => {
    return req.headers['x-csrf-token'];
  }
};
const csurfMiddelware = csurf(csrfOptions);

function conditionalCSRF(req, res, next) {
  if (csrfWhiteList.includes(req.originalUrl)) {
    return next();
  }
  return csurfMiddelware(req, res, next);
}

export {
  conditionalCSRF
};