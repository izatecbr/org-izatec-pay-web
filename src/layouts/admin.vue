<script setup lang="ts">
import { useAPI } from '@/api/http-client';
import AppNavTabs from '@/components/common/app-nav-tabs/AppNavTabs.vue';
import CadastrosFiltroList from '@/components/common/cadastros/CadastrosFiltroList.vue';
import CadastrosFiltroSheet from '@/components/common/cadastros/CadastrosFiltroSheet.vue';
import Column from '@/components/core/Column.vue';
import DashboardNavbar from '@/components/core/DashboardNavbar.vue';
import DashboardSidebar from '@/components/core/sidebar/DashboardSidebar.vue';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useResponsive } from '@/composables/useResponsive';
import { TabAppMenuOptions } from '@/constants/app/tab-app-menu-options';
import { NAV_ADD_TAB_PROVIDER_KEY, NAV_ADDED_TABS_PROVIDER_KEY, NAV_CHANGE_TAB_PROVIDER_KEY, NAV_REMOVE_TAB_PROVIDER_KEY } from '@/constants/app/tab-inject-values';
import { useAppStore } from '@/stores/app';
import Utils from '@/utils';
import { debounce } from 'lodash-es';
import { provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export interface RouteTabs {
  path: string;
  label: string;
  icon?: string
}

const INITIAL_ROUTE_INDEX = 0

const router = useRouter()
const route = useRoute()
const tabAtual = ref<RouteTabs>(TabAppMenuOptions[INITIAL_ROUTE_INDEX])
const tabsAdicionadas = ref<RouteTabs[]>([TabAppMenuOptions[INITIAL_ROUTE_INDEX]])

const { isDesktop } = useResponsive()

const store = useAppStore();
const { cadastros } = useAPI()
const sheetCadastroOpen = ref(false)

const filterInput = ref("")
const loading = ref(false)
const cadastroData = ref([])

const cadastroSelecionado = ref(null)
const toggleSheetFilterCadastros = () => {
  sheetCadastroOpen.value = !sheetCadastroOpen.value
}
const setCadastroSelecionado = (value: any) => {
  cadastroSelecionado.value = value
}

const adicionarTab = (tab: RouteTabs) => {
  /* if (route.path.includes('empresa')) {
      router.push('/adm')
  } */

  tabAtual.value = tab

  if (tabsAdicionadas.value.includes(tab)) return
  tabsAdicionadas.value.push(tab)
}

const trocarTab = (tab: RouteTabs) => {
  router.push(tab.path)
  tabAtual.value = tab
}

const removerTab = (tab: RouteTabs) => {
  tabsAdicionadas.value = tabsAdicionadas.value.filter(t => t.path !== tab.path)
  if (tabAtual.value.path === tab.path) {
    tabAtual.value = tabsAdicionadas.value[0] || TabAppMenuOptions[INITIAL_ROUTE_INDEX]
  }
}

provide(NAV_ADD_TAB_PROVIDER_KEY, { adicionarTab })
provide(NAV_CHANGE_TAB_PROVIDER_KEY, { trocarTab })
provide(NAV_REMOVE_TAB_PROVIDER_KEY, { removerTab })
provide(NAV_ADDED_TABS_PROVIDER_KEY, { tabsAdicionadas })

provide('cadastroSelecionado', cadastroSelecionado)
provide('setCadastroSelecionado', setCadastroSelecionado)
provide('toggleSheetFilterCadastros', toggleSheetFilterCadastros)
provide('sheetCadastrosOpen', sheetCadastroOpen)

const buscarCadastroPorNome = debounce(async (value: any) => {
  filterInput.value = value
  loading.value = true;
  const { body, success, status } = await cadastros.listagemNome(Utils.removeCharacters(value) || '')
  cadastroData.value = body ?? [];
  loading.value = false;
}, 500)
</script>

<template>
  <div>
    <DashboardSidebar />
    <div class="relative app-container dashboard-main"
      :style="`left: ${store.wrapperLeftOffset}px; width: calc(100% - ${store.wrapperLeftOffset}px)`">
      <DashboardNavbar />
      <div class="p-2 lg:p-6 max-w-[1440px] m-auto mt-[64px]">
        <RouterView v-slot="{ Component }">
          <AppNavTabs v-if="isDesktop" />
          <CadastrosFiltroSheet titulo="Buscar Cadastros" v-model="sheetCadastroOpen">
            <Column>
              <Input class="mb-2" :model-value="filterInput"
                @update:model-value="(value) => buscarCadastroPorNome(value)" placeholder="Digite o nome do sacado" />
              <span v-if="cadastroData.length > 0" class="text-xs text-muted-foreground mb-3">Clique no sacado para
                selecioná-lo. Clique novamente para desmarcar </span>
            </Column>
            <ScrollArea class="max-h-[74vh] w-full overflow-y-auto">
              <CadastrosFiltroList :data="cadastroData" />
            </ScrollArea>

          </CadastrosFiltroSheet>
          <transition name="fade" mode="out-in">
            <component :is="Component"></component>
          </transition>
        </RouterView>
      </div>
    </div>
  </div>
</template>