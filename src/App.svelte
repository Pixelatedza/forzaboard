<script>
  import Canvas from 'components/Canvas.svelte';
  import {
    getLocations,
    signIn,
  } from 'api';
  import {addImage, serialize} from 'common';
  import Menu from 'components/Menu.svelte';
  import Modal from 'components/Modal.svelte';
  import Form from 'components/Form.svelte';
  import Button from 'components/Button.svelte';

  let stage, layer, auth;
  let loginVisible = false;
  let form = [
    {
      path: 'username',
      label: 'Username',
    },
    {
      path: 'password',
      label: 'Password',
    },
  ];
  const onLogin = () => {
    signIn(serialize(form))
    .then(data => {
      auth = data
      loginVisible = false;
      // TODO: Fix this nonsense
      delete form[0].value;
      delete form[1].value;
    });
  }

  const onStageReady = () => {

    // TODO: Move all this stuff to a better place.
    const map = new Konva.Layer();
    addImage('/images/map.jpg', map);
    stage.add(map);

    layer = new Konva.Layer()

    layer.on('mouseover', () => {
      document.body.style.cursor = 'pointer';
    });

    layer.on('mouseout', () => {
      document.body.style.cursor = 'default';
    });

    stage.add(layer);

    getLocations()
      .then(locations => {
        if (locations.statusCode) {
          return;
        }
        for (const location of locations) {
          addImage('https://upload.wikimedia.org/wikipedia/commons/4/48/Light_Blue_Circle.svg', layer, {
            x: location.xCoord,
            y: location.yCoord,
            draggable: true,
          }).then(image => {
            image.on('dragend', e => {
              const pos = image.position();
              fetch(`/api/locations/${location.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                  xCoord: Math.floor(pos.x),
                  yCoord: Math.floor(pos.y)
                }),
                headers: {
                  'content-type': 'application/json',
                  'Authorization': `Bearer ${auth.access}`,
                }
              })
            })
          });
        }
      }).catch(e => console.error(e));

    stage.on('dblclick', (e) => {
      const pos = stage.getRelativePointerPosition();
      pos.x -= 13;
      pos.y -= 13;
      pos.draggable = true;
      addImage('https://upload.wikimedia.org/wikipedia/commons/4/48/Light_Blue_Circle.svg', layer, pos);
      fetch('/api/locations', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Testing',
          xCoord: Math.floor(pos.x),
          yCoord: Math.floor(pos.y)
        }),
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${auth.access}`,
        }
      })
    })
  }
</script>

<link rel='icon' type='image/png' href='F_small.png'>
<style>
  div {
      display: flex;
      justify-content: space-between;
      margin: 20px;
  }
</style>

<Canvas
  bind:stage={stage}
  on:stageReady={onStageReady}
/>

<Menu on:click={() => loginVisible = true}/>
<Modal
  bind:visible={loginVisible}
>
  <Form
    bind:config={form}
  />
  <div>
    <Button style={'secondary'} on:click={() => loginVisible = false}>Cancel</Button>
    <Button on:click={onLogin}>Login</Button>
  </div>
</Modal>

