<script>
   // TODO: Make this pretty
   export let field = {};
</script>

<style>
  div {
      margin: 20px;
  }
</style>
<div>
  <label for={field.name || field.id}>{field.label}</label>
  <input
    id={field.name || field.id}
    type='text'
    bind:value={field.value}
  />
</div>
