import React, { Component } from 'react';
import isSameDay from 'date-fns/isSameDay';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import calcularPrazo from './calcularPrazo';
import './estilo.css';
import ExpansionPainel from './expansionPainel';
import formatData from './formatDatas';
import WarningIcon from '@material-ui/icons/Warning';

class ReactCalendar extends Component{
    
    constructor( props ){
        
        super( props );

        this.state = {
            dataDeAbertura: '',
            prazoFinal: '',
            range: [],
            rangeAbertura_inicial: [],
            listaDeFeriados: '',
            rangeInicial: '',
            feriadosInRange: '',
            dataParaIgnorar: [],

            renderCalendario: false,
            checkedItems: new Map(),
            expansionPainel: false,
            hasError: '',
        }
        
        this.tileClassName = this.tileClassName.bind(this);
        this.verificaDescricao = this.verificaDescricao.bind(this);
        this.alterarCalendario = this.alterarCalendario.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.gerarPrazo = this.gerarPrazo.bind(this);
        
    }

    alterarCalendario({ activeStartDate, date, view }){

        if (view === 'month') {

            if( this.state.rangeInicial){ //tooltip caso tenha feriado no range inicial

                if(this.state.rangeInicial.find( e => isSameDay(e,date))){

                    return(
                        <div className="tooltip">
                            <span className="tooltiptext">{`${this.verificaDescricao(date)}`}</span>
                        </div>
                    )

                }

            }

            if(isSameDay(new Date(this.state.prazoFinal), date)){ 
                return (
                    <div className="tooltip">
                        <span className="tooltiptext">Prazo Final para a manutenção</span>
                    </div>
                )
            }

            if ( this.state.listaDeFeriados.find(feriado => isSameDay(new Date(feriado.data), date)) ){

                if( isSameDay(new Date(this.state.prazoFinal), date)){
                    return;
                }else if( !isSameDay(date, this.props.forcarDataInicial) &&  !isSameDay(date, this.state.prazoFinal)){
               
                    return (
                        <div className="tooltip">
                            <span className="tooltiptext">{this.verificaDescricao(date)}</span>
                        </div>  
                    )

                }
            }
      
        }

    }

    tileClassName({ date, view }){

        if( isSameDay( new Date(), date ) && isSameDay( this.state.dataDeAbertura, date )){
            return 'datIni'
        }else if( isSameDay( new Date(), date ) && this.state.dataDeAbertura === undefined){
            return 'datIni';
        }
        
        if( isSameDay( new Date(), date ) && !isSameDay( this.state.dataDeAbertura, date )){

            this.state.range.map( e => {

                if( isSameDay(e, date)){
                    return;
                }
            })
        }

        let lista = [];

        if( this.state.rangeInicial){

            if(this.state.rangeInicial.find( e => isSameDay(e,date))){

                if( !isSameDay(this.props.forcarDataInicial, this.state.range[0])){
                    return '';
                }else{
                    return 'range-desabilitado';
                }

            }

        }

        if( isSameDay( this.state.dataDeAbertura, date ) ){
            return 'datIni'
        }

        if(isSameDay(new Date(this.state.prazoFinal), date)){
            return 'prazo-final';
        }


        if( this.state.range.find(dDate => isSameDay(new Date(dDate), date)) ){

            if( this.state.listaDeFeriados !== undefined ){

                lista = this.state.listaDeFeriados.map(data2 => {

                    if( isSameDay(new Date(data2.data), date)){

                        let type = {data: date, typeCode: data2.typeCode}

                        let retorno = ''; 

                        if( this.props.typeCodes === undefined){
                            [1,2,3].map( typeCode=> {

                                if( typeCode == type.typeCode ){
                                    retorno = 'range-desabilitado';
                                }
                            })

                            return retorno;

                        }else{

                            this.props.typeCodes.map( typeCode=> {
    
                                if( typeCode == type.typeCode){
                                    retorno = 'range-desabilitado';
                                }
                            })
                        }

                        return retorno;

                    }

                })
            }

            if( this.props.diasParaIgnorar !== undefined ){
                
                let diaParaIgnorar = this.props.diasParaIgnorar.map( dia =>{

                    if( dia == date.getDay()){
                        return 'range-desabilitado';
                    }

                })

                lista.push( ...diaParaIgnorar )
                
            }else if( this.props.diasParaIgnorar === undefined){

                if( date.getDay() === 0 ){
                    return 'range-desabilitado';
                }

            }
           
            if( this.props.datasParaIgnorar !== undefined ){

                let dataParaIgnorar = this.props.datasParaIgnorar.map(e => {

                    if( isSameDay(new Date(e), date) ){
                        return 'range-desabilitado';
                    }

                });

                lista.push( ...dataParaIgnorar )

            }

            return lista;

        }


        if ( this.state.listaDeFeriados.find(dDate => isSameDay(new Date(dDate.data), date))  ){

            if( date.getMonth() === this.state.dataDeAbertura.getMonth() ){
                return 'active legenda5';
            }else{
                return '' ;
            }
        }

    }

    async recalcularPrazo(){

        let feriadosParaExclusao = [];

        this.state.checkedItems.forEach( ( cheked, data ) =>{

            if( !cheked ){
                feriadosParaExclusao.push(new Date( formatData(data, "anoMesDia", 2)));
            }
        });

        let prazoRecalculado = await this.calcular(
            this.props.codIbge, this.props.tempo, this.props.diasParaIgnorar, this.props.typeCodes, this.props.datasParaIgnorar,
            this.props.forcarDataInicial, this.props.token, feriadosParaExclusao, 'recalcular'
        );

        if( this.props.onChangePrazo ){
            this.props.onChangePrazo(prazoRecalculado);
        }
    
        return prazoRecalculado;
    }

    async calcular( codIbge, tempo, diasParaIgnorar, typeCodes, datasParaIgnorar, forcarDataInicial, token, removerFeriados, tipoDoCalculo ) {

        let prazos =  await calcularPrazo( codIbge, tempo, diasParaIgnorar, typeCodes, datasParaIgnorar, forcarDataInicial, token, removerFeriados );

        let listaFeriados = [];

        let feriados = prazos.calendario.feriados;

        for (var feriado in feriados) {
            listaFeriados.push(feriados[feriado]);
        }
        
        if( tipoDoCalculo === 'calcular' || tipoDoCalculo === undefined){

            this.setState({
                renderCalendario: false,
            })

            this.setState({
                dataDeAbertura: prazos.dataDeAbertura,
                prazoFinal: new Date( prazos.ultimoDiaDoPrazo ),
                listaDeFeriados: listaFeriados[1],
                range: prazos.calendario.range,
                rangeInicial: prazos.calendario.rangeInical,
                feriadosInRange: prazos.feriadosInRange,
                hasError: prazos.calendario.feriados.error,
                renderCalendario: true
            })

        }else if( tipoDoCalculo === 'recalcular'){

            this.setState({
                renderCalendario: false,
            })

            this.setState({
                dataDeAbertura: prazos.dataDeAbertura,
                prazoFinal: new Date( prazos.ultimoDiaDoPrazo ),
                listaDeFeriados: listaFeriados[1],
                range: prazos.calendario.range,
                rangeInicial: prazos.calendario.rangeInical,
                renderCalendario: true
            })

        }

        return prazos;
    }

    async gerarPrazo(){

        let prazoOriginal = await this.calcular( this.props.codIbge, this.props.tempo, this.props.diasParaIgnorar, this.props.typeCodes, this.props.datasParaIgnorar,
            this.props.forcarDataInicial, this.props.token, this.props.removerFeriados
        );

        if(this.props.onChangePrazo){
            this.props.onChangePrazo(prazoOriginal)
        }
    }
    
    componentDidMount(){

        if( this.props.showLegend === 'true' || this.props.showLegend === undefined){

            this.setState({
                expansionPainel: true
            })

        }

        this.gerarPrazo();
    }

    componentDidUpdate(prevProps, prevState) {

        if( prevProps.tempo != this.props.tempo || prevProps.codIbge !== this.props.codIbge){

            this.gerarPrazo();
            // let prazoOriginal = this.calcular( this.props.codIbge, this.props.tempo, this.props.diasParaIgnorar, this.props.typeCodes, this.props.datasParaIgnorar,
            //     this.props.forcarDataInicial, this.props.token, this.props.removerFeriados
            // );
    
            // if(this.props.onChangePrazo){
            //     this.props.onChangePrazo(prazoOriginal)
            // }

        }
    
    }

    verificaDescricao(date){ //coloca a descrição dos feriados nos tooltips

        let lista = this.state.listaDeFeriados.find( feriado => {
    
            if(isSameDay(new Date(feriado.data), date)){
    
                return feriado.description;
            }
        })
    
        if(lista === undefined){
            lista = 'Feriado [Não contém descrição]';
            return lista;
        }else{
    
            return lista.description;
        }
    
    }

    async handleChange(e) {
        const date = e.target.name;
        const isChecked = e.target.checked;
        await this.setState( prevState => ({ checkedItems: prevState.checkedItems.set(date, isChecked) }) )
        this.recalcularPrazo();
    }

    render(){

        return(
            <div className="larguraDoCalendario">
                { this.state.dataDeAbertura.length === 0 && this.state.prazoFinal.length === 0 && this.state.renderCalendario === true ? '' :

                    <>
                        { this.state.renderCalendario === false ? '' : // para renderizar o calendário novamente após o recalcular

                            <div>

                                { this.state.hasError ? 

                                    <div className="errorDiv">
                                       <WarningIcon/>
                                        <div style={{marginLeft: '5px'}}> {this.state.hasError }</div>
                                    </div>

                                :  '' 
                                
                                }

                                <Calendar showNavigation={false} value={ [this.state.dataDeAbertura, this.state.prazoFinal]} tileClassName={this.tileClassName} 
                                    tileContent={ this.alterarCalendario } className="larguraDoCalendario"
                                />

                            </div>

                        }

                        {this.state.expansionPainel === false ? '' : 
                            <ExpansionPainel feriadosInRange={this.state.feriadosInRange}  
                                change={this.handleChange.bind(this)} checkedItems={this.state.checkedItems}
                            />
                        }

                    </>

                }

            </div>
            
        );

    }
    
}

ReactCalendar.propTypes = {
    codIbge: PropTypes.string.isRequired,
    tempo: PropTypes.number.isRequired,
    diasParaIgnorar: PropTypes.array,
    typeCodes: PropTypes.array,
    datasParaIgnorar: PropTypes.array,
    forcarDataInicial: PropTypes.instanceOf(Date),
    token: PropTypes.string.isRequired,
    removerFeriados: PropTypes.array,
    onChangePrazo: PropTypes.func
};

ReactCalendar.defaultProps = {
    tempo: 1440,
    diasParaIgnorar: [0],
    typeCodes: [1,2,3],
}


export default ReactCalendar;
