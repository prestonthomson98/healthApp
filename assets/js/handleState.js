function loadInitialState() {
    if (localStorage.getItem("initialized") === null) {

      // Default settings
      localStorage.setItem("name", "CMSC 434 Student");
      localStorage.setItem("exercise", "run");
      localStorage.setItem("dayOrNight", "day");
      localStorage.setItem("time", 60);

      // Default events
      loadDefaultEvents();
      console.log(localStorage);

      localStorage.setItem("initialized", true);
    }
      // localStorage.clear();
}

function loadDefaultEvents() {

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
    "event_name": "Lunch",
    "event_type": "meal",
    "description": "mid day meal baby",
  }

  let thursday_lunch = {
    "start_time": "12:15",
    "end_time": "12:55",
    "event_name": "Lunch",
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

  let myEvents = {
    "monday": [short_lunch, dinner],
    "tuesday": [long_lunch, dinner],
    "wednesday": [short_lunch, dinner],
    "thursday": [thursday_lunch, dinner],
    "friday": [short_lunch, dinner],
  };

  localStorage.setItem("events", JSON.stringify(myEvents));
}

function generateCalendarEvents() {
  let allEvents = JSON.parse(localStorage.getItem("events"));
  console.log(allEvents);

  for (var dayOfWeek in allEvents) {
    let dayEventsInfo = allEvents[dayOfWeek];

    let dayNewEventsHTML = [];

    dayEventsInfo.forEach(newEventInfo => {
      let newEventHTML = `<li class="cd-schedule__event">`;

      newEventHTML += `<a data-start="${newEventInfo.start_time}" data-end="${newEventInfo.end_time}" data-content="" data-event="event-1" href="#0">`;
      newEventHTML += `<em class="cd-schedule__name">${newEventInfo.event_name}</em>`;
      newEventHTML += `</a>`;
      newEventHTML += `</li>`;

      dayNewEventsHTML.push(newEventHTML);
    }
    );

    dayNewEventsHTML.forEach(eventToAdd => document.getElementById(dayOfWeek + "_schedule").innerHTML += eventToAdd);
  }
}
