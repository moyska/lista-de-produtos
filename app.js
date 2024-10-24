//importar express primeiro
const express = require('express');

//cookies e sessions 
//npm install cookie-parser
//npm install express-session
const session = require('express-session');
const cookieParser = require('cookie-parser');

//inicializar express
const app = express();

app.use(cookieParser());

app.use(session(
    {
        secret:'minhasenha', //criar uma senha para acessar os cookies
        resave:false, //evita gravar sessao sem alteraçao
        saveUninitialized: true //salvar na guia anonima 
    }
));

//dados de exemplo
const produtos = [
    {id:1,nome:'Alface',preco:2},
    {id:2,nome:'pachmina',preco:70},
    {id:3,nome:'pastel',preco:6}
];

app.get('/produtos',(req,res)=>{
    res.send(`
        <h1>Lista de Produtos</h1>
        <ul>
            ${
                produtos.map((produto)=>`
                    <li>${produto.nome} - ${produto.preco}
                    <a href="/adicionar/${produto.id}
                    ">Adicionar ao carrinho</a></li>

                `).join('')
            }
        </ul>
        <a href="/carrinho">Ver Carrinho</a>

        
    `)
});
//rota de adicionar produtos
app.get('/adicionar/:id',(req,res)=>{
    const id = parseInt (req.params.id);

    const produto = produtos.find((p)=> p.id === id);

    if(produto){
       if(req.session.carrinho){
        req.session.carrinho = [];
       } 
       req.session.carrinho.push(produto);
    }
    res.redirect('/produtos');
});

//rota do carrinho
app.get('/carrinho',(req,res)=>{
    const carrinho = req.session.carrinho || [];

    res.send(`
        <h1>Lista de Produtos</h1>
        <ul>
            ${
                carrinho.map((produto)=>`
                    <li>${produto.nome} - ${produto.preco}
                

                `).join('')
            }
        </ul>
        <a href="/carrinho">Continuar Comprando</a>

        
    `);
});

app.listen(8000);
