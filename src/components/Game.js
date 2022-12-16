import React, { useState, useEffect } from 'react'

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
  const [birdPositionY, setBirdPositionY] = useState(67)

  const [gameStatus, setGameStatus] = useState(false)

  const [options, setOptions] = useState(undefined)

  useEffect(() => {
    (async function () {
      let url = 'https://api.sheety.co/51a168542b4a389d29f885a281010b31/french1/pilot';
      fetch(url)
        .then((response) => response.json())
        .then(json => {
          setOptions(json.pilot)
        });
    }())
  }, [])

  const [currentOption, setCurrentOption] = useState(undefined)

  const handleStartGame = () => {
    // TODO: Reset the game 

    if (options !== undefined && options.length >= 1) {
      console.log(options[0])
      setCurrentOption(options[0])
    }

    setGameStatus(true)
  }

  return (
    <main className='game'>
      <GameBoard height={gameBoardHeight} width={gameBoardWidth}>
        <Sprite className='sprite--round' texture={[`url('${cityBackground}')`]} height='100%' width='100%'>
          {
            gameStatus &&
            <Sprite className='sprite--label' texture={['#E6611D']} width='50%' positionY={2} positionX={35}>
              {currentOption.pronoun}({currentOption.time})
            </Sprite>
          }
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
          {
            gameStatus &&
            <Sprite
              className='sprite--column'
              texture={['#008000ab']}
              width='100px'
              height='44%'
              positionX={100}
            >
              {currentOption.conjugation}
            </Sprite>
          }
          {
            gameStatus &&
            <Sprite
              className='sprite--column'
              texture={['#ff0000ab']}
              width='100px'
              height='44%'
              positionX={100}
              positionY={67}
            >
              {
                currentOption[`wrong${Math.floor(Math.random() * 2) + 1}`]
              }
            </Sprite>
          }
          <Sprite
            className='sprite--round-bottom'
            texture={[`url(${ground})`]}
            repeatTextureInY={false}
            height='102px'
            width='100%'
            positionY={107}
          >
            Ground
          </Sprite>
        </Sprite>
      </GameBoard>
      <section className='game__board_actions'>
        <Command>
          <button className='command__button command__button-start' onClick={handleStartGame}>
            {gameStatus ? 'Start' : 'Play Again'}
          </button>
        </Command>
        <Score>
          <h2 className='score__label'>Score: 2</h2>
          <h2 className='score__label'>High Score: 5</h2>
        </Score>
      </section>
    </main>
  )
};


export default Game;
