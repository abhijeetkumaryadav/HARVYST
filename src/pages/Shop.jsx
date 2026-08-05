import { useState, useEffect, useCallback } from 'react';
import { getProductsPaginatedFromSupabase } from '../utils/supabaseService';
import { FaFilter, FaTimes, FaChevronLeft, FaChevronRight, FaSpinner, FaSync } from 'react-icons/fa';

const categories = ['All Products', 'Seeds', 'Plants', 'Fertilizers', 'Farm Equipment', 'Pesticides', 'Tools', 'Irrigation', 'Organic Care'];
const PAGE_SIZE = 50;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ===== Cache helpers =====
const getCacheKey = (category) => `harvyst_shop_cache_${category}`;

const getCachedShopData = (category) => {
  const raw = localStorage.getItem(getCacheKey(category));
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw);
    if (Date.now() - cached._timestamp > CACHE_DURATION) return null;
    return cached.data;
  } catch {
    return null;
  }
};

const setCachedShopData = (category, products, totalProducts) => {
  localStorage.setItem(
    getCacheKey(category),
    JSON.stringify({
      data: { products, totalProducts },
      _timestamp: Date.now(),
    })
  );
};

// ===== Product Card Component =====
function ProductCard({ product }) {
  const images = product.images?.length > 0 ? product.images : (product.image ? [product.image] : ['/placeholder.png']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const previewText = product.description
    ? product.description.length > 150
      ? product.description.slice(0, 150) + '…'
      : product.description
    : 'High-quality agricultural product for better yield.';

  const affiliateLinks = product.affiliatelinks || product.affiliateLinks || [];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group">
        <div className="relative h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={product.name}
            className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => e.target.src = '/placeholder.png'}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
              >
                <FaChevronRight className="text-sm" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          {product.discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
            <span className="bg-gray-100 px-2 py-0.5 rounded-full">{product.category}</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-base leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>

          <div className="mb-2">
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {previewText}
            </p>
            {product.description && product.description.length > 150 && (
              <button
                onClick={() => setShowModal(true)}
                className="text-emerald-600 text-sm font-medium hover:text-emerald-800 transition-colors mt-1"
              >
                Read more
              </button>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-emerald-700">₹{product.price}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {affiliateLinks.length > 0 ? (
              affiliateLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-sm px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                >
                  {link.platform || 'Buy Now'}
                </a>
              ))
            ) : (
              <span className="text-gray-400 text-sm">Available on partner stores</span>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800 pr-4">{product.name}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
              >
                ✕
              </button>
            </div>
            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap break-words max-w-full">
              {product.description || 'No description available.'}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ===== Main Shop Component =====
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = useCallback(async (page = 0, category = selectedCategory, append = false) => {
    try {
      const { data, count } = await getProductsPaginatedFromSupabase(page, PAGE_SIZE, category);
      
      if (append) {
        setProducts(prev => [...prev, ...data]);
      } else {
        setProducts(data);
        if (page === 0) {
          setCachedShopData(category, data, count);
        }
      }
      
      setTotalProducts(count);
      setCurrentPage(page);
      setHasMore((page + 1) * PAGE_SIZE < count);
    } catch (error) {
      console.error('Error fetching products:', error);
      try {
        const { getProducts } = await import('../utils/productStorage');
        const localData = getProducts();
        const filtered = category && category !== 'All Products' 
          ? localData.filter(p => p.category === category)
          : localData;
        const sliced = filtered.slice(0, PAGE_SIZE);
        setProducts(sliced);
        setTotalProducts(filtered.length);
        setHasMore(filtered.length > PAGE_SIZE);
        if (page === 0) {
          setCachedShopData(category, sliced, filtered.length);
        }
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
        setProducts([]);
        setTotalProducts(0);
        setHasMore(false);
      }
    }
  }, [selectedCategory]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    await loadProducts(nextPage, selectedCategory, true);
    setLoadingMore(false);
  };

  useEffect(() => {
    const fetchFirstPage = async () => {
      const cached = getCachedShopData(selectedCategory);
      if (cached) {
        setProducts(cached.products);
        setTotalProducts(cached.totalProducts);
        setHasMore(cached.products.length < cached.totalProducts);
        setCurrentPage(0);
        setLoading(false);
        setRefreshing(true);
        try {
          await loadProducts(0, selectedCategory, false);
        } catch (err) {
          console.error('Refresh failed:', err);
        } finally {
          setRefreshing(false);
        }
      } else {
        setLoading(true);
        setProducts([]);
        setCurrentPage(0);
        setHasMore(true);
        await loadProducts(0, selectedCategory, false);
        setLoading(false);
      }
    };
    fetchFirstPage();
  }, [selectedCategory, loadProducts]);

  const getCategoryCount = (category) => {
    if (category === 'All Products') return totalProducts;
    if (category === selectedCategory) {
      return products.filter(p => p.category === category).length;
    }
    return '...';
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {refreshing && (
          <div className="fixed top-24 right-4 z-50 bg-white p-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 text-xs text-gray-500">
            <FaSync className="animate-spin" /> Updating...
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-32">
              <button
                className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowFilters(false)}
              >
                <FaTimes />
              </button>
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-5">
                <FaFilter className="text-emerald-600 text-sm" />
                Categories
              </h3>
              <ul className="space-y-1">
                {categories.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        selectedCategory === cat
                          ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200'
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="flex justify-between items-center">
                        <span>{cat}</span>
                        {cat !== 'All Products' && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {getCategoryCount(cat) === '...' ? '...' : getCategoryCount(cat)}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <button
              className="lg:hidden inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-emerald-300 transition-all mb-6"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-500">Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500 text-lg">No products found.</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your category filter.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium hover:border-emerald-300 hover:bg-emerald-50/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loadingMore ? (
                        <>
                          <FaSpinner className="animate-spin text-sm" /> Loading...
                        </>
                      ) : (
                        <>
                          Load More ({Math.min(PAGE_SIZE, totalProducts - products.length)} remaining)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}