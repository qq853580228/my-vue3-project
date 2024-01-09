<script lang="jsx">
  export default defineComponent({
    setup() {
      const comp = ref('demo1');
      setTimeout(() => {
        comp.value = 'Demo1';
      }, 1000);
      return () => 
        <>
          <a-button type="primary">{comp.value}</a-button>
        </>
    }
  })
</script>