import { defineStore } from 'pinia';


const keepAlive = defineStore('keepAlive', {
  state: () => {
    return {
      list: [],
    }
  },
  actions: {
    add(name) {
      if (typeof name === 'string') {
        !this.list.includes(name) && this.list.push(name);
      } else {
        name.map((v) => {
          v && !this.list.includes(v) && this.list.push(v);
        });
      }
    },
    delete(name) {
      if (typeof name === 'string') {
        this.list = this.list.filter(v => v !== name);
      } else {
        this.list = this.list.filter(v => !name.includes(v));
      }
      console.log('keepAlive', this.list);
    },
    clear() {
      this.list = [];
    },
  }
});

export default keepAlive;