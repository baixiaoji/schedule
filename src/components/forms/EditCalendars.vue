<template>
  <div class='popup-bg'>
    <div class='popup'>
      <div class='popup-header'>
        <h2>Edit Calenders</h2>
        <span class="close" @click='close'>x</span>
      </div>
      <div class='popup-content'>
        <div class='edit-calendar'
            v-for='cal in calendars'
            :key='cal.id'
        >
          <div class='calendar-swatch' :style='{"background-color": cal.color}'/>
          <input
              type='text'
              v-model='cal.name'
              @change='editCalendar(cal, $event)'
              placeholder='Untitled'
          />
        </div>
      </div>
      <div class='popup-footer'>
      </div>
    </div>
  </div>
</template>

<script>
  import {ref} from 'vue';
  import {usePopupLogic} from '../../logic/popup-logic';
  import {store} from '../../store';

  export default {
    setup(props, {emit}) {
      const {close} = usePopupLogic('editCalendar', emit);
      const calendars = ref([]);
      
      calendars.value = JSON.parse(JSON.stringify(store.getState().calendars));
      
      const editCalendar = (cal, evt) => {
        cal.value = evt.target.value;
        
        store.editCalender(cal);
      }
      return {
        close,
        calendars,
        editCalendar,
      };
    },
  };
</script>

<style src='../../styles/popup.css' scoped>
</style>
<style scoped>
  .edit-calendar {
    margin-bottom: 10px;
  }
  
  .calendar-swatch {
    float: left;
    height: 25px;
    margin-right: 10px;
    width: 25px;
  }
  
  input[type='text'] {
    border: none;
    border-bottom: 1px solid #ccc;
    font-size: 0.8em;
    height: 25px;
    outline: none;
    width: calc(100% - 35px);
  }
</style>
