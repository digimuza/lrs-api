import React from 'react'
import { VoteTicket } from './types';
import { getQuestions, VotingInfo, Vote, PolticianPartyData } from '../../database';
import * as P from 'ts-prime'
type UserVotes = Record<string, VoteTicket>

// const mockUserData: UserVotes = {
//     '-25491': VoteTicket.FOR,
//     '-21592': VoteTicket.IDLE,
// }
// getQuestions().then((info) => {
//     console.group("getQuestions")
//     const rawScore = CalculateRawScores(P.indexBy(info, (q) => q.voteId), mockUserData)
//     console.log(rawScore);
//     const normalizedPoliticianScore = CalculateNormalizedPoliticianScore(rawScore)
//     console.log({ normalizedPoliticianScore })

//     const s = rawScore.map((v) => {
//         return [v.legislationID, v.legislationScore]
//     }).sort((v1, v2) => { return v1[1] >= v2[1] ? -1 : 1 })

//     console.log(s)

//     console.groupEnd()
// })

function result() {
    return <div>
        "ASD"
</div>
}




export function CalculateLegislationScore(iMaxMembers: number, iDecisionTreshold: number, iFor: number, iAgainst: number, iAbstained: number) {
    const participated = iFor + iAgainst + iAbstained
    const votingMultiplier = (1 - Math.abs(iFor / participated - 0.5) / 0.5)
    const participationMultiplier = participated < iDecisionTreshold ? 2 * (participated / iDecisionTreshold) : 2 - (participated - 71) / 71;
    return votingMultiplier * participationMultiplier;
}

function voteToInt(iVote: VoteTicket) {
    switch (iVote) {
        case VoteTicket.FOR: return 0;
        case VoteTicket.AGAINST: return 1;
        case VoteTicket.IDLE: return 2;
        case VoteTicket.MISSING: return 3;
    }
}

function CalculateDecisionScore(iPoliticianVote: VoteTicket, iUserVote: VoteTicket) {
    const weightsFor = [8, 2, 3.5, 2.5] as const
    const weightsAgainst = [2, 8, 3.5, 3.0] as const

    return iUserVote === VoteTicket.FOR ? weightsFor[voteToInt(iPoliticianVote)] : weightsAgainst[voteToInt(iPoliticianVote)]
}
type RawScores = ReturnType<typeof CalculateRawScores>
export function CalculateRawScores(iLegislationsData: Record<string, VotingInfo>, iUserVotes: UserVotes, activePoliticians: Record<string, PolticianPartyData>) {
    return Object.entries(iLegislationsData).map(([id, data]) => {
        // Calucalte Legislation score
        const votingInfo = data.votes.reduce(
            (acc, current) => {
                const vote = current.vote as VoteTicket
                switch (vote) {
                    case VoteTicket.FOR: acc.for++; break;
                    case VoteTicket.AGAINST: acc.against++; break;
                    case VoteTicket.IDLE: acc.abstained++; break;
                }
                return acc;
            },
            {
                for: 0,
                against: 0,
                abstained: 0
            }
        )
        const legislationScore = CalculateLegislationScore(141, 71, votingInfo.for, votingInfo.against, votingInfo.abstained)
        // Calculate politician score
        const politicianScore = iUserVotes[id] == null ? null : data.votes.map((Vote) => {
            const s = CalculateDecisionScore(Vote.vote as VoteTicket, iUserVotes[id] || VoteTicket.IDLE) * legislationScore
            if (Vote.displayName.toLowerCase() === "vida ačienė") {
                console.log("vida ačienė",Vote, iUserVotes[id], legislationScore)
                debugger
            }
            return {
                kind: "real" as const,
                id: Vote.displayName.toLowerCase(),
                politicianID: Vote.politicianId,
                displayName: Vote.displayName,
                vote: Vote.vote as VoteTicket,
                politicianScore: CalculateDecisionScore(Vote.vote as VoteTicket, iUserVotes[id] || VoteTicket.IDLE) * legislationScore
            }
        })


        return {
            legislationID: id,
            abstainedScore: CalculateDecisionScore(VoteTicket.IDLE, iUserVotes[id]) * legislationScore,
            legislationScore: legislationScore,
            politicianScore: politicianScore
        }
    }
    ).map((obj) => {
        const { politicianScore, abstainedScore } = obj
        const fakePoliticianScore = Object.entries(activePoliticians)
            .filter(([k]) => {
                return !(politicianScore || []).find((q) => q.displayName.toLowerCase() === k)
            })
            .map(([_, v]) => {
                return {
                    id: v.displayName.toLowerCase(),
                    kind: "fake" as const,
                    displayName: v.displayName,
                    vote: VoteTicket.IDLE,
                    politicianScore: abstainedScore
                }
            })

        return {
            ...obj,
            politicianScore: obj.politicianScore ? [...obj.politicianScore, ...fakePoliticianScore].map((obj) => {
                return {
                    ...obj,
                    party: activePoliticians[obj.displayName.toLowerCase()]?.politicalPartyName!
                }
            }).filter((c) => !!c.party) : [],
        }
    }).filter((q) => q.politicianScore.length !== 0).map((obj) => {
        const max = Math.max(...obj.politicianScore.map((c) => c.politicianScore))
        return {
            ...obj,
            politicianScore: obj.politicianScore.map((iQ) => ({ ...iQ, politicianScore: iQ.politicianScore / max })),
        }
    })
}

export function GetActivePoliticans(iLegislationsData: Record<string, VotingInfo>) {
    return P.indexBy(
        P.uniqBy(
            Object.entries(iLegislationsData).flatMap(([k, v]) => v.votes).map(({ displayName, fraction, politicianId }) => {
                return {
                    displayName,
                    fraction,
                    politicianId
                }
            }),
            (q) => q.politicianId
        ),
        (c) => c.politicianId
    )
}

export type NormalizedPoliticianScore = ReturnType<typeof CalculateNormalizedPoliticianScore>
export function CalculateNormalizedPoliticianScore(iRawScores: RawScores) {
    console.log("CalculateNormalizedPoliticianScore",{ iRawScores })
    debugger
    var scores = iRawScores.flatMap((raw) => {
        return raw.politicianScore
    }).reduce((acc, current) => {
        if (typeof current.politicianScore !== 'number') {
            console.log(current)
            throw new Error("asdasd")
        }
        if (acc[current.id] == null) {
            acc[current.id] = current.politicianScore
            return acc
        }
        acc[current.id] *= current.politicianScore
        if (isNaN(acc[current.id])) {
            console.log(current, acc)
            throw new Error("asd")
        }

        return acc;
    },
        {} as Record<string, number>
    )

    debugger
    
    
    const max = Math.max(...Object.values(scores))
    console.log("RAW", { scores, max })
    
    const indexedPoliticians = P.pipe(
        iRawScores.flatMap((c) => c.politicianScore),
        P.uniqBy((q) => q.displayName.toLowerCase()),
        P.indexBy((q) => q.displayName.toLowerCase())
    )

    return Object
        .entries(scores)
        .map(([k, v]) => {
            return [k, v / max] as const
        })
        .sort((n1, n2) => n1[1] >= n2[1] ? -1 : 1)
        .map(([k, v]) => {
            return {
                ...indexedPoliticians[k],
                score: v
            }
        })
}

export type NormalizedCalculatePartyScore = ReturnType<typeof CalculatePartyScores>
export function CalculatePartyScores(data: NormalizedPoliticianScore, activePoliticians: Record<string, PolticianPartyData>) {
    const groupedPolticParties = P.pipe(
        Object.entries(activePoliticians),
        P.groupBy(([, v]) => v.politicalPartyName.toLowerCase())
    )
    return P.pipe(
        Object.entries(
            P.pipe(
                data,
                P.groupBy((c) => c.party.toLowerCase()),
            )
        ).map(([k, politicians]) => {

            const score = P.pipe(
                politicians,
                P.sortBy((q) => [['real', 'fake'].indexOf(q.kind), -1 * q.score]),
                P.take(141),
                P.reduce((acc, s) => acc + s.score, 0),
                (q) => q / P.clamp(groupedPolticParties[k].length, { min: 1, max: 141 })
            )

            return {
                score,
                party: politicians[0].party,
                members: politicians
            }
        })
            .map((q, _, arr) => {
                const max = Math.max(...arr.map((c) => c.score))
                return {
                    ...q,
                    score: q.score / max
                }
            }),
        P.sortBy((q) => -1 * q.score)
    )
}

export function Test() {
    return <h1>{result()}</h1>
}
