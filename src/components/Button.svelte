<script>
  export let style = 'primary';
</script>

<style>
    div {
        display: flex;
        padding: 10px 20px;
        justify-content: center;
        align-items: center;
        transition: .2s;
    }

    div:hover {
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
        font-weight: bold;
        font-size: 20px;
    }

    .secondary:hover {
        color: #a9006e;
    }
</style>

<div class={style} on:click>
  <slot></slot>
</div>
