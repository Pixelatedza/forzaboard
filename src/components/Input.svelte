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
    type='text'
    {...field.props}
    id={field.name || field.id}
    bind:value={field.value}
  />
</div>
