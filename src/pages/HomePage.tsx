import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import Navbar from "../components/Navbar.tsx";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SaveTodayForm from "../components/SaveTodayForm.tsx";
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
    weekDays: string[],
    today: Day,
    lowestWeight: number,
    highestWeight: number

}

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    let formType: "save" | "display" = "save";
    const [wantsUpdate, setWantsUpdate] = useState(false);
    const [responseData, setResponseData] = useState<HomePageResponse>();
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip);
    let lowestWeight = 0;
    let highestWeight = 0;
    let lowBar = 50;
    let highBar = 98;
    let medianWeight = 0;
    let averageCalories = 0;
    let today;
    const navigate = useNavigate();
    const date: Date = new Date();
    const formatedDate: string = date.getDate() > 9 ? date.getDate() : ("0" + (date.getDate())) + "." + (date.getMonth() > 8 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1)));

    if (responseData) {
        lowestWeight = responseData.lowestWeight;
        highestWeight = responseData.highestWeight;
        medianWeight = responseData.medianWeight;
        averageCalories = responseData.averageCalories;
        today = responseData.today;
        if (today != null) {
            console.log(formatedDate, today.date)
            if (today.date === formatedDate) {
                formType = "display";
            }
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

        if (lowestWeight != 0) {
            lowBar = lowestWeight;
        }

        if (highestWeight != 0) {
            highBar = highestWeight;
        }


        if (chartRef.current && responseData) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                new Chart(ctx, 
                    {
                        type: "line",
                        data: {
                            labels: responseData.weekDays.map(row => row),
                            datasets: [{
                                data: responseData.dayList.map(row => row.weightMeasurement),
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
                                    min: Math.ceil(lowBar - (lowBar * 0.02 + 20 / lowBar)),
                                    max: Math.ceil(highBar + (highBar * 0.02 + 20 / highBar)),
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
                        <div className="d-flex justify-content-between close-update-row">
                            <h1 className="">Today:</h1>
                            {
                                wantsUpdate &&
                                <button onClick={onClick} className="btn p-0 m-0"><i className="bi bi-x text-danger me-2" style={{fontSize: "2rem"}}></i></button>
                            }
                        </div>
                        {formType === "save" && !wantsUpdate && <SaveTodayForm></SaveTodayForm>}
                        {(formType === "display" && !wantsUpdate) && 
                            <TodayData 
                                today={today}
                                onClickFunction={onClick}
                            ></TodayData>}
                        {wantsUpdate && 
                            <UpdateTodayForm
                                today={today} 
                            ></UpdateTodayForm>}
                        <hr className="my-5 d-md-none"/>
                    </div>
                    <div className="data-display mb-5 mb-md-0 m-auto mt-md-4"> 
                        <h1 className="">This week:</h1>
                        <ThisWeekData
                            medianWeight={ medianWeight }
                            averageKcal={ averageCalories }
                            lowestWeight={ lowestWeight }
                            highestWeight={ highestWeight }
                        ></ThisWeekData>
                    </div>
                </aside>
            </div>
        </div>
    )
}