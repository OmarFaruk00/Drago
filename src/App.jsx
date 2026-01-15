import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FlashSale from './components/FlashSale'
import Categories from './components/Categories'
import TopProducts from './components/TopProducts'
import SummerSale from './components/SummerSale'
import ExploreProducts from './components/ExploreProducts'
import ReviewSection from './components/ReviewSection'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <FlashSale />
      <Categories />
      <TopProducts />
      <SummerSale />
      <ExploreProducts />
      <ReviewSection />
      {/* Other sections will be added step by step */}
    </div>
  )
}

export default App