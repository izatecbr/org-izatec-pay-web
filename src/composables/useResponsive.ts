import { onMounted, onUnmounted, ref } from 'vue';

export function useResponsive(breakpoint = 768) {
    const isDesktop = ref(window.innerWidth >= breakpoint);

    const updateSize = () => {
        isDesktop.value = window.innerWidth >= breakpoint;
    };

    onMounted(() => {
        window.addEventListener('resize', updateSize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateSize);
    });

    return { isDesktop };
}
