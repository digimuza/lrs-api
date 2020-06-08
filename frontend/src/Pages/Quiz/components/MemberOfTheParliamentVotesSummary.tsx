import React, { Fragment, useState } from "react";
import { Box, Flex, Text, Card, Image, Heading } from "rebass";
import { Summary } from "../calculations";
import { Scroll, Frame, Page } from "framer";
import { MainData, VoteTicket } from "../types";
import { getMembers } from "../data";

function Row(props: {
  summary: Summary;
  min: number;
  max: number;
  index: number;
  onClick: (summary: Summary) => void;
}) {
  const { summary, index } = props;
  return (
    <Card
      width={"100vw"}
      m={0}
      sx={{
        ":hover": {
          cursor: "pointer",
          background: "#eeeeee",
        },
      }}
    >
      <Flex
        onClick={() => {
          props.onClick(props.summary);
        }}
      >
        <Flex justifyContent={"center"} alignItems={"center"} width={1 / 8}>
          <Image
            src={
              "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=20"
            }
            sx={{
              width: 48,
              height: 48,
              borderRadius: 5,
            }}
          />
        </Flex>
        <Flex
          px={1}
          justifyContent={"center"}
          alignItems={"flex-start"}
          width={6 / 8}
          flexDirection={"column"}
        >
          <Text
            py={1}
            textAlign={"start"}
          >{`${summary.vardas} ${summary.pavardė}`}</Text>
          <Box
            backgroundColor={"gray"}
            width={1}
            height={11}
            sx={{ borderRadius: 5, overflow: "hidden" }}
          >
            <Box
              width={`${props.summary.score * 100}%`}
              height={11}
              backgroundColor={"#4fc3f7"}
            ></Box>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}

function unParseVote(vote: VoteTicket): string {
  switch (vote) {
    case VoteTicket.IDLE:
      return "Susilaikė";
    case VoteTicket.MISSING:
      return "Nedalivavo";
    case VoteTicket.YES:
      return "Už";
    case VoteTicket.NO:
      return "Prieš";
  }
}

function Block(props: {
  title: string;
  userVotes: Record<string, VoteTicket>;
  items: ReadonlyArray<Summary>;
  data: Record<string, MainData>;
}) {
  const max = Math.max(...props.items.map((c) => c.score));
  const min = Math.min(...props.items.map((c) => c.score));
  const [page, setPage] = useState(0);
  const [selectedParliament, setSelectedParliament] = useState<string | null>(
    null
  );
  const members = getMembers();
  return (
    <Page currentPage={page} dragEnabled={false} width={"100%"} height={"100%"}>
      <Scroll position={'relative'} height={"100vh"} width={"100vw"}>
        <Flex flexDirection={"column"} px={3}>
          <Card width={"100vw"}>
            <Heading>Rezultatai</Heading>
          </Card>
          {props.items.map((summary, index) => (
            <Row
              onClick={(summary) => {
                setSelectedParliament(summary.asmens_id);
                setPage(1);
              }}
              index={index}
              summary={summary}
              min={min}
              max={max}
            ></Row>
          ))}
        </Flex>
      </Scroll>
      <Scroll height={"100vh"} width={"100vw"}>
        <Flex flexDirection={"column"} width={"100vw"}>
          <Card p={2}>
            <Flex justifyContent={"flex-start"} alignItems={"center"}>
              <span
                onClick={() => {
                  setSelectedParliament(null);
                  setPage(0);
                }}
                className="material-icons"
                style={{
                  cursor: "pointer",
                  fontSize: "36px",
                }}
              >
                keyboard_backspace
              </span>

              {selectedParliament != null ? (
                <Heading fontSize={2} px={2}>
                  {`${members[selectedParliament].vardas} ${members[selectedParliament].pavardė}`}
                </Heading>
              ) : null}
            </Flex>
          </Card>
          <Flex flexDirection={"column"}>
            <Flex flexDirection={"column"}>
              <Card>
                <Flex>
                  <Flex
                    alignItems={"center"}
                    justifyContent={"flex-start"}
                    width={2 / 4}
                  >
                    <Text>Įstatymas</Text>
                  </Flex>
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    width={1 / 4}
                  >
                    <Text textAlign={"center"}>Vartotojas</Text>
                  </Flex>
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    width={1 / 4}
                  >
                    <Text>Politikas</Text>
                  </Flex>
                </Flex>
              </Card>
            </Flex>
            {Object.values(props.data).map((v) => {
              return (
                <Flex flexDirection={"column"}>
                  <Card>
                    <Flex>
                      <Flex
                        alignItems={"center"}
                        justifyContent={"flex-start"}
                        width={2 / 4}
                      >
                        <Text>{v.order}</Text>
                      </Flex>
                      <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        width={1 / 4}
                      >
                        <Text textAlign={"center"}>
                          {unParseVote(props.userVotes[v.voteId])}
                        </Text>
                      </Flex>
                      <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        width={1 / 4}
                      >
                        <Text>
                          {v.votes.find(
                            (c) => selectedParliament === c.asmens_id
                          )?.kaip_balsavo || "Nedalivavo"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      </Scroll>
    </Page>
  );
}

export function MemberOfTheParliamentVotesSummary(props: {
  result: ReadonlyArray<Summary>;
  userVotes: Record<string, VoteTicket>;
  data: Record<string, MainData>;
}) {
  return (
    <Flex
      width={"100%"}
      height={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Block
        userVotes={props.userVotes}
        data={props.data}
        title={"Labiausiais atitike politikai"}
        items={props.result}
      ></Block>
    </Flex>
  );
}
