import React from 'react'

const GameBoard = (props) => {
  const gameBoardStyles = {
    height: props.height + '%',
    width: props.width + '%',
  }
  return (
    <div className='game__board' style={gameBoardStyles}>
      {props.children}
    </div>
  )
}

export default GameBoard
