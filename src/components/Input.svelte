<script>
   export let field = {};
</script>
<label>{field.label}</label>
<input
  type='text'
  bind:value={field.value}
/>
