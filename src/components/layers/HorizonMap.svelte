<script>
  import {
    addImage,
    CONTEXTS,
  } from 'common';
  import {getContext} from 'svelte';

  const {getStage} = getContext(CONTEXTS.CANVAS);
  const stage = getStage();
  const map = new Konva.Layer();
  addImage('/images/map.jpg', map);
  stage.add(map);
</script>
