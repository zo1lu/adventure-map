import React, { useRef } from 'react'

const Setting = ({colorChangeHandler, strokeChangeHandler, defaultColor, defaultStroke})=>{
  return (
    <div className="w-48 h-[200px] absolute flex flex-col p-5 top-24 right-8 bg-white rounded-md">
      <label>Brush Width: </label>
      <input
        type="range"
        min="1"
        max="10"
        onChange={strokeChangeHandler}
        defaultValue={defaultStroke}
      />
      <label>Brush Color: </label>
      <input
        type="color"
        onChange={colorChangeHandler}
        defaultValue={defaultColor}
      />
    </div>
  )
}

export default Setting