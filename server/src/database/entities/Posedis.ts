import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { SeimoSesija } from "./SeimoSesijos";


export interface PosedisData {
    protokolas: string;
    stenograma: string;
    sesijosId: string
    // VaizdoĮrašas: Video[] | Video;
    id: string;
    pradzia: Date;
    pabaiga: Date;
    numeris: string;
    tipas: string;
}

@Entity()
export class Posedis implements PosedisData {
    static from(data: PosedisData) {
        const entity = new Posedis()
        entity.sesijosId = data.sesijosId
        entity.protokolas = data.protokolas
        entity.stenograma = data.stenograma
        entity.id = data.id
        entity.pradzia = data.pradzia
        entity.pabaiga = data.pabaiga
        entity.numeris = data.numeris
        entity.tipas = data.tipas
        return entity
    }

    @Column()
    sesijosId: string

    @PrimaryColumn()
    id: string;

    @Column()
    numeris: string;

    @Column()
    protokolas: string;

    @Column()
    stenograma: string;

    @Column()
    tipas: string;

    @Column()
    pradzia: Date;

    @Column()
    pabaiga: Date;

    @ManyToOne(() => SeimoSesija, (s) => s.posedziai)
    sesijos: SeimoSesija
}