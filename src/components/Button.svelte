<script>
  export let style = 'primary';
  export let type = 'button';
</script>

<style>
    button {
        display: flex;
        padding: 10px 20px;
        justify-content: center;
        align-items: center;
        transition: .2s;
    }

    button:hover {
        cursor: pointer;

    }

    .primary {
        background-color: #D10086;
        color: white;
        font-weight: bold;
        font-size: 20px;
    }

    .primary:hover {
        background-color: #a9006e;
    }

    .secondary {
        color: #000;
        padding: 10px 4px;
        font-weight: bold;
        font-size: 20px;
    }

    .secondary:hover {
        color: #a9006e;
    }
</style>

<button
  class={style}
  on:click
  type={type}
>
  <slot></slot>
</button>
