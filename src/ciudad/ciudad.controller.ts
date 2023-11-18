import { Controller, UseInterceptors } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
    constructor(private readonly ciudadService: CiudadService){}

}
