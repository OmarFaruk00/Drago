import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FlashSale from './components/FlashSale'
import Categories from './components/Categories'
import TopProducts from './components/TopProducts'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <FlashSale />
      <Categories />
      <TopProducts />
      {/* Other sections will be added step by step */}
    </div>
  )
}

export default App