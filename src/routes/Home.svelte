<script>
  import {
    signIn,
    signUp,
  } from 'api';
  import {
    serialize,
  } from 'common';
  import {
    auth,
    menuItems,
  } from 'stores';
  import Menu from 'components/Menu.svelte';
  import Modal from 'components/Modal.svelte';
  import Form from 'components/Form.svelte';
  import Button from 'components/Button.svelte';
  import Map from 'scenes/Map.svelte';
  import LocationOverview from 'scenes/LocationOverview.svelte';

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

  const onLogin = () => {
    signIn(serialize(form))
      .then(res => {
        if (!res.ok) {
          loginError = 'Failed to login.'
          return;
        }
        loginError = '';
        auth.setAuth(res.body);
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
        delete signupForm[2].value;
      })
  }

  const updateMenu = () => {
    if ($auth.access) {
      menuItems.register('logout', {
        label: 'Log out',
        onClick: auth.logout,
      })
      menuItems.unregister('login');
      menuItems.unregister('signup');
    } else {
      menuItems.register('login', {
        label: 'Login',
        onClick: () => loginVisible = true,
      })

      menuItems.register('signup', {
        label: 'Register',
        onClick: () => signupVisible = true,
      })
      menuItems.unregister('logout');
    }
  }

  $: $auth, updateMenu();

</script>

<style>
    div {
        display: flex;
        justify-content: space-between;
        margin: 20px;
    }
</style>

<Map/>

<LocationOverview/>

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
      Register
    </Button>
  </div>
</Modal>

