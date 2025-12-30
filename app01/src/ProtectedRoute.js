import {Navigate} from "react-router-dom";
import { useAuth } from "./authentication";

export default function ProtectedRoute({children}) {
    const { isSignedIn } = useAuth();
    if(!isSignedIn) return <Navigate to="/SignIn" replace />;
    return children;
}