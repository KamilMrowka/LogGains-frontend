import { Today } from "../pages/HomePage"

export default function( { weight, calories }: Today ) {
    return (
        <div className="col-7">
            <div className="d-flex flex-row mt-2 pt-1 mb-3">
                <i className="bi bi-circle-fill text-log-green pe-4"></i>
                <div>Weight: { weight }kg</div>
            </div>
            <div className="d-flex flex-row mt-3 mb-3">
                <i className="bi bi-circle-fill text-log-green pe-4"></i>
                <div className="mb-1">Calories: { calories }kcal</div>
            </div>
            <button className="btn btn-dark text-white container-fluid border-light mt-2">Update</button>
        </div>
    )
}