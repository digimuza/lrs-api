import { XMLObject } from "iterparse";


export namespace RawMemberOfParlament {
    export interface Parlament extends XMLObject {
        $name:      string;
        Kontaktai?: KontaktaiElement[] | KontaktaiElement;
        Pareigos:   Pareigo[];
        $attrs:     Attrs;
    }
    export interface Attrs extends Record<string, string> {
        asmens_id:           string;
        vardas:              string;
        pavardė:             string;
        lytis:               string;
        data_nuo:            string;
        data_iki:            string;
        iškėlusi_partija:    string;
        išrinkimo_būdas:     string;
        kadencijų_skaičius:  string;
        biografijos_nuoroda: string;
    }
    
    export interface KontaktaiElement {
        rūšis:   string;
        reikšmė: string;
    }
    
    export interface Pareigo {
        padalinio_id?:                     string;
        padalinio_pavadinimas?:            string;
        pareigos:                          string;
        data_nuo:                          Date;
        data_iki:                          string;
        parlamentinės_grupės_id?:          string;
        parlamentinės_grupės_pavadinimas?: string;
    }
    
}
 

export interface Sessions extends XMLObject {
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

export interface Meetings extends XMLObject {
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


export interface Meeting extends XMLObject {
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
