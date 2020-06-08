
import { csvRead, XMLObject } from 'iterparse'

import jt from 'fs-jetpack'
import { AsyncIterable } from 'ix'
import { URL } from 'url'
import { getVoting } from './extract'

export interface CSVData {
    order: string;
    fullOrder: string;
    linkToOrder: string;
    linkToVotes: string;
    youtubeUrl: string;
}



function extractVoteId(url: string): string | undefined {
    try {
        const urlParsed = new URL(url)
        return urlParsed.searchParams.get('p_bals_id')
    } catch {
        return
    }
}

function mapToRecord<K extends string, V>(data: Map<K, V>) {
    return Array.from(data.entries()).reduce((acc, [k,v])=>{
        acc[k] = v
        return acc
    }, {} as Record<K, V>)
 }

async function parseAndExtractData() {
    const data = await AsyncIterable
        .from(csvRead<CSVData>(jt.path("./pagistatymai.csv")))
        .map((e) => {
            return {
                ...e,
                voteId: extractVoteId(e.linkToVotes)
            }
        })
        .filter((c) => !!c.voteId)
        .map(async (item) => {
            const votes = await AsyncIterable.from(getVoting(item.voteId)).toArray()
            return {
                ...item,
                votes
            }
        })
        .toArray()

    const peaople = await AsyncIterable.from(data).flatMap((q) => {
        return AsyncIterable.from(q.votes)
    })
        .toMap((s) => {
            return s.asmens_id
        })


    await jt.writeAsync("peaple.json", Object.values(mapToRecord(peaople)))

    await jt.writeAsync("mock.data.json", data)
}

parseAndExtractData()