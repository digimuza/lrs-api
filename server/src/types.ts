export interface Sessions {
    $name: string;
    SeimoSesija: SeimoSesija[];
    $attrs: {
        kadencijos_id: string;
    };
}

export interface SeimoSesija {
    sesijos_id: string;
    numeris: string;
    pavadinimas: string;
    data_nuo: string;
    data_iki: string;
}

export interface Meetings {
    $name: string;
    Protokolas: string;
    Stenograma: string;
    VaizdoĮrašas: Video[] | Video;
    $attrs: {
        posėdžio_id: string;
        numeris: string;
        tipas: string;
        pradžia: string;
        pabaiga: string;
    };
}

export interface Video {
    komentaras: string;
    vaizdo_įrašo_nuoroda: string;
}


export interface Meeting {
    $name: string;
    pavadinimas: string;
    nr: string;
    data: string;
    pradzia: Date;
    pabaiga: Date;
    "posedzio-eiga": PosedzioEiga[];
    registracijos: Registracijos;
    $attrs: {
        pos_id: string;
        ses_id: string;
    };
}


export interface PosedzioEiga {
    nr: string;
    pavadinimas: string;
    stadija?: string;
    tipas: string;
    nuo: Date;
    iki: Date;
    kalbos?: Kalbo[] | KalbosClass;
    $attrs: PosedzioEigaAttrs;
    balsavimai?: Balsavimai;
}

export interface PosedzioEigaAttrs {
    svarst_kl_stad_id: string;
    kl_stad_id: string;
    dok_key?: string;
}

export interface Balsavimai {
    nuo: Date;
    iki: Date;
    aprasas: string;
    antraste: string;
    $attrs: BalsavimaiAttrs;
}

export interface BalsavimaiAttrs {
    bals_id: string;
}

export interface Kalbo {
    asmuo: string;
    nuo: Date;
    iki: Date;
    $attrs: KalboAttrs;
    pareigos?: string;
}

export interface KalboAttrs {
    klb_id: string;
    diskus_id: string;
    asm_id?: string;
    pran_id?: string;
}

export interface KalbosClass {
    asmuo: string;
    nuo: Date;
    iki: Date;
    $attrs: KalboAttrs;
}

export interface Registracijos {
    nuo: Date;
    iki: Date;
    antraste: string;
    $attrs: RegistracijosAttrs;
}

export interface RegistracijosAttrs {
    reg_id: string;
}

export interface Vote {
    $name: string;
    asmens_id: string;
    vardas: string;
    pavardė: string;
    frakcija: string;
    kaip_balsavo: string;
}
