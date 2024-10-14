import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Analysis, GraphData } from "./HomePage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import compareGraphSetter from "../functions/CompareGraphSetter";
import ComparisonElement from "../components/ComparisonElement";


//     private List<GraphData> weekOne;
    // private List<GraphData> weekTwo;
    // private List<GraphData> monthOne;
    // private List<GraphData> monthTwo;
    // private Analysis weekOneAnalysis;
    // private Analysis weekTwoAnalysis;
    // private Analysis monthOneAnalysis;
    // private Analysis monthTwoAnalysis;


export interface ComparePageResponse {
    weekOne: GraphData[],
    weekTwo: GraphData[],
    monthOne: GraphData[],
    monthTwo: GraphData[],
    weekOneAnalysis: Analysis,
    weekTwoAnalysis: Analysis,
    monthOneAnalysis: Analysis,
    monthTwoAnalysis: Analysis,
}

export default function ComparePage() {

    const [firstDate, setFirstDate] = useState<string>("");
    const [secondDate, setSecondDate] = useState<string>("");
    const [response, setResponse] = useState<ComparePageResponse>();
    const weekWeightCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const weekCaloriesCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const monthWeightCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const monthCaloriesCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const compObjString = "comparator_response";
    
    if (!response) {
        const savedRespString  = sessionStorage.getItem(compObjString);
        if (savedRespString) {
            setResponse(JSON.parse(savedRespString));
        }
    }




    const navigate = useNavigate();

    const weekWeightChartInstance = useRef<Chart<"line", (number | null)[], string> | null>(null);
    const weekCaloriesChartInstance = useRef<Chart<"line", (number | null)[], string> | null>(null);
    const monthWeightChartInstance = useRef<Chart<"line", (number | null)[], string> | null>(null);
    const monthCaloriesChartInstance = useRef<Chart<"line", (number | null)[], string> | null>(null);

    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const token = 'Bearer ' + localStorage.getItem('420token');
        const getComparePage = async () => {
            await axios.get("http://localhost:8080/api/v1/pages/comparePage?date1="+firstDate+"&date2="+secondDate,
                {headers: {"Authorization": token}})
            .then(response => {
                console.log(response.data);
                sessionStorage.setItem(compObjString, JSON.stringify(response.data));
                setResponse(response.data);
            }).catch(error => {
                console.log(error);
                navigate("/login");
            })
        }
        if (firstDate != "") {
            getComparePage();
        }
    };

    useEffect(() => {
        if (response) {
            clearCharts();
            weekWeightChartInstance.current = compareGraphSetter({
                periodOneDataSet: response.weekOne, 
                periodTwoDataSet: response.weekTwo, 
                refObject: weekWeightCanvasRef, 
                datasets: "weight",
                periodLen: "week"
            });

            weekCaloriesChartInstance.current = compareGraphSetter({
                periodOneDataSet: response.weekOne,
                periodTwoDataSet: response.weekTwo, 
                refObject: weekCaloriesCanvasRef, 
                datasets: "calories",
                periodLen: "week"
            });

            monthWeightChartInstance.current = compareGraphSetter({
                periodOneDataSet: response.monthOne,
                periodTwoDataSet: response.monthTwo,
                refObject: monthWeightCanvasRef,
                datasets: "weight",
                periodLen: "month"
            });

            monthCaloriesChartInstance.current = compareGraphSetter({
                periodOneDataSet: response.monthOne,
                periodTwoDataSet: response.monthTwo,
                refObject: monthCaloriesCanvasRef,
                datasets: "calories",
                periodLen: "month"
            });

        }
    }, [response])

    const clearCharts = () => {
        if (weekWeightChartInstance.current) {
            weekWeightChartInstance.current.destroy();
        }
        if (weekCaloriesChartInstance.current) {
            weekCaloriesChartInstance.current.destroy();
        }
        if (monthWeightChartInstance.current) {
            monthWeightChartInstance.current.destroy();
        }
        if (monthCaloriesChartInstance.current) {
            monthCaloriesChartInstance.current.destroy();
        }

    }

    return (
        <div>
            <Navbar></Navbar>
            <main>
                <div className="d-flex align-items-start justify-content-xxl-between flex-column flex-xxl-row text-white main-container mt-5 mb-5">
                    <h1 className="compare-heading">Select a date for analysis <span className="my-green">or</span> select two for comparison:</h1>
                    <form onSubmit={onSubmit} className="d-flex justify-content-between">
                        <input type="date" onChange={(e) => setFirstDate(e.target.value)} value={firstDate} placeholder="First day" className="bg-dark form-control text-white datepicker me-5"></input>
                        <input type="date" onChange={(e) => setSecondDate(e.target.value)} value={secondDate}placeholder="Second day" className="bg-dark form-control text-white datepicker me-5"></input>
                        <button type="submit" className="btn btn-dark border-light">Compare</button>
                    </form>
                </div>
                <div className="main-container text-white">
                    {
                        response?.weekOne &&
                        <div className="w-100">
                            <h2 className="mb-4">Analysis for: <span className="my-green">WEIGHT</span> in corresponing week/weeks</h2>
                            <div className="graph-analysis-wrap">
                                <div className="comparison-graph">
                                    <canvas id={'weekWeight'} ref={weekWeightCanvasRef} />
                                </div>
                                <div>
                                    <h3 className="mb-4">ANALYSIS FOR THIS WEEK/S:</h3>
                                    <ComparisonElement
                                        periodOneAnalysis={response.weekOneAnalysis}
                                        periodTwoAnalysis={response.weekTwoAnalysis}
                                        scope="weight"
                                    ></ComparisonElement>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        response?.weekOne &&
                        <div className="w-100">
                            <h2 className="mb-4">Analysis for: <span className="my-green">CALORIE INTAKE</span> in corresponing week/weeks</h2>
                            <div className="graph-analysis-wrap">
                                <div className="comparison-graph">
                                    <canvas id={'weekCalories'} ref={weekCaloriesCanvasRef} />
                                </div>
                                <div>
                                    <h3 className="mb-4">ANALYSIS FOR THIS WEEK/S:</h3>
                                    <ComparisonElement
                                        periodOneAnalysis={response.weekOneAnalysis}
                                        periodTwoAnalysis={response.weekTwoAnalysis}
                                        scope="calories"
                                    ></ComparisonElement>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        response?.monthOne &&
                        <div className="w-100">
                            <h2 className="mb-4">Analysis for: <span className="my-green">WEIGHT</span> in corresponing month/months</h2>
                            <div className="graph-analysis-wrap">
                                <div className="comparison-graph">
                                    <canvas id={'monthWeight'} ref={monthWeightCanvasRef}/>
                                </div>
                                <div>
                                    <h3 className="mb-4">ANALYSIS FOR THIS MONTH/S:</h3>
                                    <ComparisonElement
                                        periodOneAnalysis={response.monthOneAnalysis}
                                        periodTwoAnalysis={response.monthTwoAnalysis}
                                        scope="weight"
                                    ></ComparisonElement>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        response?.monthOne &&
                        <div className="w-100">
                            <h2 className="mb-4">Analysis for: <span className="my-green">CALORIE INTAKE</span> in corresponing month/months</h2>
                            <div className="graph-analysis-wrap">
                                <div className="comparison-graph">
                                    <canvas id={'monthCalories'} ref={monthCaloriesCanvasRef}/>
                                </div>
                                <div>
                                    <h3 className="mb-4">ANALYSIS FOR THIS MONTH/S:</h3>
                                    <ComparisonElement
                                        periodOneAnalysis={response.monthOneAnalysis}
                                        periodTwoAnalysis={response.monthTwoAnalysis}
                                        scope="calories"
                                    ></ComparisonElement>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </main>
        </div>
   )
}