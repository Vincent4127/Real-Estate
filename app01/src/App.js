import './App.css';
import SignIn from "./sign-in/SignIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./sign-up/SignUp";
import MarketingPage from './marketing-page/MarketingPage';
import Dashboard from './dashboard/Dashboard';
import NotFound from './notFound';
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider, EmailProvider, NameProvider } from "./authentication";

function App() {
  return (
    <AuthProvider>
      <NameProvider>
        <EmailProvider>
          <BrowserRouter basename="/Real-Estate">
            <Routes>
              <Route path='/marketing' element={
                <ProtectedRoute isLoggedIn={true}>
                  <MarketingPage></MarketingPage>
                </ProtectedRoute>
              }></Route>

              <Route path='/' element={
                <ProtectedRoute>
                  <Dashboard></Dashboard>
                </ProtectedRoute>
              }></Route>

              <Route path='/SignIn' element={<SignIn />}></Route>
              <Route path='/SignUp' element={<SignUp />}></Route>
              <Route path='*' element={<NotFound></NotFound>}></Route>
            </Routes>
          </BrowserRouter>
        </EmailProvider>
      </NameProvider>
    </AuthProvider>
  );
}

export default App;
