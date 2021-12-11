<script>
  import {fade} from 'svelte/transition';
  import {onMount} from 'svelte';
  export let visible = false;
  let modal;
  const onClickOutside = e => {
    if (modal.contains(e.target)) {
      return;
    }

    visible = false;
  }

  $: visible && window.addEventListener('click', onClickOutside, true) && console.log('here');
  $: !visible && window.removeEventListener('click', onClickOutside, true)  && console.log('here')

  onMount(() => () => {
    window.removeEventListener('click', onClickOutside);
  })
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
    <div class='modal'>
      <slot></slot>
    </div>
  </div>
{/if}
