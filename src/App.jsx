import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CitiesProvider } from "./contexts/CitiesProvider";
import { AuthProvider } from "./contexts/AuthProvider";

import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import ProtectRoute from "./pages/ProtectRoute";
import SpinnerFullPage from "./components/SpinnerFullPage";

const Homepage = lazy(()=> import("./pages/Homepage"))
const Product = lazy(()=> import("./pages/Product"))
const Pricing = lazy(()=> import("./pages/Pricing"))
const AppLayout = lazy(()=> import("./pages/AppLayout"))
const PageNotFound = lazy(()=> import("./pages/PageNotFound"))
const Login = lazy(()=> import("./pages/Login"))

export default function App() {
  return (
    <CitiesProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage/>}>
            <Routes>
              <Route path="/" element={<Homepage/>}/>
              <Route path="/product" element={<Product/>}/>
              <Route path="/pricing" element={<Pricing/>}/>
              <Route path="/app" element={<ProtectRoute><AppLayout/></ProtectRoute>}>
                <Route index element={<Navigate replace to="cities"/>}/>
                <Route path="cities" element={<CityList/>}/>
                <Route path="cities/:id" element={<City/>}/>
                <Route path="countries" element={<CountryList/>}/>
                <Route path="form" element={<Form/>}/>
              </Route>
              <Route path="/login" element={<Login/>}/>
              <Route path="*" element={<PageNotFound/>}/>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </CitiesProvider>
  )
}
