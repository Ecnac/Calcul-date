//*************** FEES CALCULATION **************//

const calculateDifference = () => {
    const currentDateTimeValue = document.getElementById('currentDateTime').value;
    const date2Value = document.getElementById('date2').value;

    if (!currentDateTimeValue || !date2Value) {
        alert('Veuillez entrer des dates valides.');
        return;
    }

    const currentDateTime = new Date(currentDateTimeValue);
    const date2 = new Date(date2Value);

    const diffInMilliseconds = Math.abs(date2 - currentDateTime);
    const millisecondsInMinute = 1000 * 60;
    const millisecondsInHour = millisecondsInMinute * 60;
    const millisecondsInDay = millisecondsInHour * 24;

    const days = Math.floor(diffInMilliseconds / millisecondsInDay);
    const hours = Math.floor((diffInMilliseconds % millisecondsInDay) / millisecondsInHour);
    const minutes = Math.floor((diffInMilliseconds % millisecondsInHour) / millisecondsInMinute);

    const fees = days <= 11 ? 100 : days <= 45 ? 50 : 0;

    document.getElementById('result').innerHTML =
        `${days} jours, ${hours} heures et ${minutes} minutes. 
        <br />         
        Frais à ${fees}%.`;
}


//*************** KEY DATES CALCULATION **************//

const keyDates = () => {
    const travelDateInput = document.getElementById('travelDate').value;
    const service = document.getElementById('services').value;

    if (!travelDateInput || !service) {
        alert("Veuillez entrer une date de voyage et sélectionner un service.");
        return;
    }

    const travelDate = new Date(travelDateInput);
    const currentDate = new Date();
    const diffInDays = (travelDate - currentDate) / (1000 * 60 * 60 * 24);

    console.log(`diffInDays: ${diffInDays}`);

    let validationDeadLine = document.getElementById('validationDeadLine');
    let paymentDeadLine = document.getElementById('paymentDeadLine');

    const setDeadline = (daysToAdd, targetDate = currentDate, element, includeTime = false, setToNoon = false, customTime = null) => {
        const date = new Date(targetDate);
        date.setDate(date.getDate() + daysToAdd);

        if (setToNoon) {
            date.setHours(12, 0, 0, 0);
        }

        if (customTime) {
            date.setHours(customTime.getHours(), customTime.getMinutes(), 0, 0);
        }

        const options = includeTime ? { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' } : { year: 'numeric', month: 'numeric', day: 'numeric' };
        element.textContent = `${element.id.includes('validation') ? 'Date de validation de devis' : 'Date limite de paiement'}: ${date.toLocaleString(undefined, options)}`;
    };

    if (service === "SNCF") {
        if (diffInDays >= 101) {
            setDeadline(30, currentDate, validationDeadLine);
        } else if (diffInDays >= 80) {
            setDeadline(15, currentDate, validationDeadLine);
        } else if (diffInDays >= 35) {
            setDeadline(5, currentDate, validationDeadLine);
        } else if (diffInDays >= 12) {
            setDeadline(1, currentDate, validationDeadLine);
        } else {
            validationDeadLine.textContent = 'Validation de devis immédiate';
        }

        if (diffInDays >= 65) {
            setDeadline(-45, travelDate, paymentDeadLine, true);
        } else if (diffInDays >= 30) {
            setDeadline(20, currentDate, paymentDeadLine, true, false, travelDate);
        } else if (diffInDays >= 12) {
            setDeadline(-10, travelDate, paymentDeadLine, true);
        } else {
            paymentDeadLine.textContent = 'Paiement immédiat';
        }
    } else if (service === "OUIGO") {
        setDeadline(2, currentDate, validationDeadLine);
        setDeadline(6, currentDate, paymentDeadLine, true, true);
    }
}
