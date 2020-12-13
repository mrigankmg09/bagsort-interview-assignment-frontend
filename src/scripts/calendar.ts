let currDate: Date = new Date();
let selectedDate: Date | null;
const todayMonth: number = currDate.getMonth();
const todayYear: number = currDate.getFullYear();
const todayDate: number = currDate.getDate();
const monthYearEle: HTMLElement | null = document.querySelector(".month-year h1");
const datesDiv: HTMLElement | null = document.querySelector(".dates");
const dateDiffEle: HTMLElement | null = document.querySelector(".date-difference");
const numDatesToDisplay: number = 42;
const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const displayDates = (): void => {
    const currYear: number = currDate.getFullYear();
    const currMonth: number = currDate.getMonth();
    if(monthYearEle) {
        monthYearEle.textContent = `${months[currMonth]} ${currYear}`;
    }
    if(datesDiv) {
        let dateEle: HTMLDivElement;
        let remainingNumDatesToDisplay: number = numDatesToDisplay;
        const lastDateOfPrevMonth: number = new Date(currYear, currMonth, 0).getDate();
        const firstDayOfCurrMonth: number = new Date(currYear, currMonth, 1).getDay();
        const lastDate: Date = new Date(currYear, currMonth + 1, 0);
        const lastDateOfCurrMonth: number = lastDate.getDate();
        const dateEleClassListAndOnClickHandler = (dateToCompareTo: number, monthToCompareTo: number, yearToCompareTo: number): void => {
            if(todayYear === yearToCompareTo && todayMonth === monthToCompareTo && todayDate === dateToCompareTo) {
                dateEle.classList.add("today");
            } else {
                if(selectedDate && selectedDate.getDate() === dateToCompareTo && selectedDate.getMonth() === monthToCompareTo && selectedDate.getFullYear() === yearToCompareTo) {
                    dateEle.classList.add("selected");
                }
                dateEle.onclick = (): void => {onDateClick(dateToCompareTo, monthToCompareTo, yearToCompareTo)};
            }
        };
        //Loop to display previous month's dates
        for(let i = firstDayOfCurrMonth - 1; i >= 0; i --) {
            const date: number = lastDateOfPrevMonth - i;
            dateEle = document.createElement("div");
            dateEle.className = "prev-month-date";
            if(currMonth === 0) {
                dateEleClassListAndOnClickHandler(date, 11, currYear - 1);
            } else {
                dateEleClassListAndOnClickHandler(date, currMonth - 1, currYear);
            }
            dateEle.textContent = date.toString();
            datesDiv.appendChild(dateEle);
        }
        remainingNumDatesToDisplay -= firstDayOfCurrMonth;
        //Loop to display current month's dates
        for(let i = 1; i <= lastDateOfCurrMonth; i ++) {
            dateEle = document.createElement("div");
            dateEleClassListAndOnClickHandler(i, currMonth, currYear);
            dateEle.textContent = i.toString();
            datesDiv.appendChild(dateEle);
        }
        remainingNumDatesToDisplay -= lastDateOfCurrMonth;
        //Loop to display next month's dates
        for(let i = 1; i <= remainingNumDatesToDisplay; i ++) {
            dateEle = document.createElement("div");
            dateEle.className = "next-month-date";
            if(currMonth === 11) {
                dateEleClassListAndOnClickHandler(i, 0, currYear + 1);
            } else {
                dateEleClassListAndOnClickHandler(i, currMonth + 1, currYear);
            }
            dateEle.textContent = i.toString();
            datesDiv.appendChild(dateEle);
        }
    }
};

const resetCalendar = (): void => {
    if(datesDiv) {
        datesDiv.innerHTML = "";
    }
    displayDates();
};

const handleNextClick = (): void => {
    currDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
    resetCalendar();
};

const handlePrevClick = (): void => {
    currDate = new Date(currDate.getFullYear(), currDate.getMonth() - 1, 1);
    resetCalendar();
};

const onDateClick = (date: number, month: number, year: number): void => {
    if(!selectedDate || selectedDate.getDate() !== date || selectedDate.getMonth() !== month || selectedDate.getFullYear() !== year) {
        selectedDate = new Date(year, month, date);
        fetch('/api/date-diff', {
            method: 'POST',
            body: `${year}-${("0" + (month + 1)).slice(-2)}-${("0" + date).slice(-2)}`
        }).then((res: Response): Promise<any> | undefined => {
            if(!res.ok) {
                res.text().then(err => {
                    displayErrorBox(err);
                    console.log(err);
                });
            } else {
                return res.json();
            }
        }).then((data: string): void => {
            //Display date difference
            if(data && dateDiffEle && selectedDate) {
                const daysDiff: number = parseInt(data);
                const dayStr: string = daysDiff === 1 || daysDiff === -1 ? "day" : "days";
                if (daysDiff < 0) { 
                    dateDiffEle.textContent = `${selectedDate.toDateString()} is ${daysDiff * -1} ${dayStr} in the past!`;
                } else if (daysDiff > 0) {
                    dateDiffEle.textContent = `${selectedDate.toDateString()} is ${daysDiff} ${dayStr} in the future!`;
                }
                dateDiffEle.style.display = "block";
            }
        }).catch((err: string): void => {
            displayErrorBox(err);
            console.log(err);
        });
    } else {
        selectedDate = null;
        if(dateDiffEle) {
            dateDiffEle.style.display = "none";
            dateDiffEle.textContent = null;
        }
    }
    resetCalendar();
};

displayDates();