import { createConnection, Connection } from "typeorm";
import { SeimoSesija } from "./entities/SeimoSesijos";
import { Posedis } from "./entities/Posedis";




async function main() {
    const connection = await createConnection(
        {
            type: "mysql",
            host: '194.135.87.131',
            // dropSchema: true,
            synchronize: true,
            port: 3306,
            username: 'dimuza_lrs',
            password: 'J6TXTW4Z4PScsGUr',
            database: 'dimuza_lrs',
            entities: [SeimoSesija, Posedis]
        }
    )
    // await connection.manager.save(SeimoSesija.from({
    //     data_iki: new Date(),
    //     data_nuo: new Date(),
    //     numeris: "Asd",
    //     pavadinimas: "asd",
    //     id: 'xcz',
    //     kadencijos_id: 'asd'
    // }))


    // await connection.manager.save(Posedis.from({
    //     numeris: "5456",
    //     pabaiga: new Date(),
    //     id: 'zcazxsd',
    //     pradzia: new Date(),
    //     protokolas: 'asd',
    //     sesijosId: 'xcz',
    //     stenograma: 'asd',
    //     tipas: 'asd'
    // }))

    const data = await connection.manager.getRepository(SeimoSesija).find()
    console.log(data)
}

main()