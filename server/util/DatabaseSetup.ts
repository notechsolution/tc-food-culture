import { connect, connection } from 'mongoose';
import * as mongoose from 'mongoose';

(<any>mongoose).Promise = global.Promise;

export default class DatabaseSetup {

    private db;

    async setupDb() {
        await this.connectToDb(process.env.MONGODB_URI);
    }

    async setupTestDb(callback) {
        await this.connectToDb(process.env.MONGODB_TEST_URI);
    }

    async connectToDb(uri) {
        if (!uri) {
            throw 'No MongoDB URI provided. Please add MONGODB_URI to env file';
        }
        await connect(uri);
        this.db = connection;
        console.log('Connected to MongoDB');
    }

    async close(done) {
        await connection.close();
        done && done();
    }

    async before(done) {
        await this.setupDb();
        done();
    }

    async after(done = null) {
        await this.db.close();
        await this.close(done);
    }
}
