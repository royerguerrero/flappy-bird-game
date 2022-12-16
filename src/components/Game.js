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
  const gameBoardHeight = 497
  const gameBoardWidth = 1000
  const groundHeight = 93
  const groundPositionY = gameBoardHeight - groundHeight
  const jumpSize = 60
  const columnsHeight = (gameBoardHeight - groundHeight) / 2
  const columnsDifference = 30

  const [birdPositionY, setBirdPositionY] = useState(groundPositionY / 2)
  const [columnsPosition, setColumnsPosition] = useState(gameBoardWidth)
  const [gameStatus, setGameStatus] = useState(false)
  const [options, setOptions] = useState({})

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

  useEffect(() => {
    if (gameStatus) {
      let timeId;
      timeId = setInterval(() => {
        if (
          (birdPositionY <= gameBoardHeight - groundHeight)
          &&
          (birdPositionY >= 0)
        ) {
          // setBirdPositionY(birdPositionY => birdPositionY + 3)
          if (columnsPosition >= 130) {
            setColumnsPosition(columnsPosition => columnsPosition - 2)
          } else {
            setColumnsPosition(gameBoardWidth)
          }
        } else {
          setGameStatus(false)
        }
      }, 20);
      return () => clearInterval(timeId);
    } else {
      setBirdPositionY(groundPositionY / 2)
      setColumnsPosition(gameBoardWidth)
    }
  }, [gameStatus, birdPositionY, groundPositionY, columnsPosition]);

  const handleClick = () => {
    setBirdPositionY((birdPositionY) => birdPositionY - jumpSize)
  }

  return (
    <main className='game' onClick={handleClick}>
      <GameBoard height={gameBoardHeight} width={gameBoardWidth} >
        <Sprite className='sprite--round' texture={[`url('${cityBackground}')`]} height='100%' width='100%'>
          {
            gameStatus &&
            <React.Fragment>
              <Sprite className='sprite--label' texture={['#E6611D']} width='50%' positionY={20} positionX={gameBoardWidth / 4}>
                {/* {currentOption.pronoun}({currentOption.time}) */}
                JE(PRÉSENT)
              </Sprite>
              <Sprite
                texture={[`url('${bird}')`]}
                height='38px'
                width='50px'
                repeatTextureInX={false}
                repeatTextureInY={false}
                positionX={130}
                positionY={birdPositionY}
              >
                Bird
              </Sprite>
              <Sprite
                className='sprite--column'
                texture={['#008000ab']}
                width='90px'
                height={columnsHeight}
                positionX={columnsPosition - 110}
              >
                {/* {currentOption.conjugation} */}
                SUIS
              </Sprite>
              <Sprite
                className='sprite--column'
                texture={['#ff0000ab']}
                width='90px'
                height={columnsHeight}
                positionX={columnsPosition - 110}
                positionY={columnsHeight}
              >
                {/* {currentOption[`wrong${Math.floor(Math.random() * 2) + 1}`]} */}
                SUI
              </Sprite>
            </React.Fragment>
          }
          <Sprite
            className='sprite--round-bottom'
            texture={[`url(${ground})`]}
            repeatTextureInY={false}
            height={groundHeight}
            width='100%'
            positionY={groundPositionY}
          >
            Ground
          </Sprite>
        </Sprite>
      </GameBoard>
      <section className='game__board_actions'>
        {
          !gameStatus ?
            <Command>
              <button className='command__button command__button-start' onClick={() => setGameStatus(true)}>Start</button>
            </Command> :
            <Score>
              <h2 className='score__label'>Score: 2</h2>
            </Score>
        }
        <Score>
          <h2 className='score__label'>High Score: 5</h2>
        </Score>
      </section>
    </main>
  )
};


export default Game;
