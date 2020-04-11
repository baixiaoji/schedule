import {reactive, readonly} from 'vue';
import {uuid} from '../utils';
import defaultData from '../default-calendar';
import Moment from 'moment';
import {extendMoment} from 'moment-range';

const moment = extendMoment(Moment);

class Store {
  constructor() {
    let data = this.data();

    this.state = reactive(data);
  }

  getState() {
    return readonly(this.state);
  }
}

class PlannerStore extends Store {
  data() {
    return {
      calendars: defaultData.calendars,
      scheduledEvents: defaultData.events,
    };
  }

  isTimeAvailable(id, startTime, endTime) {
    let eventInDays = this.state.scheduledEvents.filter(e => {
      return e.id !== id && moment(e.startTime).isSame(startTime, 'day');
    });

    let range = moment.range(startTime, endTime);

    for (let i = 0; i < eventInDays.length; i++) {
      let eRange = moment.range(eventInDays[i].startTime, eventInDays[i].endTime);

      if (eRange.overlaps(range, {adjacent: false})) {
        return {
          overlap: eventInDays[i],
          available: false,
        };
      }
    }

    return {
      available: true,
    };

  }

  editEvent(newEvent) {
    let e = this.state.scheduledEvents.find(e => e.id === newEvent.id);

    if (!e) {
      return false;
    }
    const isTimeAvailable = this.isTimeAvailable(newEvent.id, newEvent.startTime, newEvent.endTime);

    if (isTimeAvailable.available) {
      e.name = newEvent.name;
      e.calendar = newEvent.calendar;
      e.startTime = newEvent.startTime;
      e.endTime = newEvent.endTime;
      return true;
    }

    e.shake = true;
    isTimeAvailable.overlap.shake = true;

    setTimeout(() => {
      e.shake = false;
      isTimeAvailable.overlap.shake = false;
    }, 500)
    return false;
  }

  addEvent(eventData) {
    eventData.id = uuid();

    if (this.isTimeAvailable(eventData.id, eventData.startTime, eventData.endTime).available) {
      this.state.scheduledEvents.push(eventData);
      return true;
    }

    return false;
  }

  deleteEvent(eventID) {
    this.state.scheduledEvents = this.state.scheduledEvents.filter(e => {
      return e.id !== eventID;
    });
  }

  editCalender(calendarData) {
    let cal = this.state.calendars.find(c => c.id === calendarData.id);

    if (!cal) {
      return false;
    }

    if (calendarData.name.trim().length === 0) {
      cal.name = 'Untitled';
    } else {
      cal.name = calendarData.name;
    }
  }
}

export const store = new PlannerStore();
