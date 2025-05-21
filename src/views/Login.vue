<script setup lang="ts">
import { useAPI } from "@/api/http-client";
import AppLogo from "@/components/common/logo/AppLogo.vue";
import Column from "@/components/core/Column.vue";
import Row from "@/components/core/Row.vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast/use-toast';
import { TOKEN_STORAGE_KEY } from "@/constants/storage/token";
import { useAppStore } from '@/stores/app';
import { Icon } from "@iconify/vue";
import { toTypedSchema } from '@vee-validate/zod';
import {
  MoonStar,
  Sun
} from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as z from 'zod';



const showPassword = ref(false);
const { toast } = useToast()
const { acesso } = useAPI()
const router = useRouter();
const store = useAppStore();

const loading = ref(false)
const formSchema = toTypedSchema(z.object({
  usuario: z.string().min(8),
  senha: z.string().min(4),
}));

const form = useForm({
  validationSchema: formSchema,
});


const toggleMode = () => {
  store.toggleTheme();
};

const onSubmit = form.handleSubmit(async (val) => {
  loading.value = true

  const { body, status, success } = await acesso.empresa(val)

  toast({
    title: status.message,
    description: status?.suggestion || '',
    variant: success ? 'default' : 'destructive',
    duration: 1300,
  });

  if (body?.token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, body.token)
    router.replace("/admin/pagamentos")
  }

  loading.value = false

});
</script>

<template>
  <main class="h-screen w-screen flex items-center justify-between">
    <div class=" bg-background h-full flex-1 items-center justify-center hidden md:flex">
      <Row align-items="center">
        <AppLogo class="hidden md:block" />
        <Column class="h-full" justify-content="space-between" >
          <Row>
            <h1 class=" text-5xl font-extrabold text-primary">IZA </h1>
            <h2 class=" text-muted-foreground text-5xl font-extrabold ">PAY</h2>
          </Row>
          <span class=" text-muted-foreground mr-4 mt-5 w-[16rem]">
            Gestão Simplificada de Pagamentos</span>
        </Column>
      </Row>
    </div>
    <div class="flex-1 px-2 mx-4 flex items-center justify-center">
<div class="relative" >
<div class="flex w-full items-center justify-end pb-4" >
        <Button variant="outline" class="border-0 p-[6px] ml-2 w-8 h-8" @click="toggleMode">
        <Sun v-if="store.isDark" />
        <MoonStar v-else />
      </Button>
</div>
            <Card class="w-[30rem]">
        <CardHeader>
          <CardTitle class="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="usuario">
              <FormItem class="mb-4">
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="senha">
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl class="relative">
                  <div class="relative w-full items-center">
                    <Input :type="showPassword ? 'text' : 'password'" v-bind="componentField" class="" />
                    <span class="absolute end-0 inset-y-0 flex items-center justify-center px-4">
                      <Icon @click="showPassword = !showPassword" :icon="!showPassword ? 'ph:eye' : 'ph:eye-slash'"
                        class="size-6 cursor-pointer text-muted-foreground" />
                    </span>
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <div class="flex items-center space-x-2 mt-4">
              <Checkbox id="terms" />
              <Label for="terms">Lembrar</Label>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div class="w-full">
            <Button class="w-full" :loading="loading" @click="onSubmit">Entrar</Button>
            <div class="relative my-4">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t" />
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
</div>
    </div>
  </main>
</template>