import { hasPermission } from '@/utils/permission/hasPermission';

export const permission = {
  mounted(el, binding) {
    if (binding.value == undefined) return;

    const { action, effect } = binding.value;
    // 如果action不传，则认为不需要授权认证
    if (action == undefined) {
      return;
    }
    // console.log(vnode.ref.i.ctx.hasPermission(action), '虚拟')
    if (!hasPermission(action)) {
      if (effect == 'disabled') {
        el.disabled = true;
        el.setAttribute('title', '没有权限');
      } else {
        el.remove();
      }
      console.log(action, effect);
    }
  },
};
