import * as _ from 'lodash';
import { InternalServerError } from '../../shared/errors/InternalServerError';
import ServiceResponse from '../services/response/ServiceResponse';

export default abstract class BaseController {

    handleServiceError(response, err) {
        if (_.isUndefined(err) || err == null) {
            response.status(500).json(new InternalServerError().getJson());
            return response;
        }
        let errorResponse;
        if( err instanceof ServiceResponse) {
            const data = err.data || '';
            if(data instanceof Error){
                errorResponse = new InternalServerError(data.message);
            } else {
                errorResponse = err.buildError();
            }
        }
        response.status(err.errorCode || 500).json(errorResponse.getJson());
        return response;
    }

    handleControllerError(response, err) {
        response.status(err.errorCode || 500).json({
            error: err.message || err
        });
        return response;
    }

}
