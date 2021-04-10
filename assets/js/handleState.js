var dayAbbrevations = {
  "monday": "Mon.",
  "tuesday": "Tues.",
  "wednesday": "Wed.",
  "thursday": "Thurs.",
  "friday": "Fri.",
}

var caloriesBurnedMap = {
  "run": 350,
  "walk": 285,
  "bike": 600,
  "swim": 500,
  "basketball": 300,
  "situps": 400,
  "dumbbells": 200,
}

function loadInitialState() {
  if (localStorage.getItem("initialized") === null) {
    const preferredExercises = ["run", "bike", "situps"];

    // Default settings
    localStorage.setItem("name", "CMSC 434 Student");
    localStorage.setItem("sex", "male");
    localStorage.setItem("age", "21");
    localStorage.setItem("weight", "130");
    localStorage.setItem("goal", "lose-weight");
    localStorage.setItem("preferredExercises", JSON.stringify(preferredExercises));
    localStorage.setItem("dayOrNight", "day");
    localStorage.setItem("duration", 60);
    localStorage.setItem("earliest_start", "07:00");
    localStorage.setItem("latest_start", "20:45");

    // Default events
    loadDefaultEvents();
    localStorage.setItem("initialized", true);
  }
  console.log(localStorage);
  console.log(JSON.parse(localStorage.getItem("events")))
}

function showStretchNotification() {
  let toExactMinute = 60000 - (new Date().getTime() % 60000);
  setInterval(()=>{
    new bootstrap.Toast(document.getElementById('stretchNotification')).show();
  }, toExactMinute * 60);
}

function getDailyWorkoutTime(day) {
  let allEvents = JSON.parse(localStorage.getItem("events"));
  let dayEventsInfo = allEvents[day];
  for (let i = 0; i < dayEventsInfo.length; i++) {
    if(dayEventsInfo[i]["event_type"] === "workout") {
      return convertTimeToSeconds(dayEventsInfo[i]["start_time"]);
    }
  }
  
  return null;
}

function showWorkoutNotification() {
  let toExactMinute = 60000 - (new Date().getTime() % 60000);
  setInterval(()=>{
    let todayDate = new Date();
    let days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    if(todayDate.getDay() >= 1 && todayDate.getDay() <= 5) {
      let today = days[(todayDate.getDay()) - 1];
      let workoutStartTimeSeconds = getDailyWorkoutTime(today);
      let currentTimeSeconds = (todayDate.getHours()) * 3600 + (todayDate.getMinutes()) * 60;
      if(workoutStartTimeSeconds === currentTimeSeconds) {
        new bootstrap.Toast(document.getElementById('workoutNotification')).show();
      }
    }
  }, toExactMinute);
}

function showRecommendedExercises() {
  recommendedExercises = [];
  if(localStorage.getItem("goal") === "lose-weight") {
    recommendedExercises.push("runningHeader");
    recommendedExercises.push("walkingHeader");
    recommendedExercises.push("bikingHeader");
    recommendedExercises.push("swimmingHeader");
  } else if(localStorage.getItem("goal") === "build-muscles") {
    recommendedExercises.push("situpHeader");
    recommendedExercises.push("dumbbellHeader");
  } else if(localStorage.getItem("goal") === "improve-endurance") {
    recommendedExercises.push("runningHeader");
    recommendedExercises.push("walkingHeader");
    recommendedExercises.push("bikingHeader");
    recommendedExercises.push("swimmingHeader");
    recommendedExercises.push("basketballHeader");
  }

  recommendedExercises.forEach(id => {
    document.getElementById(id).innerHTML += "&nbsp;&nbsp;[RECOMMENDED]"
  });
}

function loadDefaultEvents() {

  let early_breakfast = {
    "start_time": "07:00",
    "end_time": "07:45",
    "event_name": "Breakfast",
    "event_type": "meal",
    "description": "breakfast of champs!",
    "event_id": uuidv4(),
    "calories": 500,
  }

  let late_breakfast = {
    "start_time": "08:30",
    "end_time": "09:15",
    "event_name": "Breakfast",
    "event_type": "meal",
    "description": "breakfast of champs!",
    "event_id": uuidv4(),
    "calories": 750,
  }

  let early_event = {
    "start_time": "08:00",
    "end_time": "10:15",
    "event_name": "Early Event",
    "event_type": "event",
    "description": "Early Event",
    "event_id": uuidv4(),
  }

  let short_lunch = {
    "start_time": "12:00",
    "end_time": "12:45",
    "event_name": "Lunch",
    "event_type": "meal",
    "description": "mid day meal baby",
    "event_id": uuidv4(),
    "calories": 800,
  };

  let long_lunch = {
    "start_time": "11:45",
    "end_time": "12:35",
    "event_name": "SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH ",
    "event_type": "meal",
    "description": "mid day meal baby",
    "event_id": uuidv4(),
    "calories": 1200,
  }

  let thursday_lunch = {
    "start_time": "12:15",
    "end_time": "12:55",
    "event_name": "Lunch w/ Greg",
    "event_type": "meal",
    "description": "mid day meal baby",
    "event_id": uuidv4(),
    "calories": 910,
  }


  let dinner = {
    "start_time": "18:00",
    "end_time": "19:00",
    "event_name": "Dinner",
    "event_type": "meal",
    "description": "last supper",
    "event_id": uuidv4(),
    "calories": 1500,
  }

  let group_project = {
    "start_time": "16:00",
    "end_time": "17:50",
    "event_name": "Group Project",
    "event_type": "event",
    "description": "group project for CMSC434",
    "event_id": uuidv4(),
  }

  let myEvents = {
    "monday": [early_breakfast, early_event, short_lunch, dinner],
    "tuesday": [late_breakfast, long_lunch, dinner],
    "wednesday": [early_breakfast, short_lunch, dinner],
    "thursday": [early_breakfast, thursday_lunch, group_project, dinner],
    "friday": [early_breakfast, short_lunch, dinner],
  };

  localStorage.setItem("events", JSON.stringify(myEvents));
}

function capitalizeString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function convertTimeToSeconds(time) {
  const split = time.split(":");
  return split[0] * 3600 + split[1] * 60;
}

function convertSecondsToTime(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 5);
}

function clearWorkouts() {
  let allEvents = JSON.parse(localStorage.getItem("events"));
  for (let dayOfWeek in allEvents) {
    let dayEventsInfo = allEvents[dayOfWeek];
    for (let i = 0; i < dayEventsInfo.length; i++) {
      if(dayEventsInfo[i]["event_type"] === "workout") {
        dayEventsInfo.splice(i,1);
        i--;
      }
    }
  }
  localStorage.setItem("events", JSON.stringify(allEvents));
}

function generateWorkouts(randomize) {
  if (localStorage.getItem("generated_workouts") !== null && !randomize) {
    return;
  }
  clearWorkouts(false);
  const bufferMinutes = 15;
  let allEvents = JSON.parse(localStorage.getItem("events"));

  const preferredExercises = JSON.parse(localStorage.getItem("preferredExercises"));

  for (let dayOfWeek in allEvents) {
    let randomlySelectedExercise = preferredExercises[Math.floor(Math.random() * preferredExercises.length)];
    let dayEventsInfo = allEvents[dayOfWeek];
    dayEventsInfo.sort((a, b) => convertTimeToSeconds(a.start_time) - convertTimeToSeconds(b.start_time));

    const free_intervals = []

    free_intervals.push({ "start_time": convertTimeToSeconds("00:00"), "end_time": convertTimeToSeconds(dayEventsInfo[0]["start_time"]) - 60*bufferMinutes });
    for (let i = 1; i < dayEventsInfo.length; i++) {
      let prevEnd = convertTimeToSeconds(dayEventsInfo[i-1]["end_time"]) + 60*bufferMinutes;
      let currStart = convertTimeToSeconds(dayEventsInfo[i]["start_time"]) - 60*bufferMinutes;
      if(prevEnd < currStart) {
        free_intervals.push({ "start_time": prevEnd, "end_time": currStart });
      }
    }
    free_intervals.push({ "start_time": convertTimeToSeconds(dayEventsInfo[dayEventsInfo.length-1]["end_time"]) + 60*bufferMinutes, "end_time": convertTimeToSeconds("23:59") });

    const exerciseDurationSeconds = parseInt(localStorage.getItem("duration"))*60;
    let startTimeSeconds = convertTimeToSeconds(localStorage.getItem("earliest_start"));
    if(localStorage.getItem("dayOrNight") === "night") {
      startTimeSeconds = convertTimeToSeconds(localStorage.getItem("latest_start"));
    }
    let endTimeSeconds = startTimeSeconds + exerciseDurationSeconds;

    let event_name = `${dayAbbrevations[dayOfWeek]} ${randomlySelectedExercise}`;

    if(localStorage.getItem("dayOrNight") === "night") {
      for (let i = free_intervals.length-1; i >= 0; i--) {
        if(startTimeSeconds < free_intervals[i]["start_time"]) {
          continue;
        } else if(free_intervals[i]["start_time"] <= startTimeSeconds && endTimeSeconds <= free_intervals[i]["end_time"]) {
          dayEventsInfo.push({
            "start_time": convertSecondsToTime(startTimeSeconds),
            "end_time": convertSecondsToTime(endTimeSeconds),
            event_name,
            "event_type": "workout",
            "description": capitalizeString(randomlySelectedExercise),
            "event_id": uuidv4(),
            "calories": Math.round((endTimeSeconds - startTimeSeconds) / 3600 * caloriesBurnedMap[randomlySelectedExercise])
          })
          break;
        } else if(free_intervals[i]["end_time"] - exerciseDurationSeconds >= free_intervals[i]["start_time"]) {
          dayEventsInfo.push({
            "start_time": convertSecondsToTime(free_intervals[i]["end_time"] - exerciseDurationSeconds),
            "end_time": convertSecondsToTime(free_intervals[i]["end_time"]),
            event_name,
            "event_type": "workout",
            "description": capitalizeString(randomlySelectedExercise),
            "event_id": uuidv4(),
            "calories": Math.round((endTimeSeconds - startTimeSeconds) / 3600 * caloriesBurnedMap[randomlySelectedExercise])
          })
          break;
        } else {
          if(i-1 >= 0) {
            startTimeSeconds = free_intervals[i-1]["start_time"] - exerciseDurationSeconds;
            endTimeSeconds = free_intervals[i-1]["start_time"];
          }
        }
      }
    } else {
      for (let i = 0; i < free_intervals.length; i++) {
        if(startTimeSeconds > free_intervals[i]["end_time"]) {
          continue;
        } else if(free_intervals[i]["start_time"] <= startTimeSeconds && endTimeSeconds <= free_intervals[i]["end_time"]) {
          dayEventsInfo.push({
            "start_time": convertSecondsToTime(startTimeSeconds),
            "end_time": convertSecondsToTime(endTimeSeconds),
            event_name,
            "event_type": "workout",
            "description": capitalizeString(randomlySelectedExercise),
            "event_id": uuidv4(),
            "calories": Math.round((endTimeSeconds - startTimeSeconds) / 3600 * caloriesBurnedMap[randomlySelectedExercise])
          })
          break;
        } else if(free_intervals[i]["start_time"] + exerciseDurationSeconds <= free_intervals[i]["end_time"]) {
          dayEventsInfo.push({
            "start_time": convertSecondsToTime(free_intervals[i]["start_time"]),
            "end_time": convertSecondsToTime(free_intervals[i]["start_time"] + exerciseDurationSeconds),
            event_name,
            "event_type": "workout",
            "description": capitalizeString(randomlySelectedExercise),
            "event_id": uuidv4(),
            "calories": Math.round((endTimeSeconds - startTimeSeconds) / 3600 * caloriesBurnedMap[randomlySelectedExercise])
          })
          break;
        } else {
          if(i+1 < free_intervals.length) {
            startTimeSeconds = free_intervals[i+1]["start_time"];
            endTimeSeconds = startTimeSeconds + exerciseDurationSeconds;
          }
        }
      }
    }
    dayEventsInfo.sort((a, b) => convertTimeToSeconds(a.start_time) - convertTimeToSeconds(b.start_time));
  }
  localStorage.setItem("generated_workouts", true);
  localStorage.setItem("events", JSON.stringify(allEvents));
}

function generateCalendarEvents() {
  let allEvents = JSON.parse(localStorage.getItem("events"));

  for (var dayOfWeek in allEvents) {
    let dayEventsInfo = allEvents[dayOfWeek];

    let dayNewEventsHTML = [];

    dayEventsInfo.forEach(newEventInfo => {
      let eventName = newEventInfo.event_name;
      if (eventName.length > 16) {
        eventName = eventName.substring(0, 16) + "...";
      }

      let eventTypeIndex = {
        "meal": "event-1",
        "event": "event-2",
        "workout": "event-4",
      };

      let newEventHTML = `<li class="cd-schedule__event" id="${newEventInfo.event_id}">`;

      newEventHTML += `<a data-start="${newEventInfo.start_time}" data-end="${newEventInfo.end_time}" data-event="${eventTypeIndex[newEventInfo.event_type]}" href="#0" onclick="setInspectedEvent('${newEventInfo.event_id}');" data-bs-toggle="modal" data-bs-target="#eventModal">`;
      newEventHTML += `<em class="cd-schedule__name">${eventName}</em>`;
      newEventHTML += `</a>`;
      newEventHTML += `</li>`;

      dayNewEventsHTML.push(newEventHTML);
    }
    );

    dayNewEventsHTML.forEach(eventToAdd => {
      var x = document.getElementById(dayOfWeek + "_schedule");
      if (x !== null) {
        x.innerHTML += eventToAdd;
      };
    });
  }
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function retrieveEvent(event_id) {
  let allEvents = JSON.parse(localStorage.getItem("events"));
  for (let dayOfWeek in allEvents) {
    let dayEventsInfo = allEvents[dayOfWeek];
    for (let i = 0; i < dayEventsInfo.length; i++) {
      if(dayEventsInfo[i]["event_id"] === event_id) {
        return dayEventsInfo[i];
      }
    }
  }
  return null;
}

function updateEventFields(event_id, update_fields) {
  let allEvents = JSON.parse(localStorage.getItem("events"));
  for (let dayOfWeek in allEvents) {
    let dayEventsInfo = allEvents[dayOfWeek];
    for (let i = 0; i < dayEventsInfo.length; i++) {
      if(dayEventsInfo[i]["event_id"] === event_id) {
        for(key in update_fields) {
          dayEventsInfo[i][key] = update_fields[key]
        }
      }
    }
  }
  localStorage.setItem("events", JSON.stringify(allEvents));
}

function setInspectedEvent(event_id) {
  localStorage.setItem("selected_event", event_id);
  if (window.location.href.includes("index.html")) {
    window.location.href = "Calendar.html";
  } else {
    let modalTitleElement = document.getElementById("eventModalTitle");
    let eventBadgeElement = document.getElementById("eventBadge");
    let noteElement = document.getElementById("note");
    let caloriesElement = document.getElementById("calories");
    let caloriesLabelElement = document.getElementById("caloriesLabel");
    let caloriesInputFormElement = document.getElementById("caloriesFormInput");

    let event = retrieveEvent(event_id);
    modalTitleElement.innerHTML = event["event_name"]

    caloriesInputFormElement.style.display = 'block';
    caloriesElement.disabled = true;
    if(event["event_type"] === "workout") {
      eventBadgeElement.style.background = "hsl(31, 89%, 68%)";
      eventBadgeElement.innerHTML = "Workout";
      caloriesLabelElement.innerHTML = "Calories Burned";
      caloriesElement.value = event["calories"];
    } else if(event["event_type"] === "event") {
      eventBadgeElement.style.background = "hsl(271, 23%, 26%)";
      eventBadgeElement.innerHTML = "Event";
      caloriesInputFormElement.style.display = 'none';
    } else {
      eventBadgeElement.style.background = "hsl(199, 25%, 46%)";
      eventBadgeElement.innerHTML = "Meal";
      caloriesLabelElement.innerHTML = "Calories Gained";
      caloriesElement.value = event["calories"];
      caloriesElement.disabled = false;
    }
    noteElement.value = event["description"];
  }
}

async function scrollToWorkoutEvents() {
  let allEvents = JSON.parse(localStorage.getItem("events"));

  // Get all workout event ids
  let workoutEventIds = [];
  for (let dayOfWeek in allEvents) {
    let dayEventsInfo = allEvents[dayOfWeek];
    for (let i = 0; i < dayEventsInfo.length; i++) {
      if(dayEventsInfo[i]["event_type"] === "workout") {
        workoutEventIds.push(dayEventsInfo[i]["event_id"]);
      }
    }
  }

  workoutEventIds.reverse();
  for (let i = 0; i < workoutEventIds.length; i++) {
    const event_id = workoutEventIds[i];

    let workoutElement = document.getElementById(event_id);
    if (workoutElement !== null) {
      workoutElement.scrollIntoView({behavior: "auto", block: "center", inline: "center"});
    }

    await sleep(350);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
