import { mount } from '@test'
import Workbench from '~/components/Workbench.vue'

describe('Workbench', () => {
  let wrapper, vm
  beforeEach(() => {
    wrapper = mount(Workbench, {
      // provide stubs for all children
      stubs: Object.keys(Workbench.components),
    })
    vm = wrapper.vm
  })

  describe('route guards', () => {
    it('should attempt a redirect if no sessionID/userID provided', () => {
      // stub in a mock router
      vm.$router = {
        replace: sinon.spy(),
      }

      // call the route guard with the next callback
      vm.$options.beforeRouteEnter(null, null, cb => cb(vm))

      // no sessionID set on vm, so route event should have been triggered
      expect(vm.$router.push.called).to.equal(true)
    })

    it('should not attempt a redirect if a sessionID/userID is provided', () => {
      // stub in a mock router
      vm.$router = {
        push: sinon.spy(),
      }
      vm.$store.commit('setSessionID', 'test')
      vm.$store.commit('setUserID', 1)

      // call the route guard with the next callback
      vm.$options.beforeRouteEnter(null, null, cb => cb(vm))

      // no routing event expected
      expect(vm.$router.push.called).to.equal(false)
    })
  })
})
