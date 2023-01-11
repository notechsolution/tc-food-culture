import HttpError from './HttpError';

export class InternalServerError extends HttpError {

    error: string;
    type = 'InternalServer';

    constructor(message?) {
        super();
        this.error = message || 'An internal server error has occurred. Please contact the server administrator.';
    }

    getType(): string {
        return this.type;
    }

    getError(): string {
        return this.error;
    }

}
