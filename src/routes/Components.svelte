<script>
  import Button from 'components/_docs/Button.svelte';
  import Duration from 'components/_docs/Duration.svelte';
  import Form from 'components/_docs/Form.svelte';
  import Input from 'components/_docs/Input.svelte';
  import LeaderBoard from 'components/_docs/Leaderboard.svelte';
  import Menu from 'components/_docs/Menu.svelte';
  import Modal from 'components/_docs/Modal.svelte';
  import RadioButton from 'components/_docs/RadioButton.svelte';
  import RadioGroup from 'components/_docs/RadioGroup.svelte';
  import RecordInput from 'components/RecordInput.svelte';
  import Select from 'components/_docs/Select.svelte';

  let activeComponent = {
    name: 'Leaderboard',
    comp: LeaderBoard,
  };

  const componentGroups = {
    Components: [
      {
        name: 'Button',
        comp: Button,
      },
      {
        name: 'Leaderboard',
        comp: LeaderBoard,
      },
      {
        name: 'Menu',
        comp: Menu,
      },
      {
        name: 'Modal',
        comp: Modal,
      },
    ],
    Inputs: [
      {
        name: 'Form',
        comp: Form,
      },
      {
        name: 'Input',
        comp: Input,
      },
      {
        name: 'Select',
        comp: Select,
      },
      {
        name: 'Duration',
        comp: Duration,
      },
      {
        name: 'RecordInput',
        comp: RecordInput,
      },
      {
        name: 'Radio Button',
        comp: RadioButton,
      },
      {
        name: 'Radio Group',
        comp: RadioGroup,
      },
    ]
  };
</script>

<style>
  .view {
      display: flex;
      flex-direction: row;
      height: 100%;
  }

  .menu {
      position: sticky;
      top: 0;
      display: flex;
      flex-direction: column;
      padding: 8px 16px;
      border-right: 1px solid darkgray;
      width: fit-content;
  }

  .group-title {
      font-size: medium;
      font-weight: bold;
      margin: 10px 0 8px;
  }

  .component-name {
      margin: 0 0 0 8px;
      cursor: pointer;
  }

  .active {
      color: coral;
  }

  .component-name:hover {
      color: darkgray;
  }

  .component-view {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
  }
</style>

<div class='view'>
  <div class='menu'>
    {#each Object.entries(componentGroups) as [group, components]}
      <div class='group-title'>{group}</div>
      {#each components as component}
        <div
          class='component-name'
          class:active={activeComponent.name === component.name}
          on:click={() => activeComponent = component}
        >
          {component.name}
        </div>
      {/each}
    {/each}
  </div>
  <div class='component-view'>
    <svelte:component this={activeComponent.comp}/>
  </div>
</div>
