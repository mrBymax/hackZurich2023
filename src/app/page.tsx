import {ThemeSwitchToggle} from "@/components/ThemeSwitchToggle";
import {CalendarDateRangePicker} from "@/components/CalendarDateRangePicker";

import {Search} from "@/components/Search";
import {Button} from "@/components/ui/button";

import {
    Tabs, TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import TeamSwitcher from "@/components/TeamSwitcher";
import {Skeleton} from "@/components/ui/skeleton";
import {CheckboxWithText} from "@/components/CheckboxWithText";
import {FocusTimeLineChart} from "@/components/FocusTimeLineChart";
import {FocusScoreLineChart} from "@/components/FocusScoreLineChart";
import {toast} from "@/components/ui/use-toast";
import FocusButton from "@/components/FocusButton";


export default function DashboardPage() {
    return (
        <>
            <div className={"hidden flex-col md:flex"}>
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        <div className="flex h-16 items-center space-x-4">
                            <TeamSwitcher/>
                        </div>
                        <div className="ml-auto flex items-center space-x-4">
                            <Search/>
                            <ThemeSwitchToggle/>
                            {/*<UserNav /> TODO*/}
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <div className="flex items-center space-x-2">
                            <CalendarDateRangePicker/>
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
                                        <FocusButton/>
                                    </CardContent>
                                </Card>

                                <Card className={"col-span-2"}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle>
                                            Overview of Focus Time
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className={"p-6"}>
                                        <FocusTimeLineChart/>
                                        {/*<Skeleton className={"h-64"}/>*/}
                                    </CardContent>
                                </Card>

                                <Card className={"col-span-2"}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle>
                                            Overview of Focus Score
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className={"p-6"}>
                                        <FocusScoreLineChart/>
                                        {/*<Skeleton className={"h-64"}/>*/}
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
        </>
    )
}