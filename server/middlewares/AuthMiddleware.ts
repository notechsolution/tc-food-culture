// import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import _ from 'lodash';
import ServiceResponse from '../services/response/ServiceResponse';

const doNotRequireLoginApiPatterns = [
    '/api/auth/*',
    '/api/session/*',
    '/api/billing',
    '/api/billing/chargedItems'
];

// @Middleware({ type: 'before' })
export class AuthMiddleware{
    use(request:any, response:any, next:(err?: any) => any): void {
        if (this.needAuthentication(request.originalUrl)) {
            if (request.isAuthenticated()) {
                return next();
            } else {
                return response.status(401).json(new ServiceResponse({ submLoginRequired: true }));
            }
        }
        next();
    }

    needAuthentication(originalUrl: string): boolean {
        const isDoNotRequireLoginApi = _.some(doNotRequireLoginApiPatterns, (pattern: string) => {
            return originalUrl.match(pattern);
        });
        return originalUrl.match('/api/*') && !isDoNotRequireLoginApi;
    }
}
