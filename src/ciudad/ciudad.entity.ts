import { SupermercadoEntity } from "../supermercado/supermercado.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CiudadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    pais: string;

    @Column()
    numeroDeHabitantes: number;

    @ManyToMany(() => SupermercadoEntity, supermercado => supermercado.sedes)
    supermercados: SupermercadoEntity[];

}
