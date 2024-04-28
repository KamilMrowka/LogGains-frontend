import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import Navbar from "../components/Navbar.tsx";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import LoadingPage from "./LoadingPage.tsx";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SaveTodayForm from "../components/SaveTodayForm.tsx";
import constructData, { graphData } from "../functions/constructData.ts";
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
    let formType: "save" | "update" = "save";
    let data: graphData;
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
            formType = "update";
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
                                borderColor: 'rgb(76, 187, 23)',
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

    
    return (
        <> 
            {isLoading ? <AnimatePresence mode="wait"><LoadingPage></LoadingPage></AnimatePresence> :
                (
                    <motion.div className={"container-fluid flex-column p-0 align-self-start mb-1"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Navbar></Navbar>
                        <div className={"container-fluid d-flex text-white p-4 justify-content-evenly align-self-center align-items-start"}>
                            <div className="flex-row d-flex container-fluid p-3 justify-conent-evenly row row-cols-2">
                                <div className={"col-8 text-center"}>
                                    <div className="pb-3">
                                        <h1> Your weight this week:</h1>
                                    </div>
                                    <canvas ref={chartRef} />
                                </div>
                                <div className="vr m-4 text-secondary d-none "></div>
                                <div className="d-flex flex-column container-fluid justify-content-start align-items-center">
                                    <h1 className="text-center pb-3">Today:</h1>
                                   {formType === "save" ? <SaveTodayForm></SaveTodayForm> : 
                                   <UpdateTodayForm 
                                        weight={today.weight}
                                        calories={today.calories}
                                        date={today.date}
                                    ></UpdateTodayForm>}
                                    <div className="col-12 text-secondary m-4">
                                        <hr/>
                                    </div>
                                    <h1 className="text-center pb-3">This week:</h1>
                                    <div>Median weight: som kg</div>
                                    <div>Lowest weight: som kg</div>
                                    <div>Highest weight: som kg</div>
                                    <div>Average deficit: som kcal</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            }
        </>
    )
}