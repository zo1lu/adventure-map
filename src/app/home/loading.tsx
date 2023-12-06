import React from 'react'

const loading = () => {
  return (
    <div className="w-screen h-screen flex bg-neural-dark">
      <div className='m-auto flex gap-5'>
        <svg className="animate-spin h-5 w-5 mr-3 bg-main-70" viewBox="0 0 40 40"></svg>
        <svg className="animate-spin h-5 w-5 mr-3 bg-main-70" viewBox="0 0 40 40"></svg>
        <svg className="animate-spin h-5 w-5 mr-3 bg-main-70" viewBox="0 0 40 40"></svg>
      </div>
    </div>
  )
}

export default loading