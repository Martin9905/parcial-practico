import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    const paisesPermitidos = ['Argentina', 'Ecuador', 'Paraguay'];
    for(let i = 0; i < 5; i++){
      const randomIndex = Math.floor(Math.random() * paisesPermitidos.length);
      const paisRandom = paisesPermitidos[randomIndex];
      const ciudad: CiudadEntity = await repository.save({
      nombre: faker.location.city(),
      pais: paisRandom,
      numeroDeHabitantes: faker.number.int()})
      ciudadesList.push(ciudad);
    }
  }

  it('findAll should return all cities', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre);
    expect(ciudad.pais).toEqual(storedCiudad.pais);
    expect(ciudad.numeroDeHabitantes).toEqual(storedCiudad.numeroDeHabitantes)
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada")
  });

  it('create should return a new city', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.location.city(),
      pais: 'Argentina',
      numeroDeHabitantes: faker.number.int(),
      supermercados: []
    }
 
    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();
 
    const storedCiudad: CiudadEntity = await repository.findOne({where: {id: newCiudad.id}})
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(newCiudad.nombre)
    expect(storedCiudad.pais).toEqual(newCiudad.pais)
    expect(storedCiudad.numeroDeHabitantes).toEqual(newCiudad.numeroDeHabitantes)
  });

  it('create should throw an exception for an invalid city country', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.location.city(),
      pais: 'Colombia',
      numeroDeHabitantes: faker.number.int(),
      supermercados: []
    }
    await expect(() => service.create(ciudad)).rejects.toHaveProperty("message", "El pais al que pertenece la ciudad no esta en la lista de paises aceptados")
  });

  it('create should throw an exception for an invalid city request without fields ', async () => {
    const ciudadSinDatos: CiudadEntity = new CiudadEntity(); 
    await expect(() => service.create(ciudadSinDatos)).rejects.toHaveProperty("message", "Falta una propiedad obligatoria en la petición");
  });

  it('update should modify a city', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = "New city";
    ciudad.numeroDeHabitantes = 50;
    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre)
    expect(storedCiudad.numeroDeHabitantes).toEqual(ciudad.numeroDeHabitantes)
  });

  it('update should throw an exception for an invalid city', async () => {
    let ciudad: CiudadEntity = ciudadesList[0];
    ciudad = {
      ...ciudad, nombre: "New name", numeroDeHabitantes: 100
    }
    await expect(() => service.update("0", ciudad)).rejects.toHaveProperty("message", "La ciudad con el id ingresado no fue encontrada")
  });

  it('update should throw an exception for an invalid city country', async () => {
    let ciudad: CiudadEntity = ciudadesList[0];
    ciudad = {
      ...ciudad, pais: "Colombia"
    }
    await expect(() => service.update(ciudad.id, ciudad)).rejects.toHaveProperty("message", "El pais al que pertenece la ciudad a actualizar no esta en la lista de paises aceptados")
  });
  
  it('delete should remove a city', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);
     const deletedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(deletedCiudad).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La ciudad con el id ingresado no fue encontrada")
  });

});
