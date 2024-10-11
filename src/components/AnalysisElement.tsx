import { Analysis } from "../pages/HomePage";

interface Props {
    data: Analysis,
    header: string,
    header2?: string
}

export default function AnalysisElement ( { data, header, header2 }: Props) {
    return (
        <div className="w-100 text-white">
            <h2>{header}</h2>
            {
                header2 && <h2>{header2}</h2>
            }
            <div className="d-flex mb-3 mt-3">
                <i className="bi bi-circle-fill text-log-green pe-3"></i>
                <p className="mb-1">Average calories a day: { data.averageCalories }kcal</p>
            </div>
            <div className="d-flex mb-3">
                <i className="bi bi-circle-fill text-log-green pe-3"></i>
                <p className="mb-1">Median weight: { data.medianWeight }kg</p>
            </div>
            <div className="d-flex mb-3">
                <i className="bi bi-circle-fill text-log-green pe-3"></i>
                <p className="mb-1">Lowest weight: { data.lowestWeight }kg</p>
            </div>
            <div className="d-flex mb-3">
                <i className="bi bi-circle-fill text-log-green pe-3"></i>
                <p className="mb-1">Hightest weight: { data.highestWeight }kg</p>
            </div>

        </div>
    )
}