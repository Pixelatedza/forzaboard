<script>
  import {
    addMarker,
    addSVG,
  } from 'common';
  import {onMount} from 'svelte';
  import {auth, location as locationStore} from 'stores';
  import {
    updateLocation,
  } from 'api';

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

  addSVG(`/images/forza/icons/${location.kind}.svg`, group, {
    x: -24,
    y: -58,
    width: 48,
    height: 48,
  });

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

  group.on('mouseup', () => {
    locationStore.set(location);
  })

</script>
