export default function formatData(data, tipoDeRetorno, tipoDeData){ // tipoDeData = 1: Wed Sep 09 2020 00:00:00 GMT-0300, 2: 00/00/0000 ou 0000/00/00
    
    let dataFormatada = 0;

    if(tipoDeData == 2){
        let data2 = String(data).split('/');
        dataFormatada = new Date(data2[2], data2[1] - 1, data2[0]);

    }else if(tipoDeData == 1){
        dataFormatada = data;
    }

    let dia = dataFormatada.getDate();
    let mes = dataFormatada.getMonth() + 1;
    let ano = dataFormatada.getFullYear();

    if(dia < 10){
        dia = "0" + dia;
    }
    if(mes < 10){
        mes = "0" + mes
    }

    if(tipoDeRetorno == 'diaMesAno'){

        return dia + "/" + mes + "/" + ano;

    }else if(tipoDeRetorno == 'anoMesDia'){
        
        return ano + "/" + mes + "/" + dia;
    }

}