import { useEffect, useState } from 'react';
import {
  getProductsFromSupabase as getProductsFromFirestore,
  addProductToSupabase as addProductToFirestore,
  updateProductInSupabase as updateProductInFirestore,
  deleteProductFromSupabase as deleteProductFromFirestore,
  getGalleryFromSupabase as getGalleryFromFirestore,
  addGalleryToSupabase as addGalleryToFirestore,
  updateGalleryInSupabase as updateGalleryInFirestore,
  deleteGalleryFromSupabase as deleteGalleryFromFirestore,
  getVideosFromSupabase as getVideosFromFirestore,
  addVideoToSupabase as addVideoToFirestore,
  updateVideoInSupabase as updateVideoInFirestore,
  deleteVideoFromSupabase as deleteVideoFromFirestore,
  getBlogsFromSupabase as getBlogsFromFirestore,
  addBlogToSupabase as addBlogToFirestore,
  updateBlogInSupabase as updateBlogInFirestore,
  deleteBlogFromSupabase as deleteBlogFromFirestore,
  getCommentsFromSupabase as getCommentsFromFirestore,
  addCommentToSupabase as addCommentToFirestore,
  updateCommentInSupabase as updateCommentInFirestore,
  deleteCommentFromSupabase as deleteCommentFromFirestore,
  getSocialLinksFromSupabase as getSocialLinksFromFirestore,
  addSocialLinkToSupabase as addSocialLinkToFirestore,
  updateSocialLinkInSupabase as updateSocialLinkInFirestore,
  deleteSocialLinkFromSupabase as deleteSocialLinkFromFirestore,
  getAppSettings as getAppSettingsFromFirestore,
  updateAppSetting as updateAppSettingInFirestore,
  getMessagesFromSupabase as getMessagesFromFirestore,
  deleteMessageFromSupabase as deleteMessageFromFirestore,
} from '../utils/supabaseService';
import {
  FaBox,
  FaImage,
  FaVideo,
  FaNewspaper,
  FaComments,
  FaLink,
  FaTrash,
  FaEdit,
  FaPlus,
  FaReply,
  FaCheckCircle,
  FaCog,
  FaEnvelope,
} from 'react-icons/fa';

// ===== Shared category list =====
const CATEGORIES = [
  'Seeds',
  'Plants',
  'Fertilizers',
  'Farm Equipment',
  'Pesticides',
  'Tools',
  'Irrigation',
  'Organic Care',
];

export default function AdminDashboard() {
  // ===== STATE =====
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [videos, setVideos] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [settings, setSettings] = useState({ story_video_url: '' });
  const [messages, setMessages] = useState([]);

  // ===== UI STATE =====
  const [activeTab, setActiveTab] = useState('products');
  const [showAddForm, setShowAddForm] = useState(false);

  // ===== PRODUCTS FORM STATE =====
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    image: '',
    category: CATEGORIES[0],
    description: '',
    discount: '',
    affiliateLinks: [],
  });
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // ===== GALLERY FORM STATE =====
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Awards',
    year: '',
    image: '',
  });

  // ===== VIDEOS FORM STATE =====
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    duration: '',
    views: '',
    image: '',
    link: '',
  });

  // ===== BLOGS FORM STATE =====
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Farming Tips',
    excerpt: '',
    date: '',
    image: '',
    content: '',
  });

  // ===== COMMENTS STATE =====
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // ===== SOCIAL LINKS FORM STATE =====
  const [editingSocialId, setEditingSocialId] = useState(null);
  const [socialForm, setSocialForm] = useState({ icon: '', url: '' });

  // ===== LOAD ALL DATA =====
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        productsData,
        galleryData,
        videosData,
        blogsData,
        commentsData,
        socialData,
        settingsData,
        messagesData,
      ] = await Promise.all([
        getProductsFromFirestore(),
        getGalleryFromFirestore(),
        getVideosFromFirestore(),
        getBlogsFromFirestore(),
        getCommentsFromFirestore(),
        getSocialLinksFromFirestore(),
        getAppSettingsFromFirestore(),
        getMessagesFromFirestore(),
      ]);
      setProducts(productsData);
      setGallery(galleryData);
      setVideos(videosData);
      setBlogs(blogsData);
      setComments(commentsData);
      setSocialLinks(socialData);
      setSettings(settingsData);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ===== SETTINGS =====
  const saveSettings = async () => {
    try {
      await updateAppSettingInFirestore('story_video_url', settings.story_video_url);
      alert('Settings updated successfully!');
      await loadAllData();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    }
  };

  // ===== PRODUCT CRUD =====
  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      image: '',
      category: CATEGORIES[0],
      description: '',
      discount: '',
      affiliateLinks: [],
    });
    setNewPlatform('');
    setNewUrl('');
    setEditingProductId(null);
    setShowAddForm(false);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const product = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      image: productForm.image || '',
      category: productForm.category || '',
      description: productForm.description || '',
      discount: parseFloat(productForm.discount) || 0,
      affiliatelinks: productForm.affiliateLinks || [],
    };
    try {
      if (editingProductId) {
        await updateProductInFirestore(editingProductId, product);
      } else {
        await addProductToFirestore(product);
      }
      await loadAllData();
      resetProductForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Check console for details.');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProductFromFirestore(id);
      await loadAllData();
      if (editingProductId === id) resetProductForm();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product.');
    }
  };

  const addProductAffiliateLink = () => {
    if (newPlatform.trim() && newUrl.trim()) {
      setProductForm({
        ...productForm,
        affiliateLinks: [...productForm.affiliateLinks, { platform: newPlatform.trim(), url: newUrl.trim() }],
      });
      setNewPlatform('');
      setNewUrl('');
    }
  };

  const removeProductAffiliateLink = (index) => {
    const updated = productForm.affiliateLinks.filter((_, i) => i !== index);
    setProductForm({ ...productForm, affiliateLinks: updated });
  };

  // ===== GALLERY CRUD =====
  const resetGalleryForm = () => {
    setGalleryForm({ title: '', category: 'Awards', year: '', image: '' });
    setEditingGalleryId(null);
    setShowAddForm(false);
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGalleryId) {
        await updateGalleryInFirestore(editingGalleryId, galleryForm);
      } else {
        await addGalleryToFirestore(galleryForm);
      }
      await loadAllData();
      resetGalleryForm();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Error saving gallery item.');
    }
  };

  const deleteGalleryItem = async (id) => {
    if (!confirm('Delete this gallery item?')) return;
    try {
      await deleteGalleryFromFirestore(id);
      await loadAllData();
      if (editingGalleryId === id) resetGalleryForm();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Error deleting gallery item.');
    }
  };

  // ===== VIDEOS CRUD =====
  const resetVideoForm = () => {
    setVideoForm({ title: '', duration: '', views: '', image: '', link: '' });
    setEditingVideoId(null);
    setShowAddForm(false);
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVideoId) {
        await updateVideoInFirestore(editingVideoId, videoForm);
      } else {
        await addVideoToFirestore(videoForm);
      }
      await loadAllData();
      resetVideoForm();
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Error saving video.');
    }
  };

  const deleteVideo = async (id) => {
    if (!confirm('Delete this video?')) return;
    try {
      await deleteVideoFromFirestore(id);
      await loadAllData();
      if (editingVideoId === id) resetVideoForm();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error deleting video.');
    }
  };

  // ===== BLOGS CRUD =====
  const resetBlogForm = () => {
    setBlogForm({ title: '', category: 'Farming Tips', excerpt: '', date: '', image: '', content: '' });
    setEditingBlogId(null);
    setShowAddForm(false);
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = { ...blogForm };
      if (editingBlogId) {
        await updateBlogInFirestore(editingBlogId, blogData);
      } else {
        await addBlogToFirestore(blogData);
      }
      await loadAllData();
      resetBlogForm();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog.');
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await deleteBlogFromFirestore(id);
      await loadAllData();
      if (editingBlogId === id) resetBlogForm();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog.');
    }
  };

  // ===== COMMENTS CRUD =====
  const deleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteCommentFromFirestore(commentId);
      await loadAllData();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment.');
    }
  };

  const deleteReply = async (commentId, replyId) => {
    if (!confirm('Delete this reply?')) return;
    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;
      const updatedReplies = comment.replies.filter(r => r.id !== replyId);
      const updatedComment = { ...comment, replies: updatedReplies };
      await updateCommentInFirestore(commentId, updatedComment);
      await loadAllData();
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert('Error deleting reply.');
    }
  };

  const addReply = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;
      const newReply = {
        id: Date.now(),
        name: 'HARVYST Team',
        isVerified: true,
        time: 'Just now',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
        text: replyText.trim(),
        likes: 0,
      };
      const updatedComment = {
        ...comment,
        replies: [...(comment.replies || []), newReply],
      };
      await updateCommentInFirestore(commentId, updatedComment);
      await loadAllData();
      setReplyText('');
      setReplyCommentId(null);
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Error adding reply.');
    }
  };

  // ===== SOCIAL LINKS CRUD =====
  const resetSocialForm = () => {
    setSocialForm({ icon: '', url: '' });
    setEditingSocialId(null);
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    if (!socialForm.icon || !socialForm.url) return;
    try {
      if (editingSocialId) {
        await updateSocialLinkInFirestore(editingSocialId, socialForm);
      } else {
        await addSocialLinkToFirestore(socialForm);
      }
      await loadAllData();
      resetSocialForm();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving social link:', error);
      alert('Error saving social link.');
    }
  };

  const deleteSocialLink = async (id) => {
    if (!confirm('Delete this social link?')) return;
    try {
      await deleteSocialLinkFromFirestore(id);
      await loadAllData();
      if (editingSocialId === id) resetSocialForm();
    } catch (error) {
      console.error('Error deleting social link:', error);
      alert('Error deleting social link.');
    }
  };

  // ===== MESSAGES CRUD =====
  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await deleteMessageFromFirestore(id);
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message.');
    }
  };

  // ===== RENDER FUNCTIONS =====
  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return renderProductsTab();
      case 'gallery':
        return renderGalleryTab();
      case 'videos':
        return renderVideosTab();
      case 'blogs':
        return renderBlogsTab();
      case 'comments':
        return renderCommentsTab();
      case 'social':
        return renderSocialTab();
      case 'messages':
        return renderMessagesTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return null;
    }
  };

  // ----- PRODUCTS TAB -----
  const renderProductsTab = () => (
    <>
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mb-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
      >
        <FaPlus /> {showAddForm ? 'Cancel' : 'Add Product'}
      </button>
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingProductId ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <input
              placeholder="Price (₹)"
              type="number"
              step="0.01"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <input
              placeholder="Discount (%)"
              type="number"
              value={productForm.discount}
              onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              placeholder="Image URL"
              value={productForm.image}
              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate Links</label>
              <div className="space-y-2 mb-3">
                {productForm.affiliateLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <span className="font-medium text-sm text-gray-700 min-w-[80px]">{link.platform}</span>
                    <span className="text-sm text-gray-500 truncate flex-1">{link.url}</span>
                    <button type="button" onClick={() => removeProductAffiliateLink(i)} className="text-red-500">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Platform"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  placeholder="URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                />
                <button type="button" onClick={addProductAffiliateLink} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm">
                  Add
                </button>
              </div>
            </div>
            <textarea
              placeholder="Description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="md:col-span-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              rows="3"
            />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-medium">
                {editingProductId ? 'Update' : 'Add'} Product
              </button>
              {editingProductId && (
                <button type="button" onClick={resetProductForm} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <img src={p.image} alt={p.name} className="h-32 w-full object-cover rounded-xl mb-3" />
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-emerald-700 font-semibold">₹{p.price}</p>
            <p className="text-xs text-gray-400">{p.category}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setEditingProductId(p.id);
                  setProductForm({
                    name: p.name,
                    price: p.price.toString(),
                    image: p.image || '',
                    category: p.category || CATEGORIES[0],
                    description: p.description || '',
                    discount: p.discount?.toString() || '',
                    affiliateLinks: p.affiliatelinks || [],
                  });
                  setShowAddForm(true);
                }}
                className="flex-1 bg-blue-500 text-white py-1 rounded-xl text-sm"
              >
                <FaEdit className="inline mr-1" /> Edit
              </button>
              <button onClick={() => deleteProduct(p.id)} className="flex-1 bg-red-500 text-white py-1 rounded-xl text-sm">
                <FaTrash className="inline mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // ----- GALLERY TAB -----
  const renderGalleryTab = () => (
    <>
      <button
        onClick={() => { resetGalleryForm(); setShowAddForm(!showAddForm); }}
        className="mb-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
      >
        <FaPlus /> {showAddForm ? 'Cancel' : 'Add Gallery Item'}
      </button>
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingGalleryId ? 'Edit Gallery Item' : 'New Gallery Item'}</h3>
          <form onSubmit={handleGallerySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={galleryForm.title}
              onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <select
              value={galleryForm.category}
              onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Awards">Awards</option>
              <option value="Certifications">Certifications</option>
              <option value="Field Works">Field Works</option>
            </select>
            <input
              placeholder="Year (e.g. 2025)"
              value={galleryForm.year}
              onChange={(e) => setGalleryForm({ ...galleryForm, year: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              placeholder="Image URL"
              value={galleryForm.image}
              onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-medium">
                {editingGalleryId ? 'Update' : 'Add'}
              </button>
              {editingGalleryId && (
                <button type="button" onClick={resetGalleryForm} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
            <div className="p-3">
              <span className="text-xs font-bold text-emerald-700 uppercase">{item.category}</span>
              <h3 className="font-semibold text-sm mt-1">{item.title}</h3>
              <p className="text-xs text-gray-400">{item.year}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditingGalleryId(item.id);
                    setGalleryForm({
                      title: item.title,
                      category: item.category,
                      year: item.year,
                      image: item.image,
                    });
                    setShowAddForm(true);
                  }}
                  className="flex-1 bg-blue-500 text-white py-1 rounded-xl text-xs"
                >
                  <FaEdit className="inline mr-1" /> Edit
                </button>
                <button onClick={() => deleteGalleryItem(item.id)} className="flex-1 bg-red-500 text-white py-1 rounded-xl text-xs">
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // ----- VIDEOS TAB -----
  const renderVideosTab = () => (
    <>
      <button
        onClick={() => { resetVideoForm(); setShowAddForm(!showAddForm); }}
        className="mb-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
      >
        <FaPlus /> {showAddForm ? 'Cancel' : 'Add Video'}
      </button>
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingVideoId ? 'Edit Video' : 'New Video'}</h3>
          <form onSubmit={handleVideoSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={videoForm.title}
              onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <input
              placeholder="Duration (e.g. 04:32)"
              value={videoForm.duration}
              onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              placeholder="Views (e.g. 210)"
              value={videoForm.views}
              onChange={(e) => setVideoForm({ ...videoForm, views: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              placeholder="Thumbnail Image URL"
              value={videoForm.image}
              onChange={(e) => setVideoForm({ ...videoForm, image: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <input
              placeholder="YouTube Embed URL (e.g. https://www.youtube.com/embed/...)"
              value={videoForm.link}
              onChange={(e) => setVideoForm({ ...videoForm, link: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none md:col-span-2"
              required
            />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-medium">
                {editingVideoId ? 'Update' : 'Add'}
              </button>
              {editingVideoId && (
                <button type="button" onClick={resetVideoForm} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <img src={video.image} alt={video.title} className="h-36 w-full object-cover" />
            <div className="p-3">
              <h3 className="font-semibold text-sm">{video.title}</h3>
              <p className="text-xs text-gray-400">{video.duration} • {video.views} views</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditingVideoId(video.id);
                    setVideoForm({
                      title: video.title,
                      duration: video.duration,
                      views: video.views,
                      image: video.image,
                      link: video.link,
                    });
                    setShowAddForm(true);
                  }}
                  className="flex-1 bg-blue-500 text-white py-1 rounded-xl text-xs"
                >
                  <FaEdit className="inline mr-1" /> Edit
                </button>
                <button onClick={() => deleteVideo(video.id)} className="flex-1 bg-red-500 text-white py-1 rounded-xl text-xs">
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // ----- BLOGS TAB -----
  const renderBlogsTab = () => (
    <>
      <button
        onClick={() => { resetBlogForm(); setShowAddForm(!showAddForm); }}
        className="mb-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
      >
        <FaPlus /> {showAddForm ? 'Cancel' : 'Add Blog Post'}
      </button>
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingBlogId ? 'Edit Blog Post' : 'New Blog Post'}</h3>
          <form onSubmit={handleBlogSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <select
              value={blogForm.category}
              onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Farming Tips">Farming Tips</option>
              <option value="Sustainability">Sustainability</option>
              <option value="Soil Health">Soil Health</option>
              <option value="Community">Community</option>
              <option value="Technology">Technology</option>
            </select>
            <input
              placeholder="Date (e.g. June 20, 2025)"
              value={blogForm.date}
              onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              placeholder="Image URL"
              value={blogForm.image}
              onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <textarea
              placeholder="Excerpt"
              value={blogForm.excerpt}
              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
              className="md:col-span-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              rows="2"
              required
            />
            <textarea
              placeholder="Full Content (optional)"
              value={blogForm.content}
              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
              className="md:col-span-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              rows="5"
            />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-medium">
                {editingBlogId ? 'Update' : 'Add'}
              </button>
              {editingBlogId && (
                <button type="button" onClick={resetBlogForm} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {blogs.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <img src={post.image} alt={post.title} className="h-36 w-full object-cover" />
            <div className="p-3">
              <span className="text-xs font-bold text-emerald-700 uppercase">{post.category}</span>
              <h3 className="font-semibold text-sm mt-1">{post.title}</h3>
              <p className="text-xs text-gray-400">{post.date}</p>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditingBlogId(post.id);
                    setBlogForm({
                      title: post.title,
                      category: post.category,
                      excerpt: post.excerpt,
                      date: post.date,
                      image: post.image,
                      content: post.content || '',
                    });
                    setShowAddForm(true);
                  }}
                  className="flex-1 bg-blue-500 text-white py-1 rounded-xl text-xs"
                >
                  <FaEdit className="inline mr-1" /> Edit
                </button>
                <button onClick={() => deleteBlog(post.id)} className="flex-1 bg-red-500 text-white py-1 rounded-xl text-xs">
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // ----- COMMENTS TAB -----
  const renderCommentsTab = () => (
    <div>
      <p className="text-sm text-gray-500 mb-4">Manage community comments and replies.</p>
      {comments.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No comments yet.</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <img src={comment.avatar} alt={comment.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{comment.name}</span>
                    <span className="text-xs text-gray-400">{comment.time}</span>
                    <button onClick={() => deleteComment(comment.id)} className="text-red-400 hover:text-red-600 text-xs ml-auto">
                      <FaTrash className="inline mr-1" /> Delete
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => setReplyCommentId(comment.id)}
                      className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <FaReply className="text-[10px]" /> Reply
                    </button>
                    <span className="text-xs text-gray-400">{comment.likes} likes</span>
                  </div>

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-6 border-l-2 border-gray-100 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <img src={reply.avatar} alt={reply.name} className="w-7 h-7 rounded-full object-cover" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-emerald-800 text-sm">{reply.name}</span>
                              {reply.isVerified && <FaCheckCircle className="text-emerald-600 text-[10px]" />}
                              <span className="text-xs text-gray-400">{reply.time}</span>
                              <button
                                onClick={() => deleteReply(comment.id, reply.id)}
                                className="text-red-400 hover:text-red-600 text-xs ml-auto"
                              >
                                <FaTrash className="inline mr-1" /> Delete
                              </button>
                            </div>
                            <p className="text-gray-600 text-xs mt-0.5">{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {replyCommentId === comment.id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                      <button
                        onClick={() => addReply(comment.id)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => { setReplyCommentId(null); setReplyText(''); }}
                        className="bg-gray-300 text-gray-700 px-3 py-2 rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ----- SOCIAL LINKS TAB -----
  const renderSocialTab = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => { resetSocialForm(); setShowAddForm(!showAddForm); }}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
        >
          <FaPlus /> {showAddForm ? 'Cancel' : 'Add Social Link'}
        </button>
      </div>
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingSocialId !== null ? 'Edit Social Link' : 'New Social Link'}</h3>
          <form onSubmit={handleSocialSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={socialForm.icon}
              onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            >
              <option value="">Select Icon</option>
              <option value="FaFacebookF">Facebook</option>
              <option value="FaInstagram">Instagram</option>
              <option value="FaTwitter">Twitter</option>
              <option value="FaYoutube">YouTube</option>
              <option value="FaLinkedinIn">LinkedIn</option>
              <option value="FaWhatsapp">WhatsApp</option>
              <option value="FaTelegramPlane">Telegram</option>
            </select>
            <input
              placeholder="URL (e.g. https://facebook.com/harvyst)"
              value={socialForm.url}
              onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-medium">
                {editingSocialId !== null ? 'Update' : 'Add'}
              </button>
              {editingSocialId !== null && (
                <button type="button" onClick={resetSocialForm} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialLinks.map((link) => (
          <div key={link.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl text-emerald-600">{link.icon}</span>
              <span className="text-sm text-gray-600 truncate max-w-[200px]">{link.url}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingSocialId(link.id);
                  setSocialForm({ icon: link.icon, url: link.url });
                  setShowAddForm(true);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>
              <button onClick={() => deleteSocialLink(link.id)} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ----- MESSAGES TAB -----
  const renderMessagesTab = () => (
    <div>
      <p className="text-sm text-gray-500 mb-4">Messages from the "Leave a Message" form on the website.</p>
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-900">{msg.name}</p>
                  <p className="text-xs text-gray-400">{msg.email} • {msg.subject}</p>
                </div>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
              <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap">{msg.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Just now'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ----- SETTINGS TAB -----
  const renderSettingsTab = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">App Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Story Video URL</label>
          <input
            type="url"
            value={settings.story_video_url || ''}
            onChange={(e) => setSettings({ ...settings, story_video_url: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="https://www.youtube.com/embed/..."
          />
          <p className="text-xs text-gray-400 mt-1">This URL is used for the "Watch Our Story" button on the Our Works page.</p>
        </div>
        <button
          onClick={saveSettings}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className="min-h-screen bg-gray-50 pt-20 lg:pt-24 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Admin Dashboard</h1>
          <a href="/shop" className="text-emerald-600 hover:underline">← Back to Shop</a>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-6">
          {[
            { key: 'products', label: 'Products', icon: FaBox },
            { key: 'gallery', label: 'Gallery', icon: FaImage },
            { key: 'videos', label: 'Videos', icon: FaVideo },
            { key: 'blogs', label: 'Blogs', icon: FaNewspaper },
            { key: 'comments', label: 'Comments', icon: FaComments },
            { key: 'social', label: 'Social Links', icon: FaLink },
            { key: 'messages', label: 'Messages', icon: FaEnvelope },
            { key: 'settings', label: 'Settings', icon: FaCog },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setShowAddForm(false); }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="text-sm" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {!loading && renderTabContent()}
      </div>
    </div>
  );
}