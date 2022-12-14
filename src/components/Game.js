import React, { useState } from 'react'

import GameBoard from './GameBoard'
import Sprite from './Sprite'
import Command from './Command'
import Score from './Score'

import cityBackground from '../assets/sprites/city-background.svg'
import ground from '../assets/sprites/ground.svg'
import bird from '../assets/sprites/bird.svg'
import '../assets/styles/game.css';

const Game = () => {
  const gameBoardHeight = 80
  const gameBoardWidth = 90

  const [birdPositionX, setBirdPositionX] = useState(5)
  const [birdPositionY, setBirdPositionY] = useState(60)

  const handleStartGame = () => {
    console.log('Hello')
  }


  return (
    <main className='game'>
      <GameBoard height={gameBoardHeight} width={gameBoardWidth}>
        <Sprite className='sprite--round' texture={[`url('${cityBackground}')`]} height='100%'>
          <Sprite
            texture={[`url('${bird}')`]}
            height='38px'
            width='50px'
            repeatTextureInX={false}
            repeatTextureInY={false}
            positionX={birdPositionX}
            positionY={birdPositionY}
          >
            Bird
          </Sprite>
          <Sprite
            className='sprite--round-bottom'
            texture={[`url(${ground})`]}
            repeatTextureInY={false}
            height='100px'
            positionY={100}
          >
            Ground
          </Sprite>
        </Sprite>
      </GameBoard>
      <section className='game__board_actions'>
        <Command>
          <button className='command__button command__button-start' onClick={handleStartGame}>Start</button>
        </Command>
        <Score>
          <h2 className='score__label'>High Score: 5</h2>
        </Score>
      </section>
    </main>
  )
};


export default Game;
