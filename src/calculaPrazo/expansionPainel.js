import React, {Component} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import formatData from './formatDatas';
import Checkbox from '@material-ui/core/Checkbox'; 
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

class chek extends React.Component {
  
  
}

class SimpleExpansionPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chek: true,
    };
  }

  checou( fe ){

    if( this.props.checkedItems.get(formatData(fe, 'diaMesAno', 1)) === undefined ){
      return true
    }else{
      return this.props.checkedItems.get(formatData(fe, 'diaMesAno', 1));
    }

  }
render(){
  return (
    <div >
      <ExpansionPanel className="larguraDoCalendario">

        <ExpansionPanelSummary >
          <Typography >Legendas</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
            <div className="containerDescricaoLegenda">
                <div className="containerLegendas">
                    <div className="legenda legenda1"></div> 
                    <label>Data de abertura do prazo.</label>
                </div>

                <div className="containerLegendas">
                    <div className="legenda legenda2"></div> 
                    <label>Datas que não contam prazo.</label>
                </div>

                <div className="containerLegendas">
                    <div className="legenda legenda3"></div> 
                    <label>Dias que contam prazo.</label>
                </div>

                <div className="containerLegendas">
                    <div className="legenda legenda4"></div> 
                    <label>Data final do prazo.</label>
                </div>

                <div className="containerLegendas">
                    <div className="legenda legenda5"></div> 
                    <label>Feriados.</label>
                </div>
            </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel className="larguraDoCalendario">

        <ExpansionPanelSummary >
          <Typography>Feriados dentro do prazo de manutenção</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
            <List>
              { this.props.feriadosInRange.length === 0 ? 'Não há feriados' : 
                this.props.feriadosInRange.map( (fe, index) => (
                    <ListItem  key={index}>
                        <Checkbox 
                          name={formatData(fe.data, 'diaMesAno', 1)} 
                          checked={ this.checou( fe.data )} 
                          onChange={this.props.change} 
                        />
                        <ListItemText primary={fe.description} secondary={formatData(fe.data, 'diaMesAno', 1)}/>
                    </ListItem >
                ))
              }
            </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
}

export default SimpleExpansionPanel;