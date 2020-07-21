import React, { Component } from 'react';
import './App.css';
import InfoPrazos from './informPrazo';
// import Calc from 'lib';
// import 'lib/calendarioEstilo.css';
import Button from '@material-ui/core/Button';
import Calc from './calculaPrazo';
// import Calc from '@lestetelecom/calculaprazo2';
// import '@lestetelecom/calculaprazo2/lib/calendarioEstilo.css';

class App extends Component {

  constructor( props ){
      
    super( props );

    this.state = {
      prazos: '',
      time: 2880,
      codIbge: 3301900,
    }

    this.recalcular = this.recalcular.bind(this);

}

  async pegarPrazoRecalculado( prazo ){

    console.log("aaaa", prazo)

    this.setState((state, props) => ({
      prazos: prazo
    }));

  }

  recalcular(){
    this.setState((state, props) => ({
      time: this.state.time + 1440
    }));
  }

  codIBGEChange(){
    this.setState((state, props) => ({
      codIbge: this.state.codIbge + 1
    }));
  }

  render(){
    return (
      <div className="containerCentral">

        <Calc codIbge={ this.state.codIbge } tempo={ this.state.time } 
          token={'YW5kcmUubWVzcXVpdGExOTI3QGdtYWlsLmNvbSZoYXNoPTI0MTMzNDAzMw'}
          showLegend='true' typeCodes={[1,2,3]} onChangePrazo={ this.pegarPrazoRecalculado.bind(this)} forcarDataInicial={new Date(2020,3, 21)}
        />

        <div style={{marginLeft: '50px'}}>

          <InfoPrazos prazos={this.state.prazos} time={this.state.time}/>

          <Button variant="contained" color="primary" onClick={this.recalcular.bind(this)} style={{marginLeft: '10px'}}>
            somar 1440 minutos
          </Button>

          <Button variant="contained" color="secondary" onClick={this.codIBGEChange.bind(this)} style={{marginLeft: '10px'}}>
            mudar CodIBGE
          </Button>

        </div>

      </div>
    );

  }

}

// this.props.codIbge, this.props.cabo, this.props.diasParaIgnorar, this.props.typeCodes, this.props.datasParaIgnorar,
//                 this.props.forcarDataInicial, this.props.token, this.props.removerFeriados this.props.onChangePrazo

export default App;