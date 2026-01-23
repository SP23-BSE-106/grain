const Home = () => {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero */}
      <section className="bg-beige h-96 flex items-center justify-center">
        <div className="text-center text-olive-green">
          <h1 className="text-4xl font-bold mb-4">Pure Grains, Honest Nutrition</h1>
          <p className="text-lg mb-6">Discover the finest grains and pulses for a healthy lifestyle.</p>
          <div className="space-x-4">
            <button className="bg-olive-green text-white px-6 py-3 rounded hover:bg-wheat-brown transition">Shop Now</button>
            <button className="bg-wheat-brown text-olive-green px-6 py-3 rounded hover:bg-beige transition">Explore Categories</button>
          </div>
        </div>
      </section>
      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-beige p-6 rounded-lg text-center hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">Whole Grains</h3>
              <p>Wheat, Rice, Oats, etc.</p>
            </div>
            <div className="bg-beige p-6 rounded-lg text-center hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">Pulses (Dals)</h3>
              <p>Lentils, Beans, etc.</p>
            </div>
            <div className="bg-beige p-6 rounded-lg text-center hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">Flours</h3>
              <p>Whole Wheat, Cornmeal, etc.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Products - placeholder */}
      <section className="py-12 bg-beige">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Placeholder cards */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <h3>Product 1</h3>
              <p>$10</p>
              <button className="bg-olive-green text-white px-4 py-2 rounded">Add to Cart</button>
            </div>
            {/* Repeat for more */}
          </div>
        </div>
      </section>
      {/* Why Choose Us */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6">
              <h3 className="text-xl font-semibold">Organic</h3>
              <p>Sourced from trusted organic farms.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold">Fresh</h3>
              <p>Freshly harvested and delivered.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold">Affordable</h3>
              <p>Competitive prices for quality products.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;