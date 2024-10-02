import { Today } from "../pages/HomePage"
interface Props {
    today: Today,
    onClickFunction: React.MouseEventHandler<HTMLButtonElement>,
}

export default function( { today, onClickFunction } : Props) {
    return (
        <div>
            <div className="d-flex my-3">
                <i className="bi bi-circle-fill text-log-green pe-4"></i>
                <div>Weight: { today.weight ? today.weight : 0 }kg</div>
            </div>
            <div className="d-flex my-3">
                <i className="bi bi-circle-fill text-log-green pe-4"></i>
                <p className="mb-1">Calories: { today.calories }kcal</p>
            </div>
            <button onClick={onClickFunction} className="btn btn-dark btn-update border-light mt-2">Update</button>
        </div>
    )
}