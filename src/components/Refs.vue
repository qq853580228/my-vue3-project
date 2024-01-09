<template>
  <div class="container">
    <p class="abc">{{ age }}</p>
    <p>toRef - {{ state.info.title }}</p>
    <p>{{ newTitle }}</p>
    <p>{{ state.name }}</p>
    <p>user - {{ user.name }}</p>
  </div>
</template>

<script setup>
  const emits = defineEmits(['change']);
  console.log({emits});
  const age = ref(20);
  const name = ref('bls');
  let title = 'let title'
  setTimeout(() => {
    age.value = 22;
    state.age = 21;
    state.info.title = 'title1';
    user.age = 18;
  }, 1500);
  const state = reactive({
    name: name.value,
    age: 18,
    info: {
      title: 'title'
    }
  });
  const user = reactive({name: 'bls'});
  const newTitle = computed(() => age.value + '111');
  console.log(state.name);

</script>
<style scoped lang="less">
  .container {
    .abc {
      color: @primary-color;
      font-size: 36px;
    }
  }
</style>