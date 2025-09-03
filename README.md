# Mural de Estágios e Vagas - Fatec Zona Leste

## Descrição do Projeto
O **Mural de Estágios e Vagas da Fatec Zona Leste** é uma plataforma web desenvolvida em **React + Vite**, que substitui o site atual em Blogger trazendo mais profissionalismo, facilidade de gestão e recursos modernos.  

O site oferece aos alunos:
- Visualização de vagas de estágio e emprego por curso;
- Página detalhada de cada vaga (descrição, empresa, localização, remuneração, requisitos e formas de inscrição);
- Área de orientação para elaboração de currículos;
- Mural de documentos para formalização do estágio (Estágio Obrigatório e Não Obrigatório).

## Tecnologias Utilizadas
- **React** – biblioteca para construção da interface;
- **Vite** – ferramenta de build e desenvolvimento rápido;
- **React Router DOM** – navegação entre páginas;
- **CSS Global** – padronização de estilo, centralização e reset de CSS.


## Estrutura do Projeto

src/
├─ assets/ # imagens e ícones
├─ styles/ # CSS global e reutilizável
│ └─ global.css
├─ pages/ # páginas da aplicação
│ ├─ Home.jsx
│ ├─ Documentos.jsx
| ├─ vagas.jsx
│ └─ curriculo.jsx
├─ components/ # componentes reutilizáveis (Header, Footer)
├─ App.jsx # componente raiz com layout e rotas
└─ main.jsx # ponto de entrada da aplicação

### Observações
- O CSS global (`global.css`) afeta todas as páginas e componentes.
- A primeira página carregada é **Home.jsx**.
- Componentes como Header e Footer podem ser adicionados futuramente para padronizar layout.
- Pastas e caminhos devem ser mantidos para evitar erros de importação.

---

## Como Rodar o Projeto

### Pré-requisitos
- **Node.js 20.x ou superior**
- **npm** 

### Passos
1. Clone o repositório:
git clone <URL_DO_REPOSITORIO>
cd mural-estagio

2. Instale as dependências:
npm install

3. Inicie o servidor de desenvolvimento:
npm run dev

4. Abra o navegador no endereço exibido, geralmente:
http://localhost:5173