# Calculadora de prazos

* props
    - token(String)
    - codIbge(String)
    - tempo(Number)
    - diasParaIgnorar(Array)
    - typeCodes(Array)
    - datasParaIgnorar(Array)
    - removerFeriados(Array)
    - showLegend(String)
    - onChangePrazo(func)
    - prazoOriginal(func)

* codIbge e tempo são props obrigatórias.

* token - token da api de feriados

* codIbge - para pegar os feriados da cidade.

* tempo - para gerar o prazo de manutenção, converte minutos em dias.
    - EX: tempo={1440} converte 1440 minutos em 1 dia

* diasParaIgnorar - ignora qualquer quantidade de dias da semana(dom,seg,ter..)
    - Ex: diasParaIgnorar={[new Date()]}

* typeCodes - para validar os feriados.
    - Ex: typeCodes={[1,2,3]}

* datasParaIgnorar - ignora qualquer quantidade de datas
    - Ex: datasParaIgnorar={[new Date()]}

* removerFeriados - remove os feriados do range de feriados
    - Ex: removerFeriados={[new Date( data_do_feriado )]}

* showLegend - mostra o painel expansivo
    - Ex: showLegend={'true'}

* onChangePrazo - retorna o prazo recalculado
    - cria uma Fn: 
    - async pegarPrazoOriginal( prazo ){
        let praRecalculado = await prazo;
    }
    - EX: onChangePrazo={ this.pegarPrazoRecalculado.bind(this) }

* prazoOriginal - retorna o prazo original 
    - mesmo do onChangePrazo 

1 - npm i exemplo2

2 - <Calendar codIbge={'3301900'} tempo={1440} token={'SUA_API_KEY'} />
