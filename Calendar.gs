class CalendarFunctions
{
  constructor() {

  }

  /**
   * Lists the calendars shown in the user's calendar list.
   */
  ListCalendars() {
    let calendars;
    let pageToken;
    do {
      calendars = Calendar.CalendarList.list({
        maxResults: 100,
        pageToken: pageToken
      });
      if (calendars.items && calendars.items.length > 0) {
        for (let i = 0; i < calendars.items.length; i++) {
          let calendar = calendars.items[i];
          console.info(`${calendar.summary} (ID: ${calendar.id})`);
        }
      } else {
        console.error(`No calendars found.`);
      }
      pageToken = calendars.nextPageToken;
    } while (pageToken);
  }


  /**
   * Creates an event in the user's default calendar.
   */
  CreateEvent(eventTitle, eventLocation, eventDescription, attendeeList) {
    let calendarId = `primary`;
    let start = this.GetRelativeDate(1, 12);
    let end = this.GetRelativeDate(1, 13);
    let event = {
      summary: eventTitle,
      location: eventLocation,
      description: eventDescription,
      start: {
        dateTime: start.toISOString()
      },
      end: {
        dateTime: end.toISOString()
      },
      attendees: [
        {email: attendeeList[0]},
        {email: attendeeList[1]},
      ],
      // Red background. Use Calendar.Colors.get() for the full list.
      colorId: 11
    };
    let newEvent = Calendar.Events.insert(event, calendarId);
    console.info(`Event ID: ${newEvent.id}`);
    return newEvent;
  }

  /**
   * Helper function to get a new Date object relative to the current date.
   * @param {number} daysOffset The number of days in the future for the new date.
   * @param {number} hour The hour of the day for the new date, in the time zone of the script.
   * @return {Date} The new date.
   */
  GetRelativeDate(daysOffset, hour) {
    let date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hour);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  /**
   * Lists the next 10 upcoming events in the user's default calendar.
   */
  ListNext10Events() {
    let calendarId = `primary`;
    let now = new Date();
    let events = Calendar.Events.list(calendarId, {
      timeMin: now.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 10
    });
    if (events.items && events.items.length > 0) {
      for (let i = 0; i < events.items.length; i++) {
        let event = events.items[i];
        if (event.start.date) {
          // All-day event.
          let start = new Date(event.start.date);
          console.info(`${event.summary} (${start.toLocaleDateString()})`);
        } else {
          let start = new Date(event.start.dateTime);
          console.info(`${event.summary} (${start.toLocaleDateString()})`);
        }
      }
    } else {
      console.error(`No events found.`);
    }
  }

  /**
   * Retrieve and log events from the given calendar that have been modified
   * since the last sync. If the sync token is missing or invalid, log all
   * events from up to a month ago (a full sync).
   *
   * @param {string} calendarId The ID of the calender to retrieve events from.
   * @param {boolean} fullSync If true, throw out any existing sync token and
   *        perform a full sync; if false, use the existing sync token if possible.
   */
  LogSyncedEvents(calendarId, fullSync) {
    let properties = PropertiesService.getUserProperties();
    let options = {
      maxResults: 100
    };
    let syncToken = properties.getProperty('syncToken');
    if (syncToken && !fullSync) {
      options.syncToken = syncToken;
    } else {
      // Sync events up to thirty days in the past.
      options.timeMin = this.GetRelativeDate(-30, 0).toISOString();
    }

    // Retrieve events one page at a time.
    let events;
    let pageToken;
    do {
      try {
        options.pageToken = pageToken;
        events = Calendar.Events.list(calendarId, options);
      } catch (e) {
        // Check to see if the sync token was invalidated by the server;
        // if so, perform a full sync instead.
        if (e.message === `Sync token is no longer valid, a full sync is required.`) {
          properties.deleteProperty(`syncToken`);
          this.LogSyncedEvents(calendarId, true);
          return;
        } else {
          throw new Error(e.message);
        }
      }

      if (events.items && events.items.length > 0) {
        for (let i = 0; i < events.items.length; i++) {
          let event = events.items[i];
          if (event.status === `cancelled`) {
            console.log(`Event id: ${event.id} was cancelled.`);
          } else if (event.start.date) {
            // All-day event.
            let start = new Date(event.start.date);
            console.log(`${event.summary} (${start.toLocaleDateString()})`);
          } else {
            // Events that don't last all day; they have defined start times.
            let start = new Date(event.start.dateTime);
            console.log(`${event.summary} (${start.toLocaleDateString()})`);
          }
        }
      } else {
        console.log(`No events found.`);
      }
      pageToken = events.nextPageToken;
    } while (pageToken);

    properties.setProperty(`syncToken`, events.nextSyncToken);
  }

  /**
   * Creates an event in the user's default calendar, waits 30 seconds, then
   * attempts to update the event's location, on the condition that the event
   * has not been changed since it was created.  If the event is changed during
   * the 30-second wait, then the subsequent update will throw a 'Precondition
   * Failed' error.
   *
   * The conditional update is accomplished by setting the 'If-Match' header
   * to the etag of the new event when it was created.
   */
  ConditionalUpdate(eventTitle, eventLocation, eventDescription, attendeeList) {
    let calendarId = `primary`;
    let start = this.GetRelativeDate(1, 12);
    let end = this.GetRelativeDate(1, 13);
    let event = {
      summary: eventTitle,
      location: eventLocation,
      description: eventDescription,
      start: {
        dateTime: start.toISOString()
      },
      end: {
        dateTime: end.toISOString()
      },
      attendees: [
        {email: attendeeList[0]},
        {email: attendeeList[1]},
      ],
      // Red background. Use Calendar.Colors.get() for the full list.
      colorId: 11
    };
    let newEvent = Calendar.Events.insert(event, calendarId);
    console.info(`Event ID: ${newEvent.getId()}`);
    Utilities.sleep(30 * 1000);  // Wait 30 seconds to see if the event has been updated outside this script.

    // Try to update the event, on the condition that the event state has not
    // changed since the event was created.
    try {
      event = Calendar.Events.update(
          event,
          calendarId,
          event.id,
          {},
          {'If-Match': event.etag}
      );
      console.info(`Successfully updated event: ${event.id}`);
    } catch (e) {
      console.error(`Fetch threw an exception: ${e}`);
    }
  }

  /**
   * Creates an event in the user's default calendar, then re-fetches the event
   * every second, on the condition that the event has changed since the last
   * fetch.
   *
   * The conditional fetch is accomplished by setting the 'If-None-Match' header
   * to the etag of the last known state of the event.
   */
  ConditionalFetch(eventTitle, eventLocation, eventDescription, attendeeList) {
    let calendarId = `primary`;
    let start = this.GetRelativeDate(1, 12);
    let end = this.GetRelativeDate(1, 13);
    let event = {
      summary: eventTitle,
      location: eventLocation,
      description: eventDescription,
      start: {
        dateTime: start.toISOString()
      },
      end: {
        dateTime: end.toISOString()
      },
      attendees: [
        {email: attendeeList[0]},
        {email: attendeeList[1]},
      ],
      // Red background. Use Calendar.Colors.get() for the full list.
      colorId: 11
    };
    event = Calendar.Events.insert(event, calendarId);
    console.info(`Event ID: ${event.getId()}`);
    // Re-fetch the event each second, but only get a result if it has changed.
    for (let i = 0; i < 30; i++) {
      Utilities.sleep(1000);
      try {
        event = Calendar.Events.get(calendarId, event.id, {}, {'If-None-Match': event.etag});
        console.info(`New event description: ${event.description}`);
      } catch (e) {
        console.error(`Fetch threw an exception: ${e}`);
      }
    }
  }
}



const _testCalendar = () => {
  const cal = new CalendarFunctions();
  let l = cal.ListCalendars();
}



