
const formAdm = document.getElementById('form-adm');
const inputNome = document.getElementById('nome-adm');
const inputEmail = document.getElementById('email-adm');
const btnLimpar = document.getElementById('btn-limpar');
const btnExcluirTodos = document.getElementById('btn-excluir-todos');
const inputPesquisa = document.getElementById('pesquisa');
const listaUsuarios = document.getElementById('lista-usuarios');


const CHAVE_LS = 'ecotech_usuarios';


function carregarUsuarios() {
    const dados = localStorage.getItem(CHAVE_LS);
    return dados ? JSON.parse(dados) : [];
}


function salvarUsuarios(usuarios) {
    localStorage.setItem(CHAVE_LS, JSON.stringify(usuarios));
}


function obterDataAtual() {
    const data = new Date();
    return data.toLocaleString('pt-BR');
}


function renderizarLista(filtro = '') {
    listaUsuarios.innerHTML = '';
    const usuarios = carregarUsuarios();

    
    const usuariosFiltrados = usuarios.filter(user => 
        user.nome.toLowerCase().includes(filtro.toLowerCase()) || 
        user.email.toLowerCase().includes(filtro.toLowerCase())
    );

    
    usuariosFiltrados.forEach((user) => {
        const li = document.createElement('li');
        li.style.backgroundColor = '#f9f9f9';
        li.style.margin = '10px 0';
        li.style.padding = '15px';
        li.style.border = '1px solid #cccccc';
        li.style.borderRadius = '5px';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';

        li.innerHTML = `
            <div>
                <strong>Nome:</strong> ${user.nome} <br>
                <strong>E-mail:</strong> ${user.email} <br>
                <small style="color: #666;"><em>Cadastrado em: ${user.data}</em></small>
            </div>
            <button class="btn" style="background-color: #d32f2f; padding: 8px 12px; width: auto; margin-top: 0;" onclick="excluirItem('${user.id}')">Excluir</button>
        `;
        listaUsuarios.appendChild(li);
    });
}


formAdm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const novoUsuario = {
        id: Date.now().toString(), 
        nome: inputNome.value,
        email: inputEmail.value,
        data: obterDataAtual()
    };

    const usuarios = carregarUsuarios();
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    renderizarLista(inputPesquisa.value); 
    formAdm.reset();
    inputNome.focus();
});


btnLimpar.addEventListener('click', function() {
    formAdm.reset();
});


window.excluirItem = function(id) {
    
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        let usuarios = carregarUsuarios();
        
        usuarios = usuarios.filter(user => user.id !== id);
        salvarUsuarios(usuarios); 
        renderizarLista(inputPesquisa.value);
    }
};


btnExcluirTodos.addEventListener('click', function() {
    const usuarios = carregarUsuarios();
    
    if (usuarios.length === 0) {
        alert('A lista já está vazia.');
        return;
    }

    
    if (confirm('Atenção: Isso excluirá TODOS os usuários da lista e do armazenamento. Deseja continuar?')) {
        localStorage.removeItem(CHAVE_LS); 
        renderizarLista(); 
    }
});


inputPesquisa.addEventListener('input', function() {
    renderizarLista(this.value);
});


renderizarLista();