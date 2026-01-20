import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FlashSale from './components/FlashSale'
import Categories from './components/Categories'
import TopProducts from './components/TopProducts'
import SummerSale from './components/SummerSale'
import ExploreProducts from './components/ExploreProducts'
import ReviewSection from './components/ReviewSection'
import Footer from './components/Footer'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Blog from './pages/Blog'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import './App.css'

function Home() {
  return (
    <>
      <Hero />
      <FlashSale />
      <Categories />
      <TopProducts />
      <SummerSale />
      <ExploreProducts />
      <ReviewSection />
    </>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App