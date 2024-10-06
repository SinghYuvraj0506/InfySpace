import { useNavigate } from "react-router-dom";


const Landing = () => {
    const navigate = useNavigate()
  return (
    <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center">
      <h2>Welcome to the Infy Space</h2>

      <button onClick={()=>{navigate("/login")}} className="border p-2">Login</button>
    </div>
  );
};

export default Landing;
