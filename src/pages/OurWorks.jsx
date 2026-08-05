import React, { useState, useEffect } from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegramPlane,
  FaSeedling,
  FaBoxOpen,
  FaTruck,
  FaHeart,
  FaPlay,
  FaCalendarAlt,
  FaArrowRight,
  FaPaperPlane,
  FaEye,
  FaCheckCircle,
  FaThumbsUp,
  FaTrophy,
  FaExpand,
  FaSpinner,
  FaSync,
} from 'react-icons/fa';
import {
  getGalleryPaginatedFromSupabase as getGalleryFromFirestore,
  getVideosPaginatedFromSupabase as getVideosFromFirestore,
  getBlogsPaginatedFromSupabase as getBlogsFromFirestore,
  getCommentsFromSupabase as getCommentsFromFirestore,
  getSocialLinksFromSupabase as getSocialLinksFromFirestore,
  getAppSettings as getAppSettingsFromFirestore,
  addCommentToSupabase as addCommentToFirestore,
  updateCommentInSupabase as updateCommentInFirestore,
  deleteCommentFromSupabase as deleteCommentFromFirestore,
  addMessageToSupabase as addMessageToFirestore,
} from '../utils/supabaseService';
import VideoPlayer from '../components/VideoPlayer';

const GALLERY_PAGE_SIZE = 20;
const VIDEOS_PAGE_SIZE = 5;
const BLOGS_PAGE_SIZE = 5;
const CACHE_KEY = 'harvyst_ourworks_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ===== Cache helpers =====
const getCachedData = () => {
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw);
    if (Date.now() - cached._timestamp > CACHE_DURATION) return null;
    return cached.data;
  } catch {
    return null;
  }
};

const setCachedData = (data) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, _timestamp: Date.now() }));
};

// ===== Load More Card Component =====
function LoadMoreCard({ onClick, loading, label = 'Load More' }) {
  return (
    <div
      onClick={!loading ? onClick : undefined}
      className={`w-48 flex-shrink-0 snap-start bg-white rounded-2xl border-2 border-dashed border-emerald-300 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-all min-h-[140px] ${
        loading ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <FaSpinner className="text-2xl text-emerald-600 animate-spin" />
      ) : (
        <>
          <span className="text-2xl text-emerald-600 font-bold mb-1">+</span>
          <span className="text-xs font-semibold text-emerald-700 text-center">{label}</span>
        </>
      )}
    </div>
  );
}

export default function OurWorks() {
  // ===== STATE =====
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [steps] = useState([
    { icon: FaSeedling, title: 'Sourced with Care', desc: 'We work directly with farmers.' },
    { icon: FaBoxOpen, title: 'Processed Naturally', desc: 'Hygienic, eco-friendly processing.' },
    { icon: FaTruck, title: 'Delivered Fresh', desc: 'Fast, safe, and reliable delivery.' },
    { icon: FaHeart, title: 'Impact That Matters', desc: 'Support farmers, protect the planet.' },
  ]);

  // Gallery
  const [gallery, setGallery] = useState([]);
  const [galleryPage, setGalleryPage] = useState(0);
  const [galleryTotal, setGalleryTotal] = useState(0);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryHasMore, setGalleryHasMore] = useState(true);

  // Videos
  const [videos, setVideos] = useState([]);
  const [videosPage, setVideosPage] = useState(0);
  const [videosTotal, setVideosTotal] = useState(0);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosHasMore, setVideosHasMore] = useState(true);

  // Blogs
  const [blogs, setBlogs] = useState([]);
  const [blogsPage, setBlogsPage] = useState(0);
  const [blogsTotal, setBlogsTotal] = useState(0);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsHasMore, setBlogsHasMore] = useState(true);

  const [comments, setComments] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [storyVideoUrl, setStoryVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');

  // UI state
  const [newComment, setNewComment] = useState('');
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('All');
  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Modal states
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // ===== LOAD DATA =====
  const loadGallery = async (page = 0, append = false) => {
    setGalleryLoading(true);
    try {
      const { data, count } = await getGalleryFromFirestore(page, GALLERY_PAGE_SIZE);
      if (append) {
        setGallery(prev => [...prev, ...data]);
      } else {
        setGallery(data);
      }
      setGalleryTotal(count);
      setGalleryPage(page);
      setGalleryHasMore((page + 1) * GALLERY_PAGE_SIZE < count);
    } catch (err) {
      console.error('Gallery load error:', err);
    } finally {
      setGalleryLoading(false);
    }
  };

  const loadVideos = async (page = 0, append = false) => {
    setVideosLoading(true);
    try {
      const { data, count } = await getVideosFromFirestore(page, VIDEOS_PAGE_SIZE);
      if (append) {
        setVideos(prev => [...prev, ...data]);
      } else {
        setVideos(data);
      }
      setVideosTotal(count);
      setVideosPage(page);
      setVideosHasMore((page + 1) * VIDEOS_PAGE_SIZE < count);
    } catch (err) {
      console.error('Videos load error:', err);
    } finally {
      setVideosLoading(false);
    }
  };

  const loadBlogs = async (page = 0, append = false) => {
    setBlogsLoading(true);
    try {
      const { data, count } = await getBlogsFromFirestore(page, BLOGS_PAGE_SIZE);
      if (append) {
        setBlogs(prev => [...prev, ...data]);
      } else {
        setBlogs(data);
      }
      setBlogsTotal(count);
      setBlogsPage(page);
      setBlogsHasMore((page + 1) * BLOGS_PAGE_SIZE < count);
    } catch (err) {
      console.error('Blogs load error:', err);
    } finally {
      setBlogsLoading(false);
    }
  };

  const loadCommentsAndSocial = async () => {
    try {
      const [c, s, settings] = await Promise.all([
        getCommentsFromFirestore(),
        getSocialLinksFromFirestore(),
        getAppSettingsFromFirestore(),
      ]);
      setComments(c);
      setSocialLinks(s);
      if (settings.story_video_url) setStoryVideoUrl(settings.story_video_url);
    } catch (err) {
      console.error('Comments/Social load error:', err);
    }
  };

  // ===== Load all data (with cache) =====
  const loadAllData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      // First check cache
      const cached = getCachedData();
      if (cached && showLoading) {
        // Apply cached data immediately
        setGallery(cached.gallery || []);
        setGalleryTotal(cached.galleryTotal || 0);
        setGalleryHasMore(cached.galleryHasMore || false);
        setVideos(cached.videos || []);
        setVideosTotal(cached.videosTotal || 0);
        setVideosHasMore(cached.videosHasMore || false);
        setBlogs(cached.blogs || []);
        setBlogsTotal(cached.blogsTotal || 0);
        setBlogsHasMore(cached.blogsHasMore || false);
        setComments(cached.comments || []);
        setSocialLinks(cached.socialLinks || []);
        if (cached.storyVideoUrl) setStoryVideoUrl(cached.storyVideoUrl);
        setIsLoading(false);
      }

      // Fetch fresh data in background
      await Promise.all([
        loadGallery(0, false),
        loadVideos(0, false),
        loadBlogs(0, false),
        loadCommentsAndSocial(),
      ]);

      // Cache the fresh data
      const freshData = {
        gallery,
        galleryTotal,
        galleryHasMore,
        videos,
        videosTotal,
        videosHasMore,
        blogs,
        blogsTotal,
        blogsHasMore,
        comments,
        socialLinks,
        storyVideoUrl,
      };
      setCachedData(freshData);

    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData(true);
  }, []);

  // ===== LOAD MORE =====
  const loadMoreGallery = () => loadGallery(galleryPage + 1, true);
  const loadMoreVideos = () => loadVideos(videosPage + 1, true);
  const loadMoreBlogs = () => loadBlogs(blogsPage + 1, true);

  // ===== COMMENTS CRUD =====
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newCommentObj = {
      name: 'User',
      time: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      text: newComment.trim(),
      likes: 0,
      replies: [],
    };
    try {
      const added = await addCommentToFirestore(newCommentObj);
      setComments([added, ...comments]);
      // Update cache
      const cached = getCachedData();
      if (cached) {
        cached.comments = [added, ...(cached.comments || [])];
        setCachedData(cached);
      }
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('Failed to post comment.');
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;
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
    const updatedComment = { ...comment, replies: [...(comment.replies || []), newReply] };
    try {
      await updateCommentInFirestore(commentId, updatedComment);
      const updatedComments = comments.map(c => (c.id === commentId ? updatedComment : c));
      setComments(updatedComments);
      // Update cache
      const cached = getCachedData();
      if (cached) {
        cached.comments = updatedComments;
        setCachedData(cached);
      }
      setReplyText('');
      setReplyTargetId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to add reply.');
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteCommentFromFirestore(commentId);
      const updated = comments.filter(c => c.id !== commentId);
      setComments(updated);
      // Update cache
      const cached = getCachedData();
      if (cached) {
        cached.comments = updated;
        setCachedData(cached);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete comment.');
    }
  };

  const deleteReply = async (commentId, replyId) => {
    if (!confirm('Delete this reply?')) return;
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    const updatedReplies = comment.replies.filter(r => r.id !== replyId);
    const updatedComment = { ...comment, replies: updatedReplies };
    try {
      await updateCommentInFirestore(commentId, updatedComment);
      const updatedComments = comments.map(c => (c.id === commentId ? updatedComment : c));
      setComments(updatedComments);
      // Update cache
      const cached = getCachedData();
      if (cached) {
        cached.comments = updatedComments;
        setCachedData(cached);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete reply.');
    }
  };

  // ===== MESSAGE FORM =====
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = messageForm;
    try {
      await addMessageToFirestore({ name, email, subject, message });
      alert('Your message has been sent successfully!');
      setMessageForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  // ===== RENDER =====
  if (isLoading) {
    return (
      <div className="bg-[#f8faf9] min-h-screen flex items-center justify-center pt-20 lg:pt-24">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8faf9] min-h-screen text-gray-800 font-sans pt-20 lg:pt-24">
      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-24 right-4 z-50 bg-white p-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 text-xs text-gray-500">
          <FaSync className="animate-spin" /> Updating...
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-emerald-950 text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&fit=crop")' }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            How HARVYST Works
          </h1>
          <p className="text-gray-200 text-sm md:text-base max-w-xl mx-auto mb-16">
            From farm to your doorstep – we ensure quality, transparency, and trust in every step.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center relative group">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] right-[-40%] border-t-2 border-dashed border-white/30 z-0" />
                  )}
                  <div className="w-12 h-12 rounded-full bg-emerald-500/80 backdrop-blur-md flex items-center justify-center text-white text-lg mb-4 shadow-lg border border-emerald-400/30 z-10">
                    <Icon />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-white">{step.title}</h3>
                  <p className="text-xs text-gray-300 max-w-[180px] leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content – same as before */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl space-y-12">
        {/* TOP ROW: CONNECT, WATCH STORY, FEATURED VIDEOS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Connect With Us */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">Connect With Us</h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">Join our community across platforms and stay updated.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.length > 0 ? (
                socialLinks.map((link, idx) => {
                  const iconMap = {
                    FaFacebookF,
                    FaInstagram,
                    FaTwitter,
                    FaYoutube,
                    FaLinkedinIn,
                    FaWhatsapp,
                    FaTelegramPlane,
                  };
                  const Icon = iconMap[link.icon] || FaLink;
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-sm bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600"
                    >
                      <Icon />
                    </a>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400">No social links added yet.</p>
              )}
            </div>
          </div>

          {/* Watch Our Story */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">Watch Our Story</h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">See how we're building a better future for farming.</p>
            </div>
            <button
              onClick={() => window.open(storyVideoUrl, '_blank')}
              className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all w-fit shadow-sm"
            >
              <FaPlay className="text-[10px]" /> Watch Now
            </button>
            <div className="absolute right-2 bottom-1 opacity-20 pointer-events-none text-emerald-800">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,8C8,10 59,16.17 3.82,21.34L5.23,22.75C10.4,17.58 16.58,15 20,15C20,11 19,9 17,8M3,3C3,3 3,8 8,8C13,8 13,3 13,3C13,3 8,3 3,3Z" />
              </svg>
            </div>
          </div>

          {/* Featured Videos - Horizontal Scroll with Load More Card */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Featured Videos</h2>
                <p className="text-xs text-gray-500">Real stories. Real farmers. Real impact.</p>
              </div>
            </div>

            <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
              <div className="flex gap-4 w-max">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="w-48 flex-shrink-0 snap-start group cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-900 mb-2">
                      <img
                        src={video.image}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-white/90 text-gray-900 flex items-center justify-center pl-0.5 text-xs shadow-md group-hover:scale-110 transition-transform">
                          <FaPlay className="text-[10px]" />
                        </div>
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                        <FaEye className="text-[9px]" /> {video.views}
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {video.duration}
                      </div>
                    </div>
                    <h3 className="text-xs font-semibold text-gray-800 truncate group-hover:text-emerald-700 transition-colors">
                      {video.title}
                    </h3>
                  </div>
                ))}
                {videosHasMore && (
                  <LoadMoreCard
                    onClick={loadMoreVideos}
                    loading={videosLoading}
                    label="Load More Videos"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BLOG POSTS - Horizontal Scroll with Load More Card */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">From Our Blog</h2>
              <p className="text-xs text-gray-500">Insights, tips, and stories from the world of sustainable agriculture.</p>
            </div>
          </div>

          <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
            <div className="flex gap-6 w-max">
              {blogs.map((post) => (
                <div
                  key={post.id}
                  className="w-72 flex-shrink-0 snap-start bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer"
                  onClick={() => setSelectedBlog(post)}
                >
                  <div className="h-44 w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                        <FaCalendarAlt className="text-[10px]" />
                        <span>{post.date}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">{post.category}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800">
                        Read More <FaArrowRight className="text-[10px]" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {blogsHasMore && (
                <LoadMoreCard
                  onClick={loadMoreBlogs}
                  loading={blogsLoading}
                  label="Load More Blogs"
                />
              )}
            </div>
          </div>
        </div>

        {/* AWARDS & GALLERY - Horizontal Scroll with Load More Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <FaTrophy className="text-amber-500 text-sm" />
                <h2 className="text-xl font-bold text-gray-900">Awards & Recognition</h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">Highlights from our achievements, certifications, and field operations.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Awards', 'Certifications', 'Field Works'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveGalleryFilter(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    activeGalleryFilter === cat
                      ? 'bg-emerald-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
            <div className="flex gap-4 w-max">
              {gallery
                .filter(item => activeGalleryFilter === 'All' || item.category === activeGalleryFilter)
                .map((item) => (
                  <div
                    key={item.id}
                    className="w-56 flex-shrink-0 snap-start group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex flex-col cursor-pointer"
                    onClick={() => setSelectedImage(item.image)}
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/90 text-gray-800 flex items-center justify-center text-xs shadow-md">
                          <FaExpand />
                        </div>
                      </div>
                      <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
                        {item.year}
                      </span>
                    </div>
                    <div className="p-3 bg-white flex-1 flex flex-col justify-between border-t border-gray-50">
                      <span className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase mb-1">
                        {item.category}
                      </span>
                      <h3 className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
              {galleryHasMore && (
                <LoadMoreCard
                  onClick={loadMoreGallery}
                  loading={galleryLoading}
                  label="Load More Gallery"
                />
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM TWO COLUMN: COMMUNITY & CONTACT (unchanged) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Join the Conversation */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[480px]">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Join the Conversation</h2>
              <p className="text-xs text-gray-500 mb-6">Share your thoughts, ask questions, and connect with our community.</p>
              <div className="space-y-6 mb-6 max-h-[400px] overflow-y-auto">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="text-xs space-y-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={comment.avatar}
                          alt={comment.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="font-bold text-gray-900">{comment.name}</span>
                            <span className="text-[10px] text-gray-400">{comment.time}</span>
                            <button
                              onClick={() => deleteComment(comment.id)}
                              className="text-red-400 hover:text-red-600 text-[10px] ml-auto"
                            >
                              Delete
                            </button>
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-1.5">{comment.text}</p>
                          <div className="flex items-center gap-4 text-[11px] text-gray-400">
                            <button
                              onClick={() => setReplyTargetId(comment.id)}
                              className="hover:text-emerald-700 flex items-center gap-1"
                            >
                              Reply
                            </button>
                            <button className="hover:text-emerald-700 flex items-center gap-1">
                              <FaThumbsUp className="text-[10px]" /> {comment.likes}
                            </button>
                          </div>
                        </div>
                      </div>
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="space-y-3 pl-11">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-3">
                              <img
                                src={reply.avatar}
                                alt={reply.name}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                  <span className="font-bold text-emerald-800">{reply.name}</span>
                                  {reply.isVerified && (
                                    <FaCheckCircle className="text-emerald-600 text-[10px]" />
                                  )}
                                  <span className="text-[10px] text-gray-400 ml-1">{reply.time}</span>
                                  <button
                                    onClick={() => deleteReply(comment.id, reply.id)}
                                    className="text-red-400 hover:text-red-600 text-[10px] ml-auto"
                                  >
                                    Delete
                                  </button>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-1.5">{reply.text}</p>
                                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                                  <button className="hover:text-emerald-700 flex items-center gap-1">
                                    Reply
                                  </button>
                                  <button className="hover:text-emerald-700 flex items-center gap-1">
                                    <FaThumbsUp className="text-[10px]" /> {reply.likes}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {replyTargetId === comment.id && (
                        <div className="mt-2 pl-11 flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-1 bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          />
                          <button
                            onClick={() => handleReply(comment.id)}
                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => { setReplyTargetId(null); setReplyText(''); }}
                            className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded-xl text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8 text-sm">No comments yet. Start the conversation!</p>
                )}
              </div>
            </div>
            <form onSubmit={handlePostComment} className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <input
                type="text"
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 text-xs text-gray-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <FaPaperPlane className="text-[10px]" /> Post Comment
              </button>
            </form>
          </div>

          {/* Leave a Message */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Leave a Message</h2>
            <p className="text-xs text-gray-500 mb-6">We'd love to hear from you!</p>
            <form onSubmit={handleMessageSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={messageForm.name}
                  onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={messageForm.email}
                  onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                required
                value={messageForm.subject}
                onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                required
                value={messageForm.message}
                onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <FaPaperPlane className="text-[11px]" /> Send Message
              </button>
            </form>
            <p className="text-[10px] text-gray-400 mt-3 text-center">Your message will be stored securely and reviewed by our team.</p>
          </div>
        </div>
      </div>

      {/* ===== MODALS ===== */}

      {/* Full Screen Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Full screen"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedBlog(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {selectedBlog.image && (
              <div className="mb-6 -mt-2">
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full max-h-[400px] object-cover rounded-xl"
                />
              </div>
            )}

            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full">
                {selectedBlog.category}
              </span>
              <span>•</span>
              <span>{selectedBlog.date}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {selectedBlog.title}
            </h2>

            <div className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap prose prose-emerald max-w-none">
              {selectedBlog.content || selectedBlog.excerpt || 'No content available.'}
            </div>

            <button
              onClick={() => setSelectedBlog(null)}
              className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Video Play Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-black rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <VideoPlayer
                src={selectedVideo.link || `https://www.youtube.com/embed/${selectedVideo.id}`}
                className="w-full h-full"
                controls
                autoPlay
              />
            </div>
            <div className="p-4 bg-white flex justify-between items-center">
              <span className="font-semibold text-gray-800">{selectedVideo.title}</span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}