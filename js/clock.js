const dayTime = () => {
    const now = new Date();
    let dateString = now.toLocaleDateString();
    let timeString = now.toLocaleTimeString();
    let clock = document.getElementById('clock');
    clock.innerHTML = `${dateString}, ${timeString}`;    
}

setInterval(dayTime, 1000);
dayTime();