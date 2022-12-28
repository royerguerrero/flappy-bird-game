import React, { useState, useEffect, useRef } from 'react'

import GameBoard from './GameBoard'
import Sprite from './Sprite'
import Command from './Command'
import Score from './Score'

import '../assets/styles/game.css';

import { chooseOption, generateUUID } from '../utils'

const Game = ({ options }) => {
  const gameBoardHeight = 497
  const gameBoardWidth = 1000
  const jumpSize = 60
  const columnsHeight = gameBoardHeight / 2
  const columnsWidth = 90
  const birdPositionX = 150
  const birdWidth = 75

  const [birdPositionY, setBirdPositionY] = useState(gameBoardHeight / 2)
  const [columnsPosition, setColumnsPosition] = useState(gameBoardWidth)
  const [gameStatus, setGameStatus] = useState(false)
  const [columnsDifference, setColumnsDifference] = useState(0)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [correctAnswerInTop, setCorrectAnswerInTop] = useState(Math.random() < 0.5)

  const [user, setUser] = useState({
    id: generateUUID(),
    options: Object.assign({}, ...options.map(option => ({
      [option.id2]: {
        ...option,
        right: 1,
        wrong: 1,
        fraction: 1,
        nLow: 0,
        nHigh: 1,
      }
    }))),
    lastWrong: undefined
  })

  const [currentOption, setCurrentOption] = useState(chooseOption(user, undefined))
  const [wrongAnswer, setWrongAnswer] = useState(currentOption[`wrong${Math.floor(Math.random() * 2) + 1}`])
  const audioRef = useRef(null)

  useEffect(() => {
    if (gameStatus) {
      let timeId;
      timeId = setInterval(() => {
        if (
          (birdPositionY <= gameBoardHeight - 30)
          &&
          (birdPositionY >= 0)
        ) {
          setBirdPositionY(birdPositionY => birdPositionY + 3)
          const threshold = columnsDifference > 0
            ? columnsHeight + Math.abs(columnsDifference)
            : columnsHeight - Math.abs(columnsDifference)

          if (columnsPosition === birdPositionX + birdWidth + columnsWidth) {
            if (
              (correctAnswerInTop && birdPositionY > threshold)
              ||
              (!correctAnswerInTop && birdPositionY < threshold)
            ) {
              setUser(prevUser => ({
                ...prevUser,
                options: {
                  ...prevUser.options,
                  [currentOption.id2]: {
                    ...currentOption,
                    wrong: currentOption.wrong + 1
                  }
                },
                lastWrong: currentOption.id2
              }))
              setGameStatus(false)
            } else {
              setUser(prevUser => ({
                ...prevUser,
                options: {
                  ...prevUser.options,
                  [currentOption.id2]: {
                    ...currentOption,
                    right: currentOption.right + 1
                  }
                },
              }))
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
            setCurrentOption(prevCurrentOption => chooseOption(user, prevCurrentOption))
            setWrongAnswer(currentOption[`wrong${Math.floor(Math.random() * 2) + 1}`])
          }
        } else {
          setGameStatus(false)
        }
      }, 20);
      return () => clearInterval(timeId);
    } else {
      setScore(0)
      setBirdPositionY(gameBoardHeight / 2)
      setColumnsPosition(gameBoardWidth)
    }
  }, [
    gameStatus, birdPositionY, columnsPosition, currentOption, user, options,
    columnsDifference, columnsHeight, correctAnswerInTop, score, highScore,
  ])

  useEffect(() => {
    window.addEventListener('keydown', event => { event.key === ' ' && handleClick() })
  }, [])

  useEffect(() => {
    if (gameStatus) {
      const nHighMax = Math.max(...Object.values(user.options).map(option => (option.nHigh)))
      const recalculatedOptions = Object.assign(
        {}, ...Object.entries(user.options).map(([key, value], index) => {
          let prevValue = { nHigh: 0 }
          if (index > 0) {
            prevValue = Object.values(user.options)[index - 1]
          }
          const fraction = key === user.lastWrong
            ? Math.round(value.wrong / value.right).toFixed(2)
            : Math.round(nHighMax / 3.3).toFixed(2)

          // console.table(key, value.lastWrong)
          // console.warn(Math.round(value.wrong / value.right).toFixed(2))
          // console.warn(Math.round(nHighMax / 3.3).toFixed(2))
          const nLow = prevValue.nHigh
          return {
            [key]: {
              ...value,
              fraction: fraction,
              nLow: nLow,
              nHigh: fraction + nLow
            }
          }
        })
      )
      console.log(recalculatedOptions)
      debugger
      // setUser(prevUser => ({
      //   ...prevUser,
      //   options: recalculatedOptions
      // }))
    }
  }, [user, gameStatus])

  const handleClick = () => {
    setBirdPositionY(birdPositionY => {
      const newBirdPositionY = birdPositionY - jumpSize
      return newBirdPositionY > 0 ? newBirdPositionY : 0
    })
  }

  return (
    <main className='game' onClick={handleClick}>
      <GameBoard height={gameBoardHeight} width={gameBoardWidth} >
        <Sprite
          className='sprite--round sprite--extend-texture'
          texture={[`url('https://res.cloudinary.com/kaiserberge/image/upload/v1672181099/samples/test/parisbg1.jpg')`]}
          height='100%'
          width='100%'
        >
          {
            gameStatus &&
            <React.Fragment>
              <Sprite className='sprite--label' texture={['#E6611D']} width='50%' positionY={20} positionX={gameBoardWidth / 4}>
                {currentOption.pronoun}({currentOption.time})
              </Sprite>
              <Sprite
                className='sprite--extend-texture'
                texture={[`url('https://res.cloudinary.com/kaiserberge/image/upload/v1671554006/samples/test/bird.png')`]}
                height='50px'
                width={`${birdWidth}px`}
                repeatTextureInX={false}
                repeatTextureInY={false}
                positionX={birdPositionX}
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
                width={`${columnsWidth}px`}
                height={columnsDifference > 0 ? columnsHeight - Math.abs(columnsDifference) : columnsHeight + Math.abs(columnsDifference)}
                positionX={columnsPosition - 110}
                positionY={columnsDifference > 0 ? columnsHeight + Math.abs(columnsDifference) : columnsHeight - Math.abs(columnsDifference)}
              >
                {!correctAnswerInTop ? currentOption.conjugation : wrongAnswer}
              </Sprite>
            </React.Fragment>
          }
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
