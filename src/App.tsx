import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "./components/ui/sonner"
import "./App.css"

import Layout from "./pages/Layout/Layout"
import Home from "./pages/Home/Home"

export default function App() {
  return (
    <BrowserRouter>
    <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}