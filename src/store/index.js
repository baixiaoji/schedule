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
      return e.id === id && moment(e.startTime).isSame(startTime, 'day');
    });

    let range = moment.range(startTime, endTime);

    for (let i = 0; i < eventInDays.length; i++) {
      let eRange = moment.range(eventInDays[i].startTime, eventInDays[i].endTime);

      if (eRange.overlaps(range, {adjacent: false})) {
        return {
          overlap: eventInDays[i],
          available: false,
        }
      }
    }

    return {
      available: true,
    }

  }

  editEvent(newEvent) {
    let e = this.state.scheduledEvents.find(e => e.id === newEvent.id);

    if (!e) {
      return false;
    }

    if (this.isTimeAvailable(newEvent.id, newEvent.startTime, newEvent.endTime).available) {
      e.name = newEvent.name;
      e.calendar = newEvent.calendar;
      e.startTime = newEvent.startTime;
      e.endTime = newEvent.endTime;
      return true;
    }

    return false;
  }
}

export const store = new PlannerStore();
