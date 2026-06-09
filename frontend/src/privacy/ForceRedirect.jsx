import HomePage from "../pages/HomePage";




export default function PrivateRouter({user, children}) {
  

    if (user.isconnected ){
      return <HomePage />;
    } else {
      return children;
    }

  
}