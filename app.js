// app.js

function calculateDifference() {
    const date1 = new Date(document.getElementById('date1').value);
    const date2 = new Date(document.getElementById('date2').value);

    if (isNaN(date1) || isNaN(date2)) {
        document.getElementById('result').textContent = 'Veuillez entrer des dates valides.';
        return;
    }

    const diffInMilliseconds = Math.abs(date2 - date1);

    const millisecondsInMinute = 1000 * 60;
    const millisecondsInHour = millisecondsInMinute * 60;
    const millisecondsInDay = millisecondsInHour * 24;

    const days = Math.floor(diffInMilliseconds / millisecondsInDay);
    const hours = Math.floor((diffInMilliseconds % millisecondsInDay) / millisecondsInHour);
    const minutes = Math.floor((diffInMilliseconds % millisecondsInHour) / millisecondsInMinute);

    let fees = 0;
    if (days <= 11) {
        fees = 100;
    } else if (days <= 45) {
        fees = 50;
    }

    document.getElementById('result').innerHTML =
        `${days} jours, ${hours} heures et ${minutes} minutes. 
        <br />         
        Frais à ${fees}%.`
}
