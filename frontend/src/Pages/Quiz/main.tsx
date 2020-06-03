import React, { useState } from "react";
import mock from "./mock.json";
import members from "./people.json";
import * as P from "ts-prime";
import { Box, Heading, Flex, Button, Image, Text } from "rebass";
import { Page, Frame } from "framer";
export interface Lrs {
  _id: string;
  order: string;
  votes: Vote[];
}

export interface Members {
  id: number;
  name: string;
}

export interface Vote {
  id: number;
  vote: VoteTicket;
}

export type VoteTicket = 0 | 1 | -1;

export function getQuestions() {
  return P.indexBy((mock as unknown) as Lrs[], (c) => c._id);
}

export function Question(props: {
  _id: string;
  order: string;
  onSubmit: (value: { id: string; vote: VoteTicket }) => void;
}) {
  return (
    <Frame width={"100%"} height={"100%"}>
      <Frame center width={"50%"} height={"50%"}>
        <Flex
          width={"100%"}
          height={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Box>
            <Heading p={1} fontSize={[5]} color="primary">
              {props.order.split(" ").slice(0, 4).join(" ")}
            </Heading>
            <Flex m={1} p={1} alignItems={"center"} justifyContent={"center"}>
              <Box p={1}>
                <Button
                  variant="primary"
                  onClick={() => props.onSubmit({ id: props._id, vote: 1 })}
                >
                  Taip
                </Button>
              </Box>
              <Box p={1}>
                <Button
                  variant="primary"
                  onClick={() => props.onSubmit({ id: props._id, vote: -1 })}
                >
                  Susilaikau
                </Button>
              </Box>
              <Box p={1}>
                <Button
                  variant="primary"
                  onClick={() => props.onSubmit({ id: props._id, vote: 0 })}
                >
                  Ne
                </Button>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Frame>
    </Frame>
  );
}

export function Quiz() {
  const data = getQuestions();
  const [votes, setVotes] = useState({} as Record<string, VoteTicket>);
  const [page, setPages] = useState(0);

  const calculateResults = () => {
    return P.pipe(
      members,
      P.map((member) => {
        return {
          ...member,
          score: Object.values(data)
            .map((c) => c.votes.find((d) => d.id === member.id))
            .filter(P.isDefined)
            .reduce((acc, current) => acc + current.vote, 0),
        };
      }),
      (result) => {
        return {
          best: P.pipe(
            result,
            P.sortBy((c) => ({ order: "desc", value: c.score })),
            P.take(5)
          ),
          worst: P.pipe(
            result,
            P.sortBy((c) => ({ order: "asc", value: c.score })),
            P.take(5)
          ),
        };
      }
    );
  };
  return (
    <Page
      defaultEffect={"none"}
      dragEnabled={false}
      currentPage={page}
      width={"100%"}
      height={"100%"}
    >
      {Object.values(data).map((props) => {
        return (
          <Question
            _id={props._id}
            order={props.order}
            key={props._id}
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
      <Frame>
        <Frame center width={"50%"} height={"50%"}>
          <Flex
            width={"100%"}
            height={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Box>
              <Heading p={1} fontSize={[5]} color="primary">
                Labiausiai tinkantis politikai
              </Heading>
              <Flex m={1} p={1} alignItems={"center"} justifyContent={"center"}>
                <Box p={1} width={1 / 2}>
                  {calculateResults().best.map((c) => {
                    return (
                      <Flex>
                        <Image
                          src={
                            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=20"
                          }
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 9999,
                          }}
                        />
                        <Text p={10} alignSelf={'center'}>
                          {c.name}
                        </Text>
                      </Flex>
                    );
                  })}
                </Box>
                <Box p={1} width={1 / 2}>
                  {calculateResults().worst.map((c) => {
                    return (
                      <Flex>
                        <Image
                          src={
                            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=20"
                          }
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 9999,
                          }}
                        />
                        <Text p={10} alignSelf={'center'}>
                          {c.name}
                        </Text>
                      </Flex>
                    );
                  })}
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Frame>
      </Frame>
    </Page>
  );
}
