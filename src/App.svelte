<script>
  import Canvas from 'components/Canvas.svelte';
  let stage, layer;

  const addImage = (src, layer, options) => {
    const image = new Image();
    image.onload = () => {
      let bg = new Konva.Image({
        x: 0,
        y: 0,
        image: image,
        ...options
      });

      layer.add(bg);
    }
    image.src = src;
  }

  $: if (stage) {
    console.log('here');
    const bg = new Konva.Layer();
    layer = new Konva.Layer()
    stage.add(bg);
    stage.add(layer);
    addImage('/images/map.jpg', bg);
    fetch('/api/events.json')
      .then(r => r.json())
      .then(events => {
        for (const event of events) {
          addImage('https://upload.wikimedia.org/wikipedia/commons/4/48/Light_Blue_Circle.svg', layer, event);
        }
      });

    layer.on('mouseover', function (evt) {
      const shape = evt.target;
      document.body.style.cursor = 'pointer';
      shape.scaleX(1.2);
      shape.scaleY(1.2);
    });

    layer.on('mouseout', function (evt) {
      const shape = evt.target;
      document.body.style.cursor = 'default';
      shape.scaleX(1);
      shape.scaleY(1);
    });
  }
</script>

<Canvas bind:stage={stage}/>

