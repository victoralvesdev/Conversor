const listaGerada = document.querySelectorAll(".lista-gerada select"),
deMoeda = document.querySelector(".de select"),
paraMoeda = document.querySelector(".para select"),
getButton = document.querySelector("form button");

for (let i = 0; i < listaGerada.length; i++) {
    // selecionando BRL por padrão como moeda e USD como moeda
    for(codigo_moeda in codigo_pais){
        let selecionado;
        if (i == 0) {
            selecionado = codigo_moeda == "BRL" ? "selected" : "";
        }else if (i == 1) {
            selecionado = codigo_moeda == "USD" ? "selected" : "";
        }
        // Criando tag de opção com passagem de código de moeda como texto e valor
        let optionTag = `<option value="${codigo_moeda}" ${selecionado}>${codigo_moeda}</option>`;
        // Inserindo a tag de opções dentro da tag select
        listaGerada[i].insertAdjacentHTML("beforeend", optionTag)
    }
    listaGerada[i].addEventListener("change", e =>{
        loadFlag(e.target); // Chamando loadFlag e passando com o elemento de destino como um argumento
    })
}

function loadFlag(element){
    for(codigo in codigo_pais){
        if(codigo == element.value){ // Se o código da moeda da lista de países for igual ao valor da opção
            let imgTag = element.parentElement.querySelector("img"); // Selecionando a tag img de uma lista suspensa específica
            // Passando o código do país de um código de moeda selecionado em um url img
            imgTag.src = `https://flagicons.lipis.dev/flags/4x3/${codigo_pais[codigo]}.svg`.toLowerCase();
        }
    }
}

window.addEventListener("load", () =>{
    getValor();
});

getButton.addEventListener("click", e =>{
    e.preventDefault(); // Impedindo o envio do formulário
    getValor();
});

const valorIcone = document.querySelector(".lista-gerada .icone");
valorIcone.addEventListener("click", ()=>{
    let tempcodigo = deMoeda.value; // Código de moeda temporário da lista gerada
    deMoeda.value = paraMoeda.value; // Passando para o código da moeda para o código da moeda
    paraMoeda.value = tempcodigo // Passando o código de moeda temporário para o código de moeda
    loadFlag(deMoeda); // Chamando loadFlag e passando o elemento select (deMoeda)
    loadFlag(paraMoeda); // Chamando loadFlag e passando o elemento select (paraMoeda)
    getValor();
})

function getValor(){
    const moeda = document.querySelector(".valor input");
    valorTxt = document.querySelector(".taxa");
    let moedaVal = moeda.value;
    // Se o usuário não inserir nenhum valor ou inserir 0, colocaremos 1 valor por padrão no campo de entrada
    if(moedaVal == "" || moedaVal == "0"){
        moeda.value = "1";
        moedaVal = 1;
    }
    valorTxt.innerText = "Recebendo valores...";
    let url = `https://v6.exchangerate-api.com/v6/da28f3efdb85ee5bb5a1573b/latest/${deMoeda.value}`;
    // Buscando a resposta da API e retornando-a com análise em js obj e em outro método então recebendo esse obj
    fetch(url).then(response => response.json()).then(result => {
        let valor = result.conversion_rates[paraMoeda.value];
        let totalValor = (moedaVal * valor).toFixed(2);
        valorTxt.innerText = `${moedaVal} ${deMoeda.value} = ${totalValor} ${paraMoeda.value}`;
    }).catch(() =>{ // Se o usuário estiver offline ou ocorrer qualquer outro erro durante a busca de dados, a função catch será executada
        valorTxt.innerText = "Algo deu errado"
    })
}