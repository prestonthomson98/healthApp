function loadInitialState() {
    if (localStorage.getItem("name") === null) {
        localStorage.setItem("name", "CMSC 434 Student");
    }
    if (localStorage.getItem("exercise") === null) {
        localStorage.setItem("exercise", "run");
    }
    if (localStorage.getItem("dayOrNight") === null) {
        localStorage.setItem("dayOrNight", "day");
    }
    if (localStorage.getItem("time") === null) {
        localStorage.setItem("time", 60);
    }
    console.log(localStorage);
}