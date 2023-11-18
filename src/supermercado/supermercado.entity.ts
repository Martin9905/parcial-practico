import { CiudadEntity } from "../ciudad/ciudad.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SupermercadoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column('decimal', { precision: 10, scale: 6 })
    longitud: number;

    @Column('decimal', { precision: 10, scale: 6 })
    latitud: number;

    @Column()
    paginaWeb: string;

    @ManyToMany(() => CiudadEntity, ciudad => ciudad.supermercados)
    @JoinTable()
    sedes: CiudadEntity[];

}
