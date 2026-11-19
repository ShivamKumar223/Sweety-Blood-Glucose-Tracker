import { IoIosArrowRoundBack } from "react-icons/io";
import { NavLink, useNavigate} from "react-router-dom";
export const NotFound = ()=>{
    const navigate = useNavigate();

    return <div className="container flex-center flex-column">
        Page Not Found!
        <button className="flex-center button" onClick={() => navigate(-1)}><IoIosArrowRoundBack/>  Back</button>
    </div>

}