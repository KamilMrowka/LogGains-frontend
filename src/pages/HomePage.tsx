import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import Navbar from "../components/Navbar.tsx";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SaveTodayForm from "../components/SaveTodayForm.tsx";
import constructData, { graphData } from "../functions/constructData.ts";
import TodayData from "../components/TodayData.tsx";
import ThisWeekData from "../components/ThisWeekData.tsx";
import UpdateTodayForm from "../components/UpdateTodayForm.tsx";

interface Day {
    dayId: number,
    userId: number,
    weekId: number,
    monthId: number,
    date: string,
    caloriesConsumed: number,
    weightMeasurement: number 
}

interface Week {
    id: number, 
    firstDay: string,
    lastDay: string
}

export interface HomePageResponse {
    dayList: Day[],
    week: Week,
    averageCalories: number,
    medianWeight: number,
    weekDays: string[]
}

export interface dayData {
    date: string,
    weight: number | null
}

export interface Today {
    weight: number | null,
    calories: number | null,
    date: string,
}
export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    let formType: "save" | "display" = "save";
    let data: graphData;
    const [wantsUpdate, setWantsUpdate] = useState(false);
    const [responseData, setResponseData] = useState<HomePageResponse>();
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip);
    let lowestWeight: number;
    let highestWeight: number;
    const navigate = useNavigate();
    const date: Date = new Date();
    const formatedDate: string = date.getDate() + "." + (date.getMonth() > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1)));
    let today: Today = {
        date: "",
        weight: null,
        calories: null
    }
    if (responseData) {
        data = constructData(responseData, formatedDate);
        lowestWeight = data.lowestWeight;
        highestWeight = data.highestWeight;
        today = data.today;
        if (today.date === formatedDate) {
            formType = "display";
        } else if (wantsUpdate != false) {
            setWantsUpdate(false);
        }
     }


    useEffect(() => {
        const token = 'Bearer ' + localStorage.getItem('420token');
        const getHomePage = async () => {
            console.log(localStorage.getItem("420token"));
            await axios.get("http://localhost:8080/api/v1/pages/homePage",
                {headers: {"Authorization": token}})
            .then(response => {
                console.log(response.data);
                setResponseData(response.data);
                setIsLoading(false);
            }).catch(() => {
                navigate("/login");
            })
        }
        getHomePage();
    }, [])

    useEffect(() => {
        if (chartRef.current && responseData) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                new Chart(ctx, 
                    {
                        type: "line",
                        data: {
                            labels: data.dayData.map(row => row.date),
                            datasets: [{
                                data: data.dayData.map(row => row.weight),
                                borderColor: 'rgb(00, 191, 100)',
                                tension: 0.3,
                                pointRadius: ( responseData?.dayList.length > 1 ) ? 3 : 8,
                                pointBorderWidth: (responseData.dayList.length > 1 ) ? 1 : 3,
                            }]
                        },
                        options: {
                            plugins: {
                                tooltip: {
                                    enabled: true,
                                    intersect: false,
                                    mode: "index",
                                    callbacks: {
                                        label: function(context) {
                                            let label = context.dataset.label || '';
                                            if (label) {
                                                label += ': ';
                                            }
                                            label += "Weight: " + context.parsed.y + "kg";
                                            return label;
                                        },
                                        title: function(tooltipItems) {
                                            return "Date: " + tooltipItems[0].label;
                                        }
                                    }
                                }
                            },
                            spanGaps: true,
                            scales: {
                                x: {
                                    grid: {
                                        color: 'rgba(70, 70, 70)'
                                    },
                                    ticks: {
                                        color: 'white',
                                    },
                                },
                                y: {
                                    grid: {
                                        color: 'rgba(70, 70, 70)'
                                    },
                                    ticks: {
                                        color: 'white', 
                                        callback: function(value) {
                                            return value + " kg";
                                        },
                                    },
                                    min: Math.ceil(lowestWeight - lowestWeight * 0.02),
                                    max: Math.ceil(highestWeight + highestWeight * 0.02),
                                    beginAtZero: false,
                                },
                            },
                        }
                    }
                )
            }
        }
    }, [isLoading])

    const onClick = () => {
        if (wantsUpdate) {
            setWantsUpdate(false);
        } else {
            setWantsUpdate(true);
        }
    }

    console.log("formType: " + formType + " wants update: " + wantsUpdate)

    
    return (
        <div className="d-flex main-container-centered flex-column"> 
            <Navbar></Navbar>
            <div className="main-container d-flex flex-column flex-md-row text-white justify-content-between">
                <main className="graph mt-5 mt-md-0">
                    <div className="text-center">
                        <h1>Your weight this week:</h1>
                    </div>
                    <canvas ref={chartRef} />
                    <hr className="my-5 d-md-none"/>
                </main>
                <aside className="form-data m-0 d-md-flex flex-column justify-content-between">
                    <div className="measure-form m-auto m-md-0">
                        <h1 className="mb-3">Today:</h1>
                        {formType === "save" && !wantsUpdate && <SaveTodayForm></SaveTodayForm>}
                        {(formType === "display" && !wantsUpdate) && 
                            <TodayData 
                                today={today}
                                onClickFunction={onClick}
                            ></TodayData>}
                        {wantsUpdate && 
                            <UpdateTodayForm
                                onClick={onClick}
                            ></UpdateTodayForm>}
                        <hr className="my-5 d-md-none"/>
                    </div>
                    <div className="data-display mb-5 mb-md-0 m-auto mt-md-4"> 
                        <h1 className="">This week:</h1>
                        <ThisWeekData></ThisWeekData>
                    </div>
                </aside>
            </div>
        </div>
    )
}