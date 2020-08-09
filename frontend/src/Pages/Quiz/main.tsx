import React, { useState, Fragment, useRef } from "react";
import { Page } from "framer";
import { VoteTicket } from "./types";
import { calculateVotingScores } from "./calculations";
import { MemberOfTheParliamentVotesSummary } from "./components/MemberOfTheParliamentVotesSummary";
import { Question } from "./components/Question";
import { Watch } from "../../Core";
import { getMembers } from "./data";
import { getQuestions } from "../../database";
import { ProccesingSilde } from "./components/ProcessingSlide";
import { Spin } from "antd";

export function Quiz() {
  const members = useRef(getMembers());
  const [votes, setVotes] = useState({} as Record<string, VoteTicket>);
  const [page, setPages] = useState(0);

  return <Watch data={getQuestions()} fallback={<div style={{ display: 'flex', height: "100vh", width: "100vw", justifyContent: "center", alignItems: "center" }}>
    <Spin size="large" />
  </div>}>
    {(data) => {
      return (
        <Fragment>
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
            {

              [
                ...data.map((props, index) => {
                  return (
                    (_: { index: number }) => {
                      return <Question
                        totalItems={data.length}
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
                    }
                  );
                }),
                (args: { index: number }) => {
                  return <ProccesingSilde isActive={args.index === page} next={() => {
                    setPages(page + 1)
                  }}></ProccesingSilde>
                },
                () => {
                  return <MemberOfTheParliamentVotesSummary
                    userVotes={votes}
                    {...calculateVotingScores(votes, data, members.current)}
                    data={data}
                  ></MemberOfTheParliamentVotesSummary>
                }
              ].map((q, index) => q({ index }))
            }
          </Page>
        </Fragment>

      );
    }}
  </Watch>;
}
