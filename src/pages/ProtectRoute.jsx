import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthProvider"
import { useEffect } from "react"

export default function ProtectRoute({children}) {
  const {isAuth} = useAuth()
  const navigate = useNavigate()

  useEffect(
    function () {
      if (!isAuth) navigate("/login");
    },
    [isAuth, navigate]
  );

  return children
}
