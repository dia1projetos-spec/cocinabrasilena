# 🇧🇷 Cocina Brasileña — Sistema de Pedidos

Site premium de pedidos online com painel administrativo completo.

---

## 📁 Estrutura do Projeto

```
cocina-brasilena/
├── index.html              ← Site principal (público)
├── admin/
│   └── index.html          ← Painel administrativo
├── css/
│   ├── style.css           ← Estilos do site principal
│   └── admin.css           ← Estilos do painel admin
├── js/
│   ├── firebase-config.js  ← ⚠️ CONFIGURAR com suas credenciais
│   ├── main.js             ← JS principal do site
│   └── admin.js            ← JS do painel admin
└── firestore.rules         ← Regras de segurança do Firestore
```

---

## 🚀 Configuração Passo a Passo

### 1. Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto (ou use um existente)
3. Vá em **Authentication** → Habilite "E-mail e Senha"
4. Crie um usuário admin em Authentication → Users → Adicionar usuário
5. Vá em **Firestore Database** → Criar banco de dados
6. Copie as regras de `firestore.rules` para **Rules** no Firestore
7. Vá em **Configurações do Projeto** → **Apps** → Adicione um Web App
8. Copie as credenciais `firebaseConfig`

### 2. Editar `js/firebase-config.js`

Substitua os valores de `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 3. Cloudinary (para imagens)

1. Acesse [cloudinary.com](https://cloudinary.com) e crie uma conta gratuita
2. Vá em **Settings** → **Upload** → **Upload presets**
3. Clique em **Add upload preset**
4. Defina **Signing Mode** como `Unsigned`
5. Anote o **Preset name** e o **Cloud name**

No arquivo `js/firebase-config.js`:

```javascript
export const CLOUDINARY_CONFIG = {
  cloudName: "seu-cloud-name",
  uploadPreset: "seu-preset-name"
};
```

### 4. Deploy no GitHub + Vercel

1. Crie um repositório no GitHub e faça upload de todos os arquivos
2. Acesse [vercel.com](https://vercel.com) → Login com GitHub
3. Clique em "New Project" → selecione seu repositório
4. Clique em "Deploy" (sem build settings necessários)
5. Seu domínio personalizado pode ser configurado nas configurações do projeto no Vercel

---

## ⚙️ Funcionalidades

### Site Principal (`index.html`)
- 🏳️ Tela de carregamento com bandeira do Brasil animada + som de berimbau
- 🖼️ Slider de banners gerenciável pelo admin
- 🟢 Banner de status (Abierto / Cerrado) em destaque
- 🍽️ Grid de produtos com filtro por categoria
- 🔍 Lightbox para ver imagens em tela cheia
- 🛒 Carrinho lateral com somatório automático
- 📲 Finalização de pedido via WhatsApp com todos os dados

### Painel Admin (`admin/index.html`)
- 🔐 Login com Firebase Authentication
- 🏪 Upload e remoção de logo (via Cloudinary)
- 🖼️ Gerenciamento de slides do banner
- 🟢 Controle de status (Abierto / Cerrado) com mensagem personalizada
- 🍽️ CRUD completo de produtos (nome, preço, foto, categoria, descrição, badge)
- ✅ Ativar/desativar produtos sem excluir
- 🔄 Todas as alterações refletem em tempo real no site

---

## 📱 WhatsApp de Pedidos

Os pedidos finalizados são enviados para:
**+55 13 98176-3452**

Mensagem gerada automaticamente com:
- Nome do cliente
- WhatsApp do cliente
- Endereço (rua, número, bairro)
- Lista de itens com quantidades e preços
- Total do pedido

---

## 🎨 Design

- **Cores**: Verde (#009C3B), Amarelo (#FFDF00), Azul (#002776) — cores da bandeira do Brasil
- **Fontes**: Playfair Display (display), Nunito (texto), Dancing Script (logo)
- **Estilo**: Premium tropical brasileiro

---

## 🛠️ Tecnologias

- HTML5 + CSS3 + JavaScript (ES Modules)
- Firebase Firestore (banco de dados em tempo real)
- Firebase Authentication (login admin)
- Cloudinary (hospedagem de imagens)
- Web Audio API (som de berimbau)
- Vercel (hospedagem)
- GitHub (repositório)
