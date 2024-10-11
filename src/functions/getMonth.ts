interface Props {
    currentMonth?: String,
    plusMonths?: number,
}

export default function getMonth({ currentMonth, plusMonths }: Props): string {

    if (currentMonth && plusMonths) {
        const monthInt: number = parseInt(currentMonth.split("-")[0]);
        const yearInt: number = parseInt(currentMonth.split("-")[1]);

        if (plusMonths + monthInt > 12 && plusMonths + monthInt > 1) {
            const newMonth = plusMonths + monthInt - 12;
            const newYear = yearInt + 1;

            return (newMonth > 9 ? newMonth : "0" + newMonth) + "-" + newYear;
        } else if (plusMonths + monthInt < 1) {
            const newMonth = plusMonths + monthInt + 12;
            const newYear = yearInt - 1;

            return (newMonth > 9 ? newMonth : "0" + newMonth) + "-" + newYear;
        } else {
            return ((monthInt + plusMonths) > 9 ? (monthInt + plusMonths) : "0" + (monthInt + plusMonths)) + "-" + yearInt;
        }
    } else {
        const date: Date = new Date();
        return (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + date.getMonth() + 1) + "-" + date.getFullYear();
    }

}