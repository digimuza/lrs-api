import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Posedis } from "./Posedis";


export interface SeimoSesijaData {
    id: string;
    numeris: string;
    pavadinimas: string;
    data_nuo: Date;
    kadencijos_id: string
    data_iki: Date;
}


@Entity()
export class SeimoSesija implements SeimoSesijaData {
    static from(data: SeimoSesijaData) {
        const entity = new SeimoSesija()
        entity.id = data.id
        entity.data_iki = data.data_iki
        entity.data_nuo = data.data_nuo
        entity.pavadinimas = data.pavadinimas
        entity.numeris = data.numeris
        entity.kadencijos_id = data.kadencijos_id
        return entity
    }

    @Column()
    kadencijos_id: string

    @PrimaryColumn()
    id: string;

    @Column()
    numeris: string;

    @Column()
    pavadinimas: string;

    @Column()
    data_nuo: Date;

    @Column()
    data_iki: Date;


    @OneToMany(type => Posedis, posedis => posedis.sesijos)
    posedziai: Posedis[]
}