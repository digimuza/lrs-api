import { AsyncIterable } from 'ix'
import { xmlRead, jsonWrite, XMLObject } from "iterparse"
import fetch from 'node-fetch'
import { Sessions, Meeting, Meetings, RawMemberOfParlament } from 'src/types'
import jetpack from 'fs-jetpack'

export function getSessions() {
    return AsyncIterable
        .of(true)
        .map(() => fetch('https://apps.lrs.lt/sip/p2b.ad_seimo_sesijos'))
        .map((c) => c.body)
        .flatMap((c) => xmlRead<RawMemberOfParlament.Parlament>(c, { pattern: 'SeimoKadencija' }))
}

export function getCurrentSessionsParlaments() {
    return AsyncIterable
        .of(true)
        .map(() => fetch('https://apps.lrs.lt/sip/p2b.ad_seimo_nariai'))
        .map((c) => c.body)
        .flatMap((c) => xmlRead<RawMemberOfParlament.Parlament>(c, { pattern: 'SeimoNarys' }))
        .pipe(jsonWrite("./data/current-parlaments.json"))
}


export function getSession(id: string) {
    const url = `https://apps.lrs.lt/sip/p2b.ad_seimo_posedziai?sesijos_id=${id}`
    return AsyncIterable
        .of(true)
        .map(() => fetch(url))
        .map((c) => c.body)
        .flatMap((c) => xmlRead<Meetings>(c, { pattern: 'SeimoPosėdis' }))
        .pipe(jsonWrite(`./data/sessions/session-${id}.json`))
}

export function getMeeting(id: string) {
    const url = `https://apps.lrs.lt/sip/p2b.ad_seimo_posedzio_eiga_full?posedzio_id=${id}`
    return AsyncIterable
        .of(true)
        .map(() => fetch(url))
        .map((c) => c.body)
        .flatMap((c) => xmlRead<Meeting>(c, { pattern: 'posedis' }))
        .pipe(jsonWrite(`./data/sessions/meetings/meeting-${id}.json`))
}

export interface Vote extends XMLObject {
    $name:        string;
    asmens_id:    string;
    vardas:       string;
    pavardė:      string;
    frakcija:     string;
    kaip_balsavo: string;
}

export function getVoting(id: string) {
    const url = `https://apps.lrs.lt/sip/p2b.ad_sp_balsavimo_rezultatai?balsavimo_id=${id}`
    return AsyncIterable
        .of(true)
        .map(() => fetch(url))
        .map((c) => c.body)
        .flatMap((c) => xmlRead<Vote>(c, { pattern: 'IndividualusBalsavimoRezultatas' }))
        .pipe(jsonWrite("./votes.json"))
}

getCurrentSessionsParlaments().map((c)=>{
    return c.$attrs.asmens_id
}).pipe(jsonWrite("./active-parlaments.json")).count()