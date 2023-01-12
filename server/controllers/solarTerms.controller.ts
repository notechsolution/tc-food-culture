import {
    Body,
    Controller, Delete,
    Get,
    Inject,
    Logger,
    Param,
    Request,
    StreamableFile,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import _ from 'lodash';
import SolarTermsResource from '../../shared/resources/SolarTermsResource';
import { Post200 } from '../nestjs/decorators/post200.decorator';
import BaseController from './BaseController';
import SolarTermsService from '../services/solarTerms.service';

@Controller('solarTerms')
export default class SolarTermsController extends BaseController {

    @Inject(Logger)
    private readonly logger: Logger;

    @Inject(SolarTermsService)
    solarTermsService: SolarTermsService;

    @Post200('/')
    @UseInterceptors(FileInterceptor('image'))
    async saveSolarTerms(@Request() request: any, @UploadedFile() file: any, @Body() solarTerms: SolarTermsResource) {
        if (!solarTerms) return;
        return this.solarTermsService.upsertSolarTerms(solarTerms, file?.buffer);
    }

    @Get('/:name')
    async getByParams( @Param('name') name: string) {
        if('ALL' === _.upperCase(name)){
            return this.solarTermsService.getAllSolarTerms();
        }
        return this.solarTermsService.getSolarTermsByName(name);
    }

    @Get('/:id/image')
    async getSolarTermsImage( @Param('id') id: string) {
        const solarTerm = await this.solarTermsService.getSolarTermsById(id);
        if(solarTerm.image){
            return new StreamableFile(solarTerm.image);
        }
        return '';
    }

    @Delete('/:id')
    async deleteSolarTerms(@Param('id') id: string) {
        if (!id) return;
        return this.solarTermsService.deleteSolarTermsById(id);
    }
}
