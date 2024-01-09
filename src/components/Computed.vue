<template>
	<p>{{ num }}</p>
	<p>{{ double1 }}</p>
	<input type="text" v-model="double2">
	<a-button type="primary">button</a-button>
	<div v-for="(item, index) in items" :key="item">
		{{ item }}
	</div>
	<button @click="itemAdd">新增一个item</button>
</template>

<script>
export default {
	name: 'Computed',
	components: {

	},
	setup(props, context) {
		console.log('context', context);
	},
	data() {
		return {
			num: 20,
			items: [0, 1, 2],
			name: 'zhangsan',
		}
	},
	computed: {
		double1() {
			return this.num * 2;
		},
		double2: {
			get() {
				return this.num * 4;
			},
			set(val) {
				this.num = val / 4;
			},
		}
	},
	mounted() {
		console.log('onMounted');
	},
	methods: {
		itemAdd() {
			this.items.unshift(this.items.length);
		},
	},
}
</script>

<style scoped>
.a {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}
</style>