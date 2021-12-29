<script>
  import Input from 'components/Input.svelte';
  import Select from 'components/Select.svelte';
  import Duration from 'components/Duration.svelte';
  import {createEventDispatcher} from 'svelte';
  import RecordInput
    from 'components/RecordInput.svelte';
  let dispatch = createEventDispatcher();
  export let config = [];
  const Components = {
    'input': Input,
    'select': Select,
    'duration': Duration,
    'record': RecordInput,
  }

  const handleSubmit = () => {
    let isValid = true;
    for (const field of config) {
      delete field.error;
      if (field.required && (
        field.value === undefined ||
        field.value === null ||
        field.value === ''
      )) {
        isValid = false;
        field.error = 'required';
      }
    }

    config = config;

    if (!isValid) {
      return;
    }
    dispatch('submit');
  }
</script>

<style>
  .field {
      margin: 8px 20px;
      display: flex;
      flex-direction: column;
  }

  .form {
      display: flex;
      flex-direction: column;
      flex: 3;
      padding: 10px 0 0 0;
  }

  .error {
      color: red;
  }
</style>

<form class='form' on:submit|preventDefault={handleSubmit} aria-invalid='true'>

  {#each config as field}

    {#if field.path || field.name}
      <div class='field'>
        <label
          for={field.name || field.id}
          class:error={!!field.error}
        >
          {field.label} {#if field.required}*{/if}
        </label>
        {#if Components[field.component]}
          <svelte:component
            this={Components[field.component]}
            bind:field={field}
          />
        {:else}
          <Input
            bind:field={field}
          />
        {/if}
      </div>
    {/if}

  {/each}
  <slot/>
  <input type="submit" style="position: absolute; left: -9999px"/>

</form>
