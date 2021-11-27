<script>
  import Input from 'components/Input.svelte';
  export let config = {};
</script>

<style>
  .form {
      display: flex;
      flex-direction: column;
      flex: 3;
  }
</style>

<div class='form'>

  {#each config as field}

    {#if field.path}
      <Input
        bind:field={field}
      />
    {/if}

  {/each}

</div>
