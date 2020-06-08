import React from "react";
import { Box, Heading, Flex, Text, Image } from "rebass";

function Block(props: {
    items: ReadonlyArray<{
      frakcija: string;
      votes: number[];
      avrg: number;
    }>;
  }) {
    return (
      <Box p={1} width={1 / 2}>
        {props.items.map((c) => {
          return (
            <Flex
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Box width={1}>
                <Text p={10} textAlign={"center"} alignSelf={"center"}>
                  {`${c.frakcija}`}
                </Text>
              </Box>
              <Flex
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image
                  src={"https://www.lrs.lt/SIPIS/sn_foto/2016/vida_aciene.jpg"}
                  sx={{
                    width: 90,
                    // height: 90,
                    borderRadius: 3,
                  }}
                />
              </Flex>
            </Flex>
          );
        })}
      </Box>
    );
  }

export function FractionsSummary(props: {
  best: ReadonlyArray<{
    frakcija: string;
    votes: number[];
    avrg: number;
  }>;
  worst: ReadonlyArray<{
    frakcija: string;
    votes: number[];
    avrg: number;
  }>;
}) {
  return (<Flex width={"100%"} height={"100%"} alignItems={"flex-start"} justifyContent={"center"}>
    <Box>
      <Heading p={1} fontSize={[5]} color="primary">
        Labiausiai tinkantis politikai
        </Heading>
      <Flex m={1} p={1} alignItems={"center"} justifyContent={"center"}>
        <Block items={props.best}></Block>
        <Block items={props.worst}></Block>
      </Flex>
    </Box>
  </Flex>);
}
