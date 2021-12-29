<script>
  import {
    durationToMS,
    formatTime,
    getDurationParts,
  } from 'common';
  import Input from 'components/Input.svelte';

  export let field = {};
  let {
    hours,
    minutes,
    seconds,
    milliseconds,
  } = getDurationParts(field.value);

  const fieldId = field.name || field.id;

  let hour = {
    name: fieldId + '-hours',
    value: hours,
    pattern: /^\d{0,3}$/,
  }

  let minute = {
    name: fieldId + '-minutes',
    value: minutes,
    pattern: /^[0-6]?\d?$/,
  }

  let second = {
    name: fieldId + '-seconds',
    value: seconds,
    pattern: /^[0-6]?\d?$/,
  }

  let millisecond = {
    name: fieldId + '-milliseconds',
    value: milliseconds,
    pattern: /^\d{0,3}$/,
    props: {
      dir: "rtl",
    },
  }

  $: field.value = durationToMS({
    hours: hour.value,
    minutes: minute.value,
    seconds: second.value,
    milliseconds: millisecond.value,
  });
</script>

<style>
  div {
      display: flex;
      flex-direction: row;
      flex: 1 0 auto;
  }

  div:last-child {
      margin: 0;
  }

  .time {
      flex: 1;
      margin: 0 8px 0 0;
  }

  span {
      color: darkgray;
  }
</style>

<div>
  <div class='time'>
    <Input
      bind:field={hour}
    />
  </div>

  <div class='time'>
    <Input
      bind:field={minute}
    />
  </div>

  <div class='time'>
    <Input
      bind:field={second}
    />
  </div>

  <div class='time'>
    <Input
      bind:field={millisecond}
    />
  </div>
</div>
<span>{formatTime(field.value)}</span>
