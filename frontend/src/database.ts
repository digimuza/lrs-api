import { initializeApp, firestore } from 'firebase'
import * as z from 'zod'
function getFirebaseConfig() {
    const cfg = process.env.REACT_APP_FIREBASE
    if (cfg == null) throw new Error("Failed to load env variables")
    return JSON.parse(cfg)
}
const app = initializeApp(getFirebaseConfig())
const database = firestore(app)

const voteSchema = z.object({
    voteId: z.string(),
    politicianId: z.string(),
    fraction: z.string(),
    vote: z.enum(['+', "-", '/', '.']),
    displayName: z.string()
})

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
