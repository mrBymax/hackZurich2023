"use client";

import Image from "next/image";
import React, { useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import { ThemeSwitchToggle } from "@/components/ThemeSwitchToggle";
import { CalendarDateRangePicker } from "@/components/CalendarDateRangePicker";

import { Search } from "@/components/Search";
import { Button } from "@/components/ui/button";

import {
    Tabs, TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import TeamSwitcher from "@/components/TeamSwitcher";
import { FocusTimeLineChart } from "@/components/FocusTimeLineChart";
import { FocusScoreLineChart } from "@/components/FocusScoreLineChart";
import FocusButton from "@/components/FocusButton";
import WebSocketClient from "@/lib/websocketcli";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function DashboardPage() {

    const [dashboard, setDashboard] = React.useState(false)

    const [init, setInit] = React.useState(false)

    const socketRef = React.useRef(null);

    const [color, setColor] = React.useState("#0f172a")

    const [openbciData, setOpenbciData] = React.useState(null)
    const [activityData, setActivityData] = React.useState({})
    const [mouseData, setMouseData] = React.useState(null)
    const [gazeData, setGazeData] = React.useState(null)

    const onDataReceived = (dat: any) => {
        console.log(dat);
        if (dat.type === "rt-openbci") {
            if (dat.data.sample < 1.0)
                setColor("#ff172a")
            else if (dat.data.sample < 1.5)
                setColor("#8f882a");
            else if (dat.data.sample < 1.9)
                setColor("#0f17fa");
            else
                setColor("#0fff2a")
        } else if (dat.type === "openbci") {
            setOpenbciData(dat.data);
        } else if (dat.type === "activity") {

            var flattenedData = dat.data.flat()
            console.dir(flattenedData);
            // Initialize an empty object to store the counts
            var counts = {};

            // Iterate through the flattened data and count occurrences
            flattenedData.forEach((item: any) => {
                item.forEach((item1: any) => {
                    const key = item1[0]; // Get the string
                    if (counts[key]) {
                        counts[key]++;
                    } else {
                        counts[key] = 1;
                    }
                });
            });
            console.dir(counts);
            setActivityData(counts);
        } else if (dat.type === "mouse") {
            setMouseData(dat.data);
        } else if (dat.type === "gaze") {
            setGazeData(dat.data.data.map((item: any) => { return { measure: item[3] } }));
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
            {dashboard && (<>
                <div className={"hidden flex-col md:flex"}>
                    <div className="border-b">
                        <div className="flex h-16 items-center px-4">
                            <div className="flex h-16 items-center space-x-4 text-bold text-2xl">
                                <Image src="/logo.png" width={40} height={40} alt="logo" />
                                Mindtrics
                            </div>
                            <div className="ml-auto flex items-center space-x-4">
                                <ThemeSwitchToggle />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 p-8 pt-6">
                        <div className="flex items-center justify-between space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                            <div className="flex items-center space-x-2">
                                <CalendarDateRangePicker />
                                <Button>Download</Button>
                            </div>
                        </div>

                        <Tabs defaultValue="overview" className={"space-y-4"}>
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="analytics" disabled>
                                    Analytics
                                </TabsTrigger>
                                <TabsTrigger value="reports" disabled>
                                    Reports
                                </TabsTrigger>
                                <TabsTrigger value="notifications" disabled>
                                    Notifications
                                </TabsTrigger>
                            </TabsList>

                            {/*    Tabs content     */}

                            <TabsContent value={"overview"}>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className={"text-sm font-medium"}>
                                                Total Focus Time
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">300h</div>
                                            <p className="text-xs text-muted-foreground">
                                                The total amount of time you have spent focused.
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className={"text-sm font-medium"}>
                                                Monthly Focus Time
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">24h</div>
                                            <p className="text-xs text-muted-foreground">
                                                +10% from last month
                                            </p>
                                        </CardContent>
                                    </Card>


                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className={"text-sm font-medium"}>
                                                {/* eslint-disable-next-line react/no-unescaped-entities */}
                                                Today's Focus Time
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">4h</div>
                                            <p className="text-xs text-muted-foreground">
                                                +33% from yesterday
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className={"text-sm font-medium"}>
                                                {/* eslint-disable-next-line react/no-unescaped-entities */}
                                                Start a Focus Session
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Button onClick={() => {
                                                setDashboard(false);
                                            }}>
                                                Start Focus
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card className={"col-span-2"}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle>
                                                Focus Strength Chart
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className={"p-6"}>
                                            <ResponsiveContainer width="100%" height={350}>
                                                {/* @ts-ignore */}
                                                <LineChart data={openbciData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <Tooltip />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Line type="monotone" dataKey="Focus Score" stroke={"#0f172a"} strokeWidth={2} activeDot={{ r: 8 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>

                                    <Card className={"col-span-2"}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle>
                                                Overview of Activities
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className={"p-6"}>
                                            <Table>
                                                <TableCaption>A list of your activities.</TableCaption>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[100px]">Activity</TableHead>
                                                        <TableHead className="text-right">Count</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {
                                                        Object.keys(activityData).map((activity) => (
                                                            <TableRow>
                                                                <TableCell>{activity}</TableCell>
                                                                {/* @ts-ignore */}
                                                                <TableCell className="text-right">{activityData[activity]}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>

                                    <Card className={"col-span-2"}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle>
                                                Mouse Chart
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className={"p-6"}>
                                            <ResponsiveContainer width="100%" height={350}>
                                                {/* @ts-ignore */}
                                                <ScatterChart>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <Tooltip />
                                                    <XAxis dataKey="x" type="number" />
                                                    <YAxis dataKey="y" type="number" />
                                                    // @ts-ignore
                                                    <Scatter name="Mouse coords" data={mouseData} fill="#0f172a" />
                                                </ScatterChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                    <Card className={"col-span-2"}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle>
                                                Gaze Chart
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className={"p-6"}>
                                            <ResponsiveContainer width="100%" height={350}>
                                                {/* @ts-ignore */}
                                                <LineChart data={gazeData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <Tooltip />
                                                    <XAxis />
                                                    <YAxis />
                                                    <Line type="monotone" dataKey="measure" stroke={"#0f172a"} strokeWidth={2} activeDot={{ r: 8 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                    {/*<Card className={"col-span-4"}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle>
                                            Your Focus Time Checklist
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className={"p-6"}>
                                        <CheckboxWithText/>
                                    </CardContent>
                                </Card>*/}

                                </div>
                            </TabsContent>

                        </Tabs>

                    </div>
                </div>
            </>)
            }
            {
                !dashboard && (
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
                                        <Button onClick={() => { /* @ts-ignore */
                                            socketRef.current!.send({ cmd: "stop" });
                                            setDashboard(true);
                                            setInit(false);
                                            setTimeout(() => {
                                                //@ts-ignore
                                                socketRef.current!.send({ cmd: "reset" });
                                            }, 1000);
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
                                                color: "#aaaaaa",
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
                    </>
                )
            }
            <WebSocketClient ref={socketRef} onDataReceived={onDataReceived} />
        </>
    )
}
