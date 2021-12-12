<script>
  import {
    addMarker,
  } from 'common';
  import {onMount} from 'svelte';
  import {auth} from 'stores';
  import {updateLocation} from 'api';

  export let location = {};
  export let layer;

  const group = new Konva.Group({
    x: location.x,
    y: location.y,
  });

  addMarker(group);
  !layer
    ? console.warn('Location has no layer')
    : layer.add(group);

  onMount(() => () => {
    group.destroy();
  })

  const text = new Konva.Text({
    text: location.name,
    fontSize: 30,
    fontStyle: 'bold',
    fontFamily: 'Roboto',
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
  })

  text.x(text.width() / -2);
  text.y(text.height() * -1.5);

  const onGroupDragEnd = () => {
    const pointerOnLayer = layer.getRelativePointerPosition();
    const pointerOnGroup = group.getRelativePointerPosition()
    const pos = {
      x: pointerOnLayer.x - pointerOnGroup.x,
      y: pointerOnLayer.y - pointerOnGroup.y
    };
    updateLocation(location.uuid, {
      x: Math.floor(pos.x),
      y: Math.floor(pos.y),
    })
    // fetch(`${Environment.apiHref}/locations/${location.uuid}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({
    //     x: Math.floor(pos.x),
    //     y: Math.floor(pos.y)
    //   }),
    //   headers: {
    //     'content-type': 'application/json',
    //     'Authorization': `Bearer ${auth.access}`,
    //   }
    // })
  }

  // React to auth changes
  $: {
    if ($auth.isSuperuser) {
      group.add(text);
      group.setDraggable(true);
      group.on('dragend', onGroupDragEnd);
    } else {
      text.remove();
      group.setDraggable(false);
      group.off('dragend', onGroupDragEnd);
    }
  }

</script>
