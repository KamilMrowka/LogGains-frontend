import { homePageResponse, dayData } from '../pages/HomePage'

export interface graphData {
    dayData: dayData[],
    lowestWeight: number,
    highestWeight: number,
}

export default function constructData({ dayList, weekDays }: homePageResponse) {
    let dayData: dayData[] = [];
    let counter = 0;
    let dayListLength = dayList.length;
    let lowestWeight: number = 0;
    let highestWeight: number = 0;

    if (dayListLength > 0) {
        lowestWeight = dayList[counter].weightMeasurement;
        highestWeight = dayList[counter].weightMeasurement;
    }
    weekDays.forEach(day => {
        const shortWeekDayDate: string = day.split('-')[2] + '.'  + day.split('-')[1];
        if (dayListLength > 0) {

            const dayDate = dayList[counter].date.split('-');
            const shortDayDate = dayDate[2] + '.' + dayDate[1];

            if (shortWeekDayDate == shortDayDate) {                                        
                const weightMeasurement = dayList[counter].weightMeasurement;

                if (weightMeasurement < lowestWeight) {
                    lowestWeight = weightMeasurement;
                } 
                if (weightMeasurement > highestWeight) {
                    highestWeight = weightMeasurement;
                }

                const day: dayData = {
                    date: shortWeekDayDate,
                    weight: (weightMeasurement != 0 ? weightMeasurement : null)
                }
                dayData.push(day);
                if (counter < dayListLength - 1) {
                    counter++;
                } 
            } else {
                dayData.push({
                    date: shortWeekDayDate,
                    weight: null,
                })
            }

        } else {
            dayData.push({
                date: shortWeekDayDate,
                weight: null,
            })
        }
    })
    const data: graphData = {
        dayData: dayData,
        lowestWeight: lowestWeight,
        highestWeight: highestWeight,
    }

    return data;
}