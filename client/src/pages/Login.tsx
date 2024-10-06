
const Login = () => {
    const handleGoogleLogin = () => {
        window.open(`${import.meta.env.VITE_HOST_URL}/api/v1/auth/google`,"_self")
    }

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <button className="border p-2" onClick={handleGoogleLogin}>Sign In With Google</button>
    </div>
  )
}

export default Login