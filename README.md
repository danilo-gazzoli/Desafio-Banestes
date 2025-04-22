# Banestes Frontend

Uma interface React/TypeScript para visualizar dados bancários (clientes, agências e contas) e gerar relatórios via dashboard.

---

## Funcionalidades

### ⚙️ Navegação e Layout
- **Layout Responsivo** com sidebar fixa (desktop) e menu hambúrguer (mobile).  
- **Breadcrumb** para indicar a rota atual e permitir navegação rápida.

### 📋 Listagens e Detalhes
- **Lista de Clientes**  
  - Busca por nome ou CPF/CNPJ  
  - Filtros por estado civil  
  - Paginação  
  - Clique em qualquer linha para ir ao detalhe do cliente  
- **Detalhe de Cliente**  
  - Informações pessoais (nome, CPF/CNPJ, RG, data de nascimento, etc.)  
  - Informações financeiras (renda anual, patrimônio)  
  - Agência associada  
  - Lista de contas vinculadas ao cliente  
- **Lista de Agências**  
  - Busca por nome, código ou endereço  
  - Paginação  
  - Linha clicável para ir ao detalhe da agência  
- **Detalhe de Agência**  
  - Dados básicos (código, nome, endereço)  
  - Resumo com total de clientes e contas  
  - Tabela de “clientes da agência” com link para detalhes  
  - Tabela de “contas da agência” mostrando cliente, tipo, saldo e limite  

### 💳 Contas
- **Lista de Contas**  
  - Busca por CPF/CNPJ cliente ou tipo de conta  
  - Filtros avançados (tipo, faixa de saldo, faixa de limite de crédito)  
  - Paginação  

### 📊 Dashboard
- **Cartões de Overview**  
  - Total de clientes, total de contas, patrimônio total e saldo total  
- **Gráficos de Distribuição**  
  - Donut (tipo de conta)  
  - Pizza (estado civil)  
- **Performance de Agências**  
  - Barras comparando número de clientes e volume de depósitos  
- **Linha de Utilização de Crédito**  
  - Limite total vs. crédito utilizado vs. crédito disponível  
- **Indicadores de Risco**  
  - Percentual e valor de contas com saldo negativo  
  - Utilização média de crédito  

### 🤖 Chat AI (UI)
- **ChatBot** que simula mensagens de IA:  
  - Exibe histórico de mensagens com avatares distintos para usuário e “assistente”  
  - Campo de entrada com botão de envio e loading spinner  
  - Scroll automático para a última mensagem  

---

## 📦 Instalação

```bash
# Clone este repositório
git clone https://github.com/seu-usuario/banestes-frontend.git
cd Desafio-Banestes

# Instale dependências
npm install
# ou
pnpm install
