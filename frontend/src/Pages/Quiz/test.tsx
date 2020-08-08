import React from 'react'
import { getQuestions, getMembers } from './data';
import { VoteTicket, Vote, MainData } from './types';

type UserVotes = Record<string, VoteTicket>
type Results = Array<{
    asmensId: string,
    fullName: string
    score: number
}>


const mockUserData: UserVotes = {
    '-25491': VoteTicket.FOR,
    '-21592': VoteTicket.IDLE,
}


function result() {
    const questions = getQuestions()

   console.log(CalculateLegislationScore(141, 71, 74, 39, 10))


    const rawScore = CalculateRawScores(questions, mockUserData)
    console.log(rawScore);

    // Politicians score
   const normalizedPoliticianScore = CalculateNormalizedPoliticianScore(rawScore)
   console.log({ normalizedPoliticianScore })

// Legislation weights
   const s = rawScore.map((v) => {
    return [v.legislationID,v.legislationScore]
    }).sort((v1,v2) => { return v1[1] >= v2[1] ? -1 : 1 })

    console.log(s)

    return <div>
        "ASD"
</div>
}




function CalculateLegislationScore(iMaxMembers: number, iDecisionTreshold: number, iFor: number, iAgainst: number, iAbstained: number) {
    const participated = iFor + iAgainst + iAbstained
    const votingMultiplier = (1 - Math.abs(iFor / participated - 0.5) / 0.5)
    const participationMultiplier = participated < iDecisionTreshold ? 2 * (participated / iDecisionTreshold) : 2 - (participated - 71) / 71;
    return votingMultiplier * participationMultiplier;
}

function voteToInt(iVote: VoteTicket) {
    switch(iVote) {
        case VoteTicket.FOR: return 0;
        case VoteTicket.AGAINST: return 1;
        case VoteTicket.IDLE: return 2;
        case VoteTicket.MISSING: return 3;
    }
}

function CalculateDecisionScore(iPoliticianVote: VoteTicket, iUserVote: VoteTicket) {
    const weightsFor = [8, 2, 3.5, 2.5]
    const weightsAgainst = [2, 8, 3.5, 3.0]

    return iUserVote = VoteTicket.FOR ? weightsFor[voteToInt(iPoliticianVote)] : weightsAgainst[voteToInt(iPoliticianVote)]
}
type RawScores = ReturnType<typeof CalculateRawScores>
function CalculateRawScores(iLegislationsData : Record<string, MainData>, iUserVotes : UserVotes)
{
    return Object.entries(iLegislationsData).map(([id, data]) => {
                // Calucalte Legislation score
                const votingInfo = data.votes.reduce(
                (acc, current) => {
                    switch (current.kaip_balsavo) {
                        case "Už": acc.for++; break;
                        case "Prieš": acc.against++; break;
                        case "Susilaikė": acc.abstained++; break;
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
            const politicianScore = mockUserData[id] == null ? null : data.votes.map((Vote) => {
                return {
                    politicianID: Vote.asmens_id,
                    politicianScore: CalculateDecisionScore(ToVoteTicker(Vote.kaip_balsavo), mockUserData[id]) * legislationScore
                }
            }) 

            return {
                legislationID: id,
                legislationScore: legislationScore,
                politicianScore: politicianScore
            }
        }
        )
}

function CalculateNormalizedPoliticianScore(iRawScores : RawScores)
{
    var scores = iRawScores.flatMap(({politicianScore})=>{
        return politicianScore || []
    }).reduce((acc, current) => {

        if(acc[current.politicianID] == null)
            acc[current.politicianID] = current.politicianScore
        else
            acc[current.politicianID] *= current.politicianScore

        return acc;
    },
    {} as Record<string, number>
    )

    const max = Math.max(...Object.values(scores))

    const o = Object.entries(scores).map(([k,v]) => {
        return [k,v/max] as const
    })

    return Object.entries(scores).map(([k,v]) => {
        return [k,v/max] as const
    }).sort((n1,n2) => n1[1] >= n2[1] ? -1 : 1)
}

function ToVoteTicker(iKaipBalsavo: string) {
    switch (iKaipBalsavo) {
        case "Už": return VoteTicket.FOR;
        case "Prieš": return VoteTicket.AGAINST;
        case "Susilaikė": return VoteTicket.IDLE;
        default: return VoteTicket.MISSING;
    }
}



export function Test() {
    return <h1>{result()}</h1>
}
