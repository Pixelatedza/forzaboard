<script>
  import {fade} from 'svelte/transition';
  export let visible = false;
</script>

<style>
  .layer {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      pointer-events: none;
  }

  .modal {
      pointer-events: auto;
      background-color: white;
  }
</style>

{#if visible}
  <div class='layer' transition:fade={{duration: 150}}>
    <div class='modal'>
      <slot></slot>
    </div>
  </div>
{/if}
