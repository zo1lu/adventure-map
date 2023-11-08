import React from 'react'

const TopToolBox = () => {
  return (
    <div className="w-fit h-10 z-10 absolute top-5 right-5 flex gap-3">
        <input
        className="w-50 h-10 z-10 p-3"
        type="text"
        placeholder="Where are you?"
        />
        <button className="w-fit h-10 bg-emerald-950 text-white px-3">
        Search
        </button>
    </div>
  )
}

export default TopToolBox