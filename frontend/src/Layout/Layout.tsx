import React, { PropsWithChildren } from "react";
import { Grid, Row, Col } from "react-flexbox-grid";


export type AlignOptions = 'left' | 'center' | 'right'
export function Align(props: PropsWithChildren<{ x: AlignOptions, y: AlignOptions }>) {
    return <div>

    </div>
}





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
