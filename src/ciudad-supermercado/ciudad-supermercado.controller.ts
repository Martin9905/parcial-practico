import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto';
import { plainToInstance } from 'class-transformer';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
    constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService){}

    @Post(':cityId/supermarkets/:supermarketId')
    async addSupermarketToCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
        return await this.ciudadSupermercadoService.addSupermarketToCity(cityId, supermarketId);
    }

    @Get(':cityId/supermarkets/:supermarketId')
    async findSupermarketFromCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
        return await this.ciudadSupermercadoService.findSupermarketFromCity(cityId, supermarketId);
    }

    @Get(':cityId/supermarkets')
    async findSupermarketsFromCity(@Param('cityId') cityId: string){
        return await this.ciudadSupermercadoService.findSupermarketsFromCity(cityId);
    }

    @Put(':cityId/supermarkets')
    async updateSupermarketsFromCity(@Body() supermarketDto: SupermercadoDto[], @Param('cityId') cityId: string){
        const artworks = plainToInstance(SupermercadoEntity, supermarketDto)
        return await this.ciudadSupermercadoService.updateSupermarketsFromCity(cityId, artworks);
    }

    @Delete(':cityId/supermarkets/:supermarketId')
    @HttpCode(204)
    async ddeleteSupermarketFromCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
        return await this.ciudadSupermercadoService.deleteSupermarketFromCity(cityId, supermarketId);
    }

}
