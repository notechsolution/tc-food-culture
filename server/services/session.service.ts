import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import SessionResource from '../../shared/resources/session/SessionResource';
import { SessionEntity } from '../models/session.entity';

@Injectable()
export default class SessionService {

    @InjectModel(SessionEntity.name)
    sessionEntity: Model<SessionEntity>;

    _isExpired(expires) {
        if (!expires) {
            return true;
        }

        return Date.parse(expires) < Date.now();
    }

    _getExpires(session) {
        if (!session.cookie) {
            session.cookie = {};
        }

        if (this._isExpired(session.cookie.expires)) {
            const maxAge = 3600000;
            session.cookie.originalMaxAge = maxAge;
            session.cookie.expires = new Date(Date.now() + maxAge).toISOString();
        }
        return new Date(session.cookie.expires);
    }

    async getAllSession(): Promise<SessionEntity[]> {
        return await this.sessionEntity.find({});
    }

    async getSessionCount(): Promise<any> {
        return await this.sessionEntity.estimatedDocumentCount();
    }

    async getSessionBySid(sid: string): Promise<any> {
        const serviceResponse = await this.sessionEntity.findOne({ sid });
        return serviceResponse?.session; 
    }

    async updateSession(sid: string, session: SessionResource): Promise<any> {
        const serviceResponse = await this.sessionEntity.findOne({ sid });
        if (serviceResponse) {
            const expires = this._getExpires(session);
            return await this.sessionEntity.updateOne({ _id:serviceResponse._id } ,{ session, expires });
        }
        return serviceResponse;
    }

    async upsertSession(sid: string, session: SessionResource): Promise<any> {
        const serviceResponse = await this.sessionEntity.findOne({ sid });
        const expires = this._getExpires(session);
        if (!serviceResponse) {
            return await this.sessionEntity.create({ sid, session, expires });
        }
        return await this.sessionEntity.updateOne({ _id:serviceResponse._id } ,{ session, expires });
    }

    async deleteAllSession(): Promise<any> {
        return await this.sessionEntity.deleteMany({});
    }

    async deleteSessionBySid(sid: string): Promise<any> {
        return await this.sessionEntity.deleteOne({ sid });
    }
}
