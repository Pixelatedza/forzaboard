<script>
  import RadioButton from './RadioButton.svelte'
  export let options = [];
  let values = {}
</script>
<style>
    div {
        display: flex;
        flex-direction: column;
    }
</style>

<div>
  {#each options as option, i }
    <RadioButton bind:value={values[option.name]}/>
  {/each}
</div>
