# Etapa 1: Build da aplicação Angular
FROM node:20 AS build

# Defina o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto para o container
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Gera a build do Angular
RUN npm run build --prod

# Etapa 2: Servir a aplicação com ng serve
FROM node:20

# Defina o diretório de trabalho
WORKDIR /app

# Instala o Angular CLI globalmente
RUN npm install -g @angular/cli

# Copia os arquivos necessários para o container
COPY --from=build /app /app

# Expondo a porta 4200 para acessar a aplicação
EXPOSE 4200

# Comando para rodar o Angular diretamente
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]
