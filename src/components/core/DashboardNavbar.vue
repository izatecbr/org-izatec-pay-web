<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Breadcrumb from '@/components/ui/Breadcrumb.vue';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { JwtReponse } from '@/constants/storage/jwt-reponse.interface';
import { TOKEN_STORAGE_KEY } from '@/constants/storage/token';
import { useAppStore } from '@/stores/app';
import Utils from '@/utils';
import { truncate } from 'lodash-es';
import {
  LogOut,
  Menu,
  MoonStar,
  Sun
} from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useAppStore();
const user = ref<JwtReponse | null>(null)

const initUser = () => {
  user.value = Utils.jwtToObject(localStorage.getItem(TOKEN_STORAGE_KEY))
}

const toggleMode = () => {
  store.toggleTheme();
};

const logout = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  router.replace('/login');
  console.log('oxe')
};

onMounted(() => {
  initUser()
})
</script>

<template>
  <nav
    class="flex items-center justify-between h-[64px] border-b-[1px] px-4 fixed z-40 top-0 bg-background/80 backdrop-blur-lg border-b border-border"
    :style="{ width: store.navWidth }">
    <div class="w-24 hidden lg:block">
      <Breadcrumb />
    </div>
    <!--<div class="w-2/5 hidden lg:block">
      <GlobalSearchPopover />
    </div> -->
    <Button variant="outline" class="p-[6px] w-8 h-8 transition-all duration-200 block lg:hidden"
      :class="store.sidebarExpanded ? 'bg-transparent' : 'dark:bg-white'" @click="store.toggleSidebar()">
      <Menu class="transition-all duration-500 text-black" />
    </Button>
    <div class="flex items-center">
      <Button variant="outline" class="border-0 p-[6px] ml-2 w-8 h-8" @click="toggleMode">
        <Sun v-if="store.isDark" />
        <MoonStar v-else />
      </Button>
      <div class="border-x-[1px] border-gray-300 h-[24px] w-[1px] mx-2"></div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="border-0 flex items-center max-w-[200px] w-full justify-start">
            <Avatar class="h-8 w-8">
              <AvatarFallback>{{ Utils.getUserInitials(user?.sub) }}</AvatarFallback>
            </Avatar>
            <span class="ml-2 hidden md:flex justify-start flex-col items-start">
              <p class="mb-0">{{ truncate(user?.sub, {
                length: 14
              }) }}</p>
              <small class="text-xs text-slate-400 font-light">{{ Utils.maskCpfCnpj(user?.cpfCnpj) }}</small>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56 relative mr-4">
          <DropdownMenuLabel>{{ user?.sub }}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="cursor-pointer" @click="logout()" >
            <LogOut class="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </nav>
</template>
