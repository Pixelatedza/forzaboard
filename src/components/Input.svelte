<script>
   // TODO: Make this pretty
   export let field = {};
   let previous = field.value;

   $: {
     if (field.value && field.pattern && !field.value.match(field.pattern)) {
       field.value = previous;
     } else {
       previous = field.value;
     }
   }
</script>

<style>
  input {
      box-sizing: border-box;
      width: 100%;
  }
</style>

<input
  type='text'
  {...field.props}
  id={field.name || field.id}
  bind:value={field.value}
/>
