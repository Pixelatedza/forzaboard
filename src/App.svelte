<script>
  import Canvas from 'components/Canvas.svelte';
  import {
    getLocations,
    signIn,
    signUp,
  } from 'api';
  import {
    addImage,
    serialize,
    parseJwt,
    addMarker,
    Environment,
  } from 'common';
  import {auth as user} from 'stores';
  import Menu, {register} from 'components/Menu.svelte';
  import Modal from 'components/Modal.svelte';
  import Form from 'components/Form.svelte';
  import Button from 'components/Button.svelte';

  const mapLocations = [];
  let stage, layer;
  let loginVisible = false;
  let signupVisible = false;
  let loginError = '';
  let signUpError = '';
  let form = [
    {
      path: 'email',
      label: 'Email',
    },
    {
      path: 'password',
      label: 'Password',
      props: {
        type: 'password',
      }
    },
  ];

  let signupForm = [
    {
      path: 'email',
      label: 'Email',
    },
    {
      path: 'password',
      label: 'Password',
      props: {
        type: 'password',
      }
    },
    {
      path: 'username',
      label: 'Username (optional)',
    },
  ];

  $: {
    console.log('user changed');
    console.log($user);
  }

  const onLogin = () => {
    signIn(serialize(form))
    .then(res => {
      if (!res.ok) {
        loginError = 'Failed to login.'
        return;
      }
      loginError = '';
      const claims = parseJwt(res.body.access);
      user.set({
        access: res.body.access,
        refresh: res.body.refresh,
        permissions: new Set(claims.permissions),
        isStaff: claims.isStaff,
        isSuperuser: claims.isSuperuser,
        lastLogin: claims.lastLogin,
        userId: claims.user_id
      });
      // auth = {
      //   access: res.body.access,
      //   refresh: res.body.refresh,
      //   permissions: new Set(claims.permissions),
      //   isStaff: claims.isStaff,
      //   isSuperuser: claims.isSuperuser,
      //   lastLogin: claims.lastLogin,
      //   userId: claims.user_id
      // }
      loginVisible = false;
      // TODO: Fix this nonsense
      delete form[0].value;
      delete form[1].value;
    })
  }

  const onSignUp = () => {
    signUp(serialize(signupForm))
      .then(res => {
        if (!res.ok) {
          signUpError = 'Failed to sign up.';
          return;
        }

        signUpError = '';

        loginVisible = true;
        signupVisible = false;
        // TODO: Fix this nonsense
        delete signupForm[0].value;
        delete signupForm[1].value;
      })
  }

  // TODO: Move all this stuff to a better place.
  const enableEdit = auth => {

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
        fetch(`${Environment.apiHref}/locations/${info.uuid}`, {
          method: 'PATCH',
          body: JSON.stringify({
            x: Math.floor(pos.x),
            y: Math.floor(pos.y)
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
          x: Math.floor(pos.x),
          y: Math.floor(pos.y)
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
      .then(res => {
        if (!res.ok) {
          return;
        }
        for (const location of res.body) {
          const group = new Konva.Group({
            x: location.x,
            y: location.y,
          })

          addMarker(group)
          mapLocations.push({
            info: location,
            group,
          });
          layer.add(group);
        }
        user.subscribe(enableEdit);
      }).catch(e => console.error(e));
  }

  register('login', {
    label: 'Login',
    onClick: () => loginVisible = true,
  })

  register('signup', {
    label: 'Sign Up',
    onClick: () => signupVisible = true,
  })

  register('logout', {
    label: 'Log out',
    onClick: user.logout,
  })
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

<Menu/>
<Modal
  bind:visible={loginVisible}
>
  <Form
    bind:config={form}
    on:submit={onLogin}
  />
  <p>{loginError}</p>
  <div>
    <Button style={'secondary'} on:click={() => loginVisible = false}>Cancel</Button>
    <Button
      on:click={onLogin}
    >
      Login
    </Button>
  </div>
</Modal>

<Modal
  bind:visible={signupVisible}
>
  <Form
    bind:config={signupForm}
    on:submit={onSignUp}
  />
  <p>{signUpError}</p>
  <div>
    <Button style={'secondary'} on:click={() => signupVisible = false}>Cancel</Button>
    <Button
      on:click={onSignUp}
    >
      Login
    </Button>
  </div>
</Modal>

