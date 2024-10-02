interface Props {
    medianWeight: number,
    averageKcal: number,
    lowestWeight: number,
    highestWeight: number,
}

export default function( { medianWeight, averageKcal, lowestWeight, highestWeight }: Props) {
    return(
        <>
            <div className="d-flex my-3">
                <i className="bi bi-circle-fill text-log-green pe-4"></i>
                <div>Median weight: { medianWeight }kg</div>
            </div>
            <div className="d-flex my-3">
                <i className="bi bi-circle-fill text-log-green pe-4"></i>
                <div>Lowest weight: { lowestWeight }kg</div>
            </div>
            <div className="d-flex my-3">
                <i className="bi bi-circle-fill text-log-green pe-4"></i>
                <div>Highest weight: { highestWeight }kg</div>
            </div>
            <div className="d-flex my-3">
                <i className="bi bi-circle-fill text-log-green pe-4"></i>
                <div>Average calories: { averageKcal }kcal</div>
            </div>

        </>
    )
}