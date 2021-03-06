import { VantComponent } from '../common/component';

// Note that the bitwise operators and shift operators operate on 32-bit ints
// so in that case, the max safe integer is 2^31-1, or 2147483647
const MAX = 2147483647;

VantComponent({
  field: true,

  classes: [
    'input-class',
    'plus-class',
    'minus-class'
  ],

  props: {
    value: null,
    integer: Boolean,
    disabled: Boolean,
    asyncChange: Boolean,
    disableInput: Boolean,
    min: {
      type: null,
      value: 1
    },
    max: {
      type: null,
      value: MAX
    },
    step: {
      type: null,
      value: 1
    }
  },

  computed: {
    minusDisabled() {
      return this.data.disabled || this.data.value <= this.data.min;
    },

    plusDisabled() {
      return this.data.disabled || this.data.value >= this.data.max;
    }
  },

  watch: {
    value(value) {
      if (value !== '') {
        this.set({
          value: this.range(value)
        });
      }
    }
  },

  data: {
    focus: false
  },

  created() {
    this.set({
      value: this.range(this.data.value)
    });
  },

  methods: {
    onFocus() {
      this.setData({
        focus: true
      });
    },

    // limit value range
    range(value) {
      return Math.max(Math.min(this.data.max, value), this.data.min);
    },

    onInput(event: Weapp.Event) {
      const { value = '' } = event.detail || {};
      this.triggerInput(value);
    },

    onChange(type) {
      if (this.data[`${type}Disabled`]) {
        this.$emit('overlimit', type);
        return;
      }

      const diff = type === 'minus' ? -this.data.step : +this.data.step;
      const value = Math.round((this.data.value + diff) * 100) / 100;
      this.triggerInput(this.range(value));
      this.$emit(type);
    },

    onBlur(event: Weapp.Event) {
      const value = this.range(this.data.value);
      this.triggerInput(value);
      this.$emit('blur', event);
    },

    onMinus() {
      this.onChange('minus');
    },

    onPlus() {
      this.onChange('plus');
    },

    triggerInput(value: string) {
      this.set({
        value: this.data.asyncChange ? this.data.value : value
      });
      this.$emit('change', value);
    }
  }
});
