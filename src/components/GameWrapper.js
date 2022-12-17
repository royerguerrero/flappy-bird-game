import React, { useEffect, useState } from 'react'

import Game from './Game'

const GameWrapper = () => {
  const [data, setData] = useState(null)
  const [callAPI, setCallAPI] = useState(true)

  console.log(callAPI)
  useEffect(() => {
    if (callAPI) {
      (async function () {
        let url = 'https://api.sheety.co/51a168542b4a389d29f885a281010b31/french1/pilot';
        fetch(url)
          .then((response) => response.json())
          .then(json => {
            setData(json.pilot)
          })
      }())
    } else {
      setCallAPI(false)
    }
  }, [callAPI])
  return (
    <React.Fragment>
      {data ? <Game options={data} /> : <div>Loading...</div>}
    </React.Fragment>
  )
}

export default GameWrapper