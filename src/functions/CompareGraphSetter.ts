import { GraphData } from "../pages/HomePage";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";

interface Props {
    periodOneDataSet: GraphData[] | null,
    periodTwoDataSet: GraphData[] | null,
    refObject: React.MutableRefObject<HTMLCanvasElement | null>,
    datasets: "calories" | "weight",
    periodLen: "week" | "month"
}

export default function compareGraphSetter( { periodOneDataSet, periodTwoDataSet, refObject, datasets, periodLen}: Props) {
    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

    if (!periodOneDataSet && !periodTwoDataSet) {
        return null;
    }

    if (!periodOneDataSet) {
        return null;
    }

    const getDatasetsType = () => {
        return datasets;
    }


    const getTooltipLabelFromDataset = (datasetIndex: number, index: number): string => {
        if (datasetIndex == 0) {
            if (index > periodOneDataSet.length - 1) {
                return "";
            } else {
                const item = periodOneDataSet.at(index);
                return (datasets === "weight" ? "Weight at: " : "Calories at: ") + item?.date + ": " + (datasets === "weight" ? (item?.weight + "kg") : (item?.calories + "kcal"));
            }
        } else {
            if (periodTwoDataSet) {
                if (index > periodTwoDataSet.length - 1) {
                    return "";
                } else {
                    const item = periodTwoDataSet.at(index);
                    return (datasets === "weight" ? "Weight at: " : "Calories at: ") + item?.date + ": " + (datasets === "weight" ? (item?.weight + "kg") : (item?.calories + "kcal"));
                }
            } else {
                return "";
            }
        }
    }


    const getDataset = (data: GraphData[]) => {
        if(datasets === "calories") {
           return data.map(d => d.calories > 0 ? d.calories : null);
        } else {
            return data.map(d => d.weight > 0 ? d.weight : null);
        }
    }

    const getLabels = (): string[] => {
        if(periodLen === "week") {
            return [
                "MON",
                "TUE",
                "WEN",
                "THU",
                "FRI",
                "SAT",
                "SUN"
            ];
        } else {
            if (periodOneDataSet && !periodTwoDataSet) {
                return periodOneDataSet.map(day => day.date);
            } else if (periodOneDataSet && periodTwoDataSet) {
                const perOneLen = periodOneDataSet.length;
                const perTwoLen = periodTwoDataSet.length;

                if (perOneLen > perTwoLen) {
                    return periodOneDataSet.map(day => day.date);
                } else {
                    return periodTwoDataSet.map(day => day.date);
                }
            }
        }
        return [];
    }

    const getTooltipTitle = (index: number, dataset: 1 | 2) => {
        if (dataset === 1) {
            return "Date: " + periodOneDataSet.at(index)?.date
        } else {
            if (periodTwoDataSet) {
                return "Date: " + periodTwoDataSet.at(index)?.date
            } else {
                return "";
            }
        }
    }

    const getTooltipLabel = (index: number, dataset: 1 | 2) => {
        if (dataset === 1) {
            return datasets === "weight" ? "Weight: " + periodOneDataSet.at(index)?.weight + "kg" : "Calories: " + periodOneDataSet.at(index)?.calories + "kcal"
        }
    }

    const lowestY = getDataset(periodOneDataSet).reduce((min, current) => {
        if (current == null) return min;
        const lowest = Math.min(min ? min : 999, current ? current : 0);
        return lowest;
    });


    const highestY = getDataset(periodOneDataSet).reduce((max, current) => {
        if (current == null) return max;
        const highest = Math.max(max ? max : 0, current ? current : 0);
        return Math.floor(highest + highest * 0.05);  
    });

    if (periodOneDataSet && !periodTwoDataSet) {
        if (refObject.current) {
            const ctx = refObject.current.getContext('2d');
            if (ctx) {
                return new Chart(
                    ctx,
                    {
                        type: 'line',
                        data: {
                            labels: getLabels(),
                            datasets: [
                              {
                                data: getDataset(periodOneDataSet),
                                borderColor: 'rgb(00, 191, 100)',
                                tension: 0.3,
                              },
                            ]
                        },
                        options: {
                            plugins: {
                                tooltip: {
                                    enabled: true,
                                    intersect: false,
                                    mode: "index",
                                    callbacks: {
                                        label: function(tooltipItems) {
                                            const index = tooltipItems.dataIndex;
                                            return getTooltipLabel(index, 1);
                                        },
                                        title: function(tooltipItems) {
                                            const index = tooltipItems[0].dataIndex;
                                            return getTooltipTitle(index, 1);
                                        }
                                    }
                                }
                            },
                            spanGaps: true,
                            scales: {
                                x: {
                                    type: "category",
                                    grid: {
                                        color: 'rgba(70, 70, 70)'
                                    },
                                    ticks: {
                                        callback: function(value, index, ticks): string {
                                            const chart = this.chart as Chart;
                                            if (periodLen === "month" && chart.data.labels) {
                                                if (chart.data.labels && (index === 0 || index === ticks.length -1)) {
                                                    // chart.data.labels is possibly undefined ts(2532)
                                                    return chart.data.labels[index] as string;
                                                }
                                                return "-";
                                            } else if (chart.data.labels) {
                                                return chart.data.labels[index] as string;
                                            }
                                            return "";
                                        },
                                        color: 'white',
                                    },
                                },
                                y: {
                                    grid: {
                                        color: 'rgba(70, 70, 70)'
                                    },
                                    ticks: {
                                        color: 'white', 
                                        callback: function(value) {
                                            return value + ((getDatasetsType() === "weight") ? "kg" : "kcal");
                                        },
                                    },
                                    min: lowestY ? (lowestY - 10 >= 0 && lowestY != 999 ? lowestY - 10 : 0) : 0,
                                    max: highestY ? highestY + 10 : 100,
                                    beginAtZero: false,
                                },
                            },
                        }
                    }
                )
            }
        }
    } else if (periodOneDataSet && periodTwoDataSet) {
        if (refObject.current) {
            const ctx = refObject.current.getContext('2d');
            if (ctx) {
                return new Chart(
                    ctx,
                    {
                        type: 'line',
                        data: {
                            labels: getLabels(),
                            datasets: [
                              {
                                data: getDataset(periodOneDataSet),
                                borderColor: 'rgb(00, 191, 100)',
                                tension: 0.3,
                              },
                              {
                                data: getDataset(periodTwoDataSet),
                                borderColor: 'rgb(160, 32, 240)',
                                tension: 0.3,
                              }
                            ]
                        },
                        options: {
                            plugins: {
                                tooltip: {
                                    enabled: true,
                                    intersect: false,
                                    mode: "index",
                                    callbacks: {
                                        title: function(tooltipItems) {
                                            return tooltipItems[0].label;
                                        },
                                        label: function(tooltipItem) {
                                            const datasetIndex = tooltipItem.datasetIndex;
                                            const index = tooltipItem.dataIndex;
                                            return getTooltipLabelFromDataset(datasetIndex, index);
                                        }
                                    }
                                }
                            },
                            spanGaps: true,
                            scales: {
                                x: {
                                    type: "category",
                                    grid: {
                                        color: 'rgba(70, 70, 70)'
                                    },
                                    ticks: {
                                        callback: function(value, index, ticks): string {
                                            const chart = this.chart as Chart;
                                            if (periodLen === "month" && chart.data.labels) {
                                                if (chart.data.labels && (index === 0 || index === ticks.length -1)) {
                                                    // chart.data.labels is possibly undefined ts(2532)
                                                    return chart.data.labels[index] as string;
                                                }
                                                return "-";
                                            } else if (chart.data.labels) {
                                                return chart.data.labels[index] as string;
                                            }
                                            return "";
                                        },
                                        color: 'white',
                                    },
                                },
                                y: {
                                    grid: {
                                        color: 'rgba(70, 70, 70)'
                                    },
                                    ticks: {
                                        color: 'white', 
                                        callback: function(value) {
                                            return value + ((getDatasetsType() === "weight") ? "kg" : "kcal");
                                        },
                                    },
                                    min: lowestY ? (lowestY - 10 >= 0 && lowestY != 999 ? lowestY - 10 : 0) : 0,
                                    max: highestY ? highestY + 10 : 100,
                                    beginAtZero: false,
                                },
                            },
                        }
                    }
                )
            }
        }
    }
    return null;
}