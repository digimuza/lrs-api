import { initializeApp, firestore } from 'firebase'
import * as z from 'zod'
import { BehaviorSubject } from 'rxjs'

const app = initializeApp({
    apiKey: "AIzaSyDoMnDry1QX37MqrwhGa1UB-TlY7d3L5Ak",
    databaseURL: "https://ltr-test-4d936.firebaseio.com",
    projectId: "ltr-test-4d936",
    storageBucket: "ltr-test-4d936.appspot.com",
  })
export const database = firestore(app)

const voteSchema = z.object({
    voteId: z.string(),
    politicianId: z.string(),
    fraction: z.string(),
    vote: z.enum(['+', "-", '/', '.']),
    displayName: z.string()
})
export const schemaPolticianPartyData = z.object({
    rowId: z.string(),
    displayName: z.string(),
    politicalPartyNumber: z.string(),
    politicalPartyName: z.string(),
    vanr: z.string().optional(),
    va: z.string().optional(),
    iv: z.string().optional()
})
export interface PolticianPartyData extends z.TypeOf<typeof schemaPolticianPartyData> {}
export const politiciansParties = new BehaviorSubject<Record<string, PolticianPartyData> | null>(null)


export type Vote = z.TypeOf<typeof voteSchema>

const sheetSchema = z.object({
    order: z.string(),
    fullOrder: z.string(),
    linkToOrder: z.string(),
    linkToVotes: z.string(),
    youtubeUrl: z.string().optional()
})

const dataSchema = z.object({
    voteId: z.string(),
    votes: z.array(voteSchema),
    youtubeVideoId: z.string().optional()
}).merge(sheetSchema)

export type VotingInfo = z.TypeOf<typeof dataSchema>

export function getQuestions(): Promise<ReadonlyArray<VotingInfo>> {
    return database.collection('votes').get()
        .then((c) => {
            return c.docs
        })
        .then((c) => {
            return c
                .map((c) => c.data())
                .map((c) => {
                    return dataSchema.parse(c)
                })
        })
}
