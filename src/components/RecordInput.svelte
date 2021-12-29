<script>
  import Input from 'components/Input.svelte';
  import {InputPatterns} from 'common';
  export let field = {};
  let internalField = {
    pattern: InputPatterns.Decimal,
    ...field,
    value: (field.value | 0) / 1000,
  };

  $: field.value = internalField.value * 1000;
</script>

<Input
  bind:field={internalField}
/>
