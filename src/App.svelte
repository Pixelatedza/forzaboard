<script>
  import Canvas from 'components/Canvas.svelte';
  import {
    getLocations,
    signIn,
  } from 'api';
  import {
    addImage,
    serialize,
    parseJwt,
    addMarker,
    Environment,
  } from 'common';
  import Menu from 'components/Menu.svelte';
  import Modal from 'components/Modal.svelte';
  import Form from 'components/Form.svelte';
  import Button from 'components/Button.svelte';

  const mapLocations = [];
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
      props: {
        type: 'password',
      }
    },
  ];
  const onLogin = () => {
    signIn(serialize(form))
    .then(data => {
      const claims = parseJwt(data.access);
      auth = {
        access: data.access,
        refresh: data.refresh,
        permissions: new Set(claims.permissions),
        isStaff: claims.isStaff,
        isSuperuser: claims.isSuperuser,
        lastLogin: claims.lastLogin,
        userId: claims.user_id
      }
      loginVisible = false;
      enableEdit();
      // TODO: Fix this nonsense
      delete form[0].value;
      delete form[1].value;
    });
  }

  // TODO: Move all this stuff to a better place.
  const enableEdit = () => {

    if (!auth.isSuperuser) {
      return;
    }

    for (const {group, info} of mapLocations) {

      const text = new Konva.Text({
        text: info.name,
        fontSize: 30,
        fontStyle: 'bold',
        fontFamily: 'Roboto',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
      })

      text.x(text.width() / -2);
      text.y(text.height() * -1.5);
      group.add(text);
      group.setDraggable(true);
      group.on('dragend', () => {
        const pointerOnLayer = layer.getRelativePointerPosition();
        const pointerOnGroup = group.getRelativePointerPosition()
        const pos = {
          x: pointerOnLayer.x - pointerOnGroup.x,
          y: pointerOnLayer.y - pointerOnGroup.y
        };
        fetch(`${Environment.apiHref}/locations/${info.id}`, {
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
    }

    stage.on('dblclick', () => {
      const pos = stage.getRelativePointerPosition();
      pos.draggable = true;
      fetch(`${Environment.apiHref}/locations`, {
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
      }).then(res => {
        const group = new Konva.Group({
          x: pos.x,
          y: pos.y,
          draggable: true,
        })
        addMarker(group);
        layer.add(group);
        mapLocations.push({
          info: res,
          group,
        })
      })
    })
  }

  const onStageReady = () => {

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
          const group = new Konva.Group({
            x: location.xCoord,
            y: location.yCoord,
          })

          addMarker(group)
          mapLocations.push({
            info: location,
            group,
          });
          layer.add(group);
        }
      }).catch(e => console.error(e));
  }
</script>

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
    on:submit={onLogin}
  />
  <div>
    <Button style={'secondary'} on:click={() => loginVisible = false}>Cancel</Button>
    <Button
      on:click={onLogin}
    >
      Login
    </Button>
  </div>
</Modal>

