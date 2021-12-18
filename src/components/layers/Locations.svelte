<script>
  import {
    CONTEXTS,
  } from 'common';
  import {getContext} from 'svelte';
  import {getLocations} from 'api';
  import Location from 'components/Location.svelte';
  import {auth} from 'stores';

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

  // Refetch locations when auth changes
  $: $auth.access, getLocations()
    .then(res => {
      if (!res.ok) {
        return;
      }

      locations = [...res.body];
    }).catch(e => console.error(e));

  stage.add(layer);
</script>

{#each locations as location}
  <Location
    layer={layer}
    location={location}
  />
{/each}
