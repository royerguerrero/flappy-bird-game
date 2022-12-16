import React from 'react'

const Sprite = ({
  children,
  className,
  height,
  width,
  positionY,
  positionX,
  texture = [],
  repeatTextureInX = true,
  repeatTextureInY = true,
}) => {
  const spriteStyles = {
    background: texture.length === 1 ? texture[0] : 'initial',
    height: height,
    width: width,
    backgroundRepeatX: repeatTextureInX ? 'repeat' : 'no-repeat',
    backgroundRepeatY: repeatTextureInY ? 'repeat' : 'no-repeat',
    top: positionY,
    left: positionX,
  }
  return (
    <div className={`sprite ${className}`} style={spriteStyles}>
      {children}
    </div>
  )
}

export default Sprite
