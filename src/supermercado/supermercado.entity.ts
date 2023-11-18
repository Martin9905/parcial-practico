import { CiudadEntity } from "src/ciudad/ciudad.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SupermercadoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    longitud: string;

    @Column()
    latitud: string;

    @Column()
    paginaWeb: string;

    @ManyToMany(() => CiudadEntity, ciudad => ciudad.supermercados)
    @JoinTable()
    sedes: CiudadEntity[];

}