<template>
  <div class='day'>
    <ScheduledEvent v-for='e in state.daysEvent'
                    :key='e.id' :scheduledEvent='e'
                    @dragover.prevent
                    dragenter.prevent
                    @drop='dropEvent'
    />
    <div class='hour' v-for='i in 24' :key='i'
         @dragover.prevent
         @dragenter.prevent
         @drop='dropEvent'
    />
  </div>
</template>

<script>
  import moment from 'moment';
  import ScheduledEvent from './ScheduledEvent.vue';
  import {reactive, computed} from 'vue';
  import {store} from '../store/index.js';

  export default {
    props: {
      date: Object,
    },
    components: {
      ScheduledEvent,
    },
    setup(props) {
      const state = reactive({
        daysEvent: computed(() => {
          return store.getState().scheduledEvents.filter(e => e.startTime.isSame(props.date, 'day'));
        }),
      });

      const dropEvent = (evt) => {
        let e = JSON.parse(evt.dataTransfer.getData('event'));
        const offset = parseInt(evt.dataTransfer.getData('offset'));
        const schedule = document.getElementById('planner-schedule');

        let mouseY = evt.clientY + schedule.scrollTop - offset;

        let hour = Math.floor(mouseY / 50);
        let minutes = Math.round((mouseY - hour * 50) / 50 * 60);
        minutes = Math.round(minutes / 15) * 15;

        let startTime = props.date.clone().hour(hour).minute(minutes);
        let duration = moment(e.endTime).diff(e.startTime);
        let endTime = startTime.clone().add(duration, 'ms');

        if (startTime.isSame(props.data, 'day') && endTime.clone().subtract(1, 'minute').isSame(props.date, 'day')) {
          store.editEvent({
            ...e,
            startTime,
            endTime,
          });
        }

      };
      return {
        state,
        dropEvent,
      };
    },
  };
</script>

<style scoped>
  .day {
    border-right: 2px solid #eee;
    float: left;
    position: relative;
    width: calc(87.5% / 7);
  }
  
  .hour {
    border-bottom: 1px dashed #eee;
    height: 50px;
  }
</style>
