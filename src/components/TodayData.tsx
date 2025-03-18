import { useState } from "react";
import { GraphData } from "../pages/HomePage"
import axios from "axios";
import {getStoreValue, storeKeys} from "../functions/store.ts";
interface Props {
    today: GraphData,
    onClickFunction: React.MouseEventHandler<HTMLButtonElement>,
    customDeleteDate: string,
    setOnClickTrigger:React.Dispatch<React.SetStateAction<boolean>>
}


export default function( { today, onClickFunction, customDeleteDate, setOnClickTrigger } : Props) {

    const [deleting, setDeleting] = useState(false);

    const onClickDeleteButton = () => {
        setDeleting(true);
    }

    const onClickCancelDelete = () => {
        setDeleting(false);
    }

    const onDelete = async () => {

        await axios.delete(getStoreValue(storeKeys.baseUrl) + "/day", {
            data: customDeleteDate,
            headers: {
                    "Authorization": "Bearer " + localStorage.getItem('420token')}
        })
        .then(() => {
            window.location.reload();
        })
        .catch(() => {

        });
    }

    return (
        <>
        {
            !deleting &&
            <div className="text-white w-100">
                <div className="d-flex mt-3 mb-2">
                    <i className="bi bi-circle-fill text-log-green pe-3"></i>
                    <div>Weight: { today.weight ? today.weight : 0 }kg</div>
                </div>
                <div className="d-flex mt-2 mb-2">
                    <i className="bi bi-circle-fill text-log-green pe-3"></i>
                    <p className="mb-1">Calories: { today.calories }kcal</p>
                </div> 
                <div className="d-flex w-100">
                    <button onClick={onClickFunction} className="btn btn-dark btn-update border-light mt-2">Update</button>
                    <button onClick={onClickDeleteButton} className="btn btn-danger text-white btn-delete mt-2 border-light"><i className="bi bi-trash3 text-white"></i></button>
                </div>
            </div>
        }
        {
            deleting &&
            <div className="w-100 text-white">
                <div className="alert alert-danger" role="alert">Are you sure you want to delete {today.date}'s measurements?</div>
                <div className="w-100 d-flex flex-row justify-content-between">
                    <button onClick={onClickCancelDelete} className="btn btn-success">No, cancel!</button>
                    <button onClick={onDelete} className="btn btn-outline-danger">Yes, I want to delete.</button>
                </div>
            </div>
        }
        </>
        
    )
}