import React, { useState, useEffect, useRef } from 'react'

import GameBoard from './GameBoard'
import Sprite from './Sprite'
import Command from './Command'
import Score from './Score'

import cityBackground from '../assets/sprites/city-background.svg'
import ground from '../assets/sprites/ground.svg'
import bird from '../assets/sprites/bird.svg'
import '../assets/styles/game.css';

const Game = ({ options }) => {
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
  const [currentOption, setCurrentOption] = useState(options[Math.floor(Math.random() * options.length)])
  const [wrongAnswer, setWrongAnswer] = useState(currentOption[`wrong${Math.floor(Math.random() * 2) + 1}`])
  const audioRef = useRef(null)

  useEffect(() => {
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

          if (columnsPosition === 130 + 50 + 90) {
            if (
              (correctAnswerInTop && birdPositionY > threshold)
              ||
              (!correctAnswerInTop && birdPositionY < threshold)
            ) {
              setGameStatus(false)
            } else {
              audioRef.current.play()
              setScore(score => score + 1)
              if (highScore <= score) {
                setHighScore(score + 1)
              }
            }
          }

          if (columnsPosition > 110) {
            setColumnsPosition(columnsPosition => columnsPosition - 5)
          } else {
            setColumnsDifference(Math.floor(
              Math.random() * ((columnsHeight / 2) - -(columnsHeight / 2)) + -(columnsHeight / 2)
            ))
            setCorrectAnswerInTop(Math.random() < 0.5)
            setColumnsPosition(gameBoardWidth)
            setCurrentOption(options[Math.floor(Math.random() * options.length)])
            setWrongAnswer(currentOption[`wrong${Math.floor(Math.random() * 2) + 1}`])
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
  ])

  useEffect(() => {
    window.addEventListener('keydown', event => { event.key === ' ' && handleClick() })
  }, [])

  const handleClick = () => {
    setBirdPositionY(birdPositionY => {
      const newBirdPositionY = birdPositionY - jumpSize
      return newBirdPositionY > 0 ? newBirdPositionY : 0
    })
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
                texture={[(correctAnswerInTop ? '#008000ab' : '#ff0000ab')]}
                width='90px'
                height={columnsDifference > 0 ? columnsHeight + Math.abs(columnsDifference) : columnsHeight - Math.abs(columnsDifference)}
                positionX={columnsPosition - 110}
              >
                {correctAnswerInTop ? currentOption.conjugation : wrongAnswer}
              </Sprite>
              <Sprite
                className='sprite--column'
                texture={[(!correctAnswerInTop ? '#008000ab' : '#ff0000ab')]}
                width='90px'
                height={columnsDifference > 0 ? columnsHeight - Math.abs(columnsDifference) : columnsHeight + Math.abs(columnsDifference)}
                positionX={columnsPosition - 110}
                positionY={columnsDifference > 0 ? columnsHeight + Math.abs(columnsDifference) : columnsHeight - Math.abs(columnsDifference)}
              >
                {!correctAnswerInTop ? currentOption.conjugation : wrongAnswer}
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
        <audio ref={audioRef} src={currentOption.audio} />
      </section>
    </main>
  )
};


export default Game;
