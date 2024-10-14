import { Analysis } from "../pages/HomePage";

interface Props {
    periodOneAnalysis: Analysis,
    periodTwoAnalysis: Analysis,
    scope: "calories" | "weight",
}

export default function ComparisonElement({ periodOneAnalysis, periodTwoAnalysis, scope }: Props) {

    const getDifference = (valueOne: number, valueTwo: number, unit: "kg" | "kcal") => {

        if (valueOne === 0 || valueTwo === 0) {
            return;
        }

        const diff = Math.round((valueTwo - valueOne) * 100) / 100;

        if (diff < 0) {
            return (
                <span className="fs-5 ms-2"><br></br>== {diff * -1 + unit}<span className="my-green"> less.</span></span>
            );
        } else {
            return (
                <span className="fs-5 ms-2"><br></br>== {diff + unit}<span className="text-danger"> more.</span></span>
            );
        }
    }


    if (periodOneAnalysis && !periodTwoAnalysis) {
        return (
            <div className="w-100">
                {   scope === "weight" &&
                    <div className="w-100">
                        <div className="d-flex mb-3">
                            <i className="bi bi-circle-fill my-green me-3 mt-2"></i>
                            <span className="fs-4">Median weight: {periodOneAnalysis.medianWeight}kg</span>
                        </div>
                        <div className="d-flex mb-3">
                            <i className="bi bi-circle-fill my-green me-3 mt-2"></i>
                            <span className="fs-4">Lowest weight: {periodOneAnalysis.lowestWeight}kg</span>
                        </div>
                        <div className="d-flex mb-3">
                            <i className="bi bi-circle-fill my-green me-3 mt-2"></i>
                            <span className="fs-4">Highest weight: {periodOneAnalysis.highestWeight}kg</span>
                        </div>
                    </div>
                }
                {
                    scope === "calories" &&
                    <div className="d-flex mb-3">
                        <i className="bi bi-circle-fill my-green me-3 mt-2"></i>
                        <span className="fs-4">Average calories: {periodOneAnalysis.averageCalories}kcal</span>
                    </div>
                }
            </div>
        );
    } else if (periodOneAnalysis && periodTwoAnalysis) {
        return (
            <div className="w-100">
                {
                    scope === "weight" &&
                    <div className="d-flex mb-1">
                        <i className="bi bi-circle-fill my-green me-3 mt-2"></i>
                        <span className="fs-5">Median weight: 
                            {
                                periodOneAnalysis.medianWeight != 0 &&
                                <span className="my-green ms-2">
                                    {periodOneAnalysis.medianWeight}kg
                                </span> 
                            }
                            {
                                periodTwoAnalysis.medianWeight != 0 &&
                                <span className="my-purple ms-2">
                                    {
                                        (periodOneAnalysis.medianWeight != 0 && periodTwoAnalysis.medianWeight !=0) &&
                                        <span className="text-white">/ </span>
                                    }
                                    {periodTwoAnalysis.medianWeight}kg
                                </span>
                            }
                            {getDifference(periodOneAnalysis.medianWeight, periodTwoAnalysis.medianWeight, "kg")}
                        </span>
                    </div>
                }
                {
                    scope === "calories" &&
                    <div className="d-flex mb-1 mt-4">
                        <i className="bi bi-circle-fill my-green me-3 mt-2"></i>
                        <span className="fs-5">Average calories: 
                            {
                                periodOneAnalysis.averageCalories != 0 &&
                                <span className="my-green ms-2">
                                    {periodOneAnalysis.averageCalories}kcal
                                </span> 
                            }
                            {
                                periodTwoAnalysis.averageCalories != 0 &&
                                <span className="my-purple ms-2">
                                    {
                                        (periodOneAnalysis.averageCalories != 0 && periodTwoAnalysis.averageCalories !=0) &&
                                        <span className="text-white">/ </span>
                                    }
                                    {periodTwoAnalysis.averageCalories}kcal
                                </span>
                            }
                            {getDifference(periodOneAnalysis.averageCalories, periodTwoAnalysis.averageCalories, "kcal")}
                        </span>
                    </div>
                }
                {
                    scope === "weight" &&
                    <div className="d-flex mb-1 mt-4">
                        <i className="bi bi-circle-fill my-green me-3 mt-2"></i>
                        <span className="fs-5">Lowest weight: 
                            {
                                periodOneAnalysis.lowestWeight != 0 &&
                                <span className="my-green ms-2">
                                    {periodOneAnalysis.lowestWeight}kg
                                </span> 
                            }
                            {
                                periodTwoAnalysis.lowestWeight != 0 &&
                                <span className="my-purple ms-2">
                                    {
                                        (periodOneAnalysis.lowestWeight != 0 && periodTwoAnalysis.lowestWeight !=0) &&
                                        <span className="text-white">/ </span>
                                    }
                                    {periodTwoAnalysis.lowestWeight}kg
                                </span>
                            }
                            {getDifference(periodOneAnalysis.lowestWeight, periodTwoAnalysis.lowestWeight, "kg")}
                        </span>
                    </div>
                }
                {
                    scope == "weight" &&
                    <div className="d-flex mb-3 mt-4">
                        <i className="bi bi-circle-fill my-green me-3 mt-2"></i>
                        <span className="fs-5">Highest weight: 
                            {
                                periodOneAnalysis.highestWeight != 0 &&
                                <span className="my-green ms-2">
                                    {periodOneAnalysis.highestWeight}kg
                                </span> 
                            }
                            {
                                periodTwoAnalysis.highestWeight != 0 &&
                                <span className="my-purple ms-2">
                                    {
                                        (periodOneAnalysis.highestWeight != 0 && periodTwoAnalysis.highestWeight !=0) &&
                                        <span className="text-white">/ </span>
                                    }
                                    {periodTwoAnalysis.highestWeight}kg
                                </span>
                            }
                            {getDifference(periodOneAnalysis.highestWeight, periodTwoAnalysis.highestWeight, "kg")}
                        </span>
                    </div>
                }
            </div>
        );
    }

    return (
        <></>
    );
}