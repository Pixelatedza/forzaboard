<script>
  import Form from 'components/Form.svelte'
  import JSONEditor from 'components/JSONEditor.svelte';

  let config = [
    {
      name: 'username',
      label: 'Username',
      required: true,
    },
    {
      name: 'car',
      label: 'Car',
      component: 'select',
      options: [
        {
          label: 'One',
          value: 1,
        },{
          label: 'Two',
          value: '2',
        },{
          label: 'Three',
          value: 'three',
        }
      ]
    },
    {
      name: 'password',
      label: 'Password',
      props: {
        type: 'password',
      }
    },
    {
      name: 'record',
      label: 'Record',
      component: 'record',
    },
    {
      name: 'time',
      label: 'Time',
      component: 'duration',
    },
  ]
</script>

<style>
  .columns {
      display: flex;
      flex-direction: row;
      height: 100%;
  }

  .form {
      display: flex;
      flex: 1 0 auto;
  }

  .json {
      display: flex;
      flex: 1 0 auto;
  }
</style>

<div class='columns'>
  <div class='form'>
    <Form
      on:submit={() => console.log(config)}
      bind:config={config}
    />
  </div>

  <div class='json'>
    <JSONEditor
      bind:json={config}
    />
  </div>
</div>
