export const chooseOption = (user, prevOption) => {
  const userOptionsValues = Object.values(user.options)
  const min = userOptionsValues[0].nLow
  const max = userOptionsValues[userOptionsValues.length - 1].nHigh
  const randomNumber = Math.random() * (max - min) + min

  const newOption = userOptionsValues.find(value => (value.nLow < randomNumber && value.nHigh > randomNumber))
  if (prevOption !== undefined) {
    if (parseInt(prevOption.pronounId) === parseInt(newOption.pronounId)) {
      return chooseOption(user, prevOption)
    }
  }

  return newOption
}

export const generateUUID = () => {
  return (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (
    Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
  ).toString(16)
  )
}

export const recalculateOptions = (currentOption, options, failed) => {
  const nHighMax = Math.max(...Object.values(options).map(option => (option.nHigh)))

  const newOptions = {}
  for (const [index, [key, value]] of Object.entries(options).entries()) {
    if (failed && currentOption.id2 === key) {
      value.wrong = value.wrong + 1
    } else if (!failed && currentOption.id2 === key) {
      value.right = value.right + 1
    }

    const fraction = failed && currentOption.id2 === key
      ? Math.round(nHighMax / 3.3 * 100) / 100
      : Math.round(value.wrong / value.right * 100) / 100
    const nLow = index > 0 ? Object.values(newOptions)[index - 1].nHigh : 0
    newOptions[key] = {
      ...value,
      fraction: fraction,
      nLow: nLow,
      nHigh: fraction + nLow,
    }
  }

  return newOptions
}

export const logUserData = user => {
  const userOptions = Object.values(user.options)
  for (let i = 0; i <= userOptions.length; i++) {
    const url = `https://api.sheety.co/51a168542b4a389d29f885a281010b31/french1/user/${i}`
    const body = {
      user: {
        'user': user.id,
        'id2': userOptions[i]['id2'],
        'level': userOptions[i]['level'],
        'right': userOptions[i]['right'],
        'wrong': userOptions[i]['wrong'],
        'fraction': userOptions[i]['fraction'],
        'nLow': userOptions[i]['nLow'],
        'nHigh': userOptions[i]['nHigh']
      }
    }
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json.user)
      })
  }
}