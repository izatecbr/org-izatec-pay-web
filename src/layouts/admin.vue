<script setup lang="ts">
import { useAPI } from '@/api/http-client';
import CadastrosFiltroList from '@/components/common/cadastros/CadastrosFiltroList.vue';
import CadastrosFiltroSheet from '@/components/common/cadastros/CadastrosFiltroSheet.vue';
import Column from '@/components/core/Column.vue';
import DashboardNavbar from '@/components/core/DashboardNavbar.vue';
import DashboardSidebar from '@/components/core/sidebar/DashboardSidebar.vue';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/stores/app';
import Utils from '@/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { debounce } from 'lodash-es';
import { provide, ref } from 'vue';

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
          <CadastrosFiltroSheet titulo="Buscar Cadastros" v-model="sheetCadastroOpen">
            <Column>
              <Input class="mb-2" :model-value="filterInput"
                @update:model-value="(value) => buscarCadastroPorNome(value)" placeholder="Digite o nome do sacado" />
                <span v-if="cadastroData.length > 0" class="text-xs text-muted-foreground mb-3" >Clique no sacado para selecioná-lo. Clique novamente para desmarcar </span>
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