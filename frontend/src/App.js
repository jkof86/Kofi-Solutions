import { Routes, Route } from "react-router";
import Home from "./components/Home";
import About from "./components/portfolio/About";
import Account from "./components/portfolio/Account";
import Settings from "./components/portfolio/Settings";
import Calculator from "./components/portfolio/Calculator";
import Fitness from "./components/portfolio/Fitness";
import Professional from "./components/portfolio/Professional";
import Gaming from "./components/portfolio/Gaming";
import ContactFitness from "./components/portfolio/ContactFitness";
import ContactProfessional from "./components/portfolio/ContactProfessional";
import ContactGaming from "./components/portfolio/ContactGaming";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";

export default function App() {

  return (<>
  
    <Routes>
      <Route path="/" element={<LoginComponent />} />
      <Route path="/professional/about" element={<About />} />
      <Route path="/about" element={<About />} />
      <Route path="/professional" element={<Professional />} />
      <Route path="/professional/contact" element={<ContactProfessional />} />
      <Route path="/fitness" element={<Fitness />} />
      <Route path="/fitness/calculator" element={<Calculator />} />
      <Route path="/fitness/contact" element={<ContactFitness />} />
      <Route path="/gaming" element={<Gaming />} />
      <Route path="/gaming/contact" element={<ContactGaming />} />
      <Route path="/gaming/about" element={<ContactGaming />} />
      <Route path="/account" element={<Account />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/register" element={<RegisterComponent />} />
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/home" element={<Home />} />

    </Routes>
  </>);
}