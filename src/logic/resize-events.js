import moment from 'moment';
import { store } from '../store';

export function useResizeEvents(props) {
  let timeEdited = 'startTime'; // startTime or endTime

  const resize = (evt) => {
    let schedule = document.getElementById('planner-schedule');

    let mouseY = evt.clientY + schedule.scrollTop - 120;

    let hour = Math.floor(mouseY / 50);
    let minutes = Math.round((mouseY - hour * 50) / 50 * 60);
    minutes = Math.round(minutes / 15) * 15;

    let newTime = props.scheduledEvent.startTime.clone().hour(hour).minute(minutes);

    let newEvent = {...props.scheduledEvent};

    if (timeEdited === 'startTime' && moment(newTime).isAfter(newEvent.endTime)) {
      timeEdited = 'endTime';
      newEvent.startTime = newEvent.endTime;
    } else if (timeEdited === 'endTime' && moment(newTime).isBefore(newEvent.startTime)) {
      timeEdited = 'startTime';
      newEvent.endTime = newEvent.startTime;
    }

    newEvent[timeEdited] = newTime;
    store.editEvent(newEvent);
  };

  const mouseDown = (evt) => {
    if (evt.offsetY <= 10 || evt.target.offsetHeight - evt.offsetY <= 10) {
      timeEdited = (evt.offsetY <= 10) ? 'startTime' : 'endTime';
      document.addEventListener('mousemove', resize);
    }
  };

  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', resize)
  })

  return {
    mouseDown,
  }
}
