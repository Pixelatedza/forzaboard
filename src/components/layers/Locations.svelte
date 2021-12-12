<script>
  import {
    CONTEXTS,
  } from 'common';
  import {getContext} from 'svelte';
  import {getLocations} from 'api';
  import Location from 'components/Location.svelte';

  const {getStage} = getContext(CONTEXTS.CANVAS);
  const stage = getStage();
  const layer = new Konva.Layer()

  let locations = [];

  layer.on('mouseover', () => {
    document.body.style.cursor = 'pointer';
  });

  layer.on('mouseout', () => {
    document.body.style.cursor = 'default';
  });

  getLocations()
    .then(res => {
      if (!res.ok) {
        return;
      }

      locations = [...res.body];
      // for (const location of res.body) {
      //   const group = new Konva.Group({
      //     x: location.x,
      //     y: location.y,
      //   })
      //
      //   addMarker(group)
      //   mapLocations.push({
      //     info: location,
      //     group,
      //   });
      //   layer.add(group);
      // }
      // user.subscribe(enableEdit);
    }).catch(e => console.error(e));

  stage.add(layer);
</script>

{#each locations as location}
  <Location
    layer={layer}
    location={location}
  />
{/each}
