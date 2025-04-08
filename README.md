# Setup Inical

``` bash
npm install
```

```bash
npm run dev
```

## Build
```bash
npm run build
```

# Requisições ao Backend

Na pasta `src/api` estão todos os services que acessam os recursos do backend, consulte o arquivo `http-client.ts` e ajuste o arquivo `src/.env` com base no arquivo `.env.example` para definir a URL da sua API.

```
VITE_API_URL=http://localhost:8080
``` 

# Tecnologias

- **Vue 3**: Framework JavaScript progressivo para construção de interfaces de usuário, utilizado para criar a interface do usuário.
- **Vite**: Ferramenta de build rápida para desenvolvimento, que suporta Vue e TypeScript, facilitando o processo de build e preview.
- **Tailwind CSS**: Framework CSS utilitário para construir interfaces responsivas e customizáveis de forma rápida e eficiente.
- **Pinia**: Gerenciador de estado para Vue, substituto do Vuex em projetos mais modernos.
- **Vue Router**: Biblioteca de roteamento para Vue.js, usada para navegação entre diferentes páginas ou componentes.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática ao código, garantindo maior segurança e previsibilidade no desenvolvimento.
- **ESLint & Prettier**: Ferramentas de linting e formatação de código, garantindo consistência e qualidade no código.
- **VeeValidate & Zod**: Bibliotecas para validação de formulários e dados, utilizando uma abordagem funcional e robusta.
- **Axios**: Biblioteca para realizar requisições HTTP.
- **Iconify & Feather Icons**: Bibliotecas para ícones, oferecendo uma grande variedade de ícones prontos para usar.
- **Date-fns**: Biblioteca para manipulação de datas, com funções de formatação e cálculos de data.
- **Radix UI**: Conjunto de componentes de interface acessíveis para aplicações React e Vue.
- **v-calendar e v-money3**: Bibliotecas para manipulação de calendários e máscaras de dinheiro, facilitando o trabalho com datas e valores monetários.
- **Class Variance Authority (CVA) e Tailwind Merge**: Utilitários para gestão dinâmica de classes no Tailwind CSS.
- **Lucide e Vue Feather**: Bibliotecas para integrar ícones vetoriais modernos com Vue.
