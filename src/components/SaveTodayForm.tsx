import axios from "axios"
import { useRef, useState } from "react";
import '../styles/number.css';
import {getStoreValue, storeKeys} from "../functions/store.ts";

export interface dayMeasurements {
    caloriesConsumed: number,
    weightMeasurement: number,
    // F: YYYY-MM-DD
    date?: string

}

interface Props {
    // F: YYYY-MM-DD
    date?: string
}

export default function MeasurementsForm ( { date }: Props ) {

    const weightRef = useRef<HTMLInputElement>(null);
    const caloriesRef = useRef<HTMLInputElement>(null);
    const [isEmpty, setEmpty] = useState(true);

    const formRequest = (): dayMeasurements => {
        if (weightRef.current != null && caloriesRef.current != null) {
        let weight: number = parseFloat(weightRef.current.value);
        let calories: number = parseFloat(caloriesRef.current.value);
        if (!isNaN(weight)) {
            weight = parseFloat(weight.toFixed(2));
        } else  {
            weight = 0;
        }
        if (!isNaN(calories)) {
            calories = parseFloat(calories.toFixed(2));
        } else {
            calories = 0;
        }

        let request: dayMeasurements = {
            caloriesConsumed: calories,
            weightMeasurement: weight,
        }

        if (date) {
            request.date = date;
        }
        
        return request;
        } else {
            return {
                caloriesConsumed: 0,
                weightMeasurement: 0
            }
        }    
    }
    

    const handleSaveSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault;
        const request: dayMeasurements = formRequest();
        await axios.post(getStoreValue(storeKeys.baseUrl) + "/day", request, {headers: {"Authorization": "Bearer " + localStorage.getItem('420token')}})
        .then(() => {

        })
        .catch(() => {

        });
    }

    const handleChange = () => {
        if (weightRef.current != null && caloriesRef.current != null) {
            if (
                (weightRef.current.value == "" && caloriesRef.current.value == "") || 
                (weightRef.current.value == "" && caloriesRef.current.value.charAt(0) === "0") ||
                (weightRef.current.value.charAt(0) == "0" && caloriesRef.current.value.charAt(0) === "0") ||
                (weightRef.current.value.charAt(0) == "0" && caloriesRef.current.value === "")
            ){
                setEmpty(true);
            } else {
                setEmpty(false);
            }
        }
    }

    return (
        <div className="save-today">
            <form className="" onSubmit={handleSaveSubmit}>
                <div className="input-group">
                    <input id="weightInput" ref={weightRef} onChange={handleChange} type="number" step='0.01' min="0" max={500} placeholder="Weight" className="form-control mb-2 text-light bg-dark placeholder-light"></input>
                    <span className="input-group-text text-white bg-dark mb-2">kg</span>
                </div>
                <div className="input-group">
                    <input id={"caloriesInput"} type="number" onChange={handleChange} min={0} max={25000} ref={caloriesRef} placeholder="Calories" className="form-control mb-2 text-light bg-dark placeholder-light"></input>
                    <span className="input-group-text text-white bg-dark mb-2">kcal</span>
                </div>
                <div>
                    <button type="submit" className={"btn btn-dark text-white container-fluid border-light " + (isEmpty && "disabled")}>Save</button>
                </div>
            </form>
        </div>
    )
}