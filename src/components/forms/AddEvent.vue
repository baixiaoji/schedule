<template>
  <div class='popup-bg'>
    <div class='popup'>
      <div class='popup-header'>
        <h2>添加日程</h2>
        <span @click='close'> x </span>
      </div>
      <div class='popup-content'>
        <label>Calendar</label>
        <div
            v-for='cal in state.calendars'
            :key='cal.id'
            class='calendar-list'
            :style='calendarStyle(cal)'
            @click='eventData.calendar = cal.id'
        >
          {{ cal.name }}
        </div>
        <label>Name</label>
        <input type="text" v-model='eventData.name'>
        <label>Date</label>
        <DatePicker @update='updateDate'
                    :default-date='defaultDate'/>
        <label>Start Time</label>
        <input type="time" @change='changeTime("startTime", $event)' @blur='updateTimeDisplay("startTime", $event)'/>
        <label>End Time</label>
        <input type="time" @change='changeTime("endTime", $event)' @blur='updateTimeDisplay("endTime", $event)'/>
      </div>
      <div class='popup-footer'>
        <div class='popup-footer__cancel' @click='close'> Cancel</div>
        <div class='popup-footer__confirm' @click='submit'> Confirm</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {reactive, ref} from 'vue';
  import moment from 'moment';
  import {usePopupLogic} from '../../logic/popup-logic';
  import {store} from '../../store';
  import DatePicker from './DatePicker.vue';

  export default {
    components: {
      DatePicker,
    },
    setup(props, context) {
      const eventData = reactive({
        calendar: '01',
        name: '',
        date: '',
        startTime: moment(),
        endTime: moment(),
      });
      const defaultDate = ref(null);

      const {close} = usePopupLogic('addEvent', context.emit);

      const calendarStyle = (cal) => {
        if (eventData.calendar === cal.id) {
          return {
            'background-color': cal.color,
            'color': 'white',
            'font-weight': 'bold',
          };
        }
      };
      const changeTime = (property, evt) => {
        console.log(evt.target.value);
        const hour = parseInt(evt.target.value.split(':')[0]);
        const minutes = parseInt(evt.target.value.split(':')[1]);

        eventData[property] = eventData[property].clone().hour(hour).minute(minutes);
      };

      const updateTimeDisplay = (property, evt) => {
        evt.target.value = eventData[property].format('HH:mm');
      };
      const updateDate = (date) => {
        eventData.startTime = date.clone().set({
          'hour': eventData.startTime.hour(),
          'minute': eventData.startTime.minute(),
        });
        eventData.endTime = date.clone().set({
          'hour': eventData.endTime.hour(),
          'minute': eventData.endTime.minute(),
        });
      };
      const submit = () => {

      };
      return {
        close,
        eventData,
        state: store.getState(),
        calendarStyle,
        changeTime,
        updateTimeDisplay,
        submit,
        updateDate,
      };
    },
  };
</script>

<style src='../../styles/popup.css' scoped>
</style>
<style scoped>
  label {
    clear: both;
    display: block;
    font-size: 0.8em;
    font-weight: bold;
    margin: 10px 0;
  }
  
  input[type='text'] {
    font-size: 0.9em;
    outline: none;
    padding: 5px;
    width: 100%;
  }
  
  .time-input {
    font-family: inherit;
    font-size: 0.8em;
  }
  
  .calendar-list {
    background-color: #eee;
    color: #ccc;
    cursor: pointer;
    display: inline-block;
    font-size: 0.8em;
    margin-right: 5px;
    padding: 5px 10px;
  }
  
  
  .popup-error {
    color: #ff7675;
    font-size: 0.8em;
  }
  
  .popup-footer__cancel {
    color: #888;
    cursor: pointer;
    float: left;
    font-size: 0.9em;
    padding: 5px 0;
    text-decoration: underline;
  }
  
  .popup-footer__delete {
    background: #ff7675;
    color: white;
    float: right;
    margin-right: 5px;
    padding: 5px 10px;
  }

</style>
