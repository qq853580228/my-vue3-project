<template>
  <!-- <svg-icon :name="item.meta && item.meta.icon" /> -->
  <icon-font :type="item.meta && item.meta.icon" />
  <span class="menu-title" :title="hasTitle(item.meta.title)">{{ item.meta.title }}</span>
</template>

<script setup name="MenuItemContent">

defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});
const hasTitle = title => {
  return title.length > 5 ? title : '';
}
</script>
