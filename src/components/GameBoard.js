import React from 'react'

const GameBoard = (props) => {
  const gameBoardStyles = {
    minHeight: props.height + '%',
    maxHeight: props.height + '%',
    minWidth: props.width + '%',
    maxWidth: props.width + '%',
  }
  return (
    <div className='game__board' style={gameBoardStyles}>
      {props.children}
    </div>
  )
}

export default GameBoard
