# SWR Implementation for Product Fetching

This directory contains custom hooks that implement stale-while-revalidate (SWR) for fetching product data in the Easy Mart Clone application.

## Overview

SWR (stale-while-revalidate) is a data fetching strategy that:
- Returns cached data immediately (stale)
- Fetches fresh data in the background
- Updates the UI when fresh data arrives
- Provides better user experience with instant loading

## Files

### `useProducts.ts`
Main hook for fetching product lists with pagination and filtering.

**Features:**
- Pagination support
- Category filtering
- Automatic data transformation
- Error handling and retry logic
- Loading states
- Manual refresh capability

**Usage:**
```typescript
const {
  products,
  pagination,
  isLoading,
  error,
  refresh
} = useProducts({
  page: 1,
  limit: 6,
  category: 'fruits',
  enabled: true
});
```

### `useProduct.ts`
Hook for fetching individual product details.

**Features:**
- Single product fetching
- Automatic data transformation
- Error handling and retry logic
- Loading states

**Usage:**
```typescript
const {
  product,
  isLoading,
  error,
  mutate
} = useProduct('product-id');
```

## SWR Configuration

The SWR configuration is set up in `lib/providers/SWRProvider.tsx` with the following settings:

- **Cache Duration**: 5 minutes (`dedupeInterval: 300000`)
- **Stale While Revalidate**: 10 minutes (configured via API cache headers)
- **Deduplication**: 2 seconds (`dedupeInterval: 2000`)
- **Retry Logic**: 3 attempts with 5-second intervals
- **Focus Revalidation**: Enabled with 5-second throttling

## API Cache Headers

The product API endpoints include appropriate cache headers:

```http
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
ETag: "products-{page}-{limit}-{category}"
```

- `s-maxage=300`: Cache for 5 minutes
- `stale-while-revalidate=600`: Serve stale data for up to 10 minutes while revalidating

## Benefits

1. **Improved Performance**: Instant loading from cache
2. **Better UX**: No loading spinners for cached data
3. **Reduced Server Load**: Fewer API calls due to caching
4. **Automatic Updates**: Fresh data fetched in background
5. **Error Resilience**: Automatic retry on failures
6. **Focus Revalidation**: Updates when user returns to tab

## Migration from useEffect

The implementation replaces traditional `useEffect` + `useState` patterns:

**Before:**
```typescript
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, [dependencies]);
```

**After:**
```typescript
const { products, isLoading, error } = useProducts({
  page: 1,
  limit: 6
});
```

## Testing

Test files are located in `lib/hooks/__tests__/` and can be run with:

```bash
npm test useProducts
```

## Future Enhancements

- [ ] Add optimistic updates for cart operations
- [ ] Implement infinite scrolling with SWR
- [ ] Add offline support with SWR
- [ ] Implement real-time updates with WebSocket integration
