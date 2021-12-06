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
  <label>{field.label}</label>
  <input
    type='text'
    bind:value={field.value}
  />
</div>
