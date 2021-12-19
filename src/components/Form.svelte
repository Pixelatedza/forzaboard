<script>
  import Input from 'components/Input.svelte';
  export let config = {};
</script>

<style>
  .form {
      display: flex;
      flex-direction: column;
      flex: 3;
      padding: 10px 0 0 0;
  }
</style>

<form class='form' on:submit|preventDefault>

  {#each config as field}

    {#if field.path}
      <Input
        bind:field={field}
      />
    {/if}

  {/each}
  <input type="submit" style="position: absolute; left: -9999px"/>

</form>
