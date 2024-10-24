# Protect Web - Extensão para Privacidade no Navegador

## Descrição

**Protect Web** é uma extensão desenvolvida para navegadores com o objetivo de proteger sua privacidade durante a navegação na web. A extensão monitora conexões a domínios de terceiros, o uso de cookies, armazenamento local, fingerprinting em canvas, e possíveis ameaças de sequestro de navegador (hijacking).

A pontuação de privacidade oferece uma maneira simples de entender o quão segura é a página que você está visitando. Quanto maior a pontuação, mais seguro está seu ambiente de navegação.

## Funcionalidades

- Monitoramento de **conexões a domínios de terceiros**.
- Detecção de **cookies** de primeira e terceira parte.
- Verificação do **armazenamento local** do navegador (HTML5 local storage).
- Detecção de **Canvas Fingerprinting**.
- Monitoramento de **ameaças de hijacking** e hook em eventos do navegador.
- Sistema de **pontuação de privacidade** para cada página.

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://https://github.com/brunameinberg/SecurityPlugin.git
   cd protect-web

 2. **Carregar a extensão no navegador**:
- Abra o Firefox e vá para  `about:debugging#/runtime/this-firefox`.
- Clique em "Carregar Extensão Temporária" e selecione o arquivo manifest.json dentro da pasta do repositório clonado.

 3. **Acesse o popup da extensão**:
A extensão agora aparecerá na barra de extensões do navegador. Clique no ícone para ver o status de privacidade da página atual.

## Uso
A extensão **Protect Web** automaticamente monitora as páginas que você visita. Ao clicar no ícone da extensão, você verá:

- Conexões a domínios de terceira parte: Verifica se a página está carregando recursos de outros domínios.
- Cookies: Exibe cookies de primeira e terceira parte usados pela página.
- Armazenamento Local: Monitora o uso de local storage na página.
- Canvas Fingerprinting: Verifica se há tentativas de fingerprinting através de canvas.
- Ameaças de Sequestro: Detecta possíveis tentativas de hijacking ou modificação de eventos.
- Pontuação de Privacidade: Uma pontuação de 0 a 100, onde valores mais altos indicam maior segurança.

## Desenvolvimento

### Estrutura do Projeto
- `popup.html`: Arquivo HTML do popup da extensão.
- `popup.js`: Lógica JavaScript que coleta e exibe os dados de privacidade no popup.
- `background.js`: Script de fundo que monitora as conexões e ameaças, e calcula a pontuação de privacidade.
- `style.css`: Arquivo de estilos para o popup da extensão.
- `manifest.json`: Arquivo de manifesto que descreve a extensão para o navegador.


### Rodando Localmente para Desenvolvimento
Para fazer alterações ou contribuir com o desenvolvimento:

1. Faça modificações no código-fonte (HTML, CSS, JS).
2. Recarregue a extensão no `about:debugging#/runtime/this-firefox` para aplicar as mudanças.
3. Teste as novas funcionalidades diretamente no navegador.

### Contribuindo
Contribuições são bem-vindas! Se você encontrou um bug ou tem sugestões de melhoria, sinta-se à vontade para abrir uma issue ou enviar um pull request.


## Tecnologias Utilizadas
- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **WebExtensions API** para interação com o navegador.

# Autor
**Bruna Meinberg**



Entre em contato pelo [LinkedIn](https://www.linkedin.com/in/brunameinberg) para mais informações.

