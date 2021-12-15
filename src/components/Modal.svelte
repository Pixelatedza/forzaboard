<script>
  import {fade} from 'svelte/transition';
  import {clickOutside} from 'actions';

  export let autoHide = true;
  export let visible = false;
  let modal;
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
  <div bind:this={modal} class='layer' transition:fade={{duration: 150}}>
    <div class='modal' use:clickOutside on:clickOutside={() => visible = false}>
      <slot></slot>
    </div>
  </div>
{/if}
