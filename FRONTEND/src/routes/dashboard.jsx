import React from 'react'
import AppBar from '../components/AppBar'
import Balance from '../components/Balance'
import Users from '../components/Users'

const Dashboard = () => {
  return (
    <div className='flex flex-col justify-stretch m-1'>
      <div className='mb-6'>
        <AppBar />
      </div>
      <div className='mb-20'>
        <Balance />
      </div>
      <div className='shadow h-auto pb-6'>
        <Users />
      </div>
    </div>
  )
}

export default Dashboard