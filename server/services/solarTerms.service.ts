import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SolarTermsEntity } from '../models/solarterms.entity';
import SolarTermsResource from '../../shared/resources/SolarTermsResource';
import _ from 'lodash';

@Injectable()
export default class SolarTermsService {

    @InjectModel(SolarTermsEntity.name)
    solarTermsEntity: Model<SolarTermsEntity>;

    async getAllSolarTerms(): Promise<SolarTermsEntity[]> {
        return this.solarTermsEntity.find({});
    }

    async getSolarTermsCount(): Promise<any> {
        return this.solarTermsEntity.estimatedDocumentCount();
    }

    async getSolarTermsByName(name: string): Promise<any> {
        return this.solarTermsEntity.findOne({ name });
    }

    async getSolarTermsById(id: string): Promise<SolarTermsEntity> {
        return this.solarTermsEntity.findById(id);
    }

    async createSolarTerms(solarTermsResource: SolarTermsResource, file: Buffer): Promise<any> {
        const solarTerm = _.pick(solarTermsResource,
            [ 'name', 'englishName', 'seq',
                'description', 'createdBy','season']) as unknown as SolarTermsEntity;
        solarTerm.image = file;
        return this.solarTermsEntity.create(solarTerm);
    }

    async upsertSolarTerms(solarTermsResource: SolarTermsResource, file: Buffer): Promise<any> {
        const solarTerm = _.pick(solarTermsResource,
            [ 'name', 'englishName', 'seq',
                'description','season']) as unknown as SolarTermsEntity;
        if(file){
            solarTerm.image = file;
        }

        const serviceResponse = await this.solarTermsEntity.findOne({ name: solarTermsResource.name });
        if (!serviceResponse) {
            return this.solarTermsEntity.create(solarTerm);
        }
        return this.solarTermsEntity.updateOne({ _id:serviceResponse._id } ,solarTerm);
    }

    async deleteSolarTermsById(id: String) {
        return this.solarTermsEntity.findByIdAndDelete(id);
    }

}
