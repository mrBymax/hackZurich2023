"use client";

import CountdownTimer from "@/components/CountDown";
import { Button } from "@/components/ui/button";
import WebSocketClient from "@/lib/websocketcli";
import Image from "next/image";
import React, { useCallback } from "react";
import Particles from "react-particles";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { loadSlim } from "tsparticles-slim";

export default function FocusPage() {

    const [focus, setFocus] = React.useState(false)
    const [init, setInit] = React.useState(false)
    const [start, setStart] = React.useState(false)

    const maxSamples = 100;
    const [data, setData] = React.useState([]);

    const [timer, setTimer] = React.useState(300)
    const socketRef = React.useRef(null);

    const [color, setColor] = React.useState("#0f172a")

    const onDataReceived = (dat: any) => {
        console.log(dat);
        if (init) {
            if (dat.sample < 1.0)
                setColor("#ff172a")
            else if (dat.sample < 1.5)
                setColor("#8f882a");
            else if (dat.sample < 1.9)
                setColor("#0f17fa");
            else
                setColor("#0fff2a")
        }
    };
    const particlesInit = useCallback(async (engine: any) => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadFull(engine);
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: any) => {
        await console.log(container);
    }, []);

    return (
        <>
            <>
                {!init && (
                    <div className={"hidden flex-col md:flex"}>
                        <div className="grid h-screen place-items-center">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Start Session</h1>
                            </div>
                            <Button onClick={() => {
                                setInit(true); /* @ts-ignore */
                                socketRef.current!.send({ cmd: "init" });
                            }} className="bg-transparent hover:bg-transparent">
                                <Image src="/logo.png" width={300} height={300} alt="logo" />
                            </Button>
                        </div>
                    </div >
                )}
            </>
            <>
                {init && (
                    <div>
                        <div className="grid h-screen place-items-center">
                            <Button onClick={() => {
                                setFocus(false); setTimer(0) /* @ts-ignore */
                                socketRef.current!.send({ cmd: "stop" });
                            }}>
                                {"Stop Focus"}
                            </Button>
                        </div>

                        <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded} options={{
                            fpsLimit: 120,
                            particles: {
                                color: {
                                    value: color,
                                },
                                links: {
                                    color: "#ffffff",
                                    distance: 150,
                                    enable: true,
                                    opacity: 0.5,
                                    width: 1,
                                },
                                move: {
                                    direction: "none",
                                    enable: true,
                                    outModes: {
                                        default: "bounce",
                                    },
                                    random: false,
                                    speed: 0.4,
                                    straight: false,
                                },
                                number: {
                                    density: {
                                        enable: true,
                                        area: 800,
                                    },
                                    value: 80,
                                },
                                opacity: {
                                    value: 0.5,
                                },
                                shape: {
                                    type: "circle",
                                },
                                size: {
                                    value: { min: 1, max: 2 },
                                },
                            },
                            detectRetina: true,
                        }} />
                    </div>
                )}
            </>
            <>
                {(!focus && start) && (
                    <div>
                        <div className="flex-1 space-y-4 p-8 pt-6">
                            <div className="flex items-center justify-between space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">Focus</h2>
                            </div>
                        </div>
                    </div>
                )}
            </>
            <WebSocketClient ref={socketRef} onDataReceived={onDataReceived} />
        </>
    )
}
