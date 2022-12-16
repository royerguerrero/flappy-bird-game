import React from 'react'

const GameBoard = ({
  children,
  height,
  width,
}) => {
  const gameBoardStyles = {
    height: height + 'px',
    width: width + 'px',
  }
  return (
    <div className='game__board' style={gameBoardStyles}>
      {children}
    </div>
  )
}

export default GameBoard
