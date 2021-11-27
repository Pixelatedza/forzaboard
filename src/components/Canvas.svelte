<script>
  import {onMount} from 'svelte';

  export let stage = null;
  let scaleBy = 1.1;
  let container;

  const resize = () => {
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
  }

  onMount(() => {
    const {width, height} = container.getBoundingClientRect();
    stage = new Konva.Stage({
      container: container,
      width,
      height,
      draggable: true,
    });

    stage.on('wheel', (e) => {
      // e.evt.preventDefault();
      let oldScale = stage.scaleX();
      let pointer = stage.getPointerPosition();

      let mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      let newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });
      let newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
    });
  });
//  bind:innerHeight={h} bind:innerWidth={w}
</script>

<style>
  div {
      flex: 1 0 auto;
      background-color: #333;
  }
</style>
<svelte:window on:resize|passive={resize}/>
<div bind:this={container}></div>
