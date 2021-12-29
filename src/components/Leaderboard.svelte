<script>
  import {
    getPIClass,
    formatRecordValue,
    filteredCars,
    EventKindRecordType,
    RecordType,
    InputPatterns,
    serialize,
  } from 'common';
  import {
    auth,
    brands,
    cars,
  } from 'stores';
  import Button from 'components/Button.svelte';
  import Modal from 'components/Modal.svelte';
  import Form from 'components/Form.svelte';
  import {createRecord} from 'api';

  const RecordInputOptions = {
    [RecordType.Seconds]: {
      label: 'Seconds',
      pattern: InputPatterns.Digits,
    },
    [RecordType.Duration]: {
      label: 'Time',
      component: 'duration',
    },
    [RecordType.Speed]: {
      label: 'Km/h',
      component: 'record',
    },
    [RecordType.Distance]: {
      label: 'Meters',
      component: 'record',
    },
    [RecordType.Points]: {
      label: 'Score',
      pattern: InputPatterns.Digits,
    },
  };

  export let records = [];
  export let location = {};
  export let event = {};
  // TODO: Move the adding of records out of this file.
  // I just placed it here for lazyness because the add
  // button is here.
  let addVisible = false;
  let recordMasked = null;
  let addConfig = [
    {
      name: 'brand',
      label: 'Brand',
      component: 'select',
      options: $brands.map(brand => ({
        value: brand.uuid,
        label: brand.name,
      }))
    },
    {
      name: 'car',
      label: 'Car',
      required: true,
      component: 'select',
      options: [],
    },
    {
      name: 'value',
      required: true,
      ...RecordInputOptions[EventKindRecordType[location.kind]],
    },
    {
      name: 'pi',
      label: 'PI',
      required: true,
      pattern: InputPatterns.Digits,
    },
    {
      name: 'video',
      label: 'Video',
    },
    {
      name: 'share_code',
      label: 'Tune share code',
    }
  ];

  $: addConfig[1].options = filteredCars(addConfig[0].value, $cars).map(car => ({
    value: car.uuid,
    label: car.name,
  }));

  const onAdd = () => {
    if (!$auth.userId || !event.uuid) {
      console.error('Could not associate record with user or event');
      return;
    }

    if (!$auth.permissions.has('leaderboards.add_record')) {
      console.error('User does not have permission to add record');
      return;
    }

    createRecord({
      user: $auth.userId,
      event: event.uuid,
      ...serialize(addConfig),
    }).then(res => {
      if (!res.ok) {
        console.error('Failed to create record');
        return;
      }

      // TODO: Same as login, this is silly.
      for (const field of addConfig) {
        delete field.value;
      }
      addVisible = false;
    });
  };
</script>

<style>
    .leaderboard-header {
        height: 44px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .record_grid {
        display: grid;
        max-height: calc(100% - 54px);
        grid-template-columns: fit-content(9ch) 2fr 2fr 10ch 100px 150px 50px;
        grid-gap: 10px;
        margin: 5px;
        word-break: break-word;
        overflow: auto;
    }

    .add-mod {
        display: flex;
        flex-direction: column;
        padding: 10px;
        width: 300px;
        box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
    }

    .add-buttons {
        display: flex;
        margin: 10px 20px 0 20px;
        justify-content: space-between;
    }
</style>

<div class='leaderboard-header'>
  <h3>Leaderboard</h3>
  {#if $auth.permissions.has('leaderboards.add_record')}
    <Button on:click={() => addVisible = true}>Add</Button>
  {/if}
</div>

<div class='record_grid'>
  <b>#</b>
  <b>Username</b>
  <b>Car</b>
  <b>Sharecode</b>
  <b>PI</b>
  <b>{RecordInputOptions[EventKindRecordType[location.kind]].label}</b>
  <b>Video</b>
  {#each records as record, i}
    <div>{i + 1}</div>
    <div>{record.user}</div>
    <div>{record.car}</div>
    <div>{record.share_code || ''}</div>
    <div>{getPIClass(record.pi)} {record.pi}</div>
    <div>{formatRecordValue(location.kind, record.value)}</div>
    <div>
      {#if !record.video}
        <a target="_blank" href='https://www.youtube.com/watch?v=JRjwF8OWNck'>link</a>
      {/if}
    </div>
  {/each}
</div>


<Modal
  bind:visible={addVisible}
>
  <div class='add-mod'>
    <Form
      bind:config={addConfig}
      on:submit={onAdd}
    >
      <div class='add-buttons'>
        <Button type='button' style={'secondary'} on:click={() => addVisible = false}>Cancel</Button>
        <Button
          type='submit'
        >
          Add
        </Button>
      </div>
    </Form>
  </div>
</Modal>
