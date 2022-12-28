export const chooseOption = (user, prevOption) => {
  if (prevOption === undefined) {
    const userOptionsKeys = Object.keys(user.options)
    return user.options[userOptionsKeys[Math.floor(Math.random() * userOptionsKeys.length)]]
  }

  const userOptionsValues = Object.values(user.options)
  const min = userOptionsValues[0].nLow
  const max = userOptionsValues[userOptionsValues.length - 1].nHigh
  const randomNumber = Math.random() * (max - min) + min

  return Object.entries(user.options).find(value => (value.nLow > randomNumber && value.nHigh < randomNumber))
}

export const generateUUID = () => {
  return (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (
    Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
  ).toString(16)
  )
}
