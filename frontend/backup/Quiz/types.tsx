export interface MainData {
  order: string;
  fullOrder: string;
  linkToOrder: string;
  linkToVotes: string;
  youtubeUrl: string;
  voteId: string;
  votes: Vote[];
}
export interface Person {
  asmens_id: string;
  vardas: string;
  frakcija: string;
  pavardė: string;
}
export interface Vote extends Person {
  $name: string;
  frakcija: string;
  kaip_balsavo: string;
}
export enum VoteTicket {
  YES,
  NO,
  IDLE,
  MISSING
}
