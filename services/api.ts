import { products, getProductById, getProductsByCategory, searchProducts, getTrendingProducts, getBestSellers, getNewArrivals } from '@/mock/products';
import { categories } from '@/mock/categories';
import { packages, addOns, coupons, sampleOrders, sampleNotifications, sampleAddresses, testimonials, whyChooseUs, heroBanners } from '@/mock/data';
import { Product, Category, Package, AddOn, Coupon, Order, AppNotification, Address } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async getCategories(): Promise<Category[]> {
    await delay(400);
    return categories;
  },

  async getProducts(): Promise<Product[]> {
    await delay(500);
    return products;
  },

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    await delay(400);
    return getProductsByCategory(categoryId);
  },

  async getProduct(id: string): Promise<Product | undefined> {
    await delay(300);
    return getProductById(id);
  },

  async getTrending(): Promise<Product[]> {
    await delay(400);
    return getTrendingProducts();
  },

  async getBestSellers(): Promise<Product[]> {
    await delay(400);
    return getBestSellers();
  },

  async getNewArrivals(): Promise<Product[]> {
    await delay(400);
    return getNewArrivals();
  },

  async search(query: string): Promise<Product[]> {
    await delay(300);
    return searchProducts(query);
  },

  async getPackages(): Promise<Package[]> {
    await delay(400);
    return packages;
  },

  async getAddOns(): Promise<AddOn[]> {
    await delay(200);
    return addOns;
  },

  async getCoupons(): Promise<Coupon[]> {
    await delay(200);
    return coupons;
  },

  async getOrders(): Promise<Order[]> {
    await delay(400);
    return sampleOrders;
  },

  async getNotifications(): Promise<AppNotification[]> {
    await delay(300);
    return sampleNotifications;
  },

  async getAddresses(): Promise<Address[]> {
    await delay(300);
    return sampleAddresses;
  },

  async getTestimonials() {
    await delay(300);
    return testimonials;
  },

  async getWhyChooseUs() {
    await delay(200);
    return whyChooseUs;
  },

  async getHeroBanners() {
    await delay(200);
    return heroBanners;
  },

  async login(email: string, _password: string) {
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

  async register(name: string, email: string, _password: string) {
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

  async verifyOtp(_otp: string) {
    await delay(600);
    return { success: true };
  },
};
