<script>
  import Router from 'svelte-spa-router';
  import Home from 'routes/Home.svelte';
  import Components from 'routes/Components.svelte';

  const routes = {
    '/': Home,
    '/components': Components,
  }
</script>

<Router {routes}/>
