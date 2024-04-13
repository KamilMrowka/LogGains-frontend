import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import Navbar from "../components/Navbar.tsx";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import LoadingPage from "./LoadingPage.tsx";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MeasurementsForm from "../components/MeasurementsForm.tsx";

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

interface homePageResponse {
    dayList: Day[],
    week: Week,
    averageCalories: number,
    medianWeight: number,
    weekDays: string[]
}
export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    let weekDays: string[] = [];
    let weekMeasurements: ( number | null )[] = [] 
    const [responseData, setResponseData] = useState<homePageResponse>();

    const chartRef = useRef<HTMLCanvasElement | null>(null);

    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

    const navigate = useNavigate();

    let lowestWeight: number;
    let highestWeight: number;

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

    if (responseData) {
        if (Array.isArray(responseData.weekDays) && Array.isArray(responseData.dayList)) {
            weekDays = responseData.weekDays.map(function(day){
                let dateParts = day.split("-");
                const shortDate = dateParts[2] + "." + dateParts[1];
                return shortDate;
            });
            
            if (responseData.dayList.length != 0) {
                let counter = 0;
                lowestWeight = responseData.dayList[counter].weightMeasurement;
                highestWeight = responseData.dayList[counter].weightMeasurement;
                weekDays.forEach(day => {
                    const checkDay: Day = responseData.dayList[counter];
                    let dateParts: string[] = checkDay.date.split("-");
                    const shortDate = dateParts[2] + "." + dateParts[1];
                    if (day == shortDate) {
                        
                        if (checkDay.weightMeasurement > highestWeight) {
                            highestWeight = checkDay.weightMeasurement;
                        } else if (checkDay.weightMeasurement < lowestWeight) {
                            lowestWeight = checkDay.weightMeasurement;
                        }
                
                        weekMeasurements.push(checkDay.weightMeasurement);
                        if (counter < responseData.dayList.length - 1) {
                            counter++;
                        }
                    } else {
                        weekMeasurements.push(null);
                    }
                })
            }
            console.log(weekMeasurements);
        } else {
        }
    }
    


    useEffect(() => {

        if (chartRef.current && responseData) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                new Chart(
                    ctx,
                    {
                        type: "line",
                        data: {
                            labels: weekDays.map(row => row),
                            datasets: [
                                {
                                    data: weekMeasurements.map(row => row),
                                    borderColor: 'rgb(76, 187, 23)',
                                    tension: 0.3,
                                    pointRadius: ( responseData?.dayList.length > 1 ) ? 3 : 8,
                                    pointBorderWidth: (responseData.dayList.length > 1 ) ? 1 : 3,
                                }
                            ]
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
                                    suggestedMin: 1,
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
                    <motion.div className={"container-fluid flex-column p-0 align-self-start"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Navbar></Navbar>
                        <div className={"container-fluid d-flex text-white p-4 justify-content-evenly align-items-start"}>
                            <div className="flex-row d-flex container-fluid ps-3 p-3 pe-3 justify-conent-evenly">
                                <div className={"col-7 text-center"}>
                                    <div className="pb-3">
                                        <h1> Your weight this week:</h1>
                                    </div>
                                    <canvas ref={chartRef} />
                                </div>
                                <div className="flex-column ps-5 pt-4 d-flex container-fluid justify-content-start align-items-center">
                                   <MeasurementsForm></MeasurementsForm> 
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            }
        </>
    )
}