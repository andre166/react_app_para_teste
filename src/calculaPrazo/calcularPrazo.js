import formatData from './formatDatas';
import axios from 'axios';
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import lastIndexOf from 'lodash/lastIndexOf'
var forEach = require('lodash/forEach');
var last = require('lodash/last');
var isSameDay = require('date-fns/isSameDay/index');
var addDays = require('date-fns/addDays/index')

export default async function calcularPrazo( 
        codigoDaCidade_IBGE = '3301900', tempo = 1440, diaDaSemana = [0], typeCodes = [1,2,3], datasParaIgnorar, forcarDataInicial = '', token,
        removerFeriados = []
    ){

    let dataInicial = '';
    let feriadosInRange = [];

    if( forcarDataInicial.length === 0 ){

        dataInicial = new Date();

    }else{

        dataInicial = forcarDataInicial;
    } 

    diaDaSemana = ordernarDiasDaSemanaParaIgnorar( diaDaSemana );
    datasParaIgnorar = ordernarDatasParaIgnorar( datasParaIgnorar );

    let prazoManutencao = gerarPrazoDeManutencao( tempo );

    let listaFeriados = [];

    listaFeriados = await pegarFeriados( codigoDaCidade_IBGE, dataInicial, token, removerFeriados );

    let dataDeAberturaValidada = calcPrazoInicial( diaDaSemana, typeCodes, listaFeriados, tempo , dataInicial, datasParaIgnorar); 

    let prazoInicial = calcPrazoInicial( diaDaSemana, typeCodes, listaFeriados, tempo , addDays(dataDeAberturaValidada, 1), datasParaIgnorar); 

    if( !isSameDay(prazoInicial, dataInicial)){
        prazoInicial = calcPrazoInicial( diaDaSemana, typeCodes, listaFeriados, tempo , prazoInicial, datasParaIgnorar);
    }else{
        
    }
    
    let prazoFinal = prazoInicial;
    let tipoDoPrazo = '';

    for(let i = 1; i < prazoManutencao; i++){ //retorna o prazoFinal de acordo com o tipo do cabo, soma 24h a cada iteração

        let prazo = somarPrazoFinal( prazoFinal, diaDaSemana, typeCodes, listaFeriados, tempo, tipoDoPrazo, datasParaIgnorar);

        prazoFinal = prazo;

    }

    let range = pegarRangeFeriados( dataInicial, prazoFinal );

    let rangeInical = pegarRangeDataAbertura_DataInicial( dataInicial, dataDeAberturaValidada);

    range.map( dia => {
        listaFeriados.feriadosDoMes.map( feriado =>{

            if(isSameDay(feriado.data, dia)){

                feriadosInRange.push(feriado)

            }
        })

    });

    let rangeDeFeriadosValidos = validarRangeDeferiados( typeCodes, feriadosInRange );

    return {
        ultimoDiaDoPrazo: prazoFinal, dataDeAbertura: dataDeAberturaValidada, 
        calendario: {feriados: listaFeriados, rangeInical: rangeInical, range: range}, feriadosInRange: rangeDeFeriadosValidos
    };

}

function validarRangeDeferiados( typeCodes, feriadosInRange ){
    
    let feriados = [];

    typeCodes.map( (Code, index )=>{

        feriadosInRange.map(fe => {

            if( Code == fe.typeCode){
                feriados.push(fe);
            }

        })

    });

    let rangeDeFeriadosValidos = feriados.filter(function (el) {

        if(el.length == undefined || el == undefined){
            return el
        }

    });

    return rangeDeFeriadosValidos;

}

function pegarRangeFeriados( dataInicial, dataFinal ) { //pega as datas entre a data inicial e final para o calendário

    var result = eachDayOfInterval({
        start: new Date(dataInicial),
        end: new Date(dataFinal)
    })

    return result;
}

function pegarRangeDataAbertura_DataInicial( dataDeAbertura, dataInicial ) { //pega as datas entre a data inicial e final para o calendário

    var result = eachDayOfInterval({
        start: new Date(dataDeAbertura),
        end: new Date(dataInicial)
    })

    result = result.slice( 0, lastIndexOf(result) - 1)

    if( result.length < 1 ){
        return '';
    }

    return result;
}

function calcPrazoInicial( diaDaSemana, typeCodes, feriados3, tempo, dataInicial, datasParaIgnorar){

    let tipoDoPrazo = 'PrazoInicial';

    let prazo = verificacoes( dataInicial, diaDaSemana, typeCodes, feriados3, tempo, tipoDoPrazo, datasParaIgnorar);

    return prazo;

}

function somarPrazoFinal(data, diaDaSemana, typeCodes, feriados3, tempo,  tipoDoPrazo, datasParaIgnorar){ 

    let novaData = somarDia(data);

    return verificacoes( novaData,  diaDaSemana, typeCodes, feriados3, tempo, tipoDoPrazo, datasParaIgnorar);

}

function ignorarDatas( data, datasParaIgnorar ){ // recebe um array de datas para serem ignoradas

    function ignorarDatas(){

        let dias = datasParaIgnorar.map( (dia, index) =>{

            if( isSameDay(datasParaIgnorar[index], data) ){

                data = somarDia(data);
    
            }else if( !isSameDay(datasParaIgnorar[index], data) ){

                return data;
            }

            return data;
        });

        return dias;

    }

    let datasIgnoradas = ignorarDatas();
    let UltimaDataIgnorada = last( datasIgnoradas );

    return UltimaDataIgnorada;
}

function verificacoes( data, diaDaSemana, typeCodes, feriados3, tempo, tipoDoPrazo, datasParaIgnorar ){

    let dataParaConferir = data;
    let sairDoLoop = 0;

    let dataIgnoradas = ignorarDatas( data, datasParaIgnorar );

    let diaDaSemanaIgnorados = ignorarDiasDaSemana( dataIgnoradas, diaDaSemana, feriados3 );

    let feriadosIgnorados = verificarFeriado( diaDaSemanaIgnorados, typeCodes, feriados3 );

    feriadosIgnorados = new Date(feriadosIgnorados);

    sairDoLoop = feriadosIgnorados;

    if( isSameDay(dataParaConferir, sairDoLoop) ){

        return feriadosIgnorados;

    }else{

        return verificacoes( feriadosIgnorados, diaDaSemana, typeCodes, feriados3, tempo, tipoDoPrazo, datasParaIgnorar);
    }

}

async function pegarFeriados( codigoDaCidade_IBGE, dataAtual, token, removerFeriados ){

    let feriadosAnoAtual = [];
    let listaDeFeriados = [];
    
    let feriadosDeJaneiro = [];
    let feriadosDoMesAtual = [];

    let listaDeFeriadoFinal = []
        
    let anoAtual = dataAtual.getFullYear();
    let mesAtual = dataAtual.getMonth() + 1;

    const feriados = await chamarAxios( anoAtual, codigoDaCidade_IBGE, token ); 

    if( typeof feriados !== 'object'){
        return {feriados: feriadosAnoAtual, feriadosDoMes: feriadosDoMesAtual, error: feriados}
    }

    let anoPosterior = anoAtual + 1;

    const feriadosDoAnoSeguinte = await chamarAxios( anoPosterior, codigoDaCidade_IBGE, token ); 

    for(const feriado in feriados){ 

        feriadosAnoAtual.push({
            data: formatData(feriados[feriado].date, "anoMesDia", 2), 
            typeCode: feriados[feriado].type_code, 
            description: feriados[feriado].name
        });
    }

    feriadosAnoAtual.map(n => {
        if(new Date(n.data).getMonth() == mesAtual - 1 || new Date(n.data).getMonth() == mesAtual){ 

            feriadosDoMesAtual.push({
                data: new Date(formatData(new Date(n.data), "anoMesDia", 1)),  
                typeCode: n.typeCode,  
                description: n.description}  
            );
        }

    });

    for(const feriado in feriadosDoAnoSeguinte){ // retorna os feriados de janeiro do ano seguinte para calcular o prazo
        listaDeFeriados.push({
            data: formatData(feriadosDoAnoSeguinte[feriado].date, "anoMesDia", 2), 
            typeCode: feriadosDoAnoSeguinte[feriado].type_code, 
            description: feriadosDoAnoSeguinte[feriado].name
        })
    }
    
    
    listaDeFeriados.map(n => { //retorna todos os feriados de janeiro do ano seguinte já formatados

        if(new Date(n.data).getMonth() == 0){
           feriadosDeJaneiro.push( {
               data:new Date(n.data), 
               typeCode: n.typeCode, 
               description: n.name
            } );
        }

    });

    feriadosDeJaneiro.map((e, index) => feriadosAnoAtual.push(feriadosDeJaneiro[index])); // coloca todos os feriados de janeiro do ano posterior no final do array do ano atual

    for(let feriado in feriadosAnoAtual){ // formatada a data e retorna o array final - Thu Jun 11 2020 00:00:00 GMT-0300 (Horário Padrão de Brasília)

        listaDeFeriadoFinal.push({
            feriados: feriadosAnoAtual[feriado].data = new Date(feriadosAnoAtual[feriado].data),
            typeCode: feriadosAnoAtual[feriado].typeCode,
            description: feriadosAnoAtual[feriado].name
        });
    }

    if( removerFeriados.length > 0 ){
        for(let des in removerFeriados){
            feriadosDoMesAtual.map( (e,index )=> {
                if( isSameDay(e.data, removerFeriados[des])){
    
                    feriadosDoMesAtual.splice(index, 1)
                }
            })
        }
    }

    return {feriados: feriadosAnoAtual, feriadosDoMes: feriadosDoMesAtual, error: ''};

}

function somarDia(data){

    let result = new Date(data);

    const diaEmMilisegundos = 86400000; 

    var novaDataFormatada = result.getTime();

    novaDataFormatada = novaDataFormatada + diaEmMilisegundos

    return new Date(novaDataFormatada);
}

function ignorarDiasDaSemana( data, diaDaSemana ){ 

    function ignorarDias(){

        let dias = diaDaSemana.map( dia =>{

            if( data.getDay() == dia ){

                data = somarDia(data)
    
            }else if( data.getDay() != dia ){

                return data;
    
            }

            return data;
        });

        return dias;

    }

    let diasIgnorados = ignorarDias();

    diasIgnorados = last(diasIgnorados);
        
    return diasIgnorados;

}

function verificarFeriado( data, typeCodes, feriados3){ // data = 00/00/0000

    const diaEmMilisegundos = 86400000; //para conferir e somar o prazo caso seja feriado 24H
    
    let dataFormatada = formatData(data, 'anoMesDia', 1)//formata para ano/mes/dia

    let listaFeriados = listarFeriados(feriados3, data);

    

    if( listaFeriados != dataFormatada){

        return listarFeriados(feriados3, new Date(listaFeriados));

    }else if(listaFeriados == dataFormatada){
        
        return new Date(dataFormatada);

    }


    function listarFeriados(feriados3, _data){
        
        var lista = [];

        feriados3.feriadosDoMes.map( feriado => {

            forEach(typeCodes, function( typeCode ) {

                if( formatData( feriado.data, 'anoMesDia', 1) == formatData( _data, 'anoMesDia', 1) && feriado.typeCode == typeCode){

                   lista.push( verificar(feriado.data) );

                }

            });


        });

        if( lista.length === 0 ){

            return _data;

        }else{
            return lista;
        }
    }

    function verificar( data ){

        let novaData = new Date(data);

        novaData = novaData.getTime() ; // soma 1 dia em milisegundos

        novaData = novaData + diaEmMilisegundos;

        novaData = formatData (new Date( novaData ), 'diaMesAno', 1) // formata a data em dia/mes/ano

        let novaDatadataFormatada = formatData( novaData, 'anoMesDia', 2) //formata para ano/mes/dia

        return novaDatadataFormatada;

    }

}

// Tratativas

function ordernarDiasDaSemanaParaIgnorar(diaDaSemana){

    let dias = diaDaSemana.find (dia => dia === 0);

    if( dias === 0 ){
        diaDaSemana.sort();
        diaDaSemana.splice(0,1)
        diaDaSemana.push(0)
    }

    return diaDaSemana;
}

function gerarPrazoDeManutencao( tempo ){

    let prazoManutencao = tempo / 60 / 24;

    if( tempo < 1440 ){
        prazoManutencao = 1;
    }

    return prazoManutencao;
}

function ordernarDatasParaIgnorar(datasParaIgnorar){

    if(datasParaIgnorar === undefined || datasParaIgnorar.length === 0){
        datasParaIgnorar = [new Date(1970,10,10)];
    }
    
    datasParaIgnorar.sort();

    return datasParaIgnorar;
}

async function chamarAxios(ano, cod_cidade, token){

    let hasError = '';

    if( cod_cidade.length == 0) return

    const options = {
         method: 'GET',
         mode: 'cors',
         cache: 'default', 
     }

    const feriados = await axios.get(`https://api.calendario.com.br/?json=true&ano=${ano}&ibge=${cod_cidade}&token=${token}`, options)
    .then(function (response) {
         return response;
    })
    .catch(e => {
        console.log("Error: " + e.message)
        if( e ){
            hasError = e.message;
        }
    });
    
    if( hasError.length > 0 ){
        console.log("Error:", hasError)
        return hasError;
    }


    if( typeof feriados.data === 'string'){

        console.log("Error:", feriados.data)
        let a = feriados.data.slice(0, feriados.data.indexOf('<'))

        return a;
    }

    return feriados.data

}