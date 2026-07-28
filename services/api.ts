// import { products, getProductById, getProductsByCategory, searchProducts, getTrendingProducts, getBestSellers, getNewArrivals } from '@/mock/products';
// import { categories } from '@/mock/categories';
// import { packages, addOns, coupons, sampleOrders, sampleNotifications, sampleAddresses, testimonials, whyChooseUs, heroBanners } from '@/mock/data';
// import { Product, Category, Package, AddOn, Coupon, Order, AppNotification, Address } from '@/types';

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// export const mockApi = {
//   async getCategories(): Promise<Category[]> {
//     await delay(400);
//     return categories;
//   },

//   async getProducts(): Promise<Product[]> {
//     await delay(500);
//     return products;
//   },

//   async getProductsByCategory(categoryId: string): Promise<Product[]> {
//     await delay(400);
//     return getProductsByCategory(categoryId);
//   },

//   async getProduct(id: string): Promise<Product | undefined> {
//     await delay(300);
//     return getProductById(id);
//   },

//   async getTrending(): Promise<Product[]> {
//     await delay(400);
//     return getTrendingProducts();
//   },

//   async getBestSellers(): Promise<Product[]> {
//     await delay(400);
//     return getBestSellers();
//   },

//   async getNewArrivals(): Promise<Product[]> {
//     await delay(400);
//     return getNewArrivals();
//   },

//   async search(query: string): Promise<Product[]> {
//     await delay(300);
//     return searchProducts(query);
//   },

//   async getPackages(): Promise<Package[]> {
//     await delay(400);
//     return packages;
//   },

//   async getAddOns(): Promise<AddOn[]> {
//     await delay(200);
//     return addOns;
//   },

//   async getCoupons(): Promise<Coupon[]> {
//     await delay(200);
//     return coupons;
//   },

//   async getOrders(): Promise<Order[]> {
//     await delay(400);
//     return sampleOrders;
//   },

//   async getNotifications(): Promise<AppNotification[]> {
//     await delay(300);
//     return sampleNotifications;
//   },

//   async getAddresses(): Promise<Address[]> {
//     await delay(300);
//     return sampleAddresses;
//   },

//   async getTestimonials() {
//     await delay(300);
//     return testimonials;
//   },

//   async getWhyChooseUs() {
//     await delay(200);
//     return whyChooseUs;
//   },

//   async getHeroBanners() {
//     await delay(200);
//     return heroBanners;
//   },

//   async login(email: string, _password: string) {
//     await delay(800);
//     return {
//       token: 'mock_jwt_token_' + Date.now(),
//       user: {
//         id: 'u1',
//         name: 'Arjun Patel',
//         email,
//         phone: '+91 98765 43210',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: true,
//       },
//     };
//   },

//   async register(name: string, email: string, _password: string) {
//     await delay(1000);
//     return {
//       token: 'mock_jwt_token_' + Date.now(),
//       user: {
//         id: 'u' + Date.now(),
//         name,
//         email,
//         phone: '',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: false,
//       },
//     };
//   },

//   async verifyOtp(_otp: string) {
//     await delay(600);
//     return { success: true };
//   },
// };




// import axios from 'axios';
// import { Product, Category, Package, AddOn, Coupon, Order, AppNotification, Address } from '@/types';

// const API_BASE_URL = 'https://hoped-dude-enters-desktops.trycloudflare.com/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Categories API
// export const categoriesApi = {
//   getCategories: () => api.get<Category[]>('/categories').then(res => res.data),
//   getCategory: (id: string) => api.get<Category>(`/categories/${id}`).then(res => res.data),
//   createCategory: (data: { category_name: string }) => 
//     api.post<{ message: string; id: number }>('/categories', data).then(res => res.data),
//   updateCategory: (id: string, data: { category_name: string }) => 
//     api.put<{ message: string }>(`/categories/${id}`, data).then(res => res.data),
//   deleteCategory: (id: string) => 
//     api.delete<{ message: string }>(`/categories/${id}`).then(res => res.data),
// };

// // Products API
// export const productsApi = {
//   getProducts: () => api.get<Product[]>('/products').then(res => res.data),
//   getProductsByCategory: (categoryId: string) => 
//     api.get<Product[]>(`/products/category/${categoryId}`).then(res => res.data),
//   getProduct: (id: string) => api.get<Product>(`/products/${id}`).then(res => res.data),
//   searchProducts: (query: string) => 
//     api.get<Product[]>(`/products/search?q=${query}`).then(res => res.data),
//   getTrendingProducts: () => api.get<Product[]>('/products/trending').then(res => res.data),
//   getBestSellers: () => api.get<Product[]>('/products/best-sellers').then(res => res.data),
//   getNewArrivals: () => api.get<Product[]>('/products/new-arrivals').then(res => res.data),
// };

// // Packages API
// export const packagesApi = {
//   getPackages: () => api.get<Package[]>('/packages').then(res => res.data),
//   getPackage: (id: string) => api.get<Package>(`/packages/${id}`).then(res => res.data),
// };

// // Add-ons API
// export const addOnsApi = {
//   getAddOns: () => api.get<AddOn[]>('/add-ons').then(res => res.data),
//   getAddOn: (id: string) => api.get<AddOn>(`/add-ons/${id}`).then(res => res.data),
// };

// // Coupons API
// export const couponsApi = {
//   getCoupons: () => api.get<Coupon[]>('/coupons').then(res => res.data),
//   getCoupon: (id: string) => api.get<Coupon>(`/coupons/${id}`).then(res => res.data),
// };

// // Orders API
// export const ordersApi = {
//   getOrders: () => api.get<Order[]>('/orders').then(res => res.data),
//   getOrder: (id: string) => api.get<Order>(`/orders/${id}`).then(res => res.data),
//   createOrder: (data: any) => api.post<Order>('/orders', data).then(res => res.data),
//   updateOrder: (id: string, data: any) => api.put<Order>(`/orders/${id}`, data).then(res => res.data),
//   deleteOrder: (id: string) => api.delete<{ message: string }>(`/orders/${id}`).then(res => res.data),
// };

// // Notifications API
// export const notificationsApi = {
//   getNotifications: () => api.get<AppNotification[]>('/notifications').then(res => res.data),
//   markAsRead: (id: string) => 
//     api.put<{ message: string }>(`/notifications/${id}/read`).then(res => res.data),
//   deleteNotification: (id: string) => 
//     api.delete<{ message: string }>(`/notifications/${id}`).then(res => res.data),
// };

// // Addresses API
// export const addressesApi = {
//   getAddresses: () => api.get<Address[]>('/addresses').then(res => res.data),
//   getAddress: (id: string) => api.get<Address>(`/addresses/${id}`).then(res => res.data),
//   createAddress: (data: any) => api.post<Address>('/addresses', data).then(res => res.data),
//   updateAddress: (id: string, data: any) => api.put<Address>(`/addresses/${id}`, data).then(res => res.data),
//   deleteAddress: (id: string) => api.delete<{ message: string }>(`/addresses/${id}`).then(res => res.data),
// };

// // Testimonials API
// export const testimonialsApi = {
//   getTestimonials: () => api.get<any[]>('/testimonials').then(res => res.data),
//   getTestimonial: (id: string) => api.get<any>(`/testimonials/${id}`).then(res => res.data),
//   createTestimonial: (data: any) => api.post<any>('/testimonials', data).then(res => res.data),
//   updateTestimonial: (id: string, data: any) => api.put<any>(`/testimonials/${id}`, data).then(res => res.data),
//   deleteTestimonial: (id: string) => api.delete<{ message: string }>(`/testimonials/${id}`).then(res => res.data),
// };

// // Why Choose Us API
// export const whyChooseUsApi = {
//   getWhyChooseUs: () => api.get<any[]>('/why-choose-us').then(res => res.data),
//   getWhyChooseUsItem: (id: string) => api.get<any>(`/why-choose-us/${id}`).then(res => res.data),
//   createWhyChooseUsItem: (data: any) => api.post<any>('/why-choose-us', data).then(res => res.data),
//   updateWhyChooseUsItem: (id: string, data: any) => api.put<any>(`/why-choose-us/${id}`, data).then(res => res.data),
//   deleteWhyChooseUsItem: (id: string) => api.delete<{ message: string }>(`/why-choose-us/${id}`).then(res => res.data),
// };

// // Hero Banners API
// export const heroBannersApi = {
//   getHeroBanners: () => api.get<any[]>('/hero-banners').then(res => res.data),
//   getHeroBanner: (id: string) => api.get<any>(`/hero-banners/${id}`).then(res => res.data),
//   createHeroBanner: (data: any) => api.post<any>('/hero-banners', data).then(res => res.data),
//   updateHeroBanner: (id: string, data: any) => api.put<any>(`/hero-banners/${id}`, data).then(res => res.data),
//   deleteHeroBanner: (id: string) => api.delete<{ message: string }>(`/hero-banners/${id}`).then(res => res.data),
// };

// // Auth API
// export const authApi = {
//   login: (email: string, password: string) => 
//     api.post<{ token: string; user: any }>('/auth/login', { email, password }).then(res => res.data),
  
//   register: (name: string, email: string, password: string) => 
//     api.post<{ token: string; user: any }>('/auth/register', { name, email, password }).then(res => res.data),
  
//   verifyOtp: (otp: string) => 
//     api.post<{ success: boolean }>('/auth/verify-otp', { otp }).then(res => res.data),
// };

// // Main API object for backward compatibility
// export const mockApi = {
//   // Categories
//   getCategories: () => categoriesApi.getCategories(),
//   getCategory: (id: string) => categoriesApi.getCategory(id),
  
//   // Products
//   getProducts: () => productsApi.getProducts(),
//   getProductsByCategory: (categoryId: string) => productsApi.getProductsByCategory(categoryId),
//   getProduct: (id: string) => productsApi.getProduct(id),
//   search: (query: string) => productsApi.searchProducts(query),
//   getTrending: () => productsApi.getTrendingProducts(),
//   getBestSellers: () => productsApi.getBestSellers(),
//   getNewArrivals: () => productsApi.getNewArrivals(),
  
//   // Packages
//   getPackages: () => packagesApi.getPackages(),
  
//   // Add-ons
//   getAddOns: () => addOnsApi.getAddOns(),
  
//   // Coupons
//   getCoupons: () => couponsApi.getCoupons(),
  
//   // Orders
//   getOrders: () => ordersApi.getOrders(),
  
//   // Notifications
//   getNotifications: () => notificationsApi.getNotifications(),
  
//   // Addresses
//   getAddresses: () => addressesApi.getAddresses(),
  
//   // Testimonials
//   getTestimonials: () => testimonialsApi.getTestimonials(),
  
//   // Why Choose Us
//   getWhyChooseUs: () => whyChooseUsApi.getWhyChooseUs(),
  
//   // Hero Banners
//   getHeroBanners: () => heroBannersApi.getHeroBanners(),
  
//   // Auth
//   login: (email: string, password: string) => authApi.login(email, password),
//   register: (name: string, email: string, password: string) => authApi.register(name, email, password),
//   verifyOtp: (otp: string) => authApi.verifyOtp(otp),
// };

// // services/api.ts
// import axios from 'axios';
// // Import mock data with different names to avoid conflicts
// import { 
//   products as mockProducts, 
//   getProductById as mockGetProductById, 
//   getProductsByCategory as mockGetProductsByCategory, 
//   searchProducts as mockSearchProducts, 
//   getTrendingProducts as mockGetTrendingProducts, 
//   getBestSellers as mockGetBestSellers, 
//   getNewArrivals as mockGetNewArrivals 
// } from '@/mock/products';
// import { categories as mockCategories } from '@/mock/categories';
// import { 
//   packages as mockPackages, 
//   addOns as mockAddOns, 
//   coupons as mockCoupons, 
//   sampleOrders as mockSampleOrders, 
//   sampleNotifications as mockSampleNotifications, 
//   sampleAddresses as mockSampleAddresses, 
//   testimonials as mockTestimonials, 
//   whyChooseUs as mockWhyChooseUs, 
//   heroBanners as mockHeroBanners 
// } from '@/mock/data';
// import { Product, Category, Package, AddOn, Coupon, Order, AppNotification, Address } from '@/types';

// // ─── Configuration ──────────────────────────────────────────────
// // Set to true to use real API, false to use mock data
// const USE_REAL_API = true;

// // Your backend API base URL - change this to your actual backend URL
// const API_BASE_URL = 'https://hoped-dude-enters-desktops.trycloudflare.com/api'; // For development
// // const API_BASE_URL = 'https://your-production-api.com/api'; // For production

// // ─── Axios Instance ─────────────────────────────────────────────
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     // If you have authentication, get token from storage
//     // For React Native, you might use AsyncStorage
//     // const token = localStorage.getItem('authToken');
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// // ─── Helper Functions ───────────────────────────────────────────
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// // Map backend category to frontend Category type
// const mapCategory = (apiCategory: any): Category => ({
//   id: apiCategory.id?.toString() || '',
//   name: apiCategory.category_name || apiCategory.name || '',
//   category_name: apiCategory.category_name || apiCategory.name || '',
//   image: apiCategory.image || 'https://via.placeholder.com/300x200?text=Category',
//   productCount: apiCategory.product_count || apiCategory.productCount || 0,
//   slug: apiCategory.slug || apiCategory.category_name?.toLowerCase().replace(/\s+/g, '-') || '',
//   icon: apiCategory.icon || '🎨',
//   color: apiCategory.color || '#6C63FF',
// });

// // Map backend product to frontend Product type - includes ALL required fields
// const mapProduct = (apiProduct: any): Product => {
//   // Handle discount calculation if not provided
//   const originalPrice = Number(apiProduct.original_price) || Number(apiProduct.originalPrice) || Number(apiProduct.price) || 0;
//   const price = Number(apiProduct.price) || 0;
//   const discount = Number(apiProduct.discount) || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

//   // Parse features, specifications, colors, sizes from JSON strings if they're stored as JSON
//   let features = [];
//   let specifications = {};
//   let colors = [];
//   let sizes = [];

//   try {
//     features = apiProduct.features ? (typeof apiProduct.features === 'string' ? JSON.parse(apiProduct.features) : apiProduct.features) : ['Premium Quality', 'Durable', 'Elegant Design'];
//   } catch (e) {
//     features = ['Premium Quality', 'Durable', 'Elegant Design'];
//   }

//   try {
//     specifications = apiProduct.specifications ? (typeof apiProduct.specifications === 'string' ? JSON.parse(apiProduct.specifications) : apiProduct.specifications) : {
//       material: 'Premium',
//       weight: '1.5 kg',
//       dimensions: '30 x 20 x 15 cm'
//     };
//   } catch (e) {
//     specifications = { material: 'Premium', weight: '1.5 kg', dimensions: '30 x 20 x 15 cm' };
//   }

//   try {
//     colors = apiProduct.colors ? (typeof apiProduct.colors === 'string' ? JSON.parse(apiProduct.colors) : apiProduct.colors) : ['Gold', 'Silver', 'Rose Gold'];
//   } catch (e) {
//     colors = ['Gold', 'Silver', 'Rose Gold'];
//   }

//   try {
//     sizes = apiProduct.sizes ? (typeof apiProduct.sizes === 'string' ? JSON.parse(apiProduct.sizes) : apiProduct.sizes) : ['Small', 'Medium', 'Large'];
//   } catch (e) {
//     sizes = ['Small', 'Medium', 'Large'];
//   }

//   return {
//     id: apiProduct.id?.toString() || '',
//     name: apiProduct.name || '',
//     description: apiProduct.description || '',
//     price: price,
//     originalPrice: originalPrice,
//     discount: discount,
//     images: Array.isArray(apiProduct.images) ? apiProduct.images : [apiProduct.image || 'https://via.placeholder.com/300x300'],
//     categoryId: apiProduct.category_id?.toString() || apiProduct.categoryId?.toString() || '',
//     categoryName: apiProduct.category_name || apiProduct.categoryName || '',
//     rating: Number(apiProduct.rating) || 0,
//     reviewCount: Number(apiProduct.review_count) || Number(apiProduct.reviewCount) || 0,
//     inStock: apiProduct.in_stock !== undefined ? Boolean(apiProduct.in_stock) : true,
//     isTrending: Boolean(apiProduct.is_trending || apiProduct.isTrending),
//     isBestSeller: Boolean(apiProduct.is_best_seller || apiProduct.isBestSeller),
//     // Additional required fields
//     features: features,
//     specifications: specifications,
//     colors: colors,
//     sizes: sizes,
//     stockCount: Number(apiProduct.stock_count) || Number(apiProduct.stockCount) || 10,
//     soldCount: Number(apiProduct.sold_count) || Number(apiProduct.soldCount) || 0,
//     isFeatured: Boolean(apiProduct.is_featured || apiProduct.isFeatured),
//     brand: apiProduct.brand || '',
//     weight: apiProduct.weight || '1.5 kg',
//     dimensions: apiProduct.dimensions || '30 x 20 x 15 cm',
//     material: apiProduct.material || 'Premium',
//     careInstructions: apiProduct.care_instructions || apiProduct.careInstructions || 'Dry clean only',
//     warranty: apiProduct.warranty || '1 year manufacturer warranty',
//     returnPolicy: apiProduct.return_policy || apiProduct.returnPolicy || '30 days return policy',
//     shippingInfo: apiProduct.shipping_info || apiProduct.shippingInfo || 'Free shipping on orders above ₹500',
//   };
// };

// // ─── API Service ──────────────────────────────────────────────────
// export const mockApi = {
//   // ─── CATEGORIES ──────────────────────────────────────────────
//   async getCategories(): Promise<Category[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/categories');
//         // Your backend returns an array directly: [ { id, category_name }, ... ]
//         const data = response.data;
//         if (Array.isArray(data)) {
//           return data.map(mapCategory);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch categories from API, falling back to mock data:', error);
//         await delay(400);
//         return mockCategories;
//       }
//     }
//     await delay(400);
//     return mockCategories;
//   },

//   async getCategoryById(id: string): Promise<Category | null> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get(`/categories/${id}`);
//         const data = response.data;
//         return mapCategory(data);
//       } catch (error) {
//         console.error('Failed to fetch category from API:', error);
//         await delay(300);
//         return mockCategories.find(c => c.id === id) || null;
//       }
//     }
//     await delay(300);
//     return mockCategories.find(c => c.id === id) || null;
//   },

//   // ─── PRODUCTS ──────────────────────────────────────────────────
//   async getProducts(): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/products');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data.map(mapProduct);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch products from API, falling back to mock data:', error);
//         await delay(500);
//         return mockProducts;
//       }
//     }
//     await delay(500);
//     return mockProducts;
//   },

//   async getProductsByCategory(categoryId: string): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get(`/products/category/${categoryId}`);
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data.map(mapProduct);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch products by category from API, falling back to mock data:', error);
//         await delay(400);
//         return mockGetProductsByCategory(categoryId);
//       }
//     }
//     await delay(400);
//     return mockGetProductsByCategory(categoryId);
//   },

//   async getProduct(id: string): Promise<Product | undefined> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get(`/products/${id}`);
//         const data = response.data.data || response.data;
//         return mapProduct(data);
//       } catch (error) {
//         console.error('Failed to fetch product from API:', error);
//         await delay(300);
//         return mockGetProductById(id);
//       }
//     }
//     await delay(300);
//     return mockGetProductById(id);
//   },

//   async getTrending(): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/products/trending');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data.map(mapProduct);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch trending products from API, falling back to mock data:', error);
//         await delay(400);
//         return mockGetTrendingProducts();
//       }
//     }
//     await delay(400);
//     return mockGetTrendingProducts();
//   },

//   async getBestSellers(): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/products/best-sellers');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data.map(mapProduct);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch best sellers from API, falling back to mock data:', error);
//         await delay(400);
//         return mockGetBestSellers();
//       }
//     }
//     await delay(400);
//     return mockGetBestSellers();
//   },

//   async getNewArrivals(): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/products/new-arrivals');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data.map(mapProduct);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch new arrivals from API, falling back to mock data:', error);
//         await delay(400);
//         return mockGetNewArrivals();
//       }
//     }
//     await delay(400);
//     return mockGetNewArrivals();
//   },

//   async search(query: string): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get(`/products/search?q=${encodeURIComponent(query)}`);
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data.map(mapProduct);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to search products from API, falling back to mock data:', error);
//         await delay(300);
//         return mockSearchProducts(query);
//       }
//     }
//     await delay(300);
//     return mockSearchProducts(query);
//   },

//   // ─── PACKAGES ──────────────────────────────────────────────────
//   async getPackages(): Promise<Package[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/packages');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch packages from API, falling back to mock data:', error);
//         await delay(400);
//         return mockPackages;
//       }
//     }
//     await delay(400);
//     return mockPackages;
//   },

//   // ─── ADD-ONS ──────────────────────────────────────────────────
//   async getAddOns(): Promise<AddOn[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/addons');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch add-ons from API, falling back to mock data:', error);
//         await delay(200);
//         return mockAddOns;
//       }
//     }
//     await delay(200);
//     return mockAddOns;
//   },

//   // ─── COUPONS ──────────────────────────────────────────────────
//   async getCoupons(): Promise<Coupon[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/coupons');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch coupons from API, falling back to mock data:', error);
//         await delay(200);
//         return mockCoupons;
//       }
//     }
//     await delay(200);
//     return mockCoupons;
//   },

//   // ─── ORDERS ────────────────────────────────────────────────────
//   async getOrders(): Promise<Order[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/orders');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch orders from API, falling back to mock data:', error);
//         await delay(400);
//         return mockSampleOrders;
//       }
//     }
//     await delay(400);
//     return mockSampleOrders;
//   },

//   // ─── NOTIFICATIONS ────────────────────────────────────────────
//   async getNotifications(): Promise<AppNotification[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/notifications');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch notifications from API, falling back to mock data:', error);
//         await delay(300);
//         return mockSampleNotifications;
//       }
//     }
//     await delay(300);
//     return mockSampleNotifications;
//   },

//   // ─── ADDRESSES ─────────────────────────────────────────────────
//   async getAddresses(): Promise<Address[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/addresses');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch addresses from API, falling back to mock data:', error);
//         await delay(300);
//         return mockSampleAddresses;
//       }
//     }
//     await delay(300);
//     return mockSampleAddresses;
//   },

//   // ─── TESTIMONIALS ─────────────────────────────────────────────
//   async getTestimonials() {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/testimonials');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch testimonials from API, falling back to mock data:', error);
//         await delay(300);
//         return mockTestimonials;
//       }
//     }
//     await delay(300);
//     return mockTestimonials;
//   },

//   // ─── WHY CHOOSE US ────────────────────────────────────────────
//   async getWhyChooseUs() {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/why-choose-us');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch why choose us from API, falling back to mock data:', error);
//         await delay(200);
//         return mockWhyChooseUs;
//       }
//     }
//     await delay(200);
//     return mockWhyChooseUs;
//   },

//   // ─── HERO BANNERS ─────────────────────────────────────────────
//   async getHeroBanners() {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/hero-banners');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch hero banners from API, falling back to mock data:', error);
//         await delay(200);
//         return mockHeroBanners;
//       }
//     }
//     await delay(200);
//     return mockHeroBanners;
//   },

//   // ─── AUTHENTICATION ────────────────────────────────────────────
//   async login(email: string, password: string) {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.post('/auth/login', { email, password });
//         const data = response.data.data || response.data;
//         return {
//           token: data.token || 'mock_jwt_token_' + Date.now(),
//           user: data.user || {
//             id: 'u1',
//             name: 'Arjun Patel',
//             email,
//             phone: '+91 98765 43210',
//             avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//             isPremium: true,
//           },
//         };
//       } catch (error) {
//         console.error('Login failed:', error);
//         // Fallback to mock login
//         await delay(800);
//         return {
//           token: 'mock_jwt_token_' + Date.now(),
//           user: {
//             id: 'u1',
//             name: 'Arjun Patel',
//             email,
//             phone: '+91 98765 43210',
//             avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//             isPremium: true,
//           },
//         };
//       }
//     }
//     await delay(800);
//     return {
//       token: 'mock_jwt_token_' + Date.now(),
//       user: {
//         id: 'u1',
//         name: 'Arjun Patel',
//         email,
//         phone: '+91 98765 43210',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: true,
//       },
//     };
//   },

//   async register(name: string, email: string, password: string) {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.post('/auth/register', { name, email, password });
//         const data = response.data.data || response.data;
//         return {
//           token: data.token || 'mock_jwt_token_' + Date.now(),
//           user: data.user || {
//             id: 'u' + Date.now(),
//             name,
//             email,
//             phone: '',
//             avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//             isPremium: false,
//           },
//         };
//       } catch (error) {
//         console.error('Registration failed:', error);
//         await delay(1000);
//         return {
//           token: 'mock_jwt_token_' + Date.now(),
//           user: {
//             id: 'u' + Date.now(),
//             name,
//             email,
//             phone: '',
//             avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//             isPremium: false,
//           },
//         };
//       }
//     }
//     await delay(1000);
//     return {
//       token: 'mock_jwt_token_' + Date.now(),
//       user: {
//         id: 'u' + Date.now(),
//         name,
//         email,
//         phone: '',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: false,
//       },
//     };
//   },

//   async verifyOtp(otp: string) {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.post('/auth/verify-otp', { otp });
//         return { success: true };
//       } catch (error) {
//         console.error('OTP verification failed:', error);
//         await delay(600);
//         return { success: true };
//       }
//     }
//     await delay(600);
//     return { success: true };
//   },
// };

// // ─── Export individual functions for convenience ──────────────
// // These are the functions that will be used by the app
// export const getCategories = mockApi.getCategories.bind(mockApi);
// export const getCategoryById = mockApi.getCategoryById.bind(mockApi);
// export const getProducts = mockApi.getProducts.bind(mockApi);
// export const getProductsByCategory = mockApi.getProductsByCategory.bind(mockApi);
// export const getProduct = mockApi.getProduct.bind(mockApi);
// export const getTrending = mockApi.getTrending.bind(mockApi);
// export const getBestSellers = mockApi.getBestSellers.bind(mockApi);
// export const getNewArrivals = mockApi.getNewArrivals.bind(mockApi);
// export const search = mockApi.search.bind(mockApi);
// export const getPackages = mockApi.getPackages.bind(mockApi);
// export const getAddOns = mockApi.getAddOns.bind(mockApi);
// export const getCoupons = mockApi.getCoupons.bind(mockApi);
// export const getOrders = mockApi.getOrders.bind(mockApi);
// export const getNotifications = mockApi.getNotifications.bind(mockApi);
// export const getAddresses = mockApi.getAddresses.bind(mockApi);
// export const getTestimonials = mockApi.getTestimonials.bind(mockApi);
// export const getWhyChooseUs = mockApi.getWhyChooseUs.bind(mockApi);
// export const getHeroBanners = mockApi.getHeroBanners.bind(mockApi);
// export const login = mockApi.login.bind(mockApi);
// export const register = mockApi.register.bind(mockApi);
// export const verifyOtp = mockApi.verifyOtp.bind(mockApi);

// // ─── Export the API client for advanced usage ──────────────────
// export { apiClient };





// // services/api.ts
// import axios from 'axios';
// // Import mock data
// import { 
//   products as mockProducts, 
//   getProductById as mockGetProductById, 
//   getProductsByCategory as mockGetProductsByCategory, 
//   searchProducts as mockSearchProducts, 
//   getTrendingProducts as mockGetTrendingProducts, 
//   getBestSellers as mockGetBestSellers, 
//   getNewArrivals as mockGetNewArrivals 
// } from '@/mock/products';
// import { categories as mockCategories } from '@/mock/categories';
// import { 
//   packages as mockPackages, 
//   addOns as mockAddOns, 
//   coupons as mockCoupons, 
//   sampleOrders as mockSampleOrders, 
//   sampleNotifications as mockSampleNotifications, 
//   sampleAddresses as mockSampleAddresses, 
//   testimonials as mockTestimonials, 
//   whyChooseUs as mockWhyChooseUs, 
//   heroBanners as mockHeroBanners 
// } from '@/mock/data';
// import { Product, Category, Package, AddOn, Coupon, Order, AppNotification, Address } from '@/types';

// // ─── Configuration ──────────────────────────────────────────────
// // Only use real API for categories since that's all you have
// const USE_REAL_API_FOR_CATEGORIES = true;
// const USE_REAL_API_FOR_PRODUCTS = false; // Set to false until you have product routes
// const USE_REAL_API_FOR_OTHERS = false; // Set to false until you have other routes

// const API_BASE_URL = 'https://hoped-dude-enters-desktops.trycloudflare.com/api';

// // ─── Axios Instance ─────────────────────────────────────────────
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// });

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// // ─── Helper Functions ───────────────────────────────────────────
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// // Map backend category to frontend Category type
// const mapCategory = (apiCategory: any): Category => ({
//   id: apiCategory.id?.toString() || '',
//   name: apiCategory.category_name || apiCategory.name || '',
//   category_name: apiCategory.category_name || apiCategory.name || '',
//   image: apiCategory.image || 'https://via.placeholder.com/300x200?text=Category',
//   productCount: apiCategory.product_count || apiCategory.productCount || 0,
//   slug: apiCategory.slug || apiCategory.category_name?.toLowerCase().replace(/\s+/g, '-') || '',
//   icon: apiCategory.icon || '🎨',
//   color: apiCategory.color || '#6C63FF',
// });

// // ─── API Service ──────────────────────────────────────────────────
// export const mockApi = {
//   // ─── CATEGORIES (Real API) ──────────────────────────────────
//   async getCategories(): Promise<Category[]> {
//     if (USE_REAL_API_FOR_CATEGORIES) {
//       try {
//         const response = await apiClient.get('/categories');
//         // Your backend returns an array directly: [ { id, category_name }, ... ]
//         const data = response.data;
//         if (Array.isArray(data)) {
//           return data.map(mapCategory);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch categories from API, falling back to mock data:', error);
//         await delay(400);
//         return mockCategories;
//       }
//     }
//     await delay(400);
//     return mockCategories;
//   },

//   async getCategoryById(id: string): Promise<Category | null> {
//     if (USE_REAL_API_FOR_CATEGORIES) {
//       try {
//         const response = await apiClient.get(`/categories/${id}`);
//         const data = response.data;
//         return mapCategory(data);
//       } catch (error) {
//         console.error('Failed to fetch category from API:', error);
//         await delay(300);
//         return mockCategories.find(c => c.id === id) || null;
//       }
//     }
//     await delay(300);
//     return mockCategories.find(c => c.id === id) || null;
//   },

//   // ─── PRODUCTS (Mock Only) ──────────────────────────────────
//   async getProducts(): Promise<Product[]> {
//     await delay(500);
//     return mockProducts;
//   },

//   async getProductsByCategory(categoryId: string): Promise<Product[]> {
//     await delay(400);
//     return mockGetProductsByCategory(categoryId);
//   },

//   async getProduct(id: string): Promise<Product | undefined> {
//     await delay(300);
//     return mockGetProductById(id);
//   },

//   async getTrending(): Promise<Product[]> {
//     await delay(400);
//     return mockGetTrendingProducts();
//   },

//   async getBestSellers(): Promise<Product[]> {
//     await delay(400);
//     return mockGetBestSellers();
//   },

//   async getNewArrivals(): Promise<Product[]> {
//     await delay(400);
//     return mockGetNewArrivals();
//   },

//   async search(query: string): Promise<Product[]> {
//     await delay(300);
//     return mockSearchProducts(query);
//   },

//   // ─── PACKAGES (Mock Only) ──────────────────────────────────
//   async getPackages(): Promise<Package[]> {
//     await delay(400);
//     return mockPackages;
//   },

//   // ─── ADD-ONS (Mock Only) ──────────────────────────────────
//   async getAddOns(): Promise<AddOn[]> {
//     await delay(200);
//     return mockAddOns;
//   },

//   // ─── COUPONS (Mock Only) ──────────────────────────────────
//   async getCoupons(): Promise<Coupon[]> {
//     await delay(200);
//     return mockCoupons;
//   },

//   // ─── ORDERS (Mock Only) ──────────────────────────────────
//   async getOrders(): Promise<Order[]> {
//     await delay(400);
//     return mockSampleOrders;
//   },

//   // ─── NOTIFICATIONS (Mock Only) ──────────────────────────
//   async getNotifications(): Promise<AppNotification[]> {
//     await delay(300);
//     return mockSampleNotifications;
//   },

//   // ─── ADDRESSES (Mock Only) ──────────────────────────────────
//   async getAddresses(): Promise<Address[]> {
//     await delay(300);
//     return mockSampleAddresses;
//   },

//   // ─── TESTIMONIALS (Mock Only) ──────────────────────────────
//   async getTestimonials() {
//     await delay(300);
//     return mockTestimonials;
//   },

//   // ─── WHY CHOOSE US (Mock Only) ────────────────────────────
//   async getWhyChooseUs() {
//     await delay(200);
//     return mockWhyChooseUs;
//   },

//   // ─── HERO BANNERS (Mock Only) ──────────────────────────────
//   async getHeroBanners() {
//     await delay(200);
//     return mockHeroBanners;
//   },

//   // ─── AUTHENTICATION (Mock Only - Add when you have auth routes) ──
//   async login(email: string, _password: string) {
//     await delay(800);
//     return {
//       token: 'mock_jwt_token_' + Date.now(),
//       user: {
//         id: 'u1',
//         name: 'Arjun Patel',
//         email,
//         phone: '+91 98765 43210',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: true,
//       },
//     };
//   },

//   async register(name: string, email: string, _password: string) {
//     await delay(1000);
//     return {
//       token: 'mock_jwt_token_' + Date.now(),
//       user: {
//         id: 'u' + Date.now(),
//         name,
//         email,
//         phone: '',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: false,
//       },
//     };
//   },

//   async verifyOtp(_otp: string) {
//     await delay(600);
//     return { success: true };
//   },
// };

// // ─── Export individual functions ──────────────────────────────
// export const getCategories = mockApi.getCategories.bind(mockApi);
// export const getCategoryById = mockApi.getCategoryById.bind(mockApi);
// export const getProducts = mockApi.getProducts.bind(mockApi);
// export const getProductsByCategory = mockApi.getProductsByCategory.bind(mockApi);
// export const getProduct = mockApi.getProduct.bind(mockApi);
// export const getTrending = mockApi.getTrending.bind(mockApi);
// export const getBestSellers = mockApi.getBestSellers.bind(mockApi);
// export const getNewArrivals = mockApi.getNewArrivals.bind(mockApi);
// export const search = mockApi.search.bind(mockApi);
// export const getPackages = mockApi.getPackages.bind(mockApi);
// export const getAddOns = mockApi.getAddOns.bind(mockApi);
// export const getCoupons = mockApi.getCoupons.bind(mockApi);
// export const getOrders = mockApi.getOrders.bind(mockApi);
// export const getNotifications = mockApi.getNotifications.bind(mockApi);
// export const getAddresses = mockApi.getAddresses.bind(mockApi);
// export const getTestimonials = mockApi.getTestimonials.bind(mockApi);
// export const getWhyChooseUs = mockApi.getWhyChooseUs.bind(mockApi);
// export const getHeroBanners = mockApi.getHeroBanners.bind(mockApi);
// export const login = mockApi.login.bind(mockApi);
// export const register = mockApi.register.bind(mockApi);
// export const verifyOtp = mockApi.verifyOtp.bind(mockApi);

// export { apiClient };




/////////////////////////////////////////////////////////////////////////////////////////////////


// // services/api.ts
// import axios from 'axios';
// // Import mock data with different names to avoid conflicts
// import { 
//   products as mockProducts, 
//   getProductById as mockGetProductById, 
//   getProductsByCategory as mockGetProductsByCategory, 
//   searchProducts as mockSearchProducts, 
//   getTrendingProducts as mockGetTrendingProducts, 
//   getBestSellers as mockGetBestSellers, 
//   getNewArrivals as mockGetNewArrivals 
// } from '@/mock/products';
// import { categories as mockCategories } from '@/mock/categories';
// import { 
//   packages as mockPackages, 
//   addOns as mockAddOns, 
//   coupons as mockCoupons, 
//   sampleOrders as mockSampleOrders, 
//   sampleNotifications as mockSampleNotifications, 
//   sampleAddresses as mockSampleAddresses, 
//   testimonials as mockTestimonials, 
//   whyChooseUs as mockWhyChooseUs, 
//   heroBanners as mockHeroBanners 
// } from '@/mock/data';
// import { Product, Category, Package, AddOn, Coupon, Order, AppNotification, Address } from '@/types';

// // ─── Configuration ──────────────────────────────────────────────
// // Set to true to use real API, false to use mock data
// const USE_REAL_API = true;

// // Your backend API base URL - change this to your actual backend URL
// const API_BASE_URL = 'https://hoped-dude-enters-desktops.trycloudflare.com/api'; // For development
// // const API_BASE_URL = 'https://your-production-api.com/api'; // For production

// // ─── Axios Instance ─────────────────────────────────────────────
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     // If you have authentication, get token from storage
//     // For React Native, you might use AsyncStorage
//     // const token = localStorage.getItem('authToken');
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// // ─── Helper Functions ───────────────────────────────────────────
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// // Map backend category to frontend Category type
// const mapCategory = (apiCategory: any): Category => ({
//   id: apiCategory.id?.toString() || '',
//   name: apiCategory.category_name || apiCategory.name || '',
//   category_name: apiCategory.category_name || apiCategory.name || '',
//   image: apiCategory.image || 'https://via.placeholder.com/300x200?text=Category',
//   productCount: apiCategory.product_count || apiCategory.productCount || 0,
//   slug: apiCategory.slug || apiCategory.category_name?.toLowerCase().replace(/\s+/g, '-') || '',
//   icon: apiCategory.icon || '🎨',
//   color: apiCategory.color || '#6C63FF',
// });

// // Map backend product to frontend Product type - matches your database schema
// const mapProduct = (apiProduct: any): Product => {
//   // Handle discount calculation if not provided
//   const originalPrice = Number(apiProduct.original_price) || Number(apiProduct.originalPrice) || Number(apiProduct.price) || 0;
//   const price = Number(apiProduct.price) || Number(apiProduct.original_price) || 0;
//   const discount = Number(apiProduct.discount) || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

//   // Parse images - your backend might store images separately or as JSON
//   let images = [];
//   try {
//     if (apiProduct.images && typeof apiProduct.images === 'string') {
//       images = JSON.parse(apiProduct.images);
//     } else if (Array.isArray(apiProduct.images)) {
//       images = apiProduct.images.map((img: any) => img.image_url || img);
//     } else if (apiProduct.image) {
//       images = [apiProduct.image];
//     } else {
//       images = ['https://via.placeholder.com/300x300'];
//     }
//   } catch (e) {
//     images = ['https://via.placeholder.com/300x300'];
//   }

//   // Parse features from description or create default
//   const features = apiProduct.features ? 
//     (typeof apiProduct.features === 'string' ? JSON.parse(apiProduct.features) : apiProduct.features) :
//     ['Premium Quality', 'Durable', 'Elegant Design'];

//   // Parse specifications
//   const specifications = apiProduct.specifications ?
//     (typeof apiProduct.specifications === 'string' ? JSON.parse(apiProduct.specifications) : apiProduct.specifications) :
//     {
//       material: apiProduct.material || 'Premium',
//       dimensions: apiProduct.dimensions || 'Standard',
//       weight: apiProduct.weight || 'N/A',
//       color: apiProduct.color || 'Multiple'
//     };

//   // Parse colors
//   const colors = apiProduct.colors ?
//     (typeof apiProduct.colors === 'string' ? JSON.parse(apiProduct.colors) : apiProduct.colors) :
//     [apiProduct.color || '#6C63FF'];

//   // Parse sizes
//   const sizes = apiProduct.sizes ?
//     (typeof apiProduct.sizes === 'string' ? JSON.parse(apiProduct.sizes) : apiProduct.sizes) :
//     ['Standard'];

//   return {
//     id: apiProduct.id?.toString() || '',
//     name: apiProduct.product_name || apiProduct.name || '',
//     description: apiProduct.description || '',
//     price: price,
//     originalPrice: originalPrice,
//     discount: discount,
//     images: images,
//     categoryId: apiProduct.category_id?.toString() || apiProduct.categoryId?.toString() || '',
//     categoryName: apiProduct.category_name || apiProduct.categoryName || '',
//     rating: Number(apiProduct.rating) || 0,
//     reviewCount: Number(apiProduct.review_count) || Number(apiProduct.reviewCount) || 0,
//     inStock: Number(apiProduct.available_stock) > 0 || Boolean(apiProduct.in_stock) || true,
//     isTrending: Boolean(apiProduct.is_trending || apiProduct.isTrending),
//     isBestSeller: Boolean(apiProduct.is_best_seller || apiProduct.isBestSeller),
//     // Additional required fields
//     features: features,
//     specifications: specifications,
//     colors: colors,
//     sizes: sizes,
//     stockCount: Number(apiProduct.available_stock) || Number(apiProduct.stock_count) || Number(apiProduct.stockCount) || 10,
//     soldCount: Number(apiProduct.sold_count) || Number(apiProduct.soldCount) || 0,
//     isFeatured: Boolean(apiProduct.is_featured || apiProduct.isFeatured),
//     brand: apiProduct.brand || '',
//     weight: apiProduct.weight || 'N/A',
//     dimensions: apiProduct.dimensions || 'Standard',
//     material: apiProduct.material || 'Premium',
//     careInstructions: apiProduct.care_instructions || apiProduct.careInstructions || 'Dry clean only',
//     warranty: apiProduct.warranty || '1 year manufacturer warranty',
//     returnPolicy: apiProduct.return_policy || apiProduct.returnPolicy || '30 days return policy',
//     shippingInfo: apiProduct.shipping_info || apiProduct.shippingInfo || 'Free shipping on orders above ₹500',
//     // Reviews - your backend might not have this, so we'll use mock data
//     reviews: apiProduct.reviews || [
//       {
//         id: '1',
//         userName: 'Rahul Sharma',
//         userAvatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         rating: 5,
//         comment: 'Excellent quality! The decoration was perfect for our wedding.',
//         date: '2024-12-15'
//       },
//       {
//         id: '2',
//         userName: 'Priya Patel',
//         userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
//         rating: 4,
//         comment: 'Great product, delivery was on time. Highly recommend!',
//         date: '2024-12-10'
//       }
//     ],
//     // Related IDs - you might need to fetch these separately
//     relatedIds: apiProduct.related_ids || apiProduct.relatedIds || [],
//   };
// };

// // ─── API Service ──────────────────────────────────────────────────
// export const mockApi = {
//   // ─── CATEGORIES ──────────────────────────────────────────────
//   async getCategories(): Promise<Category[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/categories');
//         // Your backend returns an array directly: [ { id, category_name }, ... ]
//         const data = response.data;
//         if (Array.isArray(data)) {
//           return data.map(mapCategory);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch categories from API, falling back to mock data:', error);
//         await delay(400);
//         return mockCategories;
//       }
//     }
//     await delay(400);
//     return mockCategories;
//   },

//   async getCategoryById(id: string): Promise<Category | null> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get(`/categories/${id}`);
//         const data = response.data;
//         return mapCategory(data);
//       } catch (error) {
//         console.error('Failed to fetch category from API:', error);
//         await delay(300);
//         return mockCategories.find(c => c.id === id) || null;
//       }
//     }
//     await delay(300);
//     return mockCategories.find(c => c.id === id) || null;
//   },

//   // ─── PRODUCTS ──────────────────────────────────────────────────
//   async getProducts(): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/products');
//         // Your backend returns an array directly: [ { id, product_name, ... }, ... ]
//         const data = response.data;
//         if (Array.isArray(data)) {
//           return data.map(mapProduct);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch products from API, falling back to mock data:', error);
//         await delay(500);
//         return mockProducts;
//       }
//     }
//     await delay(500);
//     return mockProducts;
//   },

//   async getProductsByCategory(categoryId: string): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         // Your backend might not have this endpoint yet, so we'll filter products
//         const response = await apiClient.get('/products');
//         const data = response.data;
//         if (Array.isArray(data)) {
//           const filtered = data.filter((p: any) => p.category_id?.toString() === categoryId);
//           return filtered.map(mapProduct);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch products by category from API, falling back to mock data:', error);
//         await delay(400);
//         return mockGetProductsByCategory(categoryId);
//       }
//     }
//     await delay(400);
//     return mockGetProductsByCategory(categoryId);
//   },

//   async getProduct(id: string): Promise<Product | undefined> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get(`/products/${id}`);
//         // Your backend returns a single product object
//         const data = response.data;
//         return mapProduct(data);
//       } catch (error) {
//         console.error('Failed to fetch product from API:', error);
//         await delay(300);
//         return mockGetProductById(id);
//       }
//     }
//     await delay(300);
//     return mockGetProductById(id);
//   },

//   async getTrending(): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         // Your backend might not have trending endpoint, so we'll sort by rating
//         const response = await apiClient.get('/products');
//         const data = response.data;
//         if (Array.isArray(data)) {
//           const sorted = data
//             .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
//             .slice(0, 10)
//             .map(mapProduct);
//           return sorted;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch trending products from API, falling back to mock data:', error);
//         await delay(400);
//         return mockGetTrendingProducts();
//       }
//     }
//     await delay(400);
//     return mockGetTrendingProducts();
//   },

//   async getBestSellers(): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         // Your backend might not have best-sellers endpoint, so we'll sort by rating or available stock
//         const response = await apiClient.get('/products');
//         const data = response.data;
//         if (Array.isArray(data)) {
//           const sorted = data
//             .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
//             .slice(0, 10)
//             .map(mapProduct);
//           return sorted;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch best sellers from API, falling back to mock data:', error);
//         await delay(400);
//         return mockGetBestSellers();
//       }
//     }
//     await delay(400);
//     return mockGetBestSellers();
//   },

//   async getNewArrivals(): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         // Your backend might not have new-arrivals endpoint, so we'll sort by id (assuming newer = higher id)
//         const response = await apiClient.get('/products');
//         const data = response.data;
//         if (Array.isArray(data)) {
//           const sorted = data
//             .sort((a: any, b: any) => (b.id || 0) - (a.id || 0))
//             .slice(0, 10)
//             .map(mapProduct);
//           return sorted;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch new arrivals from API, falling back to mock data:', error);
//         await delay(400);
//         return mockGetNewArrivals();
//       }
//     }
//     await delay(400);
//     return mockGetNewArrivals();
//   },

//   async search(query: string): Promise<Product[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get(`/products/search?q=${encodeURIComponent(query)}`);
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data.map(mapProduct);
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to search products from API, falling back to mock data:', error);
//         await delay(300);
//         return mockSearchProducts(query);
//       }
//     }
//     await delay(300);
//     return mockSearchProducts(query);
//   },

//   // ─── PACKAGES ──────────────────────────────────────────────────
//   async getPackages(): Promise<Package[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/packages');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch packages from API, falling back to mock data:', error);
//         await delay(400);
//         return mockPackages;
//       }
//     }
//     await delay(400);
//     return mockPackages;
//   },

//   // ─── ADD-ONS ──────────────────────────────────────────────────
//   async getAddOns(): Promise<AddOn[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/addons');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch add-ons from API, falling back to mock data:', error);
//         await delay(200);
//         return mockAddOns;
//       }
//     }
//     await delay(200);
//     return mockAddOns;
//   },

//   // ─── COUPONS ──────────────────────────────────────────────────
//   async getCoupons(): Promise<Coupon[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/coupons');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch coupons from API, falling back to mock data:', error);
//         await delay(200);
//         return mockCoupons;
//       }
//     }
//     await delay(200);
//     return mockCoupons;
//   },

//   // ─── ORDERS ────────────────────────────────────────────────────
//   async getOrders(): Promise<Order[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/orders');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch orders from API, falling back to mock data:', error);
//         await delay(400);
//         return mockSampleOrders;
//       }
//     }
//     await delay(400);
//     return mockSampleOrders;
//   },

//   // ─── NOTIFICATIONS ────────────────────────────────────────────
//   async getNotifications(): Promise<AppNotification[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/notifications');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch notifications from API, falling back to mock data:', error);
//         await delay(300);
//         return mockSampleNotifications;
//       }
//     }
//     await delay(300);
//     return mockSampleNotifications;
//   },

//   // ─── ADDRESSES ─────────────────────────────────────────────────
//   async getAddresses(): Promise<Address[]> {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/addresses');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch addresses from API, falling back to mock data:', error);
//         await delay(300);
//         return mockSampleAddresses;
//       }
//     }
//     await delay(300);
//     return mockSampleAddresses;
//   },

//   // ─── TESTIMONIALS ─────────────────────────────────────────────
//   async getTestimonials() {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/testimonials');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch testimonials from API, falling back to mock data:', error);
//         await delay(300);
//         return mockTestimonials;
//       }
//     }
//     await delay(300);
//     return mockTestimonials;
//   },

//   // ─── WHY CHOOSE US ────────────────────────────────────────────
//   async getWhyChooseUs() {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/why-choose-us');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch why choose us from API, falling back to mock data:', error);
//         await delay(200);
//         return mockWhyChooseUs;
//       }
//     }
//     await delay(200);
//     return mockWhyChooseUs;
//   },

//   // ─── HERO BANNERS ─────────────────────────────────────────────
//   async getHeroBanners() {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.get('/hero-banners');
//         const data = response.data.data || response.data;
//         if (Array.isArray(data)) {
//           return data;
//         }
//         return [];
//       } catch (error) {
//         console.error('Failed to fetch hero banners from API, falling back to mock data:', error);
//         await delay(200);
//         return mockHeroBanners;
//       }
//     }
//     await delay(200);
//     return mockHeroBanners;
//   },

//   // ─── AUTHENTICATION ────────────────────────────────────────────
//   async login(email: string, password: string) {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.post('/auth/login', { email, password });
//         const data = response.data.data || response.data;
//         return {
//           token: data.token || 'mock_jwt_token_' + Date.now(),
//           user: data.user || {
//             id: 'u1',
//             name: 'Arjun Patel',
//             email,
//             phone: '+91 98765 43210',
//             avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//             isPremium: true,
//           },
//         };
//       } catch (error) {
//         console.error('Login failed:', error);
//         // Fallback to mock login
//         await delay(800);
//         return {
//           token: 'mock_jwt_token_' + Date.now(),
//           user: {
//             id: 'u1',
//             name: 'Arjun Patel',
//             email,
//             phone: '+91 98765 43210',
//             avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//             isPremium: true,
//           },
//         };
//       }
//     }
//     await delay(800);
//     return {
//       token: 'mock_jwt_token_' + Date.now(),
//       user: {
//         id: 'u1',
//         name: 'Arjun Patel',
//         email,
//         phone: '+91 98765 43210',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: true,
//       },
//     };
//   },

//   async register(name: string, email: string, password: string) {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.post('/auth/register', { name, email, password });
//         const data = response.data.data || response.data;
//         return {
//           token: data.token || 'mock_jwt_token_' + Date.now(),
//           user: data.user || {
//             id: 'u' + Date.now(),
//             name,
//             email,
//             phone: '',
//             avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//             isPremium: false,
//           },
//         };
//       } catch (error) {
//         console.error('Registration failed:', error);
//         await delay(1000);
//         return {
//           token: 'mock_jwt_token_' + Date.now(),
//           user: {
//             id: 'u' + Date.now(),
//             name,
//             email,
//             phone: '',
//             avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//             isPremium: false,
//           },
//         };
//       }
//     }
//     await delay(1000);
//     return {
//       token: 'mock_jwt_token_' + Date.now(),
//       user: {
//         id: 'u' + Date.now(),
//         name,
//         email,
//         phone: '',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: false,
//       },
//     };
//   },

//   async verifyOtp(otp: string) {
//     if (USE_REAL_API) {
//       try {
//         const response = await apiClient.post('/auth/verify-otp', { otp });
//         return { success: true };
//       } catch (error) {
//         console.error('OTP verification failed:', error);
//         await delay(600);
//         return { success: true };
//       }
//     }
//     await delay(600);
//     return { success: true };
//   },
// };

// // ─── Export individual functions for convenience ──────────────
// // These are the functions that will be used by the app
// export const getCategories = mockApi.getCategories.bind(mockApi);
// export const getCategoryById = mockApi.getCategoryById.bind(mockApi);
// export const getProducts = mockApi.getProducts.bind(mockApi);
// export const getProductsByCategory = mockApi.getProductsByCategory.bind(mockApi);
// export const getProduct = mockApi.getProduct.bind(mockApi);
// export const getTrending = mockApi.getTrending.bind(mockApi);
// export const getBestSellers = mockApi.getBestSellers.bind(mockApi);
// export const getNewArrivals = mockApi.getNewArrivals.bind(mockApi);
// export const search = mockApi.search.bind(mockApi);
// export const getPackages = mockApi.getPackages.bind(mockApi);
// export const getAddOns = mockApi.getAddOns.bind(mockApi);
// export const getCoupons = mockApi.getCoupons.bind(mockApi);
// export const getOrders = mockApi.getOrders.bind(mockApi);
// export const getNotifications = mockApi.getNotifications.bind(mockApi);
// export const getAddresses = mockApi.getAddresses.bind(mockApi);
// export const getTestimonials = mockApi.getTestimonials.bind(mockApi);
// export const getWhyChooseUs = mockApi.getWhyChooseUs.bind(mockApi);
// export const getHeroBanners = mockApi.getHeroBanners.bind(mockApi);
// export const login = mockApi.login.bind(mockApi);
// export const register = mockApi.register.bind(mockApi);
// export const verifyOtp = mockApi.verifyOtp.bind(mockApi);

// // ─── Export the API client for advanced usage ──────────────────
// export { apiClient };


///////////////////////////////////////////////////////////////////////////////////////////////





// services/api.ts
import axios from 'axios';
// Import mock data with different names to avoid conflicts
import { 
  products as mockProducts, 
  getProductById as mockGetProductById, 
  getProductsByCategory as mockGetProductsByCategory, 
  searchProducts as mockSearchProducts, 
  getTrendingProducts as mockGetTrendingProducts, 
  getBestSellers as mockGetBestSellers, 
  getNewArrivals as mockGetNewArrivals 
} from '@/mock/products';
import { categories as mockCategories } from '@/mock/categories';
import { 
  packages as mockPackages, 
  addOns as mockAddOns, 
  coupons as mockCoupons, 
  sampleOrders as mockSampleOrders, 
  sampleNotifications as mockSampleNotifications, 
  sampleAddresses as mockSampleAddresses, 
  testimonials as mockTestimonials, 
  whyChooseUs as mockWhyChooseUs, 
  heroBanners as mockHeroBanners 
} from '@/mock/data';
import { Product, Category, Package, AddOn, Coupon, Order, AppNotification, Address } from '@/types';

// ─── Configuration ──────────────────────────────────────────────
// Set to true to use real API, false to use mock data
const USE_REAL_API = true;

// Your backend API base URL - change this to your actual backend URL
const API_BASE_URL = 'https://hoped-dude-enters-desktops.trycloudflare.com/api'; // For development

// ─── Axios Instance ─────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // If you have authentication, get token from storage
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ─── Helper Functions ───────────────────────────────────────────
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Map backend category to frontend Category type
const mapCategory = (apiCategory: any): Category => ({
  id: apiCategory.id?.toString() || '',
  name: apiCategory.category_name || apiCategory.name || '',
  category_name: apiCategory.category_name || apiCategory.name || '',
  image: apiCategory.image || 'https://via.placeholder.com/300x200?text=Category',
  productCount: apiCategory.product_count || apiCategory.productCount || 0,
  slug: apiCategory.slug || apiCategory.category_name?.toLowerCase().replace(/\s+/g, '-') || '',
  icon: apiCategory.icon || '🎨',
  color: apiCategory.color || '#6C63FF',
});

// Map backend product to frontend Product type
const mapProduct = (apiProduct: any): Product => {
  const originalPrice = Number(apiProduct.original_price) || Number(apiProduct.originalPrice) || Number(apiProduct.price) || 0;
  const price = Number(apiProduct.price) || Number(apiProduct.original_price) || 0;
  const discount = Number(apiProduct.discount) || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  let images = [];
  try {
    if (apiProduct.images && typeof apiProduct.images === 'string') {
      images = JSON.parse(apiProduct.images);
    } else if (Array.isArray(apiProduct.images)) {
      images = apiProduct.images.map((img: any) => img.image_url || img);
    } else if (apiProduct.image) {
      images = [apiProduct.image];
    } else {
      images = ['https://via.placeholder.com/300x300'];
    }
  } catch (e) {
    images = ['https://via.placeholder.com/300x300'];
  }

  const features = apiProduct.features ? 
    (typeof apiProduct.features === 'string' ? JSON.parse(apiProduct.features) : apiProduct.features) :
    ['Premium Quality', 'Durable', 'Elegant Design'];

  const specifications = apiProduct.specifications ?
    (typeof apiProduct.specifications === 'string' ? JSON.parse(apiProduct.specifications) : apiProduct.specifications) :
    {
      material: apiProduct.material || 'Premium',
      dimensions: apiProduct.dimensions || 'Standard',
      weight: apiProduct.weight || 'N/A',
      color: apiProduct.color || 'Multiple'
    };

  const colors = apiProduct.colors ?
    (typeof apiProduct.colors === 'string' ? JSON.parse(apiProduct.colors) : apiProduct.colors) :
    [apiProduct.color || '#6C63FF'];

  const sizes = apiProduct.sizes ?
    (typeof apiProduct.sizes === 'string' ? JSON.parse(apiProduct.sizes) : apiProduct.sizes) :
    ['Standard'];

  return {
    id: apiProduct.id?.toString() || '',
    name: apiProduct.product_name || apiProduct.name || '',
    description: apiProduct.product_description || apiProduct.description || '',
    price: price,
    originalPrice: originalPrice,
    discount: discount,
    images: images,
    categoryId: apiProduct.product_category_id?.toString() || apiProduct.category_id?.toString() || apiProduct.categoryId?.toString() || '',
    categoryName: apiProduct.category_name || apiProduct.categoryName || '',
    rating: Number(apiProduct.rating) || 0,
    reviewCount: Number(apiProduct.review_count) || Number(apiProduct.reviewCount) || 0,
    inStock: Number(apiProduct.available_stock) > 0 || Boolean(apiProduct.in_stock) || true,
    isTrending: Boolean(apiProduct.is_trending || apiProduct.isTrending),
    isBestSeller: Boolean(apiProduct.is_best_seller || apiProduct.isBestSeller),
    features: features,
    specifications: specifications,
    colors: colors,
    sizes: sizes,
    stockCount: Number(apiProduct.available_stock) || Number(apiProduct.stock_count) || Number(apiProduct.stockCount) || 10,
    soldCount: Number(apiProduct.sold_count) || Number(apiProduct.soldCount) || 0,
    isFeatured: Boolean(apiProduct.is_featured || apiProduct.isFeatured),
    brand: apiProduct.product_brand || apiProduct.brand || '',
    weight: apiProduct.weight || 'N/A',
    dimensions: apiProduct.dimensions || 'Standard',
    material: apiProduct.material || 'Premium',
    careInstructions: apiProduct.care_instructions || apiProduct.careInstructions || 'Dry clean only',
    warranty: apiProduct.warranty || '1 year manufacturer warranty',
    returnPolicy: apiProduct.return_policy || apiProduct.returnPolicy || '30 days return policy',
    shippingInfo: apiProduct.shipping_info || apiProduct.shippingInfo || 'Free shipping on orders above ₹500',
    reviews: apiProduct.reviews || [
      {
        id: '1',
        userName: 'Rahul Sharma',
        userAvatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 5,
        comment: 'Excellent quality! The decoration was perfect for our wedding.',
        date: '2024-12-15'
      },
      {
        id: '2',
        userName: 'Priya Patel',
        userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4,
        comment: 'Great product, delivery was on time. Highly recommend!',
        date: '2024-12-10'
      }
    ],
    relatedIds: apiProduct.related_ids || apiProduct.relatedIds || [],
  };
};

// Map backend package to frontend Package type
const mapPackage = (apiPackage: any): Package => {
  // Parse JSON fields
  let includes: string[] = [];
  let catering: any = false;
  let stageDecoration: any = false;
  let flowerDecoration: any = false;
  let lighting: any = false;
  let photography: any = false;
  let videography: any = false;
  let soundSystem: any = false;

  try {
    includes = apiPackage.includes ? (typeof apiPackage.includes === 'string' ? JSON.parse(apiPackage.includes) : apiPackage.includes) : [];
  } catch (e) { includes = []; }

  try {
    if (apiPackage.catering !== undefined && apiPackage.catering !== null) {
      catering = typeof apiPackage.catering === 'string' ? JSON.parse(apiPackage.catering) : apiPackage.catering;
    }
  } catch (e) { catering = false; }

  try {
    if (apiPackage.stage_decoration !== undefined && apiPackage.stage_decoration !== null) {
      stageDecoration = typeof apiPackage.stage_decoration === 'string' ? JSON.parse(apiPackage.stage_decoration) : apiPackage.stage_decoration;
    }
  } catch (e) { stageDecoration = false; }

  try {
    if (apiPackage.flower_decoration !== undefined && apiPackage.flower_decoration !== null) {
      flowerDecoration = typeof apiPackage.flower_decoration === 'string' ? JSON.parse(apiPackage.flower_decoration) : apiPackage.flower_decoration;
    }
  } catch (e) { flowerDecoration = false; }

  try {
    if (apiPackage.lighting !== undefined && apiPackage.lighting !== null) {
      lighting = typeof apiPackage.lighting === 'string' ? JSON.parse(apiPackage.lighting) : apiPackage.lighting;
    }
  } catch (e) { lighting = false; }

  try {
    if (apiPackage.photography !== undefined && apiPackage.photography !== null) {
      photography = typeof apiPackage.photography === 'string' ? JSON.parse(apiPackage.photography) : apiPackage.photography;
    }
  } catch (e) { photography = false; }

  try {
    if (apiPackage.videography !== undefined && apiPackage.videography !== null) {
      videography = typeof apiPackage.videography === 'string' ? JSON.parse(apiPackage.videography) : apiPackage.videography;
    }
  } catch (e) { videography = false; }

  try {
    if (apiPackage.sound_system !== undefined && apiPackage.sound_system !== null) {
      soundSystem = typeof apiPackage.sound_system === 'string' ? JSON.parse(apiPackage.sound_system) : apiPackage.sound_system;
    }
  } catch (e) { soundSystem = false; }

  // Get images array
  let images: string[] = [];
  try {
    if (apiPackage.images && typeof apiPackage.images === 'string') {
      images = JSON.parse(apiPackage.images);
    } else if (Array.isArray(apiPackage.images)) {
      images = apiPackage.images;
    } else if (apiPackage.image_url) {
      images = [apiPackage.image_url];
    }
  } catch (e) {
    images = apiPackage.image_url ? [apiPackage.image_url] : ['https://via.placeholder.com/300x200'];
  }

  // Determine tier
  let tier: 'Basic' | 'Premium' | 'Luxury' | 'Silver' | 'Gold' | 'Platinum' = 'Basic';
  const tierMap: Record<string, any> = {
    'basic': 'Basic',
    'premium': 'Premium',
    'luxury': 'Luxury',
    'silver': 'Silver',
    'gold': 'Gold',
    'platinum': 'Platinum'
  };
  if (apiPackage.tier && tierMap[apiPackage.tier.toLowerCase()]) {
    tier = tierMap[apiPackage.tier.toLowerCase()];
  }

  return {
    id: apiPackage.id?.toString() || '',
    name: apiPackage.package_name || apiPackage.name || '',
    tier: tier,
    price: Number(apiPackage.price) || 0,
    originalPrice: Number(apiPackage.original_price) || Number(apiPackage.originalPrice) || 0,
    discount: Number(apiPackage.discount) || 0,
    rating: Number(apiPackage.rating) || 0,
    reviewCount: Number(apiPackage.review_count) || 0,
    image: apiPackage.image_url || (images && images[0]) || 'https://via.placeholder.com/300x200',
    images: images,
    guestCapacity: Number(apiPackage.guest_capacity) || 0,
    description: apiPackage.description || '',
    includes: includes,
    catering: catering,
    stageDecoration: stageDecoration,
    flowerDecoration: flowerDecoration,
    lighting: lighting,
    photography: photography,
    videography: videography,
    soundSystem: soundSystem,
    djSetup: Boolean(apiPackage.dj_setup || apiPackage.djSetup),
    isActive: apiPackage.is_active !== undefined ? Boolean(apiPackage.is_active) : true,
  };
};

// ─── API Service ──────────────────────────────────────────────────
export const mockApi = {
  // ─── CATEGORIES ──────────────────────────────────────────────
  async getCategories(): Promise<Category[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/categories');
        const data = response.data;
        if (Array.isArray(data)) {
          return data.map(mapCategory);
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch categories from API, falling back to mock data:', error);
        await delay(400);
        return mockCategories;
      }
    }
    await delay(400);
    return mockCategories;
  },

  async getCategoryById(id: string): Promise<Category | null> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get(`/categories/${id}`);
        const data = response.data;
        return mapCategory(data);
      } catch (error) {
        console.error('Failed to fetch category from API:', error);
        await delay(300);
        return mockCategories.find(c => c.id === id) || null;
      }
    }
    await delay(300);
    return mockCategories.find(c => c.id === id) || null;
  },

  // ─── PRODUCTS ──────────────────────────────────────────────────
  async getProducts(): Promise<Product[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/products');
        const data = response.data;
        if (Array.isArray(data)) {
          return data.map(mapProduct);
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch products from API, falling back to mock data:', error);
        await delay(500);
        return mockProducts;
      }
    }
    await delay(500);
    return mockProducts;
  },

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get(`/products/category/${categoryId}`);
        const data = response.data;
        if (Array.isArray(data)) {
          return data.map(mapProduct);
        }
        return [];
      } catch (error) {
        console.error('Category endpoint failed, trying fallback:', error);
        try {
          const response = await apiClient.get('/products');
          const data = response.data;
          if (Array.isArray(data)) {
            const filtered = data.filter((p: any) => 
              p.product_category_id?.toString() === categoryId || 
              p.category_id?.toString() === categoryId
            );
            return filtered.map(mapProduct);
          }
          return [];
        } catch (fallbackError) {
          console.error('Failed to fetch products by category from API, falling back to mock data:', fallbackError);
          await delay(400);
          return mockGetProductsByCategory(categoryId);
        }
      }
    }
    await delay(400);
    return mockGetProductsByCategory(categoryId);
  },

  async getProduct(id: string): Promise<Product | undefined> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get(`/products/${id}`);
        const data = response.data;
        return mapProduct(data);
      } catch (error) {
        console.error('Failed to fetch product from API:', error);
        await delay(300);
        return mockGetProductById(id);
      }
    }
    await delay(300);
    return mockGetProductById(id);
  },

  async getTrending(): Promise<Product[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/products/trending');
        const data = response.data;
        if (Array.isArray(data)) {
          return data.map(mapProduct);
        }
        return [];
      } catch (error) {
        console.error('Trending endpoint failed, using fallback:', error);
        try {
          const response = await apiClient.get('/products');
          const data = response.data;
          if (Array.isArray(data)) {
            const sorted = data
              .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
              .slice(0, 10)
              .map(mapProduct);
            return sorted;
          }
          return [];
        } catch (fallbackError) {
          console.error('Failed to fetch trending products from API, falling back to mock data:', fallbackError);
          await delay(400);
          return mockGetTrendingProducts();
        }
      }
    }
    await delay(400);
    return mockGetTrendingProducts();
  },

  async getBestSellers(): Promise<Product[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/products/best-sellers');
        const data = response.data;
        if (Array.isArray(data)) {
          return data.map(mapProduct);
        }
        return [];
      } catch (error) {
        console.error('Best sellers endpoint failed, using fallback:', error);
        try {
          const response = await apiClient.get('/products');
          const data = response.data;
          if (Array.isArray(data)) {
            const sorted = data
              .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
              .slice(0, 10)
              .map(mapProduct);
            return sorted;
          }
          return [];
        } catch (fallbackError) {
          console.error('Failed to fetch best sellers from API, falling back to mock data:', fallbackError);
          await delay(400);
          return mockGetBestSellers();
        }
      }
    }
    await delay(400);
    return mockGetBestSellers();
  },

  async getNewArrivals(): Promise<Product[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/products/new-arrivals');
        const data = response.data;
        if (Array.isArray(data)) {
          return data.map(mapProduct);
        }
        return [];
      } catch (error) {
        console.error('New arrivals endpoint failed, using fallback:', error);
        try {
          const response = await apiClient.get('/products');
          const data = response.data;
          if (Array.isArray(data)) {
            const sorted = data
              .sort((a: any, b: any) => (b.id || 0) - (a.id || 0))
              .slice(0, 10)
              .map(mapProduct);
            return sorted;
          }
          return [];
        } catch (fallbackError) {
          console.error('Failed to fetch new arrivals from API, falling back to mock data:', fallbackError);
          await delay(400);
          return mockGetNewArrivals();
        }
      }
    }
    await delay(400);
    return mockGetNewArrivals();
  },

  async search(query: string): Promise<Product[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get(`/products/search?q=${encodeURIComponent(query)}`);
        const data = response.data;
        if (Array.isArray(data)) {
          return data.map(mapProduct);
        }
        return [];
      } catch (error) {
        console.error('Search endpoint failed, using fallback:', error);
        try {
          const response = await apiClient.get('/products');
          const data = response.data;
          if (Array.isArray(data)) {
            const searchTerm = query.toLowerCase();
            const filtered = data.filter((p: any) => 
              (p.product_name && p.product_name.toLowerCase().includes(searchTerm)) ||
              (p.product_description && p.product_description.toLowerCase().includes(searchTerm)) ||
              (p.category_name && p.category_name.toLowerCase().includes(searchTerm))
            );
            return filtered.map(mapProduct);
          }
          return [];
        } catch (fallbackError) {
          console.error('Failed to search products from API, falling back to mock data:', fallbackError);
          await delay(300);
          return mockSearchProducts(query);
        }
      }
    }
    await delay(300);
    return mockSearchProducts(query);
  },

  // ─── PACKAGES ──────────────────────────────────────────────────
  async getPackages(): Promise<Package[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/packages');
        const data = response.data;
        if (Array.isArray(data)) {
          return data.map(mapPackage);
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch packages from API, falling back to mock data:', error);
        await delay(400);
        return mockPackages;
      }
    }
    await delay(400);
    return mockPackages;
  },

  async getPackage(id: string): Promise<Package | undefined> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get(`/packages/${id}`);
        const data = response.data;
        return mapPackage(data);
      } catch (error) {
        console.error('Failed to fetch package from API:', error);
        await delay(300);
        return mockPackages.find(p => p.id === id);
      }
    }
    await delay(300);
    return mockPackages.find(p => p.id === id);
  },

  async getPackagesByTier(tier: string): Promise<Package[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get(`/packages/tier/${tier}`);
        const data = response.data;
        if (Array.isArray(data)) {
          return data.map(mapPackage);
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch packages by tier from API, falling back to mock data:', error);
        await delay(300);
        return mockPackages.filter(p => p.tier.toLowerCase() === tier.toLowerCase());
      }
    }
    await delay(300);
    return mockPackages.filter(p => p.tier.toLowerCase() === tier.toLowerCase());
  },

  // ─── ADD-ONS ──────────────────────────────────────────────────
  // async getAddOns(): Promise<AddOn[]> {
  //   if (USE_REAL_API) {
  //     try {
  //       const response = await apiClient.get('/addons');
  //       const data = response.data.data || response.data;
  //       if (Array.isArray(data)) {
  //         return data;
  //       }
  //       return [];
  //     } catch (error) {
  //       console.error('Failed to fetch add-ons from API, falling back to mock data:', error);
  //       await delay(200);
  //       return mockAddOns;
  //     }
  //   }
  //   await delay(200);
  //   return mockAddOns;
  // },
  // services/api.ts - Make sure getAddOns is working correctly

async getAddOns(): Promise<AddOn[]> {
  if (USE_REAL_API) {
    try {
      const response = await apiClient.get('/addons');
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          id: item.id?.toString() || '',
          name: item.name || '',
          price: Number(item.price) || 0,
          icon: item.icon || '📦',
          description: item.description || '',
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch add-ons from API, falling back to mock data:', error);
      await delay(200);
      return mockAddOns;
    }
  }
  await delay(200);
  return mockAddOns;
},

  // ─── COUPONS ──────────────────────────────────────────────────
  async getCoupons(): Promise<Coupon[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/coupons');
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          return data;
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch coupons from API, falling back to mock data:', error);
        await delay(200);
        return mockCoupons;
      }
    }
    await delay(200);
    return mockCoupons;
  },

  // ─── ORDERS ────────────────────────────────────────────────────
  async getOrders(): Promise<Order[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/orders');
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          return data;
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch orders from API, falling back to mock data:', error);
        await delay(400);
        return mockSampleOrders;
      }
    }
    await delay(400);
    return mockSampleOrders;
  },

  // ─── NOTIFICATIONS ────────────────────────────────────────────
  async getNotifications(): Promise<AppNotification[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/notifications');
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          return data;
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch notifications from API, falling back to mock data:', error);
        await delay(300);
        return mockSampleNotifications;
      }
    }
    await delay(300);
    return mockSampleNotifications;
  },

  // ─── ADDRESSES ─────────────────────────────────────────────────
  async getAddresses(): Promise<Address[]> {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/addresses');
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          return data;
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch addresses from API, falling back to mock data:', error);
        await delay(300);
        return mockSampleAddresses;
      }
    }
    await delay(300);
    return mockSampleAddresses;
  },

  // ─── TESTIMONIALS ─────────────────────────────────────────────
  async getTestimonials() {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/testimonials');
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          return data;
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch testimonials from API, falling back to mock data:', error);
        await delay(300);
        return mockTestimonials;
      }
    }
    await delay(300);
    return mockTestimonials;
  },

  // ─── WHY CHOOSE US ────────────────────────────────────────────
  async getWhyChooseUs() {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.get('/why-choose-us');
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          return data;
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch why choose us from API, falling back to mock data:', error);
        await delay(200);
        return mockWhyChooseUs;
      }
    }
    await delay(200);
    return mockWhyChooseUs;
  },

  // ─── HERO BANNERS ─────────────────────────────────────────────
// services/api.ts - Update the getHeroBanners method

// ─── HERO BANNERS ─────────────────────────────────────────────
async getHeroBanners() {
  if (USE_REAL_API) {
    try {
      const response = await apiClient.get('/hero-banners');
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          id: item.id?.toString() || '',
          title: item.title || '',
          subtitle: item.subtitle || '',
          image: item.image || item.image_url || 'https://via.placeholder.com/800x400',
          cta: item.cta || item.cta_text || 'Learn More',
          ctaLink: item.cta_link || '/',
          displayOrder: Number(item.display_order) || 0,
          isActive: item.is_active !== undefined ? Boolean(item.is_active) : true,
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch hero banners from API, falling back to mock data:', error);
      await delay(200);
      return mockHeroBanners;
    }
  }
  await delay(200);
  return mockHeroBanners;
},

  // ─── AUTHENTICATION ────────────────────────────────────────────
  async login(email: string, password: string) {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.post('/customers/login', { email, password });
        const data = response.data.data || response.data;
        return {
          token: data.token || 'mock_jwt_token_' + Date.now(),
          user: data.user || {
            id: 'u1',
            name: 'Arjun Patel',
            email,
            phone: '+91 98765 43210',
            avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
            isPremium: true,
          },
        };
      } catch (error) {
        console.error('Login failed:', error);
        await delay(800);
        return {
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: 'u1',
            name: 'Arjun Patel',
            email,
            phone: '+91 98765 43210',
            avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
            isPremium: true,
          },
        };
      }
    }
    await delay(800);
    return {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: 'u1',
        name: 'Arjun Patel',
        email,
        phone: '+91 98765 43210',
        avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
        isPremium: true,
      },
    };
  },

  async register(name: string, email: string, password: string) {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.post('/customers/register', { name, email, password });
        const data = response.data.data || response.data;
        return {
          token: data.token || 'mock_jwt_token_' + Date.now(),
          user: data.user || {
            id: 'u' + Date.now(),
            name,
            email,
            phone: '',
            avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
            isPremium: false,
          },
        };
      } catch (error) {
        console.error('Registration failed:', error);
        await delay(1000);
        return {
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: 'u' + Date.now(),
            name,
            email,
            phone: '',
            avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
            isPremium: false,
          },
        };
      }
    }
    await delay(1000);
    return {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: 'u' + Date.now(),
        name,
        email,
        phone: '',
        avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
        isPremium: false,
      },
    };
  },

  async verifyOtp(otp: string) {
    if (USE_REAL_API) {
      try {
        const response = await apiClient.post('/customers/verify-otp', { otp });
        return { success: true };
      } catch (error) {
        console.error('OTP verification failed:', error);
        await delay(600);
        return { success: true };
      }
    }
    await delay(600);
    return { success: true };
  },
};

// ─── Export individual functions for convenience ──────────────
export const getCategories = mockApi.getCategories.bind(mockApi);
export const getCategoryById = mockApi.getCategoryById.bind(mockApi);
export const getProducts = mockApi.getProducts.bind(mockApi);
export const getProductsByCategory = mockApi.getProductsByCategory.bind(mockApi);
export const getProduct = mockApi.getProduct.bind(mockApi);
export const getTrending = mockApi.getTrending.bind(mockApi);
export const getBestSellers = mockApi.getBestSellers.bind(mockApi);
export const getNewArrivals = mockApi.getNewArrivals.bind(mockApi);
export const search = mockApi.search.bind(mockApi);
export const getPackages = mockApi.getPackages.bind(mockApi);
export const getPackage = mockApi.getPackage.bind(mockApi);
export const getPackagesByTier = mockApi.getPackagesByTier.bind(mockApi);
export const getAddOns = mockApi.getAddOns.bind(mockApi);
export const getCoupons = mockApi.getCoupons.bind(mockApi);
export const getOrders = mockApi.getOrders.bind(mockApi);
export const getNotifications = mockApi.getNotifications.bind(mockApi);
export const getAddresses = mockApi.getAddresses.bind(mockApi);
export const getTestimonials = mockApi.getTestimonials.bind(mockApi);
export const getWhyChooseUs = mockApi.getWhyChooseUs.bind(mockApi);
export const getHeroBanners = mockApi.getHeroBanners.bind(mockApi);
export const login = mockApi.login.bind(mockApi);
export const register = mockApi.register.bind(mockApi);
export const verifyOtp = mockApi.verifyOtp.bind(mockApi);

export { apiClient };