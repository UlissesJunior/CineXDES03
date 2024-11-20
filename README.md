
<h1 align="center">
🎬🍿<br>CineNTT - Projeto de Catálogo de Filmes
</h1>

Bem-vindo ao repositório do projeto *CineNTT*, um catálogo de filmes desenvolvido com Angular. Este projeto tem como objetivo proporcionar uma experiência de busca e navegação de filmes populares, com sistema de favoritos e uma simulação de um ambiente de autenticação para o usuário.

<p align="center">
<img src="/public/bannerCineNTT.png">
<p>

<h4 align="center"><a href="https://cine-ntt.vercel.app/">Clique para visitar o projeto</a></h4>

---

## Sumário  
1. [Introdução](#introdução)  
2. [Páginas da Aplicação](#páginas-da-aplicação)  
3. [Bibliotecas e Dependências Utilizadas](#bibliotecas-e-dependências-utilizadas)  
4. [Possíveis Melhorias](#possíveis-melhorias)
5. [Agradecimentos](#agradecimentos)

## Introdução 

Este projeto foi desenvolvido como parte de um desafio técnico. O objetivo principal é permitir que o usuário explore um catálogo de filmes, crie sua conta, salve favoritos e pesquise por títulos específicos, com acessibilidade e uma boa experiência ao usuário. Apesar de ter sido pedido apenas uma aplicação SPA, a frase "Junto com este material você deve ter recebido um wireframe para usar como norte do seu layout,
porém sinta-se livre para ir além" me motivou a ir bem mais além da proposta inicial!

## Páginas da Aplicação

### Login

Página para autenticação do usuário. Permite acesso ao sistema com um e-mail registrado anteriormente.

### Signup

Página de cadastro, onde novos usuários podem criar sua conta no sistema utilizando suas credenciais de nome, email e foto.

### Populares

Página inicial que exibe os filmes mais populares no momento. Os dados são carregados da API TMDB.

### Search

Página de busca que permite ao usuário procurar por títulos específicos. Exibe uma lista de filmes relacionados à pesquisa realizada, os dados são carregados da API OMDB.

### Favoritos

Página onde o usuário pode visualizar e gerenciar os filmes que foram marcados como favoritos.

### Movie/:title

Página onde o usuário vê os dados detalhados do filme escolhido por busca ou por listagem de populares, o detalhamento é feito usando os dados da API OMDB.

## Bibliotecas e Dependências Utilizadas

- @angular/core: ```^18.2.0```
- @angular/router: ```^18.2.0```
- angular-toastify: ```^2.0.0```
- bootstrap: ```^5.3.3```
- rxjs: ```~7.8.0```

## Possíveis Melhorias
- Autenticação com integração a uma API utilizando JWT para maior segurança
- Documentação completa dos componentes com Storybook para facilitar a colaboração
- Implementação de mais testes automatizados para garantir a estabilidade das funcionalidades
- Melhorias na acessibilidade para usuários com deficiência visual, como suporte a leitores de tela e teclas de atalho

## Agradecimentos

Gostaria de agradecer ao Ivan Waltrick por aceitar a conexão no LinkedIn e pela oportunidade de fazer parte deste processo. Também deixo um agradecimento especial à Camila Gorczyca, que conduziu a entrevista de uma maneira que me desafiou e ao mesmo tempo me motivou a dar o meu melhor. A experiência foi muito positiva, e espero ter a chance de colaborar com vocês em breve! 😊