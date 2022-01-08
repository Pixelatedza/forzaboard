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
  import {
    createRecord,
    removeRecord,
  } from 'api';

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

  let w,h;
  export let records = [];
  export let location = {};
  export let event = {};
  // TODO: Move the adding of records out of this file.
  // I just placed it here for lazyness because the add
  // button is here.
  let showDelete = false;
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

  const onDelete = (uuid, i) => {
    if (!$auth.userId || !event.uuid) {
      console.error('Could not associate record with user or event');
      return;
    }

    if (!$auth.permissions.has('leaderboards.delete_record')) {
      console.error('User does not have permission to delete record');
      return;
    }

    removeRecord(uuid)
      .then(res => {
        if (!res.ok) {
          console.error('Failed to remove record');
        }

        records.splice(i, 1);
        records = records; // Trigger refresh
      });

  }

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

  const posWidth = `${records.length.toString().length * 10}px`;
</script>

<style>

    .lb {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
    }

    .leaderboard-header {
        height: 44px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
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

    .table-container {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        overflow: hidden;
    }

    .thead {
        display: flex;
        position: sticky;
        top: 0;
        background-color: #FFFFFF;
    }

    .thead > div {
        padding: 0 8px;
    }

    .tbody {
        max-height: 100%;
        overflow-y: auto;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    .tbody::-webkit-scrollbar {
        display: none;
    }

    .row {
        display: flex;
        transition: 0.2s;
    }

    .row:nth-child(2n) {
        background-color: #F8F8F8;
    }

    .row:hover {
        background-color: #D10086;
        color: white;
    }

    .row > div {
        padding: 0 8px;
    }

    .col1 {

    }

    .col2 {
        flex: 1 1 0;
    }

    .col3 {
        flex: 1 1 0;
    }

    .col4 {
        width: 10ch
    }

    .col5 {
        width: 100px
    }

    .col6 {
        width: 150px
    }

    .col7 {
        width: 50px
    }
</style>

<div class='lb'>
  <div class='leaderboard-header'>
    <h3>Leaderboard</h3>
    {#if $auth.permissions.has('leaderboards.add_record')}
      <Button on:click={() => addVisible = true}>Add</Button>
    {/if}
  </div>

  <div class='table-container' bind:clientWidth={w} bind:clientHeight={h}>
    <div class='thead'>
      <div class='col1' style={`width: ${posWidth}`}>#</div>
      <div class='col2'>Username</div>
      <div class='col3'>Car</div>
      <div class='col4'>Sharecode</div>
      <div class='col5'>PI</div>
      <div class='col6'>{RecordInputOptions[EventKindRecordType[location.kind]].label}</div>
      <div class='col7'>Video</div>
    </div>
    <div class='tbody'>
    {#each records as record, i}
      <div
        class='row'
        on:mouseover={() => {showDelete = i}}
        on:mouseleave={() => {showDelete = null}}
      >
        <div class='col1' style={`width: ${posWidth}`}>{i + 1}</div>
        <div class='col2'>{record.user?.username}</div>
        <div class='col3'>{record.car}</div>
        <div class='col4'>{record.share_code || ''}</div>
        <div class='col5'>{getPIClass(record.pi)} {record.pi}</div>
        <div class='col6'>{formatRecordValue(location.kind, record.value)}</div>
        <div class='col7'>
          {#if !record.video}
            <a target="_blank" href='https://www.youtube.com/watch?v=JRjwF8OWNck'>link</a>
          {/if}
        </div>
        {#if showDelete === i && record.user?.uuid === $auth.userId}
          <div style='cursor: pointer; color: red;' on:click={() => onDelete(record.uuid, i)}>
            X
          </div>
        {/if}
      </div>
    {/each}
    </div>
  </div>
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
