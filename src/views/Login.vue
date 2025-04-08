<script setup lang="ts">
import { useAPI } from "@/api/http-client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast/use-toast';
import { TOKEN_STORAGE_KEY } from "@/constants/storage/token";
import { Icon } from "@iconify/vue";
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as z from 'zod';



const showPassword = ref(false);
const { toast } = useToast()
const { acesso } = useAPI()
const router = useRouter();

const loading = ref(false)
const formSchema = toTypedSchema(z.object({
  usuario: z.string().min(8),
  senha: z.string().min(4),
}));

const form = useForm({
  validationSchema: formSchema,
});

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
    router.replace("/admin/home")
  }

  loading.value = false

});
</script>

<template>
  <main class="h-screen w-screen flex items-center justify-center">
    <Card class="max-w-[320px] md:max-w-[400px] w-full">
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
                <div class="relative w-full max-w-sm items-center">
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
  </main>
</template>