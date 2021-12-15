<script>
  import {fade} from 'svelte/transition';
  import {location} from 'stores';
  import {clickOutside} from 'actions';
  import {
    getEvents,
    getRecords,
  } from 'api';
  import { formatTime } from 'common';

  $: hasLocation = !!$location.uuid;
  let events = [];
  let activeEventIndex;
  $: activeEvent = events[activeEventIndex] || {};
  let records = [];

  const formatRecordValue = (event_kind, value) => {
    switch (event_kind) {
      case 'road_circuit': return formatTime(value)
      default: return value;
    }
  }

  const getLeaderboardEvents = () => {
    getEvents({
      query: {
        'location__uuid': $location.uuid,
      }
    }).then(res => {
      if (!res.ok) {
        console.error('failed to fetch events for location');
        return;
      }

      events = res.body;
      activeEventIndex = 0;
    });
  }

  $: $location.uuid && getLeaderboardEvents();

  const getActiveLeaderboard = () => {

    if (!events[activeEventIndex]) {
      return;
    }

    getRecords({
      query: {
        'event__uuid': events[activeEventIndex].uuid,
      }
    }).then(res => {
      if (!res.ok) {
        console.error('failed to fetch leaderboard for event');
        return;
      }

      records = res.body;
    });
  }

  $: activeEventIndex !== undefined && getActiveLeaderboard();


</script>

<style>
  .layer {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
  }

  .card_group {
      display: flex;
  }

  .card {
      height: 80vh;
      background-color: white;
      pointer-events: auto;
      margin: 0 10px;
      overflow: hidden;
  }

  h3 {
      margin: 10px;
  }

  .event_card {
      width: 15vw;
  }

  .leaderboard_card {
      width: 40vw;
  }

  .details_card {
      width: 30vw;
  }

  .row {
      display: flex;
      cursor: pointer;
      background: white;
      color: black;
      transition: all 0.2s;
      padding: 10px;
  }

  .active_event {
      background: #ff00a3;
      color: #fff;
  }

  .event:hover {
      cursor: pointer;
      background: #D10086;
      color: #fff;
  }

  .record_grid {
      display: grid;
      grid-template-columns: fit-content(9ch) 2fr 1fr 100px 100px 50px;
      grid-gap: 10px;
      margin: 5px;
      word-break: break-word;
  }

  .lb_video {
      text-align: right;
  }

  .event_details {
      margin: 10px;
  }
</style>

{#if hasLocation}
  <div class='layer'>
    <div
      class='card_group'
      use:clickOutside
      on:clickOutside={() => location.set({})}
    >
      <div
        class='card event_card'
        transition:fade={{duration: 150}}
      >
        <h3>Events</h3>
        {#each events as event, i}
          <div
            class='row event'
            class:active_event={i === activeEventIndex}
            on:click={() => activeEventIndex = i}
          >
            {event.name}
          </div>
        {/each}
      </div>
      <div
        class='card leaderboard_card'
        transition:fade={{duration: 150}}
      >
        <h3>Leaderboard</h3>
        <div class='record_grid'>
          <b>#</b>
          <b>Username</b>
          <b>Car</b>
          <b>PI</b>
          <b>Time</b>
          <b>Video</b>
          {#each records as record, i}
            <div>{i + 1}</div>
            <div>{record.user}</div>
            <div>{record.car}</div>
            <div>{record.pi}</div>
            <div>{formatRecordValue(activeEvent.kind, record.value)}</div>
            <div class='lb_video'>
              {#if !record.video}
                <a target="_blank" href='https://www.youtube.com/watch?v=JRjwF8OWNck'>link</a>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      <div
        class='card details_card'
        transition:fade={{duration: 150}}
      >
        <h3>Event Details</h3>
        <div class='event_details'>
          <b>Description</b>
          {activeEvent.description || ''}
        </div>
      </div>
    </div>
  </div>
{/if}
