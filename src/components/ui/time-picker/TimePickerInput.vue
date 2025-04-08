<template>
    <Input
      :id="picker"
      :name="picker"
      :class="inputClasses"
      :value="calculatedValue"
      :defaultValue="calculatedValue"
      :type="type"
      inputmode="decimal"
      @keydown="handleKeyDown"
    />
  </template>
  
  <script setup>
  import { Input } from '@/components/ui/input';
  import {
    getArrowByType,
    getDateByType,
    setDateByType
  } from './time-picker-utils.ts';
  import { cn } from '@/lib/utils';
  
  import { computed, ref, watch } from "vue";
  
  const props = defineProps({
    picker: String,
    date: {
      type: Date,
      default: () => new Date(new Date().setHours(0, 0, 0, 0)),
    },
    period: String,
    class: String,
    type: {
      type: String,
      default: 'tel',
    },
    id: String,
    name: String,
  });
  
  const emit = defineEmits(['update:date', 'rightFocus', 'leftFocus']);
  
  const flag = ref(false);
  const prevIntKey = ref('');
  
  const inputClasses = computed(() => 
    cn('w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none', props.class)
  );
  
  const calculatedValue = computed(() => 
    getDateByType(props.date, props.picker)
  );
  
  watch(flag, (newFlag) => {
    if (newFlag) {
      const timer = setTimeout(() => {
        flag.value = false;
      }, 2000);
      return () => clearTimeout(timer);
    }
  });
  
  watch(() => props.period, (newPeriod) => {
    if (newPeriod) {
      const tempDate = new Date(props.date);
      emit('update:date', setDateByType(tempDate, tempDate.getHours() % 12, props.picker, newPeriod));
    }
  });
  
  const calculateNewValue = (key) => {
    if (props.picker === '12hours') {
      if (flag.value && prevIntKey.value === '1' && ['0', '1', '2'].includes(key)) {
        const newValue = '1' + key;
        prevIntKey.value = '';
        return newValue;
      }
      if (flag.value) {
        prevIntKey.value = '';
        return prevIntKey.value + key;
      }
      prevIntKey.value = key;
      return '0' + key;
    }
    return !flag.value ? '0' + key : calculatedValue.value.slice(1, 2) + key;
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') return;
  
    e.preventDefault();
  
    if (e.key === 'ArrowRight') emit('rightFocus');
    if (e.key === 'ArrowLeft') emit('leftFocus');
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      const step = e.key === 'ArrowUp' ? 1 : -1;
      const newValue = getArrowByType(calculatedValue.value, step, props.picker);
      if (flag.value) flag.value = false;
      const tempDate = new Date(props.date);
      emit('update:date', setDateByType(tempDate, newValue, props.picker, props.period));
    }
    if (e.key >= '0' && e.key <= '9') {
      const newValue = calculateNewValue(e.key);
      if (flag.value && (newValue === '10' || newValue === '11')) {
        emit('rightFocus');
      }
      flag.value = !flag.value;
      const tempDate = new Date(props.date);
      emit('update:date', setDateByType(tempDate, newValue, props.picker, props.period));
    }
  };
  </script>