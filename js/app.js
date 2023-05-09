const dateInputs = document.querySelectorAll('.input-container input');
const ageSpans = document.querySelectorAll('.age p span');
const viewErrors = document.querySelectorAll('.error');

let inputDate = {};
const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let date = new Date();
const getBirthDate = () => {
    dateInputs.forEach(dateInput => {
        inputDate[dateInput.id] = dateInput.value;
    });
    calculateAge();
}

const calculateAge = () => {
    let d2 = date.getDate();
    let m2 = date.getMonth() + 1;
    let y2 = date.getFullYear();
    let d1 = inputDate.day;
    let m1 = inputDate.month;
    let y1 = inputDate.year;

    // blank paragraphs that view errors before making other process
    viewErrors.forEach(viewError => {
        viewError.innerText = '';
    })

    // blank the number before we start the program again
    ageSpans.forEach(span => {
        span.innerText = '- -'
    })
    // function to check for all posable errors
    let error = checkForErrors(d1, m1, y1);

    // if no errors the program proceeds
    if (error === 'no error') {
        /* pass the old and new years to calculate
         the number of leap years between them*/
        let noOfLeapYears = calculateLeapYear(y2, y1, m2);
        // handle if input day > today
        if (d2 < d1) {
            d2 += months[m2 - 1];
            m2--;
        }
        // handle if input month > this month
        if (m2 < m1) {
            m2 += 12;
            y2--;
        }

        // calculate the age
        let d = (d2 - d1) + noOfLeapYears;
        let m = m2 - m1;
        let y = y2 - y1;

        /*
        after taking extra days of leap year we chick 
        if the days proceeded 31 if that happened 
        we add to month 1 and subtract 30 from days
         */
        while (d > 30) {
            d -= 30;
            m++;
        }

        // finally we display age
        displayAge([y, m, d]);
    }
    else {
        viewErrors.forEach(viewError => {
            if(viewError.classList.contains(error[0]))
                viewError.innerText = error[1];
        })
    }
}

const calculateLeapYear = (y2, y1, m) => {
    let noOfLeapYears = 0;
    if (m > 2)
        y2++;
    for (let i = y1; i < y2; i++) {
        if (i % 4 === 0 && (i % 100 !== 0 || i % 400 === 0))
            noOfLeapYears++;
    }
    return noOfLeapYears;
}

const displayAge = (age) => {
    ageSpans.forEach((ageSpan, index) => {
        ageSpan.innerText = age[index];
    })
}

const checkForErrors = (d, m, y) => {
    /*
        make copy of months 
        (we will need to edit it so we shouldn't edit the original )
    */ 
    copyOfMonths = [...months];
    // error in input datatype
    if (d === '')
        return ['day-error', 'this field is required'];

    if (m === '')
        return ['month-error', 'this field is required'];

    if (y === '')
        return ['year-error', 'this field is required'];

     // validate that input is a number
     let validate = /\d+/;
     if(!(validate.test(d) && validate.test(m) && validate.test(y)))
        return ['day-error', 'must be a valid date'];

    // error in getting over the valid input
    if (parseInt(d) > 31)
        return ['day-error', 'must be a valid day'];

    if (parseInt(m) > 12)
        return ['month-error', 'must be a valid month'];

    if (parseInt(y) > date.getFullYear())
        return ['year-error', 'must be in the past'];


    // wrong date error
    if(parseInt(y) % 4 === 0 && (parseInt(y) % 100 !== 0 || parseInt(y) % 400 === 0))
        copyOfMonths[1] = 29; // to make FEB = 29 if the year is leap
    if (d > copyOfMonths[m - 1])
        return ['day-error', 'must be a valid date'];
    return 'no error';

}
const btn = document.querySelector('.calc-age-btn');
btn.addEventListener('click', (e) => {
    e.preventDefault();
    getBirthDate();
})