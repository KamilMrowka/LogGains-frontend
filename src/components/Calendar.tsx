import { Analysis, GraphData } from "../pages/HomePage"
import WeekElement from "./WeekElement"

interface Props {
    weeks: GraphData[][],
    setChosenDay: React.Dispatch<React.SetStateAction<GraphData>>,
    currentMonth?: boolean,
    chosenDay: GraphData | undefined
}

export interface CalendarPageResponse {
    weeks: GraphData[][],
    monthAnalysis: Analysis,
    today: GraphData
}


export default function Calendar ( {weeks, currentMonth, setChosenDay, chosenDay} : Props) {
    let weekDays: GraphData[] = [
        {date: "MON", calories: -99, weight: 0},
        {date: "TUE", calories: -99, weight: 0},
        {date: "WEN", calories: -99, weight: 0},
        {date: "THU", calories: -99, weight: 0},
        {date: "FRI", calories: -99, weight: 0},
        {date: "SAT", calories: -99, weight: 0},
        {date: "SUN", calories: -99, weight: 0},
    ]



    return (
        <div className="calendar text-white">
            <WeekElement chosenDay={chosenDay} week={weekDays} setChosenDay={setChosenDay}></WeekElement> 
            {
                weeks.map((value, indx) => {
                    return <WeekElement chosenDay={chosenDay} setChosenDay={setChosenDay} currentMonth={currentMonth} key={indx} week={value}></WeekElement>
                })
            }
        </div>
    )
}