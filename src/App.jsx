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
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App