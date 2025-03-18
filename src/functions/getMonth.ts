interface Props {
    currentMonth?: string,
    plusMonths?: number,
}

export default function getMonth({ currentMonth, plusMonths }: Props): string {
    if (currentMonth && plusMonths !== undefined) {
        const [monthStr, yearStr] = currentMonth.split("-");
        const monthInt: number = parseInt(monthStr);
        const yearInt: number = parseInt(yearStr);

        let newMonth = monthInt + plusMonths;
        let newYear = yearInt;

        if (newMonth > 12) {
            newMonth -= 12;
            newYear += 1;
        } else if (newMonth < 1) {
            newMonth += 12;
            newYear -= 1;
        }

        return `${newMonth.toString().padStart(2, '0')}-${newYear}`;
    } else {
        const date: Date = new Date();
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    }
}