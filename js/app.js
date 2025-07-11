//*************** FEES CALCULATION **************//



// Afficher/masquer les options Lyria selon le service sélectionné
document.addEventListener('DOMContentLoaded', function () {
    const serviceSelect = document.getElementById('services');
    const lyriaOptions = document.getElementById('lyria-options');

    // Cacher au départ
    lyriaOptions.style.display = 'none';

    serviceSelect.addEventListener('change', function () {
      if (this.value === 'TGV LYRIA') {
        lyriaOptions.style.display = 'block';
      } else {
        lyriaOptions.style.display = 'none';
      }
    });
  });

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

        const service = document.getElementById('services').value;
        let fees = days;

        if (service === "") {
            alert("Veuillez sélectionner un service valide");
            return;
        }

        if (service === "TGV INOUI") {
            fees = days <= 11 ? 100 : days <= 45 ? 50 : 0;
        }

        if (service === "TGV LYRIA") {
           /* const lyriaType = document.querySelector('input[name="lyriaType"]:checked');
            if (!lyriaType) {
                alert("Veuillez sélectionner un canal de vente pour TGV LYRIA.");
                return;
            } */

           // if (lyriaType.value === "AGS") {
                fees = days <= 7 ? 100 : days <= 29 ? 30 : 20;
           /* } else if (lyriaType.value === "VEG") {
                fees = days <= 11 ? 100 : days <= 29 ? 30 : days <= 45 ? 20 : 0;
            } */
         }

        if (service === "TGV FRANCE-ESPAGNE/ITALIE") {
                fees = days <= 11 ? 100 : days <= 29 ? 50 : 25;
        }

        if (service === "TER NOMAD") {
            fees = days <= 11 ? 100 : days <= 29 ? 50 : 0;
        }

        document.getElementById('result').innerHTML =
            `${days} jours, ${hours} heures et ${minutes} minutes.<br />Frais à ${fees}%.`;

    };


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

    const elements = {
        validation: document.getElementById('validationDeadLine'),
        payment: document.getElementById('paymentDeadLine'),
        earlyFees: document.getElementById('earlyFeesContainer'),
        partialFees: document.getElementById('partialFeesContainer'),
        fullFees: document.getElementById('fullFeesContainer'),
    };

    const formatDate = (date, withTime = false) => {
        const options = withTime
            ? { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }
            : { year: 'numeric', month: 'numeric', day: 'numeric' };
        return date.toLocaleString(undefined, options);
    };

    const setDeadline = ({ baseDate, offsetDays, element, label, withTime = false, setToNoon = false }) => {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + offsetDays);
        if (setToNoon) date.setHours(12, 0, 0, 0);
        element.textContent = `${label} : ${formatDate(date, withTime)}`;
    };

    const setFee = (daysBefore, percentage, container, options = {}) => {
    const { immediate = false } = options;
    const feeDate = new Date(travelDate);
    feeDate.setDate(feeDate.getDate() - daysBefore);

    if (!immediate) {
        feeDate.setMinutes(feeDate.getMinutes() + 1); // +1 min uniquement si ce n'est pas immédiat
    }

    const now = new Date();
    let text = "";

    if (immediate) {
        text = `Frais de ${percentage}% dès le paiement, jusqu’au ${formatDate(feeDate, true)}`;
    } else {
        if (now >= feeDate) {
            text = `Frais à ${percentage}% : En application depuis le ${formatDate(feeDate, true)}`;
        } else {
            text = `Frais à ${percentage}% : à partir du ${formatDate(feeDate, true)}`;
        }
    }

    container.textContent += text + '\n';
};




    

    // Réinitialiser les champs de frais
    elements.earlyFees.textContent = '';
    elements.partialFees.textContent = '';
    elements.fullFees.textContent = '';

    if (service === "TGV INOUI") {
        if (diffInDays >= 101) {
            setDeadline({ baseDate: currentDate, offsetDays: 30, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 80) {
            setDeadline({ baseDate: currentDate, offsetDays: 15, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 35) {
            setDeadline({ baseDate: currentDate, offsetDays: 5, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 12) {
            setDeadline({ baseDate: currentDate, offsetDays: 1, element: elements.validation, label: "Date de validation de devis" });
        } else {
            elements.validation.textContent = 'Validation de devis immédiate';
        }

        if (diffInDays >= 65) {
            setDeadline({ baseDate: travelDate, offsetDays: -45, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else if (diffInDays >= 30) {
            setDeadline({ baseDate: currentDate, offsetDays: 20, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else if (diffInDays >= 12) {
            setDeadline({ baseDate: travelDate, offsetDays: -10, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else {
            elements.payment.textContent = 'Paiement immédiat';
        }

        setFee(46, 50, elements.partialFees);
        setFee(12, 100, elements.fullFees);
    }

    else if (service === "TER NOMAD") {
        if (diffInDays >= 101) {
            setDeadline({ baseDate: currentDate, offsetDays: 30, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 80) {
            setDeadline({ baseDate: currentDate, offsetDays: 15, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 35) {
            setDeadline({ baseDate: currentDate, offsetDays: 5, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 12) {
            setDeadline({ baseDate: currentDate, offsetDays: 1, element: elements.validation, label: "Date de validation de devis" });
        } else {
            elements.validation.textContent = 'Validation de devis immédiate';
        }

        if (diffInDays >= 65) {
            setDeadline({ baseDate: travelDate, offsetDays: -45, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else if (diffInDays >= 30) {
            setDeadline({ baseDate: currentDate, offsetDays: 20, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else if (diffInDays >= 12) {
            setDeadline({ baseDate: travelDate, offsetDays: -10, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else {
            elements.payment.textContent = 'Paiement immédiat';
        }

        setFee(30, 50, elements.partialFees);
        setFee(12, 100, elements.fullFees);
    }

    else if (service === "TGV FRANCE-ESPAGNE/ITALIE") {
        if (diffInDays >= 101) {
            setDeadline({ baseDate: currentDate, offsetDays: 30, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 80) {
            setDeadline({ baseDate: currentDate, offsetDays: 15, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 35) {
            setDeadline({ baseDate: currentDate, offsetDays: 5, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 12) {
            setDeadline({ baseDate: currentDate, offsetDays: 1, element: elements.validation, label: "Date de validation de devis" });
        } else {
            elements.validation.textContent = 'Validation de devis immédiate';
        }

        if (diffInDays >= 65) {
            setDeadline({ baseDate: travelDate, offsetDays: -45, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else if (diffInDays >= 30) {
            setDeadline({ baseDate: currentDate, offsetDays: 20, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else if (diffInDays >= 12) {
            setDeadline({ baseDate: travelDate, offsetDays: -10, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else {
            elements.payment.textContent = 'Paiement immédiat';
        }
        setFee(31, 25, elements.earlyFees, { immediate: true });   
        setFee(31, 50, elements.partialFees);                      
        setFee(12, 100, elements.fullFees);                        

    }

    else if (service === "TGV LYRIA") {

        /* const lyriaType = document.querySelector('input[name="lyriaType"]:checked');
            if (!lyriaType) {
                alert("Veuillez sélectionner un canal de vente pour TGV LYRIA.");
                return;
            } */
        
        if (diffInDays >= 101) {
            setDeadline({ baseDate: currentDate, offsetDays: 30, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 80) {
            setDeadline({ baseDate: currentDate, offsetDays: 15, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 35) {
            setDeadline({ baseDate: currentDate, offsetDays: 5, element: elements.validation, label: "Date de validation de devis" });
        } else if (diffInDays >= 12) {
            setDeadline({ baseDate: currentDate, offsetDays: 1, element: elements.validation, label: "Date de validation de devis" });
        } else {
            elements.validation.textContent = 'Validation de devis immédiate';
        }

        if (diffInDays >= 65) {
            setDeadline({ baseDate: travelDate, offsetDays: -45, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else if (diffInDays >= 30) {
            setDeadline({ baseDate: currentDate, offsetDays: 20, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else if (diffInDays >= 12) {
            setDeadline({ baseDate: travelDate, offsetDays: -10, element: elements.payment, label: "Date limite de paiement", withTime: true });
        } else {
            elements.payment.textContent = 'Paiement immédiat';
        }

        setFee(30, 20, elements.earlyFees, { immediate: true });
        setFee(30, 30, elements.partialFees);
        setFee(8, 100, elements.fullFees);

      /*  if (lyriaType.value === "AGS") {
        setFee(30, 20, elements.earlyFees, { immediate: true });
        setFee(30, 30, elements.partialFees);
        setFee(8, 100, elements.fullFees);
    } else if (lyriaType.value === "VEG") {
        setFee(46, 20, elements.earlyFees);
        setFee(30, 30, elements.partialFees);
        setFee(12, 100, elements.fullFees);
    } */
    }
};