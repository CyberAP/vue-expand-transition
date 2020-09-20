import Vue, { VNode } from 'vue';

export const ExpandTransition = Vue.extend({
  name: 'ExpandTransition',
  props: {
    name: {
      type: String,
      default: 'expand-transition'
    },
    duration: {
      type: [String, Number],
      default: 200
    },
    delay: [Number, String],
    timingFunction: String,
  },
  data(): { height: number | null } {
    return {
      height: null,
    }
  },
  methods: {
    enter(el: HTMLElement) {
      this.$emit('enter', el);
      const container = this.$refs.container as HTMLElement;
      const startHeight = this.height;

      // do not let current height affect final height
      this.height = null;

      // wait for height to sync
      this.$nextTick(() => {
        // container height will respect margin collapsing of inserted element
        const endHeight = container.clientHeight;
        this.height = startHeight;

        // wait for microtasks to finish
        setTimeout(() => {
          this.height = endHeight;
        });
      });
    },
    leave(el: HTMLElement) {
      this.$emit('leave', el);
      const container = this.$refs.container as HTMLElement;

      // toggle between single and cross-transition
      if (container.children.length === 1) {
        this.height = container.clientHeight;

        // wait for microtasks to finish
        setTimeout(() => {
          this.height = 0;
        });
      }

      el.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%';
    },
    beforeEnter(el: HTMLElement) {
      this.$emit('beforeEnter', el);
      el.style.transitionDuration = this.transitionDuration;
      el.style.transitionDelay = this.transitionDelay;
      // sync on beforeEnter so element is not yet inserted, i.e. doesn't affect container height
      const container = this.$refs.container as HTMLElement;
      this.height = container.clientHeight;
    },
    beforeLeave(el: HTMLElement) {
      this.$emit('beforeLeave', el);
      el.style.transitionDuration = this.transitionDuration;
      el.style.transitionDelay = this.transitionDelay;
    },
    afterLeave(el: HTMLElement) {
      this.$emit('afterLeave', el);
      this.height = null;
    },
    afterEnter(el: HTMLElement) {
      this.$emit('afterEnter', el);
      this.height = null;
    },
  },
  computed: {
    transitionDuration() {
      return `${this.duration}ms`;
    },
    transitionDelay() {
      return `${this.delay}ms`;
    },
    restListeners() {
      const {
        leaveCancelled,
        enterCancelled,
      } = this.$listeners;
      return {
        leaveCancelled,
        enterCancelled,
      };
    },
  },
  render(h): VNode {
    const {
      duration,
      transitionDuration,
      transitionDelay,
      timingFunction,
      height,
      name,
      enter,
      leave,
      beforeEnter,
      afterEnter,
      beforeLeave,
      afterLeave,
      restListeners,
    } = this;

    return h(
      'div',
      {
        attrs: {
          style: {
            overflow: 'hidden',
            position: 'relative',
            transitionProperty: 'height',
            transitionDuration,
            transitionTimingFunction: timingFunction,
            transitionDelay,
            height: height !== null ? `${height}px` : null,
          },
        },
        ref: 'container'
      },
      [
        h(
          'transition',
          {
            props: {
              name,
              duration,
            },
            on: {
              enter,
              leave,
              beforeEnter,
              afterEnter,
              beforeLeave,
              afterLeave,
              ...restListeners,
            },
          },
          this.$slots.default,
        )
      ]
    );
  }
});