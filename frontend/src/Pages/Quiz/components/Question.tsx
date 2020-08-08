import React, { useRef } from "react";
import { Scroll } from "framer";
import { BehaviorSubject } from "rxjs";
import { YouTubeView } from "../../../Shared/YoutubeVideo";
import { VoteTicket } from "../types";
import { VotingInfo } from "../../../database";
import { Row, Col, Card, Typography, Button, Collapse, Progress } from "antd";
export function Question(props: {
  data: VotingInfo;
  totalItems: number;
  onSubmit: (value: { id: string; vote: VoteTicket }) => void;
  index: number;
  current: number;
}) {
  const ref = useRef(new BehaviorSubject<boolean>(false));

  const showVideoIf =
    props.current - 1 === props.index ||
    props.current === props.index ||
    props.current + 1 === props.index;

  return (
    <Scroll position={"relative"} width={"100%"} height={"100vh"}>

      <Row justify={"center"} align={"middle"}>
        <Col xl={6}></Col>
        <Col xl={12}>
          <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Col span={4}>
              <img
                width={200}
                height={"auto"}
                src="images/logo.png"
                alt=""
                className="pb-2"
              />
            </Col>
            <Col></Col>
          </Row>
          <Card
            
          >
            <Typography.Title style={{ fontSize: 24, marginBottom: 25 }}>{props.data.order}</Typography.Title>
            {
              props.data.youtubeUrl ? (
                showVideoIf ? (
                  <YouTubeView
                    play={ref.current}
                    url={props.data.youtubeUrl}
                  ></YouTubeView>
                ) : null
              ) : null
            }
            <Collapse bordered={false}>
              <Collapse.Panel header={"Daugiau informacijos"} key="1">
                <Typography.Text>{props.data.fullOrder}</Typography.Text>
              </Collapse.Panel>
            </Collapse>

            <Row
              style={{ marginTop: 10 }}
              gutter={[8, 8]}
              justify={"center"}
              align={"middle"}
            >
              <Col span={8}>
                <Button
                  style={{
                    width: "100%",
                    height: 80,
                    background: "green",
                    color: "white",
                  }}
                  onClick={() => {
                    ref.current.next(false);
                    props.onSubmit({
                      id: props.data.voteId,
                      vote: VoteTicket.FOR,
                    });
                  }}
                >
                  <b>Už</b>
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  style={{
                    width: "100%",
                    height: 80,
                  }}
                  onClick={() => {
                    ref.current.next(false);
                    props.onSubmit({
                      id: props.data.voteId,
                      vote: VoteTicket.IDLE,
                    });
                  }}
                >
                  <b>Praleisti</b>
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  style={{
                    width: "100%",
                    height: 80,
                    background: "red",
                    color: "white",
                  }}
                  onClick={() => {
                    ref.current.next(false);
                    props.onSubmit({
                      id: props.data.voteId,
                      vote: VoteTicket.AGAINST,
                    });
                  }}
                >
                  <b>Prieš</b>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Progress percent={parseFloat((((props.index + 1) / props.totalItems) * 100).toFixed(0))} size={'default'} />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Typography.Title style={{ fontSize: 14 }}>
                    {props.index + 1}/{props.totalItems}
                  </Typography.Title>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xl={6}></Col>
      </Row>
    </Scroll>
  );
}
