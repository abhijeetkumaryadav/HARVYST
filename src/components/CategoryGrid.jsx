const categories = ['Seeds', 'Plants', 'Fertilizers', 'Farm Equipment', 'Pesticides', 'Tools', 'Irrigation', 'Organic Care'];

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-10">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat}
              className="bg-green-50 p-6 rounded-xl text-center hover:shadow-lg transition cursor-pointer border border-green-100"
            >
              <span className="block text-4xl mb-2">🌿</span>
              <span className="font-semibold text-gray-800">{cat}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="/shop" className="text-green-700 font-semibold hover:underline">
            View all categories →
          </a>
        </div>
      </div>
    </section>
  );
}