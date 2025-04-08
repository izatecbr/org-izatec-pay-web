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