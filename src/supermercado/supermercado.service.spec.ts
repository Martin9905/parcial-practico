import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for(let i = 0; i < 5; i++){
      const supermercado: SupermercadoEntity = await repository.save({
      nombre: faker.company.name().substring(0, 10),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(), 
      paginaWeb: faker.image.url()})
      supermercadosList.push(supermercado);
    }
  }

  it('findAll should return all supermarkets', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadosList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre);
    expect(supermercado.latitud).toEqual(storedSupermercado.latitud);
    expect(supermercado.longitud).toEqual(storedSupermercado.longitud);
    expect(supermercado.paginaWeb).toEqual(storedSupermercado.paginaWeb);
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado")
  });

  it('create should return a new supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: faker.company.name().substring(0, 10),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(), 
      paginaWeb: faker.image.url(),
      sedes: []
    }
 
    const newSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();
 
    const storedSupermercado: SupermercadoEntity = await repository.findOne({where: {id: newSupermercado.id}})
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(newSupermercado.nombre)
    expect(storedSupermercado.longitud).toEqual(newSupermercado.longitud)
    expect(storedSupermercado.latitud).toEqual(newSupermercado.latitud)
    expect(storedSupermercado.paginaWeb).toEqual(newSupermercado.paginaWeb)
  });

  it('create should throw an exception for an invalid supermarket name', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: faker.company.name().substring(0, 15),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(), 
      paginaWeb: faker.image.url(),
      sedes: []
    }
    await expect(() => service.create(supermercado)).rejects.toHaveProperty("message", "El nombre del supermercado recibido tiene mas de 10 caracteres")
  });

  it('create should throw an exception for an invalid supermarket request without fields ', async () => {
    const supermercadoSinDatos: SupermercadoEntity = new SupermercadoEntity(); 
    await expect(() => service.create(supermercadoSinDatos)).rejects.toHaveProperty("message", "Falta una propiedad obligatoria en la petición");
  });
  
  it('update should modify a supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = "Super";
    supermercado.latitud = 50;
    const updatedSupermarket: SupermercadoEntity = await service.update(supermercado.id, supermercado);
    expect(updatedSupermarket).not.toBeNull();
    const storedSupermarket: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.nombre).toEqual(supermercado.nombre)
    expect(storedSupermarket.latitud).toEqual(supermercado.latitud)
  });

  it('update should throw an exception for an invalid supermarked', async () => {
    let supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado = {
      ...supermercado, nombre: "New name", latitud: 100
    }
    await expect(() => service.update("0", supermercado)).rejects.toHaveProperty("message", "El supermercado con el id ingresado no fue encontrado")
  });

  it('update should throw an exception for an invalid supermarket length', async () => {
    let supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado = {
      ...supermercado, nombre: "New Supermarket long name"
    }
    await expect(() => service.update(supermercado.id, supermercado)).rejects.toHaveProperty("message", "El nombre del supermercado recibido tiene mas de 10 caracteres")
  });

  it('delete should remove a supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);
     const deletedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El supermercado con el id ingresado no fue encontrado")
  });


});
