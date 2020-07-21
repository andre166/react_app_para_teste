import React from 'react';
import formatData from '../calculaPrazo/formatDatas';
import '../App.css'
function InformPrazo({ prazos, time }) {

    const { ultimoDiaDoPrazo, dataDeAbertura } = prazos
    
  return (
    <div className="prazosContainer">
      
      <div className="divDeTestes" >Div de testes</div>

      {ultimoDiaDoPrazo === undefined ? '' :
        <div>
            <p >Tempo: <strong style={{color:'red'}}>{time}m = {time / 60}h = {time / 60 / 24}dias úteis</strong></p>
            <p>Data de Abertura: {formatData(dataDeAbertura, 'diaMesAno', 1)}</p>
            <p>Prazo Final: {formatData(ultimoDiaDoPrazo, 'diaMesAno', 1)}</p>
        </div>
      }

    </div>
  );
}

export default InformPrazo;