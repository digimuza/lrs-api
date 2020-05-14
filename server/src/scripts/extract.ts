import { AsyncIterable } from 'ix'
import { xmlRead, jsonWrite } from "iterparse"
import fetch from 'node-fetch'
import { Sessions, Meeting, Meetings } from 'src/types'


function getSessions() {
    return AsyncIterable
        .of(true)
        .map(() => fetch('https://apps.lrs.lt/sip/p2b.ad_seimo_sesijos'))
        .map((c) => c.body)
        .flatMap((c) => xmlRead<Sessions>(c, { pattern: 'SeimoKadencija' }))
        // .pipe(jsonWrite("./data/sessions.json"))
}


function getSession(id: string) {
    const url = `https://apps.lrs.lt/sip/p2b.ad_seimo_posedziai?sesijos_id=${id}`
    return AsyncIterable
        .of(true)
        .map(() => fetch(url))
        .map((c) => c.body)
        .flatMap((c) => xmlRead<Meetings>(c, { pattern: 'SeimoPosėdis' }))
        .pipe(jsonWrite(`./data/sessions/session-${id}.json`))
}

function getMeeting(id: string) {
    const url = `https://apps.lrs.lt/sip/p2b.ad_seimo_posedzio_eiga_full?posedzio_id=${id}`
    return AsyncIterable
        .of(true)
        .map(() => fetch(url))
        .map((c) => c.body)
        .flatMap((c) => xmlRead<Meeting>(c, { pattern: 'posedis' }))
        .pipe(jsonWrite(`./data/sessions/meetings/meeting-${id}.json`))
}

function getVoting(id: string) {
    const url = `https://apps.lrs.lt/sip/p2b.ad_sp_balsavimo_rezultatai?balsavimo_id=${id}`
    return AsyncIterable
        .of(true)
        .map(() => fetch(url))
        .map((c) => c.body)
        .flatMap((c) => xmlRead(c, { pattern: 'IndividualusBalsavimoRezultatas' }))
        .pipe(jsonWrite("./votes.json"))
}


AsyncIterable.from(
    getSessions()
)
    .flatMap((c) => {
        console.log("Extracting sessions")
        console.log("sd")
        return AsyncIterable.from(c.SeimoSesija)
    })
    .flatMap((c) => {
        console.log("Getting meetings")
        return getSession(c.sesijos_id)
    })
    .flatMap((c) => {
        console.log(`Getting meeting ${c.$attrs.posėdžio_id}`)
        return getMeeting(c.$attrs.posėdžio_id)
    })
    .flatMap((c) => {
        return AsyncIterable.from(
            c["posedzio-eiga"].map((c) => {
                return {
                    name: c.pavadinimas,
                    voting: c.balsavimai?.$attrs?.bals_id
                }
            })).filter((c) => !!c.voting)
    })
    .filter((c) => !!c.voting)
    .flatMap(async (c) => {
        const allVotes = await getVoting(c.voting).toArray()
        return AsyncIterable.of(
            {
                ...c,
                votes: allVotes
            }
        ).pipe(jsonWrite(`./data/votes/votes-${c.voting}.json`))
    })
    .count()