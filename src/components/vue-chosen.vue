<template>
  <select :data-placeholder="placeholder" :multiple="multiple" :disabled="disabled" id="taphouseSelect" class="chosen-select">
    <option v-for="option in localOptions" v-bind:key="option[trackBy]" v-bind:value="option[trackBy]">
      {{ option[label] }}
    </option>
  </select>
</template>

<script>
/* eslint-disable */
import $ from 'jquery';

window.$ = window.jQuery = $;

import chosen from 'chosen-js';

export default {
  props: {
    value: {
      type: [String, Number, Array, Object],
      default: null,
    },
    options: {
      type: [Array, Object],
      default: () => [],
    },
    label: {
      type: String,
      default: 'label',
    },
    trackBy: {
      type: String,
      default: 'id',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: 'Select',
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    searchableMin: {
      type: Number,
      default: 1,
    },
    allowEmpty: {
      type: Boolean,
      default: true,
    },
    allowAll: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onValueReturn: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    localOptions() {
      const vm = this;
      const options = [];
      if (this.allowAll) {
        options.push({
          [this.trackBy]: -1,
          [this.label]: 'All',
        });
      }

      if (Array.isArray(this.options)) {
        return options.concat(this.options);
      }

      Object.keys(this.options).forEach((key) => {
        options.push({
          [vm.trackBy]: key,
          [vm.label]: vm.options[key],
        });
      });

      return this.allowEmpty
        ? [{ [this.trackBy]: null, [this.label]: '' }].concat(options)
        : options;
    },
    localValue() {
      const value = this.allowAll && this.value === null ? -1 : this.value;
      this.$nextTick(function () {
        $(this.$el).val(value).trigger('chosen:updated');
      });
      return value;
    },
  },
  watch: {
    localValue() {},
    localOptions() {
      this.$nextTick(function () {
        const value = this.allowAll && this.value === null ? '-1' : this.value;
        $(this.$el).val(value).trigger('chosen:updated');
      });
    },
  },
  mounted() {
    $(this.$el).chosen()
      .change(($event) => {
        const value = $($event.target).val();
        if (typeof this.onValueReturn[value] !== 'undefined') {
          return this.$emit('input', this.onValueReturn[value]);
        }
        if (this.allowAll && ($($event.target).val() === '-1' || $($event.target).val() === -1)) {
          return this.$emit('input', null);
        }
        this.$emit('input', $($event.target).val());
        return 0;
      });
  },
};
</script>
