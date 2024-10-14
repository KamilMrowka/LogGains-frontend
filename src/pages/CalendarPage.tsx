import { useEffect, useState } from "react";
import Calendar, { CalendarPageResponse } from "../components/Calendar";
import Navbar from "../components/Navbar";
import "../styles/pages/calendarPage.css"
import getMonth from "../functions/getMonth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GraphData } from "./HomePage";
import MeasurementsForm from "../components/SaveTodayForm";
import TodayData from "../components/TodayData";
import UpdateTodayForm from "../components/UpdateTodayForm";
import AnalysisElement from "../components/AnalysisElement";

export default function CalendarPage() {

    const date: Date = new Date();
    const formatedDate: string = "" + (date.getDate() > 9 ? date.getDate() : ("0" + (date.getDate()))) + "." + (date.getMonth() > 8 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "." + date.getFullYear();
    const plusYear: string =  "" + (date.getMonth() > 8 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "-" + (date.getFullYear() + 1);
    const currentMonth: string = "currently_viewing_Month";
    const [month, setMonth] = useState(() => {
        return sessionStorage.getItem(currentMonth) || getMonth({});
    });
    const [responseData, setResponseData] = useState<CalendarPageResponse>();
    const [showWrongDate, setShowWrongDate] = useState(false);
    const chosenDayInitiationObject = {calories:-100, date:"00.00",weight:-100};
    const [chosenDay, setChosenDay] = useState<GraphData>(chosenDayInitiationObject);
    const navigate = useNavigate();
    const [wantsUpdate, setWantsUpdate] = useState(false);
    // F: YYYY-MM-DD
    const chosenDayRequestDate: string = month.split("-")[1] + "-" + month.split("-")[0] + "-" + chosenDay.date.split(".")[0];
    const todayRequestDate: string = date.getFullYear() + "-" + (date.getMonth() > 8 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "-" + (date.getDate() > 9 ? date.getDate() : ("0" + (date.getDate()))) 
    const [onClickTrigger, setOnClickTrigger] = useState(false);
    const onclickSetUpdate = () => {
        if (!wantsUpdate) {
            setWantsUpdate(true);
        }
    }



    useEffect(() => {
        const token = 'Bearer ' + localStorage.getItem('420token');
        const getHomePage = async () => {
            await axios.get("http://localhost:8080/api/v1/pages/calendarPage?date="+month,
                {headers: {"Authorization": token}})
            .then(response => {
                setResponseData(response.data);
                if (showWrongDate) {
                    setShowWrongDate(false);
                }
            }).catch(error => {
                if (error.response.status == 400) {
                    setShowWrongDate(true);
                } else {
                    navigate("/login");
                }
            })
        }
        getHomePage();
    }, [month, onClickTrigger])

    useEffect(() => {
        if(chosenDay.calories === 100 && responseData) {
            setChosenDay(responseData?.today);
        }
    }, [responseData])

    const onclickPlus = () => {
        sessionStorage.setItem(currentMonth, getMonth({currentMonth: month, plusMonths: 1}))
        setMonth(getMonth({currentMonth: month, plusMonths: 1}))
    }

    const onclickMinus = () => {
        sessionStorage.setItem(currentMonth, getMonth({currentMonth: month, plusMonths: -1}))
        setMonth(getMonth({currentMonth: month, plusMonths: -1}))
    }

    const onClick = () => {
        if (getMonth({}) != month) {
            sessionStorage.setItem(currentMonth, getMonth({}));
            setMonth(getMonth({}));
        }
    }

    useEffect(() => {
        setChosenDay(chosenDayInitiationObject);
    }, [month])

    return (
        <>
            <Navbar></Navbar>
            <div className={"m-auto d-flex calendar-page"} style={{maxWidth:1200}}>
                <main className="main-calendar">
                    <div className="calendar">
                        <div className="d-flex justify-content-between mt-4">
                            <h1 className="text-center text-white fs-2">Today: {formatedDate} </h1>
                            <div onClick={onClick} className="btn d-flex btn-secondary px-4 rounded-4 mb-5">
                                <div className="me-2">Go back</div>
                                <span className="mt-1 bi bi-arrow-return-left text-white"></span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            {
                                month != "01-2023" && !showWrongDate?
                                <i onClick={onclickMinus} className="bi bi-arrow-left-circle-fill fs-3 calendar-arrow"></i>
                                :
                                <i className="bi bi-arrow-left-circle text-white fs-3"></i>
                            }
                            {!showWrongDate ?
                                <h2 className="text-center text-white mb-5 fs-3">Viewing Month: {month} </h2>
                                : 
                                <h2 className="text-danger text-center mb-5 fs-3">Select a date from 2023 upwards!</h2>
                            }
                            {
                                month != plusYear ?
                                    <i onClick={onclickPlus} className="bi bi-arrow-right-circle-fill text-white fs-3"></i>
                                    :
                                    <i className="bi bi-arrow-right-circle text-white fs-3"></i>
                            }
                        </div>
                        <div className="d-flex align-items-center justify-content-center ">
                            {responseData &&
                                <Calendar chosenDay={chosenDay} currentMonth={(getMonth({}) === month )} weeks={responseData.weeks} setChosenDay={setChosenDay}></Calendar>
                            }
                        </div>
                    </div>
                </main>
                <aside className="aside-calendar">
                    { 
                        // Day doesn't have saved data
                        (chosenDay.calories == 0 && chosenDay.weight == 0) &&
                        <div className="w-100">
                            <h2 className="text-white mb-4">Selected: {chosenDay.date}</h2>
                            <MeasurementsForm date={chosenDayRequestDate}></MeasurementsForm>
                        </div>
                    }
                    {
                        // chosenDay unitialized, show today object as displayData    
                        (chosenDay.calories == -100 && responseData && (responseData.today.calories > 0 || responseData.today.weight > 0) && !wantsUpdate) &&
                        <div className="w-100">
                            <h2 className="text-white mb-4">Today: {responseData.today.date}</h2>
                            <TodayData setOnClickTrigger={setOnClickTrigger} customDeleteDate={todayRequestDate} onClickFunction={onclickSetUpdate} today={responseData.today}></TodayData>
                        </div>
                    }
                    {
                        // chosenDay initialized with actual day
                        ((chosenDay.calories > 0 || chosenDay.weight > 0) && !wantsUpdate) &&
                        <div className="w-100">
                            <h2 className="text-white mb-4">Data for: {chosenDay.date}</h2>
                            <TodayData setOnClickTrigger={setOnClickTrigger} customDeleteDate={chosenDayRequestDate} onClickFunction={onclickSetUpdate} today={chosenDay}></TodayData>
                        </div>
                    }
                    {
                        // updating chosenDay
                        ((chosenDay.calories > 0 || chosenDay.weight > 0) && wantsUpdate) &&
                        <div className="w-100">
                            <div className="d-flex justify-content-between">
                                <h2 className="text-white mb-4">Updating: {chosenDay.date}</h2>
                                <i onClick={() => {setWantsUpdate(false)}} className="bi bi-x text-danger fs-2 cancel-update"></i>
                            </div>
                            <UpdateTodayForm customDate={chosenDayRequestDate} today={chosenDay} ></UpdateTodayForm>
                        </div>
                    }
                    {
                        //Updating Today
                        ((chosenDay.calories == -100 && responseData) && wantsUpdate) &&
                        <div className="w-100">
                            <div className="d-flex justify-content-between">
                                <h2 className="text-white mb-4">Updating: {responseData.today.date}</h2>
                                <i onClick={() => {setWantsUpdate(false)}} className="bi bi-x text-danger fs-2 cancel-update"></i>
                            </div>
                            <UpdateTodayForm customDate={todayRequestDate} today={chosenDay} ></UpdateTodayForm>
                        </div>
                    }
                    <div className="mb-5"></div>
                    {
                        responseData && <AnalysisElement header={"Month: " + month} data={responseData?.monthAnalysis}></AnalysisElement>
                    }
                </aside>
            </div>
        </>
   )
}