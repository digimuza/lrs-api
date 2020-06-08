

export interface SeimoSesijaData {
    id: string;
    numeris: string;
    pavadinimas: string;
    data_nuo: Date;
    kadencijos_id: string
    data_iki: Date;
}
declare function getSeimoSesijos(): Promise<SeimoSesijaData[]>
declare function getSeimoSesija(id: string): Promise<SeimoSesijaData>

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

declare function getPosedziai(from: Date, to: Date, full: boolean): Promise<PosedisData[]>
declare function getPosedis(id: string): Promise<PosedisData>
declare function getTopics(from: Date, to: Date): void