<script>

  export let json = {};
  export let disabled = false;
  let error = null;
  $: value = JSON.stringify(json, null, 2);

  const onChange = e => {

    try {
      json = JSON.parse(e.target.value);
      error = null;
    } catch (e) {

      if (e instanceof SyntaxError) {
        error = e.message;
        return;
      }

      alert(e.message);
    }
  }

</script>

<style>

  textarea {
      display: flex;
      flex: 1;
      resize: none;
  }

  .data {
      display: flex;
      flex-direction: column;
      flex: 1;
  }

  .error {
      background-color: darkred;
      color: white;
      display: flex;
      padding: 10px;
  }
</style>

<div class='data'>

  <textarea
    on:input={onChange}
    disabled={disabled}
  >{value}</textarea>

  {#if error}
    <div class='error'>{error}</div>
  {/if}
</div>
