import { GraphData } from "../pages/HomePage"

interface Props {
    day: GraphData
    currentMonth?: boolean,
    setChosenDay: React.Dispatch<React.SetStateAction<GraphData>>
    chosenDay: GraphData | undefined
}

export default function Day ({ day, currentMonth, setChosenDay, chosenDay } : Props) {
    const date = new Date();
    const today: string = "" + (date.getDate() > 9 ? date.getDate() : ("0" + (date.getDate()))) + "." + (date.getMonth() > 8 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1)));

    const onClick = () => {
        if (day.calories != -99 && day.calories != -98) {
            if (chosenDay != day) {
                setChosenDay(day);
            }
        }
    }
    console.log(day.date, today)

    return (
        // -99 kcal means day names row(top row: mon, tue, wed...)
        // -98 kcal means day outside of month
        // TODO: FIX showing every year as today
        <div onClick={onClick} className={"day text-center py-2" + (day.calories != -99 ? " " : "") + (day.calories == -98 ? " border-secondary-subtle text-secondary" : "") +
            ((currentMonth && today === day.date) ? " day-today" : "") + 
            (day.calories != -98 && day.calories != -99 ? " day-proper" : "")
        }>
            <text className={(day.calories > 0 || day.weight > 0 ? " day-has-data" : "")}>{day.date}</text>
        </div>
    )
}