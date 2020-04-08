<template>
  <div class='day'>
    <ScheduledEvent v-for='e in state.daysEvent' :key='e.id' :scheduledEvent='e'/>
    <div class='hour' v-for='i in 24' :key='i'/>
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
      return {
        state,
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
