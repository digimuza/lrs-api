import React, { useState, Fragment } from "react";
import { Box, Heading, Flex, Image, Text } from "rebass";
import { Page, Frame, Data } from "framer";
import { VoteTicket, Vote } from "./types";
import { calculateVotingScores, Summary } from "./calculations";
import { getQuestions, getMembers } from "./data";
import { MemberOfTheParliamentVotesSummary } from "./components/MemberOfTheParliamentVotesSummary";
import { Question } from "./components/Question";

export function Quiz() {
  const data = getQuestions();
  const members = getMembers();
  const [votes, setVotes] = useState({} as Record<string, VoteTicket>);
  const [page, setPages] = useState(0);
  return (
    <Page
      top={0}
      left={0}
      defaultEffect={"none"}
      backgroundColor={"white"}
      dragEnabled={false}
      currentPage={page}
      width={"100%"}
      height={"100%"}
    >
      {Object.values(data).map((props, index) => {
        return (
          <Question
            index={index}
            current={page}
            data={props}
            key={props.voteId}
            onSubmit={({ id, vote }) => {
              setVotes({
                ...votes,
                [id]: vote,
              });
              setPages(page + 1);
              return;
            }}
          ></Question>
        );
      })}
      <MemberOfTheParliamentVotesSummary
        userVotes={votes}
        {...calculateVotingScores(votes, data, members)}
        data={data}
      ></MemberOfTheParliamentVotesSummary>
    </Page>
  );
}
