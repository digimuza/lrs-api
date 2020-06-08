import React, { useRef } from "react";
import { Box, Heading, Flex, Button, Text, Card } from "rebass";
import { Frame } from "framer";
import { BehaviorSubject } from "rxjs";
import { YouTubeView } from "../../../Shared/YoutubeVideo";
import { MainData, VoteTicket } from "../types";

export function Question(props: {
  data: MainData;
  onSubmit: (value: { id: string; vote: VoteTicket }) => void;
  index: number;
  current: number;
}) {
  const ref = useRef(new BehaviorSubject<boolean>(false));
  return (
    <Frame position={'relative'} width={"100%"} height={"100%"}>
      <Flex
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Card p={0} width={"100%"}>
          <Flex
            width={"100%"}
            height={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Box width={[1, 2 / 3]}>
              {props.current + 1 >= props.index ? (
                <YouTubeView
                  play={ref.current}
                  url={props.data.youtubeUrl}
                ></YouTubeView>
              ) : null}
            </Box>
          </Flex>
          <Box px={3}>
            <Heading textAlign={"center"} p={1} color="primary">
              {props.data.order}
            </Heading>
            <Text textAlign={"center"}>{props.data.fullOrder}</Text>
          </Box>
          <Flex m={1} p={1} alignItems={"center"} justifyContent={"center"}>
            <Box p={1}>
              <Button
                variant="primary"
                onClick={() => {
                  ref.current.next(false);
                  props.onSubmit({
                    id: props.data.voteId,
                    vote: VoteTicket.YES,
                  });
                }}
              >
                Už
              </Button>
            </Box>
            <Box p={1}>
              <Button
                variant="primary"
                onClick={() => {
                  ref.current.next(false);
                  props.onSubmit({
                    id: props.data.voteId,
                    vote: VoteTicket.IDLE,
                  });
                }}
              >
                Susilaikau
              </Button>
            </Box>
            <Box p={1}>
              <Button
                variant="primary"
                onClick={() => {
                  ref.current.next(false);
                  props.onSubmit({
                    id: props.data.voteId,
                    vote: VoteTicket.NO,
                  });
                }}
              >
                Prieš
              </Button>
            </Box>
          </Flex>
        </Card>
        {/* <Box>
          <Heading p={1} fontSize={[4]} color="primary">
            {props.data.order}
          </Heading>
          <Text>{props.data.fullOrder}</Text>
          <Flex p={1} m={2} alignItems={"center"} justifyContent={"center"}>
            <Box width={1 / 2}>
              <YoutubeView
                play={ref.current}
                url={props.data.youtubeUrl}
              ></YoutubeView>
            </Box>
          </Flex>
          
        </Box> */}
      </Flex>
    </Frame>
  );
}
