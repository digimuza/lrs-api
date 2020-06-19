import { VoteTicket, MainData, Person } from "./types";
import * as P from 'ts-prime'
import { getActiveMembers } from "./data";
import { VotingInfo, Vote } from '../../database'

function scoreVotes(seimoVote: VoteTicket, userVote: VoteTicket): number {
    if (seimoVote === userVote) return 10;
    if (userVote === VoteTicket.FOR && seimoVote === VoteTicket.AGAINST) return -10;
    if (userVote === VoteTicket.AGAINST && seimoVote === VoteTicket.FOR) return -10;
    if (userVote === VoteTicket.FOR && seimoVote === VoteTicket.IDLE) return -10;
    if (userVote === VoteTicket.AGAINST && seimoVote === VoteTicket.IDLE) return 10;
    if (userVote === VoteTicket.FOR && seimoVote === VoteTicket.MISSING) return -2;
    if (userVote === VoteTicket.AGAINST && seimoVote === VoteTicket.MISSING) return 2;
    return 0;
}

export interface Summary {
    score: number;
    asmens_id: string;
    vardas: string;
    frakcija: string;
    pavardė: string;
}

export interface Result {
    result: ReadonlyArray<Summary>
}

/**
 * Normalize score to [0,1] range
 * Initial scores can be negative. Becouse of this reason i need to normalize it to you for UI. For example progress bar
 * @param scores [-4,1,5]
 * @param score [1]
 * @returns 0.5145
 */
function scoreNormalizer(scores: ReadonlyArray<number>, score: number) {
    const min = Math.min(...scores)
    const calculateAbsolute = () => {
        if (min > 0) return scores
        return scores.map((c) => c + Math.abs(min))
    }
    const normalized = calculateAbsolute()
    const max = Math.max(...normalized)
    return P.clamp((score + Math.abs(min)) / max, { min: 0, max: 1 })
}


export function calculateStatistics(data: Record<string, VotingInfo>) {
    return Object.values(data).reduce(
        (acc, current) => {
            const allVotes = Object.values(current.votes).map((c) => c.vote as VoteTicket)
            return {
                total_for: acc.total_for + allVotes.filter((c) => VoteTicket.FOR === c).length,
                total_against: acc.total_against + allVotes.filter((c) => VoteTicket.AGAINST === c).length,
                total_idle: acc.total_idle + allVotes.filter((c) => VoteTicket.IDLE === c).length,
                voted_in_some_way: acc.total_idle + allVotes.filter((c) => [VoteTicket.IDLE, VoteTicket.AGAINST, VoteTicket.FOR].includes(c)).length,
            };
        },
        {
            total_for: 0,
            total_against: 0,
            total_idle: 0,
            voted_in_some_way: 0,
        }
    );
}

export function parseVote(vote: Vote['vote'] | undefined): VoteTicket {
    if (vote == null) return VoteTicket.MISSING
    return vote as VoteTicket
}

export function calculateVotingScores(userVotes: Record<string, VoteTicket>, data: ReadonlyArray<VotingInfo>, members: Record<string, Person>): Result {
    return P.pipe(
        Object.values(members),
        P.map((member) => {
            return {
                ...member,
                score: data
                    .map((c) => {
                        return {
                            userVote: userVotes[c.voteId],
                            voteId: c.voteId,
                            vote: parseVote(c.votes.find((d) => d.politicianId === member.asmens_id)?.vote),
                            participated: c.votes.map((c) => parseVote(c.vote)).filter((c) => [VoteTicket.FOR, VoteTicket.AGAINST, VoteTicket.IDLE].includes(c))
                        };
                    })
                    .reduce((acc, current) => {
                        const scores = {
                            participated: current.participated.length / 141, // 0.7546 
                            userPreference: scoreVotes(current.userVote, current.vote)
                        }

                        return acc + (scores.userPreference / scores.participated);
                    }, 0),
            };
        }),
        (result) => {
            const scores = result.map((c) => c.score)
            const activeMembers = getActiveMembers()
            return {
                result: P.pipe(
                    result,
                    P.filter((c) => activeMembers.includes(c.asmens_id)),
                    P.sortBy((c) => ({ order: "desc", value: c.score })),
                    P.map((c) => {
                        return {
                            ...c,
                            score: scoreNormalizer(scores, c.score)
                        }
                    })
                )
            }
        }
    );
}
