import React, { Fragment, useState, PropsWithChildren } from "react";
import { Summary, calculateStatistics } from "../calculations";
import {
  Card,
  Avatar,
  Progress,
  List,
  Button,
  Layout,
  Typography,
  PageHeader,
  Tag,
  Table,
} from "antd";
import { Scroll, Frame, Page } from "framer";
import { MainData, VoteTicket } from "../types";
import { getMembers } from "../data";
import { motion } from "framer-motion";
import { Grid, Row, Col } from "react-flexbox-grid";
import { Flex, Heading } from "rebass";
import * as P from "ts-prime";
import { VotingInfo } from "../../../database";
function ParliamentList(props: {
  summary: Summary;
  min: number;
  max: number;
  index: number;
  onClick: (summary: Summary) => void;
}) {
  const { summary } = props;
  return (
    <List.Item
      actions={[
        <div style={{ width: 200 }}>
          <Progress
            percent={Math.round((summary.score / props.max) * 100)}
          ></Progress>
        </div>,
        <Button onClick={() => props.onClick(summary)}>Daugiau</Button>,
      ]}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            src={
              "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=20"
            }
          >
            {summary.vardas.slice(0, 1)}
          </Avatar>
        }
        description={
          <span>
            <b>Frakcija:</b>
            {` ${summary.frakcija}`}{" "}
          </span>
        }
        title={`${summary.vardas} ${summary.pavardė}`}
      ></List.Item.Meta>
    </List.Item>
  );
}

function unParseVote(vote: VoteTicket): string {
  switch (vote) {
    case VoteTicket.IDLE:
      return "Susilaikė";
    case VoteTicket.MISSING:
      return "Nedalivavo";
    case VoteTicket.FOR:
      return "Už";
    case VoteTicket.AGAINST:
      return "Prieš";
  }
}

function ParliamentVoteSummary(props: {
  title: string;
  userVotes: Record<string, VoteTicket>;
  items: ReadonlyArray<Summary>;
  data: ReadonlyArray<VotingInfo>;
  setPage: (page: number) => void;
  selectedParliament: string | null;
  setSelectedParliament: (parliament: string | null) => void;
}) {
  const members = getMembers();
  const { selectedParliament, setPage, setSelectedParliament } = props;
  if (selectedParliament == null) return null;
  const parliament = members[selectedParliament];

  const columns = [
    {
      title: "Įstatymas",
      dataIndex: "order",
      width: 400,
      key: "order",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Jūs",
      dataIndex: "user_vote",
      key: "user_vote",
      render: (text: JSX.Element) => text,
    },
    {
      title: `${members[selectedParliament].vardas} ${members[selectedParliament].pavardė}`,
      dataIndex: "politic_vote",
      key: "politic_vote",
      render: (text: JSX.Element) => text,
    },
  ];

  const generatePoliticTag = (xDep: VotingInfo) => {
    const userVote = props.userVotes[xDep.voteId];
    const politicVote =
      xDep.votes.find((q) => q.politicianId === selectedParliament)
        ?.vote || VoteTicket.MISSING;
    if (politicVote === VoteTicket.MISSING) {
      return <Tag>Nedalivavo</Tag>;
    }
    if (politicVote === VoteTicket.FOR) {
      if (userVote === VoteTicket.FOR) return <Tag color={"green"}>Už</Tag>;
      if (userVote === VoteTicket.AGAINST) return <Tag color={"red"}>Už</Tag>;
      if (userVote === VoteTicket.IDLE) return <Tag color={"green"}>Už</Tag>;
      if (userVote == null) return <Tag color={"green"}>Už</Tag>;
    }

    if (politicVote === VoteTicket.AGAINST) {
      if (userVote === VoteTicket.FOR) return <Tag color={"red"}>Prieš</Tag>;
      if (userVote === VoteTicket.AGAINST) return <Tag color={"green"}>Prieš</Tag>;
      if (userVote === VoteTicket.IDLE) return <Tag color={"green"}>Prieš</Tag>;
      if (userVote == null) return <Tag color={"green"}>Prieš</Tag>;
    }

    if (politicVote === VoteTicket.MISSING) {
      return <Tag color={"warning"}>{politicVote}</Tag>;
    }

    if (politicVote === VoteTicket.IDLE) {
      return <Tag>Susilaikė</Tag>
    } 

    return <Tag>{politicVote}</Tag>;
  };

  const data = Object.values(props.data).map((c, index) => {
    return {
      key: index,
      user_vote: (
        <Tag color={"green"}>
          {unParseVote(props.userVotes[c.voteId]) || "Susilaikė"}
        </Tag>
      ),
      order: c.order,
      politic_vote: generatePoliticTag(c),
    };
  });

  return (
    <LayoutContainer
      header={
        <PageHeader
          title={`${parliament.vardas} ${parliament.pavardė}`}
          onBack={() => setPage(0)}
        ></PageHeader>
      }
    >
      <Table pagination={false} columns={columns} dataSource={data} />
    </LayoutContainer>
  );
}

function LayoutContainer(props: PropsWithChildren<{ header: JSX.Element }>) {
  return (
    <Scroll position={"relative"} width={"100%"} height={"100vh"}>
      <Grid>
        <Row>
          <Col xl={3}></Col>
          <Col xl={6}>
            <Layout>
              {props.header}
              <Layout.Content style={{ padding: 20 }}>
                {props.children}
              </Layout.Content>
            </Layout>
          </Col>
          <Col xl={3}></Col>
        </Row>
      </Grid>
    </Scroll>
  );
}

function Block(props: {
  title: string;
  userVotes: Record<string, VoteTicket>;
  items: ReadonlyArray<Summary>;
  data: ReadonlyArray<VotingInfo>;
}) {
  const max = Math.max(...props.items.map((c) => c.score));
  const min = Math.min(...props.items.map((c) => c.score));
  const [page, setPage] = useState(0);
  const [selectedParliament, setSelectedParliament] = useState<string | null>(
    null
  );
  return (
    <Page
      position={"relative"}
      currentPage={page}
      dragEnabled={false}
      width={"100%"}
      height={"100vh"}
    >
      <LayoutContainer header={<PageHeader title={"Rezultatai"}></PageHeader>}>
        {props.items.map((summary, index) => (
          <ParliamentList
            onClick={(summary) => {
              setSelectedParliament(summary.asmens_id);
              setPage(1);
            }}
            index={index}
            summary={summary}
            min={min}
            max={max}
          ></ParliamentList>
        ))}
      </LayoutContainer>
      <ParliamentVoteSummary
        setPage={setPage}
        selectedParliament={selectedParliament}
        setSelectedParliament={setSelectedParliament}
        {...props}
      ></ParliamentVoteSummary>
    </Page>
  );
}

export function MemberOfTheParliamentVotesSummary(props: {
  result: ReadonlyArray<Summary>;
  userVotes: Record<string, VoteTicket>;
  data: ReadonlyArray<VotingInfo>;
}) {
  return (
    <Block
      userVotes={props.userVotes}
      data={props.data}
      title={"Labiausiais atitike politikai"}
      items={props.result}
    ></Block>
  );
}
