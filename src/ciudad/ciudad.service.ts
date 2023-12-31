import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find({relations: ["supermercados"]});
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["supermercados"]});
        if(!ciudad){
            throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND)
        }
        return ciudad;
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        if(!ciudad.nombre  || !ciudad.pais || !ciudad.numeroDeHabitantes){
            throw new BusinessLogicException("Falta una propiedad obligatoria en la petición", BusinessError.BAD_REQUEST);
        }
        const listaDePaises: string[] = ['Argentina', 'Ecuador', 'Paraguay']
        if(!listaDePaises.includes(ciudad.pais)){
            throw new BusinessLogicException("El pais al que pertenece la ciudad no esta en la lista de paises aceptados", BusinessError.BAD_REQUEST);
        }
        return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const listaDePaises: string[] = ['Argentina', 'Ecuador', 'Paraguay']
        if(!listaDePaises.includes(ciudad.pais)){
            throw new BusinessLogicException("El pais al que pertenece la ciudad a actualizar no esta en la lista de paises aceptados", BusinessError.BAD_REQUEST);
        }
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if(!persistedCiudad){
            throw new BusinessLogicException("La ciudad con el id ingresado no fue encontrada", BusinessError.NOT_FOUND);
        }
        return await this.ciudadRepository.save({...persistedCiudad, ...ciudad});
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if(!ciudad){
            throw new BusinessLogicException("La ciudad con el id ingresado no fue encontrada", BusinessError.NOT_FOUND);
        }
        await this.ciudadRepository.remove(ciudad);
    }

}
