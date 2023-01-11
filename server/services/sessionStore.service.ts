import SessionService from './session.service';
import { Store } from 'express-session';
import { Inject,Injectable } from '@nestjs/common';

@Injectable()
export default class SessionStore extends Store {

  @Inject(SessionService)
  sessionService: SessionService;

  constructor() {
    super({});
  }

  // Required
  destroy(sid, cb) {
    this.sessionService.deleteSessionBySid(sid).then(() => cb);
  }
  get(sid, cb) {
    this.sessionService.getSessionBySid(sid).then((response) => {
      cb(null, response);
    });
  }
  set(sid, session, cb) {
    this.sessionService.upsertSession(sid, session).then((response) => {
      cb(null, response);
    });
  }

  // Optional
  all(cb) {
    this.sessionService.getAllSession().then((response) => {
      cb(null, response);
    });
  }
  clear(cb) {
    this.sessionService.deleteAllSession().then(() => cb);
  }
  length(cb) {
    this.sessionService.getSessionCount().then((response) => {
      const len = parseInt(response);
      cb(null, len);
    });
  }
  // Recommended
  touch(sid, session, cb) {
    this.sessionService.updateSession(sid, session).then((response) => {
      cb(null, response);
    });
  }
}