import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadosList : SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();
 
    supermercadosList = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await supermercadoRepository.save({
          nombre: faker.company.name().substring(0, 10),
          longitud: faker.location.longitude(),
          latitud: faker.location.latitude(), 
          paginaWeb: faker.image.url()
        })
        supermercadosList.push(supermercado);
    }
 
    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: "Ecuador",
      numeroDeHabitantes: faker.number.int(),
      supermercados: supermercadosList
    })
  }

  it('addSupermarketToCity should add an supermarket to a city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name().substring(0, 10),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(), 
      paginaWeb: faker.image.url()
    });
 
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: "Argentina",
      numeroDeHabitantes: faker.number.int(),
      supermercados: supermercadosList
    })
 
    const result: CiudadEntity = await service.addSupermarketToCity(newCiudad.id, newSupermercado.id);
   
    expect(result.supermercados.length).toBe(6);
    expect(result.supermercados[5]).not.toBeNull();
    expect(result.supermercados[5].nombre).toBe(newSupermercado.nombre)
    expect(result.supermercados[5].longitud).toBe(newSupermercado.longitud)
    expect(result.supermercados[5].latitud).toBe(newSupermercado.latitud)
    expect(result.supermercados[5].paginaWeb).toBe(newSupermercado.paginaWeb)
  });

  it('addSupermarketToCity should thrown exception for an invalid supermarket', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: "Argentina",
      numeroDeHabitantes: faker.number.int(),
      supermercados: supermercadosList
    })
 
    await expect(() => service.addSupermarketToCity(newCiudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('addSupermarketToCity should throw an exception for an invalid city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name().substring(0, 10),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(), 
      paginaWeb: faker.image.url()
    });
 
    await expect(() => service.addSupermarketToCity("0", newSupermercado.id)).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('findSupermarketFromCity should return supermarket by city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    const storedSupermercado: SupermercadoEntity = await service.findSupermarketFromCity(ciudad.id, supermercado.id)
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toBe(supermercado.nombre);
    expect(storedSupermercado.longitud).toBe(supermercado.longitud);
    expect(storedSupermercado.latitud).toBe(supermercado.latitud);
    expect(storedSupermercado.paginaWeb).toBe(supermercado.paginaWeb);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(()=> service.findSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('findSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(()=> service.findSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('findSupermarketFromCity should throw an exception for a supermarket not associated to the city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name().substring(0, 10),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(), 
      paginaWeb: faker.image.url()
    });
 
    await expect(()=> service.findSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con el id dado no esta asociado a esa ciudad");
  });

  it('findSupermarketsFromCity should return supermarkets by city', async ()=>{
    const supermercados: SupermercadoEntity[] = await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(5)
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(()=> service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('updateSupermarketsFromCity should update supermarkets list for a city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name().substring(0, 10),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(), 
      paginaWeb: faker.image.url()
    });
 
    const updatedCity: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, [newSupermercado]);
    expect(updatedCity.supermercados.length).toBe(1);
 
    expect(updatedCity.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(updatedCity.supermercados[0].longitud).toBe(newSupermercado.longitud);
    expect(updatedCity.supermercados[0].latitud).toBe(newSupermercado.latitud);
    expect(updatedCity.supermercados[0].paginaWeb).toBe(newSupermercado.paginaWeb);
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid museum', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name().substring(0, 10),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(), 
      paginaWeb: faker.image.url()
    });
 
    await expect(()=> service.updateSupermarketsFromCity("0", [newSupermercado])).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid artwork', async () => {
    const newSupermercado: SupermercadoEntity = supermercadosList[0];
    newSupermercado.id = "0";
 
    await expect(()=> service.updateSupermarketsFromCity(ciudad.id, [newSupermercado])).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('deleteSupermarketFromCity should remove an artwork from a museum', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
   
    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);
 
    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ["supermercados"]});
    const deletedSupermercado: SupermercadoEntity = storedCiudad.supermercados.find(a => a.id === supermercado.id);
 
    expect(deletedSupermercado).toBeUndefined();
 
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid artwork', async () => {
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid museum', async () => {
    const artwork: SupermercadoEntity = supermercadosList[0];
    await expect(()=> service.deleteSupermarketFromCity("0", artwork.id)).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('deleteSupermarketFromCity should thrown an exception for an non asocciated artwork', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name().substring(0, 10),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(), 
      paginaWeb: faker.image.url()
    });
 
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con el id dado no esta asociado a esa ciudad");
  });

});
