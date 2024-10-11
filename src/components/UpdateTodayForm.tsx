import { useRef, useState } from "react"
import axios from "axios";
import { GraphData } from "../pages/HomePage";

interface updateRequest {
    date: string,
    weightMeasurement: number | null,
    caloriesConsumed: number | null,
}

interface Props {
    today: GraphData
    // F: YYYY-MM-DD
    customDate?: string
}



export default function( { today, customDate }: Props ) {
    const weightRef = useRef<HTMLInputElement>(null);
    const kcalRef = useRef<HTMLInputElement>(null);
    const [isEmptyOrSame, setIsEmptyOrSame] = useState(true);
    const date: Date = new Date();
    const dateArr = today.date.split(".");
    const todayDay: string = dateArr[0];
    const todayMonth: string = dateArr[1];
    const todayDate: string = date.getFullYear() + "-" + todayMonth + "-" + todayDay;

    const formRequest = (): updateRequest => {
        if (weightRef.current != null && kcalRef.current != null) {
        let weight: number | null = parseFloat(weightRef.current.value);
        let calories: number | null = parseFloat(kcalRef.current.value);
        if (!isNaN(weight)) {
            weight = parseFloat(weight.toFixed(2));
        } else  {
            weight = null;
        }
        if (!isNaN(calories)) {
            calories = parseFloat(calories.toFixed(2));
        } else {
            calories = null;
        }
        const request: updateRequest = {
            date: todayDate,
            caloriesConsumed: calories,
            weightMeasurement: weight,
        }

        if (customDate) {
            request.date = customDate;
        }


        return request;
        } else {
            return {
                date: todayDate,
                caloriesConsumed: null,
                weightMeasurement: null, 
            }
        }    
    }
    

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault;
        const request: updateRequest = formRequest();
        await axios.put("http://localhost:8080/api/v1/day", request, {headers: {"Authorization": "Bearer " + localStorage.getItem('420token')}})
        .then(() => {
        })
        .catch(() => {
            
        });
    }

    const handleChange = () => {
        if (weightRef.current != null && kcalRef.current != null) {
            if ((weightRef.current.value == "" && kcalRef.current.value == "") ||
                (weightRef.current.value == "" && kcalRef.current.value.charAt(0) === "0") ||
                (weightRef.current.value.charAt(0) == "0" && kcalRef.current.value.charAt(0) === "0") ||
                (weightRef.current.value.charAt(0) == "0" && kcalRef.current.value === "")
            ) {
                setIsEmptyOrSame(true);
            } else {
                setIsEmptyOrSame(false);
            }
        }
    }


    return (
        <div className="save-today">
            <form onSubmit={handleSubmit} className="">
                <div className="input-group mb-2">
                    <input onChange={handleChange} type="number" ref={weightRef} min={0} max={500} step={0.1} placeholder="Weight" className="placeholder-light bg-dark text-white form-control"></input>
                    <span className="input-group-text text-white bg-dark">kg</span>
                </div>
                <div className="input-group mb-2">
                    <input onChange={handleChange} type="number" ref={kcalRef} min={0} max={25000} placeholder="Calories" className="placeholder-light bg-dark text-white form-control"></input>
                    <span className="input-group-text text-white bg-dark">kcal</span>
                </div>
                <div className="d-flex">
                    <button type="submit" className={"btn bg-dark btn-dark border-light w-100 " + (isEmptyOrSame && "disabled")}>Update</button>
                </div>
            </form>
       </div>
    ) 
}