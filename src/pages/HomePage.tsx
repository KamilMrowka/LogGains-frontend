import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import Navbar from "../components/Navbar.tsx";
import { useEffect, useRef } from "react";
export default function HomePage() {

    const chartRef = useRef<HTMLCanvasElement | null>(null);

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);

    const data = [
        {day: 1.04, weight: 85.4},
        {day: 2.04, weight: 84.7},
        {day: 3.04, weight: 84.5},
        {day: 4.04, weight: 85.0},
        {day: 5.04, weight: 84.3},
        {day: 6.04, weight: 84.0},
        {day: 7.04, weight: 84.1}
    ];

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                new Chart(
                    ctx,
                    {
                        type: "line",
                        data: {
                            labels: data.map(row => row.day),
                            datasets: [
                                {
                                    label: 'Your weight this week',
                                    data: data.map(row => row.weight),
                                    borderColor: 'rgb(76, 187, 23)',
                                }
                            ]
                        },
                        options: {
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
                                        callback: function(value, index, ticks) {
                                            return value + " kg";
                                        }
                                    },
                                },
                            },
                        }
                    }
                )
            }
        }
    })

    
    
    return (
        <div className={"container-fluid flex-column p-0 align-self-start"}>
            <Navbar></Navbar>
            <div className={"container-fluid d-flex text-white p-4 justify-content-evenly align-items-start"}>
                <div className="flex-row d-flex container-fluid ps-3 pb-3 pe-3 justify-conent-evenly">
                    <div className={"col-7 text-center"}>
                        <div className="pb-3">
                            <text> Your weight this week</text>
                        </div>
                        <canvas ref={chartRef} />
                    </div>
                    <div className="flex-column d-flex justify-content-center">
                        <h2 className="mt-5">Save today's measurements:</h2>
                        <div className="col-6">
                            <div className="input-group">
                                <input type="text" placeholder="weight" className="form-control m-2 text-light bg-dark"></input>
                            </div>
                            <div className="input-group">
                                <input type="text" placeholder="calories" className="form-control m-2 text-light bg-dark"></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}