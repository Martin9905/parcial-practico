import { Injectable } from '@nestjs/common';
import { SupermercadoEntity } from './supermercado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoService {
    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>
    ){}

    async findAll(): Promise<SupermercadoEntity[]> {
        return await this.supermercadoRepository.find({relations: ["sedes"]});
    }

    async findOne(id: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}, relations: ["sedes"]});
        if(!supermercado){
            throw new BusinessLogicException("El supermercado con el id dado no fue encontrado", BusinessError.NOT_FOUND)
        }
        return supermercado;
    }

    async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        if(!supermercado.nombre  || !supermercado.latitud || !supermercado.longitud ||!supermercado.paginaWeb){
            throw new BusinessLogicException("Falta una propiedad obligatoria en la petición", BusinessError.BAD_REQUEST);
        }
        if(supermercado.nombre.length > 10){
            throw new BusinessLogicException("El nombre del supermercado recibido tiene mas de 10 caracteres", BusinessError.BAD_REQUEST);
        }
        return await this.supermercadoRepository.save(supermercado);
    }

    async update(id: string, supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        if(supermercado.nombre.length > 10){
            throw new BusinessLogicException("El nombre del supermercado recibido tiene mas de 10 caracteres", BusinessError.BAD_REQUEST);
        }
        const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
        if(!persistedSupermercado){
            throw new BusinessLogicException("El supermercado con el id ingresado no fue encontrado", BusinessError.NOT_FOUND);
        }
        return await this.supermercadoRepository.save({...persistedSupermercado, ...supermercado});
    }

    async delete(id: string) {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
        if(!supermercado){
            throw new BusinessLogicException("El supermercado con el id ingresado no fue encontrado", BusinessError.NOT_FOUND);
        }
        await this.supermercadoRepository.remove(supermercado);
    }

}
