import { csvRead, jsonWrite } from "iterparse";
import { Root } from "../root";
import { AsyncIterable } from 'ix'
import * as P from 'ts-prime'
import * as z from 'zod'

export namespace CandidateFactory {
    export const schema = z.object({
        rowId: z.string(),
        displayName: z.string(),
        politicalPartyNumber: z.string(),
        politicalPartyName: z.string(),
        vanr: z.string().optional(),
        va: z.string().optional(),
        iv: z.string().optional()
    })
    export interface Candidate extends z.TypeOf<typeof schema> { }
    export function extract(filePath: string): AsyncIterable<Candidate> {
        const data = {
            'Eilės Nr.': 'rowId',
            'Vardas PAVARDĖ': 'displayName',
            'Daugiamandatės sąrašo Nr.': 'politicalPartyNumber',
            'Daugiamandatės sąrašas': 'politicalPartyName',
            'Nr. sąraše': 'politicianNumber',
            'Vienmandatės apygardos Nr.': 'vanr',
            'Vienmandatė apygarda': 'va',
            'Iškėlė vienmandatėje': 'iv',
            'Išsikėlė pats (-i)': 'ip'
        }
        return AsyncIterable
            .from(csvRead(filePath))
            .map((c) => {
                return P.canFail(()=> {
                    return schema.nonstrict().parse(Object.assign({}, ...Object.keys(c).map((k) => {
                        return {
                            [data[k]]: c[k]
                        }
                    })))
                })
            })
            .filter(P.isNot(P.isError))
    }
}
CandidateFactory
    .extract(Root.path("../data/kandi.csv"))
    .pipe(jsonWrite(Root.path("../data/normalize.json")))
    .tap((q) => {
        console.log(q)
    })
    .count()

// Root.path("../data/kandi.csv")
