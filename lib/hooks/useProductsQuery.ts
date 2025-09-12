import useSWR from 'swr';
import { useMemo } from 'react';

export interface UIProduct {
  id: string;
  name: string;
  image: string;
  price: string;
  originalPrice?: string;
  unit: string;
  stock: string;
  isVerified?: boolean;
  isBestSeller?: boolean;
}

interface ProductResponse {
  success: boolean;
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
}

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  enabled?: boolean;
}

// Fetcher function for SWR
const fetchProducts = async (url: string): Promise<ProductResponse> => {
  const res = await fetch(url);
  const json = await res.json();
  
  if (!res.ok || !json?.success) {
    const error = new Error(json?.error || 'Failed to fetch products');
    (error as any).status = res.status;
    throw error;
  }
  
  return json;
};

// Transform raw product data to UI format
const transformProduct = (p: any): UIProduct => ({
  id: String(p.id || p._id || ''),
  name: String(p.name || ''),
  image: String(p.image || '/assets/images/product/product-1.png'),
  price: typeof p.price === 'number' ? `Php ${p.price.toFixed(2)}` : String(p.price ?? ''),
  originalPrice: typeof p.originalPrice === 'number' ? `$${p.originalPrice.toFixed(2)}` : (p.originalPrice ? String(p.originalPrice) : undefined),
  unit: String(p.unit || 'each'),
  stock: String(typeof p.stock === 'number' ? (p.stock === 0 ? 'Out of Stock' : `${p.stock} Left`) : ''),
  isVerified: Boolean(p.isVerified),
  isBestSeller: Boolean(p.isBestSeller),
});

// SWR key factory for products
export const productKeys = {
  all: () => ['products'] as const,
  lists: () => [...productKeys.all(), 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all(), 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const useProducts = (options: UseProductsOptions = {}) => {
  const {
    page = 1,
    limit = 6,
    category,
    enabled = true
  } = options;

  // Build the API URL
  const categoryParam = category ? `&groceryCategory=${encodeURIComponent(category)}` : '';
  const url = enabled ? `/api/product?limit=${limit}&page=${page}${categoryParam}` : null;

  // Use SWR for data fetching
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate: mutateData,
  } = useSWR(
    url,
    fetchProducts,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0, // Disable automatic refresh by default
      dedupingInterval: 2000,
      errorRetryCount: 3,
      shouldRetryOnError: (error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return true;
      },
    }
  );

  // Transform and sort products
  const products = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }

    const items = data.data;
    const mapped = items
      .filter((p: any) => p && typeof p === 'object')
      .map(transformProduct);

    // Sort by best seller flag
    const compareByBest = (a: UIProduct, b: UIProduct): number => {
      const aBestFlag = items.find((p: any) => String(p.id || p._id) === a.id)?.isBestSeller ? 1 : 0;
      const bBestFlag = items.find((p: any) => String(p.id || p._id) === b.id)?.isBestSeller ? 1 : 0;
      return Number(bBestFlag) - Number(aBestFlag);
    };

    return mapped.sort(compareByBest);
  }, [data?.data]);

  // useEffect(() => {
  //   refresh();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // Manual refresh function
  const refresh = () => {
    mutateData();
  };

  return {
    products,
    pagination: data?.pagination || null,
    isLoading,
    isFetching: isValidating,
    isError: !!error,
    error: error?.message || null,
    refresh,
    isStale: isValidating,
    isRefetching: isValidating,
  };
};

// Hook for fetching a single product
export const useProduct = (id: string | null) => {
  const url = id ? `/api/product/${id}` : null;
  
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate: mutateData,
  } = useSWR(
    url,
    async (url: string) => {
      const res = await fetch(url);
      const json = await res.json();
      
      if (!res.ok || !json?.success) {
        const error = new Error(json?.error || 'Failed to fetch product');
        (error as any).status = res.status;
        throw error;
      }
      
      return json.data;
    },
    {
      revalidateOnFocus: false, // Less aggressive for individual products
      revalidateOnReconnect: true,
      refreshInterval: 0,
      dedupingInterval: 5000,
      errorRetryCount: 3,
    }
  );

  const refetch = () => {
    mutateData();
  };

  return {
    product: data,
    isLoading,
    isFetching: isValidating,
    isError: !!error,
    error: error?.message || null,
    refetch,
    isStale: isValidating,
  };
};

// // Hook for infinite scrolling products
// export const useInfiniteProducts = (options: Omit<UseProductsOptions, 'page'> = {}) => {
//   const { limit = 6, category, enabled = true } = options;

//   const {
//     data,
//     error,
//     isLoading,
//     isValidating,
//     size,
//     setSize,
//     mutate: mutateData,
//   } = useSWRInfinite(
//     (index: number) => {
//       if (!enabled) return null;
//       const categoryParam = category ? `&groceryCategory=${encodeURIComponent(category)}` : '';
//       return `/api/product?limit=${limit}&page=${index + 1}${categoryParam}`;
//     },
//     fetchProducts,
//     {
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//       refreshInterval: 0,
//       dedupingInterval: 2000,
//       errorRetryCount: 3,
//     }
//   );

//   // Flatten all pages into a single array
//   const products = useMemo(() => {
//     if (!data) return [];
    
//     const allProducts = data.flatMap((page: any) => page.data || []);
//     return allProducts
//       .filter((p: any) => p && typeof p === 'object')
//       .map(transformProduct);
//   }, [data]);

//   // Check if there are more pages
//   const hasNextPage = data ? data[data.length - 1]?.pagination?.hasNextPage : false;
  
//   const fetchNextPage = () => {
//     if (hasNextPage && !isValidating) {
//       setSize(size + 1);
//     }
//   };

//   const refetch = () => {
//     mutateData();
//   };

//   return {
//     products,
//     isLoading,
//     isFetching: isValidating,
//     isError: !!error,
//     error: error?.message || null,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage: isValidating,
//     refetch,
//   };
// };

// // Hook for adding products to cart (if needed)
// export const useAddToCart = () => {
//   const addToCart = async (productData: any) => {
//     const response = await fetch('/api/cart', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(productData),
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to add to cart');
//     }
    
//     // Invalidate cart data using SWR mutate
//     mutate('/api/cart');
    
//     return response.json();
//   };

//   return { mutate: addToCart };
// };

// // Utility function to prefetch product data
// export const usePrefetchProduct = () => {
//   return (id: string) => {
//     // Prefetch using SWR's mutate
//     mutate(`/api/product/${id}`, async () => {
//       const res = await fetch(`/api/product/${id}`);
//       const json = await res.json();
      
//       if (!res.ok || !json?.success) {
//         throw new Error(json?.error || 'Failed to fetch product');
//       }
      
//       return json.data;
//     });
//   };
// };
