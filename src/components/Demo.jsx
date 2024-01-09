
export default defineComponent({
  setup() {
    const comp = ref('demo');
    setTimeout(() => {
      comp.value = 'Demo'
    }, 1000);
    return () => 
    <>
      <div>{comp.value}</div>
    </>
  }
})
