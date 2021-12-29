<script>
   // TODO: Make this pretty
   export let field = {};
</script>

<select bind:value={field.value}>
  <option value="">All</option>
  {#each Object.values(field.options || []) as option}
    <option value={option.value}>{option.label}</option>
  {/each}
</select>
