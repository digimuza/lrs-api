import mock from "../mock.data.json";
import members from "../peaple.json";
import active from "../active-parlaments.json";
import * as P from "ts-prime";
import { MainData, Person } from "./types";

export function getActiveMembers(): ReadonlyArray<string> {
    return active 
}

export function getQuestions() {
    return P.indexBy((mock as unknown) as MainData[], (c) => c.voteId);
}
export function getMembers() {
    return P.indexBy((members as unknown) as Person[], (c) => c.asmens_id);
}
