<script>
  import {onMount} from 'svelte';

  let open = false;
  let toggle, menu;
  const onClickOutside = e => {
  // TODO: Make it hide when a menu item was clicked
    if (toggle.contains(e.target) || menu.contains(e.target)) {
      return;
    }

    open = false;
  }

  window.addEventListener('click', onClickOutside)

  onMount(() => () => {
    window.removeEventListener('click', onClickOutside);
  })
</script>

<style>
    #toggle {
        position: fixed;
        width: 28px;
        height: 30px;
        margin: 20px 0 0 20px;
    }

    #toggle:hover {
        cursor: pointer;
    }

    #toggle div {
        position: relative;
        width: 100%;
        height: 5px;
        background-color: #FFF;
        margin: 4px auto;
        transition: all 0.3s;
        backface-visibility: hidden;
        border-radius: 2px;
    }

    #toggle.open .two {
        background-color: transparent;
    }
    #toggle.open .one {
        transform: rotate(45deg) translate(5px, 5px);
    }
    #toggle.open .three {
        transform: rotate(-45deg) translate(7px, -8px);
    }
    #toggle.open + #menu {
        opacity: 1;
        visibility: visible;
    }

    #menu {
        position: absolute;
        color: #999;
        width: 200px;
        padding: 10px;
        margin: 60px 0 0 20px;
        font-family: "Segoe UI", Candara, "Bitstream Vera Sans", "DejaVu Sans", "Bitstream Vera Sans", "Trebuchet MS", Verdana, "Verdana Ref", sans-serif;
        text-align: center;
        border-radius: 4px;
        background: white;
        box-shadow: 0 1px 8px rgba(0,0,0,0.05);
        opacity: 0;
        visibility: hidden;
        transition: opacity .4s;
    }
    ul, li, li div {
        list-style: none;
        display: block;
        margin: 0;
        padding: 0;
    }
    li div {
        padding: 5px;
        color: #888;
        text-decoration: none;
        transition: all .2s;
    }
    li div:hover,
    li div:focus {
        cursor: pointer;
        background: #D10086;
        color: #fff;
    }
</style>

<div id="toggle" class:open={open} on:click={() => open = !open} bind:this={toggle}>
  <div class="one"></div>
  <div class="two"></div>
  <div class="three"></div>
</div>
<div id="menu" bind:this={menu}>
  <ul>
    <!-- TODO: onclick should be more generic, hardcode for now, config will fix this -->
    <!-- TODO: Menu should be given a config to display menu items -->
    <li><div id='menu-login' on:click>Login</div></li>
  </ul>
</div>
