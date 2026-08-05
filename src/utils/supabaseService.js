// src/utils/supabaseService.js
import { supabase } from '../supabase';

// ========== PRODUCTS ==========
export const getProductsFromSupabase = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false });
  if (error) throw error;
  return data;
};

export const addProductToSupabase = async (product) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateProductInSupabase = async (id, product) => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .match({ id })
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteProductFromSupabase = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .match({ id });
  if (error) throw error;
};

// ========== PRODUCTS PAGINATED ==========
export const getProductsPaginatedFromSupabase = async (page = 0, pageSize = 50, category = null) => {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' });

  if (category && category !== 'All Products') {
    query = query.eq('category', category);
  }

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data, count };
};

// ========== GALLERY ==========
export const getGalleryFromSupabase = async () => {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('year', { ascending: false });
  if (error) throw error;
  return data;
};

export const addGalleryToSupabase = async (item) => {
  const { data, error } = await supabase
    .from('gallery')
    .insert([item])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateGalleryInSupabase = async (id, item) => {
  const { data, error } = await supabase
    .from('gallery')
    .update(item)
    .match({ id })
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteGalleryFromSupabase = async (id) => {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .match({ id });
  if (error) throw error;
};

// ========== GALLERY PAGINATED ==========
export const getGalleryPaginatedFromSupabase = async (page = 0, pageSize = 20) => {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from('gallery')
    .select('*', { count: 'exact' })
    .order('year', { ascending: false })
    .range(from, to);
  if (error) throw error;
  return { data, count };
};

// ========== VIDEOS ==========
export const getVideosFromSupabase = async () => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('id', { ascending: false });
  if (error) throw error;
  return data;
};

export const addVideoToSupabase = async (video) => {
  const { data, error } = await supabase
    .from('videos')
    .insert([video])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateVideoInSupabase = async (id, video) => {
  const { data, error } = await supabase
    .from('videos')
    .update(video)
    .match({ id })
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteVideoFromSupabase = async (id) => {
  const { error } = await supabase
    .from('videos')
    .delete()
    .match({ id });
  if (error) throw error;
};

// ========== VIDEOS PAGINATED ==========
export const getVideosPaginatedFromSupabase = async (page = 0, pageSize = 5) => {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from('videos')
    .select('*', { count: 'exact' })
    .order('id', { ascending: false })
    .range(from, to);
  if (error) throw error;
  return { data, count };
};

// ========== BLOGS ==========
export const getBlogsFromSupabase = async () => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
};

export const addBlogToSupabase = async (blog) => {
  const { data, error } = await supabase
    .from('blogs')
    .insert([blog])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateBlogInSupabase = async (id, blog) => {
  const { data, error } = await supabase
    .from('blogs')
    .update(blog)
    .match({ id })
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteBlogFromSupabase = async (id) => {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .match({ id });
  if (error) throw error;
};

// ========== BLOGS PAGINATED ==========
export const getBlogsPaginatedFromSupabase = async (page = 0, pageSize = 5) => {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .order('date', { ascending: false })
    .range(from, to);
  if (error) throw error;
  return { data, count };
};

// ========== COMMENTS ==========
export const getCommentsFromSupabase = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addCommentToSupabase = async (comment) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateCommentInSupabase = async (id, comment) => {
  const { data, error } = await supabase
    .from('comments')
    .update(comment)
    .match({ id })
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteCommentFromSupabase = async (id) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .match({ id });
  if (error) throw error;
};

// ========== SOCIAL LINKS ==========
export const getSocialLinksFromSupabase = async () => {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return data;
};

export const addSocialLinkToSupabase = async (link) => {
  const { data, error } = await supabase
    .from('social_links')
    .insert([link])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateSocialLinkInSupabase = async (id, link) => {
  const { data, error } = await supabase
    .from('social_links')
    .update(link)
    .match({ id })
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteSocialLinkFromSupabase = async (id) => {
  const { error } = await supabase
    .from('social_links')
    .delete()
    .match({ id });
  if (error) throw error;
};

// ========== MESSAGES ==========
export const getMessagesFromSupabase = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addMessageToSupabase = async (message) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteMessageFromSupabase = async (id) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .match({ id });
  if (error) throw error;
};

// ========== APP SETTINGS ==========
export const getAppSettings = async () => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*');
  if (error) throw error;
  const settings = {};
  data.forEach(item => { settings[item.key] = item.value; });
  return settings;
};

export const updateAppSetting = async (key, value) => {
  const { data, error } = await supabase
    .from('app_settings')
    .upsert({ key, value })
    .select();
  if (error) throw error;
  return data[0];
};