import React, { useState, Fragment, useLayoutEffect, useRef } from "react";
import { Box, Heading, Flex, Image, Text } from "rebass";
import { Page, Frame, Data } from "framer";
import { VoteTicket, Vote } from "./types";
import { calculateVotingScores, Summary } from "./calculations";
import { MemberOfTheParliamentVotesSummary } from "./components/MemberOfTheParliamentVotesSummary";
import { Question } from "./components/Question";
import { Watch } from "../../Core";
import { getMembers } from "./data";
import { getQuestions } from "../../database";

export function Quiz() {
  const members = useRef(getMembers());
  const [votes, setVotes] = useState({} as Record<string, VoteTicket>);
  const [page, setPages] = useState(0);

  return <Watch data={getQuestions()} fallback={<h1>Loading</h1>}>
    {(data) => {
      return (
        <Page
          top={0}
          left={0}
          defaultEffect={'none'}
          backgroundColor={"white"}
          dragEnabled={false}
          currentPage={page}
          width={"100%"}
          height={"100%"}
        >
          {data.map((props, index) => {
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
            {...calculateVotingScores(votes, data, members.current)}
            data={data}
          ></MemberOfTheParliamentVotesSummary>
        </Page>
      );
    }}
  </Watch>;
}
