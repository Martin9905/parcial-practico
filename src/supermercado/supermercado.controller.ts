import { Controller, UseInterceptors } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
    constructor(private readonly supermercadoService: SupermercadoService){}

}
