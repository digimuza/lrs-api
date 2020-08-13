import React, { useEffect, useState } from "react";
import { Scroll } from "framer";
import { Typography } from "antd";
import { interval } from "rxjs";
import * as RXO from "rxjs/operators";
import { politiciansParties, PolticianPartyData } from "../../../database";
import * as P from 'ts-prime'
export function ProccesingSilde(props: {
    isActive: boolean
    next: () => void
}) {
    const [state, setState] = useState(0)
    const messages = [
        {
            mesage: "Traukiami LRS balsavimo rezultatai",
        },
        {
            mesage: "Lyginami balsavimo duomenis",
        },
        {
            mesage: "Vykdomas išmanusis reitingavimas",
        },
        {
            message: ""
        }
    ]
    useEffect(() => {
        if (props.isActive) {
            interval(1500).pipe(RXO.take(messages.length), RXO.finalize(()=>{
                props.next()
            })).subscribe((q)=> {
                setState(q)
            })
            fetch("/data/normalize.json").then(async (q)=>{
                const result = await q.json() as ReadonlyArray<PolticianPartyData>
                console.log(result)
                politiciansParties.next(P.indexBy(
                    result,
                    (q) => {
                        return q.displayName.toLowerCase()
                    }
                ))
            })
        }
    }, [props.isActive])
    return (
        <Scroll position={"relative"} width={"100%"} height={"100vh"}>
            {props.isActive ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
                <Typography.Title style={{ textAlign: "center"}}>
                    {messages[state].mesage}
                </Typography.Title>
            </div> : null}
        </Scroll>
    );
}
