import React, { useState, useEffect } from 'react'

import GameBoard from './GameBoard'
import Sprite from './Sprite'
import Command from './Command'
import Score from './Score'

import cityBackground from '../assets/sprites/city-background.svg'
import ground from '../assets/sprites/ground.svg'
import bird from '../assets/sprites/bird.svg'
import '../assets/styles/game.css';

const Game = ({options}) => {
  const gameBoardHeight = 497
  const gameBoardWidth = 1000
  const groundHeight = 93
  const groundPositionY = gameBoardHeight - groundHeight
  const jumpSize = 60
  const columnsHeight = (gameBoardHeight - groundHeight) / 2

  const [birdPositionY, setBirdPositionY] = useState(groundPositionY / 2)
  const [columnsPosition, setColumnsPosition] = useState(gameBoardWidth)
  const [gameStatus, setGameStatus] = useState(false)
  const [columnsDifference, setColumnsDifference] = useState(0)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [correctAnswerInTop, setCorrectAnswerInTop] = useState(Math.random() < 0.5)
  const [currentOption, setCurrentOption] = useState()

  useEffect(() => {
    if (currentOption === undefined) {
      setCurrentOption(options[Math.floor(Math.random() * options.length)])
    }

    if (gameStatus) {
      let timeId;
      timeId = setInterval(() => {
        if (
          (birdPositionY <= gameBoardHeight - groundHeight)
          &&
          (birdPositionY >= 0)
        ) {
          setBirdPositionY(birdPositionY => birdPositionY + 3)
          const threshold = columnsDifference > 0
            ? columnsHeight + Math.abs(columnsDifference)
            : columnsHeight - Math.abs(columnsDifference)

          if (
            columnsPosition === 130 + 50 + 90
            &&
            (
              (!correctAnswerInTop && birdPositionY > threshold)
              ||
              (correctAnswerInTop && birdPositionY < threshold)
            )
          ) {
            // GAME OVER
            setGameStatus(false)
          } else if (
            columnsPosition === 130 + 50 + 90
            &&
            (
              (!correctAnswerInTop && birdPositionY < threshold)
              ||
              (correctAnswerInTop && birdPositionY > threshold)
            )
          ) {
            // TODO: solve this bug
            setScore(score => score + 1)
            if (highScore < score) {
              setHighScore(score)
            }
          }

          if (columnsPosition > 130) {
            setColumnsPosition(columnsPosition => columnsPosition - 5)
          } else {
            setColumnsDifference(Math.floor(
              Math.random() * ((columnsHeight / 2) - -(columnsHeight / 2)) + -(columnsHeight / 2)
            ))
            setCorrectAnswerInTop(Math.random() < 0.5)
            setColumnsPosition(gameBoardWidth)
            setCurrentOption(options[Math.floor(Math.random() * options.length)])
          }
        } else {
          setGameStatus(false)
        }
      }, 20);
      return () => clearInterval(timeId);
    } else {
      setScore(0)
      setBirdPositionY(groundPositionY / 2)
      setColumnsPosition(gameBoardWidth)
    }
  }, [
    gameStatus, birdPositionY, groundPositionY, columnsPosition, currentOption,
    columnsDifference, columnsHeight, correctAnswerInTop, score, highScore, options
  ]);

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
                {currentOption.pronoun}({currentOption.time})
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
              </Sprite>
              <Sprite
                className='sprite--column'
                texture={[(correctAnswerInTop ? '#ff0000ab' : '#008000ab')]}
                width='90px'
                height={columnsDifference > 0 ? columnsHeight + Math.abs(columnsDifference) : columnsHeight - Math.abs(columnsDifference)}
                positionX={columnsPosition - 110}
              >
                {correctAnswerInTop ? currentOption.conjugation : currentOption[`wrong${Math.floor(Math.random() * 2) + 1}`]}
              </Sprite>
              <Sprite
                className='sprite--column'
                texture={[(!correctAnswerInTop ? '#ff0000ab' : '#008000ab')]}
                width='90px'
                height={columnsDifference > 0 ? columnsHeight - Math.abs(columnsDifference) : columnsHeight + Math.abs(columnsDifference)}
                positionX={columnsPosition - 110}
                positionY={columnsDifference > 0 ? columnsHeight + Math.abs(columnsDifference) : columnsHeight - Math.abs(columnsDifference)}
              >
                {correctAnswerInTop ? currentOption.conjugation : currentOption[`wrong${Math.floor(Math.random() * 2) + 1}`]}
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
              <h2 className='score__label'>Score: {score}</h2>
            </Score>
        }
        <Score>
          <h2 className='score__label'>High Score: {highScore}</h2>
        </Score>
      </section>
    </main>
  )
};


export default Game;
