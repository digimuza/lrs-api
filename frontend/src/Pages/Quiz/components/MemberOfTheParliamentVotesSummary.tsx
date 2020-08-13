import React, { useState, PropsWithChildren, Fragment } from "react";
import * as P from 'ts-prime'
import { Summary } from "../calculations";
import {
  Avatar,
  Progress,
  List,
  Button,
  Layout,
  PageHeader,
  Tag,
  Row,
  Col,
  Grid,
} from "antd";
import { Scroll, Page } from "framer";
import { VoteTicket } from "../types";
import { getMembers } from "../data";
import { Link } from "rebass";
import { VotingInfo, politiciansParties } from "../../../database";
import { CalculateRawScores, CalculateNormalizedPoliticianScore, GetActivePoliticans, CalculatePartyScores, NormalizedPoliticianScore } from "../test";
import { BehaviorSubject } from "rxjs";
import { Watch } from "../../../Core";
import * as RXO from 'rxjs/operators'
function tableColorPickByVotes(userVote: VoteTicket, parliamentMemberVote: VoteTicket) {
  const secondary = (v: VoteTicket) => {
    return [VoteTicket.IDLE, VoteTicket.MISSING].includes(v)
  }

  if (userVote === parliamentMemberVote) {
    return {
      rawColor: '#B2FF59',
      color: "green"
    }
  }

  if ((secondary(userVote) || secondary(parliamentMemberVote)) && userVote !== parliamentMemberVote) {
    return {
      rawColor: '#fff',
      color: "white"
    }
  }

  return {
    rawColor: '#FF5722',
    color: "red"
  }
}


function ParliamentList(props: {
  summary: NormalizedPoliticianScore[number];
  min: number;
  max: number;
  index: number;
  onClick: (summary: NormalizedPoliticianScore[number]) => void;
}) {
  const { summary } = props;
  return (
    <List.Item
      actions={[
        <div style={{ width: 200 }}>
          <Progress
            percent={Math.round(summary.score * 100)}
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
            {summary.displayName.slice(0, 1)}
          </Avatar>
        }
        description={
          <span>
            {` ${summary.party}`}{" "}
          </span>
        }
        title={summary.displayName}
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
      if (userVote === VoteTicket.FOR) return <Tag>Už</Tag>;
      if (userVote === VoteTicket.AGAINST) return <Tag>Už</Tag>;
      if (userVote === VoteTicket.IDLE) return <Tag>Už</Tag>;
      if (userVote == null) return <Tag>Už</Tag>;
    }

    if (politicVote === VoteTicket.AGAINST) {
      if (userVote === VoteTicket.FOR) return <Tag>Prieš</Tag>;
      if (userVote === VoteTicket.AGAINST) return <Tag>Prieš</Tag>;
      if (userVote === VoteTicket.IDLE) return <Tag>Prieš</Tag>;
      if (userVote == null) return <Tag>Prieš</Tag>;
    }

    if (politicVote === VoteTicket.IDLE) {
      return <Tag>Susilaikė</Tag>
    }

    return <Tag>{politicVote}</Tag>;
  };

  const data = Object.values(props.data).filter((w) => {
    return props.userVotes[w.voteId] !== VoteTicket.IDLE && props.userVotes[w.voteId] != null
  }).map((c, index) => {
    const politicVote =
      c.votes.find((q) => q.politicianId === selectedParliament)
        ?.vote || VoteTicket.MISSING;
    return {
      key: index,
      user_vote: (
        <Tag>
          {unParseVote(props.userVotes[c.voteId]) || "Susilaikė"}
        </Tag>
      ),
      voteId: c.voteId,
      color: tableColorPickByVotes(props.userVotes[c.voteId], politicVote as VoteTicket),
      order: c.order,
      politic_vote: generatePoliticTag(c),
    };
  });

  return (
    <LayoutContainer
      header={
        <PageHeader
          title={`${parliament.vardas} ${parliament.pavardė}`}
          footer={<Link href={`https://www.lrs.lt/sip/portal.show?p_r=35299&p_k=1&p_a=498&p_asm_id=${parliament.asmens_id}`}>Apie {`${parliament.vardas} ${parliament.pavardė}`}</Link>}
          onBack={() => setPage(0)}
        ></PageHeader>
      }
    >
      <List>
        <List.Item>
          <Row style={{ width: "100%" }}>
            <Col span={14}><div style={{ padding: 10, display: "flex", justifyContent: "flex-start", alignItems: 'center' }}>
              <strong>Įstatymas</strong>
            </div></Col>
            <Col span={5}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
                <strong>Politiko balsas</strong>
              </div>
            </Col>
            <Col span={5}>
              <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: 'center' }}>
                <strong>Jūs</strong>
              </div>
            </Col>
          </Row>
        </List.Item>
        {P.pipe(data, P.sortBy((q) => 5 + ['green', 'red'].reverse().indexOf(q.color.color))).reverse().map((q) => {
          return <List.Item style={{ background: q.color.rawColor }}>
            <Row style={{ width: "100%" }}>
              <Col span={14}><div style={{ padding: 10 }}>
                {q.order}
              </div></Col>
              <Col span={5}>
                <div style={{ height: "100%", display: "flex", justifyContent: "flex-end", alignItems: 'center' }}>
                  {q.politic_vote}
                </div>
              </Col>
              <Col span={5}>
                <div style={{ height: "100%", display: "flex", justifyContent: "flex-end", alignItems: 'center' }}>
                  {q.user_vote}
                </div>
              </Col>
            </Row>
          </List.Item>
        })}
      </List>
    </LayoutContainer>
  );
}

function LayoutContainer(props: PropsWithChildren<{ header: JSX.Element }>) {
  return (
    <Scroll position={"relative"} width={"100%"} height={"100vh"}>
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
    </Scroll>
  );
}




interface PoliticianWithScore {
  score: number;
  displayName: string;
  fraction: string;
  politicianId: string;
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
      <Watch data={politiciansParties.pipe(RXO.filter(P.isDefined))}>
        {(data) => {
          const indexed = P.indexBy(props.data, (c) => c.voteId)
          const rawScore = CalculateRawScores(indexed, props.userVotes, data)
          console.log({
            rawScore
          })
          const politiciansScores = CalculateNormalizedPoliticianScore(rawScore)
          console.log({
            politiciansScores
          })
          const partiesScores = CalculatePartyScores(politiciansScores, data)
          console.log({
            partiesScores
          })
          return <Fragment>
            <LayoutContainer header={<PageHeader title={"Rezultatai"}></PageHeader>}>
              <List>
                {partiesScores.map((q) => {
                  return <List.Item extra={
                    <div style={{ width: "100%" }}>
                      <Progress
                        percent={Math.round(q.score * 100)}
                      ></Progress>
                    </div>
                  } actions={
                    [
                      <Button >Daugiau</Button>,
                    ]
                  }>
                    <List.Item.Meta title={q.party}></List.Item.Meta>
                  </List.Item>
                })}
              </List>
              {/* {P.pipe(
                politiciansScores,
                P.take(141)
              ).map((summary, index) => (
                <ParliamentList
                  onClick={(summary) => {
                    setSelectedParliament(summary.id);
                    setPage(1);
                  }}
                  index={index}
                  summary={summary}
                  min={min}
                  max={max}
                ></ParliamentList>
              ))} */}
            </LayoutContainer>
            <ParliamentVoteSummary
              setPage={setPage}
              selectedParliament={selectedParliament}
              setSelectedParliament={setSelectedParliament}
              {...props}
            ></ParliamentVoteSummary>
          </Fragment>
        }}
      </Watch>
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
