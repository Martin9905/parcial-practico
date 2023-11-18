import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { SupermercadoDto } from './supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity';
import { plainToInstance } from 'class-transformer';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
    constructor(private readonly supermercadoService: SupermercadoService){}

    @Get()
    async findAll() {
        return await this.supermercadoService.findAll();
    }

    @Get(':supermarkedId')
    async findOne(@Param('supermarkedId') supermarkedId: string) {
        return await this.supermercadoService.findOne(supermarkedId);
    }
    
    @Post()
    async create(@Body() supermarketDto: SupermercadoDto) {
        const supermercado: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermarketDto);
        return await this.supermercadoService.create(supermercado);
    }

    @Put(':supermarkedId')
    async update(@Param('supermarkedId') supermarkedId: string, @Body() supermarketDto: SupermercadoDto) {
        const supermercado: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermarketDto);
        return await this.supermercadoService.update(supermarkedId, supermercado);
    }

    @Delete(':supermarkedId')
    @HttpCode(204)
    async delete(@Param('supermarkedId') supermarkedId: string) {
        return await this.supermercadoService.delete(supermarkedId);
    }

}
