<script>

  let value = false;
  const onClick = () => {
    value = !value;
  };
</script>

<style>
    .parent {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: 2px solid black;
        background-color: white;
        width: 30px;
        height: 30px;
    }

    .child {
        border-radius: 50%;
        background-color: dodgerblue;
        width: 20px;
        height: 20px;
    }
</style>

<div class='parent' on:click={onClick}>
  {#if value}
    <div class='child'></div>
  {/if}
</div>
