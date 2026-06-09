
import Noaccess from "../pages/Noaccess";
import Login from "../pages/Auth/Login";
export default function PrivateRouter({user, children}) {
  

    if (user.isconnected ){
      return children;
    } else {
      return <Login />;
    }

  
}
