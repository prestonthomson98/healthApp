const dayAbbrevations = {
  "monday": "Mon.",
  "tuesday": "Tues.",
  "wednesday": "Wed.",
  "thursday": "Thurs.",
  "friday": "Fri.",
}

function loadInitialState() {
  if (localStorage.getItem("initialized") === null) {

    // Default settings
    localStorage.setItem("name", "CMSC 434 Student");
    localStorage.setItem("sex", "male");
    localStorage.setItem("weight", "130 lbs");
    localStorage.setItem("height", "6 ft");
    localStorage.setItem("goal", "personal-best");
    localStorage.setItem("exercise", "run");
    localStorage.setItem("dayOrNight", "day");
    localStorage.setItem("duration", 60);
    localStorage.setItem("earliest_start", "07:00");
    localStorage.setItem("latest_start", "20:45");

    // Default events
    loadDefaultEvents();
    localStorage.setItem("initialized", true);
  }
  console.log(localStorage);
}

function loadDefaultEvents() {

  let early_breakfast = {
    "start_time": "07:00",
    "end_time": "07:45",
    "event_name": "Breakfast",
    "event_type": "meal",
    "description": "breakfast of champs!",
  }

  let late_breakfast = {
    "start_time": "08:30",
    "end_time": "09:15",
    "event_name": "Breakfast",
    "event_type": "meal",
    "description": "breakfast of champs!",
  }

  let early_event = {
    "start_time": "08:00",
    "end_time": "10:15",
    "event_name": "Early Event",
    "event_type": "event",
    "description": "Early Event",
  }

  let short_lunch = {
    "start_time": "12:00",
    "end_time": "12:45",
    "event_name": "Lunch",
    "event_type": "meal",
    "description": "mid day meal baby",
  };

  let long_lunch = {
    "start_time": "11:45",
    "end_time": "12:35",
    "event_name": "SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH SUPER LONG LUNCH WITH ",
    "event_type": "meal",
    "description": "mid day meal baby",
  }

  let thursday_lunch = {
    "start_time": "12:15",
    "end_time": "12:55",
    "event_name": "Lunch w/ Greg",
    "event_type": "meal",
    "description": "mid day meal baby",
  }


  let dinner = {
    "start_time": "18:00",
    "end_time": "19:00",
    "event_name": "Dinner",
    "event_type": "meal",
    "description": "last supper",
  }

  let group_project = {
    "start_time": "16:00",
    "end_time": "17:50",
    "event_name": "Group Project",
    "event_type": "event",
    "description": "group project for CMSC434",
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

function generateWorkouts() {
  clearWorkouts();
  const bufferMinutes = 15;
  let allEvents = JSON.parse(localStorage.getItem("events"));

  for (let dayOfWeek in allEvents) {
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

    if(localStorage.getItem("dayOrNight") === "night") {
      for (let i = free_intervals.length-1; i >= 0; i--) {
        // console.log(`${convertSecondsToTime(free_intervals[i]["start_time"])} ${convertSecondsToTime(startTimeSeconds)} ${convertSecondsToTime(endTimeSeconds)} ${convertSecondsToTime(free_intervals[i]["end_time"])}`);
        if(startTimeSeconds < free_intervals[i]["start_time"]) {
          continue;
        } else if(free_intervals[i]["start_time"] <= startTimeSeconds && endTimeSeconds <= free_intervals[i]["end_time"]) {
          dayEventsInfo.push({
            "start_time": convertSecondsToTime(startTimeSeconds),
            "end_time": convertSecondsToTime(endTimeSeconds),
            "event_name": `${dayAbbrevations[dayOfWeek]} ${localStorage.getItem("exercise")}`,
            "event_type": "workout",
            "description": "Hability generated workout!",
          })
          break;
        } else if(free_intervals[i]["end_time"] - exerciseDurationSeconds >= free_intervals[i]["start_time"]) {
          dayEventsInfo.push({
            "start_time": convertSecondsToTime(free_intervals[i]["end_time"] - exerciseDurationSeconds),
            "end_time": convertSecondsToTime(free_intervals[i]["end_time"]),
            "event_name": `${dayAbbrevations[dayOfWeek]} ${localStorage.getItem("exercise")}`,
            "event_type": "workout",
            "description": "Hability generated workout!",
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
        // console.log(`${convertSecondsToTime(free_intervals[i]["start_time"])} ${convertSecondsToTime(startTimeSeconds)} ${convertSecondsToTime(endTimeSeconds)} ${convertSecondsToTime(free_intervals[i]["end_time"])}`);
        if(startTimeSeconds > free_intervals[i]["end_time"]) {
          continue;
        } else if(free_intervals[i]["start_time"] <= startTimeSeconds && endTimeSeconds <= free_intervals[i]["end_time"]) {
          dayEventsInfo.push({
            "start_time": convertSecondsToTime(startTimeSeconds),
            "end_time": convertSecondsToTime(endTimeSeconds),
            "event_name": `${dayAbbrevations[dayOfWeek]} ${localStorage.getItem("exercise")}`,
            "event_type": "workout",
            "description": "Hability generated workout!",
          })
          break;
        } else if(free_intervals[i]["start_time"] + exerciseDurationSeconds <= free_intervals[i]["end_time"]) {
          dayEventsInfo.push({
            "start_time": convertSecondsToTime(free_intervals[i]["start_time"]),
            "end_time": convertSecondsToTime(free_intervals[i]["start_time"] + exerciseDurationSeconds),
            "event_name": `${dayAbbrevations[dayOfWeek]} ${localStorage.getItem("exercise")}`,
            "event_type": "workout",
            "description": "Hability generated workout!",
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

      let newEventHTML = `<li class="cd-schedule__event">`;

      newEventHTML += `<a data-start="${newEventInfo.start_time}" data-end="${newEventInfo.end_time}" data-content="" data-event="${eventTypeIndex[newEventInfo.event_type]}" href="#0">`;
      newEventHTML += `<em class="cd-schedule__name">${eventName}</em>`;
      newEventHTML += `</a>`;
      newEventHTML += `</li>`;

      dayNewEventsHTML.push(newEventHTML);
    }
    );

    dayNewEventsHTML.forEach(eventToAdd => document.getElementById(dayOfWeek + "_schedule").innerHTML += eventToAdd);
  }
}
