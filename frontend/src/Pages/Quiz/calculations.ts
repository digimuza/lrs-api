import { VoteTicket, MainData, Person } from "./types";
import * as P from 'ts-prime'
import { getActiveMembers } from "./data";
function parseVote(vote: string) {
    if (vote === "Už") {
        return VoteTicket.YES;
    }
    if (vote === "Susilaikė") {
        return VoteTicket.IDLE;
    }
    if (vote === "Prieš") {
        return VoteTicket.NO;
    }
    return VoteTicket.MISSING;
}

function compareVotes(seimoVote: VoteTicket, userVote: VoteTicket): number {
    if (seimoVote === userVote) {
        return 20;
    }
    if (userVote === VoteTicket.YES && seimoVote === VoteTicket.NO) {
        return 10;
    }
    if (userVote === VoteTicket.NO && seimoVote === VoteTicket.YES) {
        return 10;
    }
    if (seimoVote === VoteTicket.IDLE) {
        return 10;
    }
    if (seimoVote === VoteTicket.MISSING) {
        return 0;
    }

    return 0;
}


export function calculateFractions(userVotes: Record<string, VoteTicket>, data: Record<string, MainData>, members: Record<string, Person>) {

    return P.pipe(
        Object.values(members),
        P.groupBy((c) => {
            return c.frakcija;
        }),
        (c) => Object.entries(c),
        P.map(([frakcija, person]) => {
            const votes = person.map((c) => {
                return Object.entries(data).reduce((acc, [voteId, r]) => {
                    const vote = parseVote(
                        r.votes.find((q) => q.asmens_id === c.asmens_id)?.kaip_balsavo || ""
                    );
                    const userVote = userVotes[voteId];
                    return acc + compareVotes(vote, userVote);
                }, 0);
            });

            return {
                frakcija,
                votes,
                avrg: votes.reduce((acc, current) => acc + current, 0) / votes.length,
            };
        }),
        (q) => ({
            best: P.pipe(
                q,
                P.sortBy((c) => ({ order: "desc", value: c.avrg })),
                P.take(3)
            ),
            worst: P.pipe(
                q,
                P.sortBy((c) => ({ order: "asc", value: c.avrg })),
                P.take(3)
            ),
        })
    );
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

export function calculateVotingScores(userVotes: Record<string, VoteTicket>, data: Record<string, MainData>, members: Record<string, Person>): Result {
    return P.pipe(
        Object.values(members),
        P.map((member) => {
            return {
                ...member,
                score: Object.values(data)
                    .map((c) => {
                        return {
                            voteId: c.voteId,
                            vote: c.votes.find((d) => d.asmens_id === member.asmens_id),
                            participated: c.votes.map((c) => parseVote(c.kaip_balsavo)).filter((c) => [VoteTicket.YES, VoteTicket.NO, VoteTicket.IDLE].includes(c))
                        };
                    })
                    .reduce(() => {
                        return Math.random();
                    }, 0),
            };
        }),
        (result) => {
            const activeMembers = getActiveMembers()
            return {
                result: P.pipe(
                    result,
                    P.filter((c) => activeMembers.includes(c.asmens_id)),
                    P.sortBy((c) => ({ order: "desc", value: c.score })),
                )
            }
        }
    );
}
