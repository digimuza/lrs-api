import React, { PropsWithChildren } from "react";
import { Grid, Row, Col } from "react-flexbox-grid";



export function Layout() {
  return (
    <Grid fluid>
      <Row>
        <Col xl={12}>
          <div className={"asd"}>asd</div>
        </Col>
      </Row>
    </Grid>
  );
}
