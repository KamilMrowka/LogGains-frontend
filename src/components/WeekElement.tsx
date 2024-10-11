import { GraphData } from "../pages/HomePage";
import Day from "./Day"

interface Props {
    week: GraphData[],
    currentMonth?: boolean,
    setChosenDay: React.Dispatch<React.SetStateAction<GraphData>>,
    chosenDay: GraphData | undefined
}

export default function WeekElement( { week, currentMonth, setChosenDay, chosenDay } : Props) {
    return (
            <div className="days">
                {
                    week.map((day, index) => {
                        return <Day chosenDay={chosenDay} setChosenDay={setChosenDay} key={index} day={day} currentMonth={currentMonth}></Day>
                    })
                }
            </div>
    )
}