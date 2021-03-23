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
}

function loadDefaultEvents() {

  let early_breakfast = {
    "start_time": "07:00",
    "end_time": "07:45",
    "event_name": "Breakfast",
    "event_type": "meal",
    "description": "breakfast of champs!",
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

  let myEvents = {
    "monday": [early_breakfast, short_lunch, dinner],
    "tuesday": [early_breakfast, long_lunch, dinner],
    "wednesday": [early_breakfast, short_lunch, dinner],
    "thursday": [early_breakfast, thursday_lunch, dinner],
    "friday": [early_breakfast, short_lunch, dinner],
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
      let eventName = newEventInfo.event_name;
      if (eventName.length > 16) {
        eventName = eventName.substring(0, 16) + "...";
      }

      let newEventHTML = `<li class="cd-schedule__event">`;

      newEventHTML += `<a data-start="${newEventInfo.start_time}" data-end="${newEventInfo.end_time}" data-content="" data-event="event-1" href="#0">`;
      newEventHTML += `<em class="cd-schedule__name">${eventName}</em>`;
      newEventHTML += `</a>`;
      newEventHTML += `</li>`;

      dayNewEventsHTML.push(newEventHTML);
    }
    );

    dayNewEventsHTML.forEach(eventToAdd => document.getElementById(dayOfWeek + "_schedule").innerHTML += eventToAdd);
  }
}
