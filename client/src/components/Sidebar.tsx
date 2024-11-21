import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

const SidebarOptions = [
    {
        name:"Dashboard",
        path:"/dashboard"
    },
    {
        name:"Accounts",
        path:"/dashboard/accounts"
    },
    {
        name:"Transfers",
        path:"/dashboard/transfers"
    },
]

const Sidebar = () => {
    const navigate = useNavigate()
    const {user,logout} = useAuth()

  return (
    <div className='h-screen w-[250px] bg-[#eeeeee] flex flex-col gap-16 items-center p-5 box-border'>
        <h1 className='text-2xl font-bold cursor-pointer' onClick={()=>{navigate("/")}}>Infy Space</h1>

        <div className='flex flex-col gap-4 items-start w-full'>
            {SidebarOptions?.map((e)=>(
                <Link to={e?.path}>{e?.name}</Link>
            ))}
        </div>

        <div className='w-full flex flex-col gap-1 items-center mt-auto'>
            <img src={user?.avatar} alt="" className='w-10 h-10 rounded-full mb-4'/>
            <span>{user?.name}</span>
            <span>{user?.email}</span>
        </div>

        <button onClick={logout}>Logout</button>

    </div>
  )
}

export default Sidebar