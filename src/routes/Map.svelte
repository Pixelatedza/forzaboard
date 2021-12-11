<script>
  import Canvas from 'components/Canvas.svelte';
</script>

<Canvas
  bind:stage={stage}
  on:stageReady={onStageReady}
/>
