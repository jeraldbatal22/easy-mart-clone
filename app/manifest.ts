import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Easy Mart - Fresh Groceries & Best Sellers',
    short_name: 'Easy Mart',
    description: 'Shop fresh groceries, best sellers, and quality products at Easy Mart. Fast delivery, competitive prices, and verified products.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    // icons: [
    //   {
    //     src: '/assets/icons/logo.png',
    //     sizes: 'any',
    //     type: 'image/png',
    //   },
    //   {
    //     src: '/assets/icons/logo-with-text.png',
    //     sizes: 'any',
    //     type: 'image/png',
    //   },
    // ],
    categories: ['shopping', 'food', 'lifestyle'],
    lang: 'en',
    orientation: 'portrait',
  }
}
