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

<form class='form' on:submit>

  {#each config as field}

    {#if field.path}
      <Input
        bind:field={field}
      />
    {/if}

  {/each}
  <input type="submit" style="position: absolute; left: -9999px"/>

</form>
