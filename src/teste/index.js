import React from 'react'
import withStyles from 'isomorphic-style-loader/withStyles'
import s from './teste.css'

function App(props, context) {
  return (
    <div className={s.root}>
      <h1 className={s.title}>Hello, world!</h1>
    </div>
  )
}

export default withStyles(s)(App) // <--