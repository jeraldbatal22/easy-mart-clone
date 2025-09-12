import type { Metadata } from "next";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

// Generate metadata for product pages
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const productId = params.id;

  try {
    // Fetch product data for metadata
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/product/${productId}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return {
        title: "Product Not Found | Easy Mart",
        description: "The requested product could not be found. Browse our collection of fresh groceries and quality products.",
      };
    }

    const data = await response.json();
    const product = data.data;

    if (!product) {
      return {
        title: "Product Not Found | Easy Mart",
        description: "The requested product could not be found. Browse our collection of fresh groceries and quality products.",
      };
    }

    const productName = product.name || "Product";
    const productDescription = product.description || `Shop ${productName} at Easy Mart. Fresh, quality products with competitive prices and fast delivery.`;
    const productPrice = typeof product.price === 'number' ? `Php ${product.price.toFixed(2)}` : product.price || '';
    const productImage = product.image || '/assets/images/product/product-1.png';
    const productCategory = product.groceryCategory || 'groceries';

    return {
      title: `${productName} | ${productPrice} | Easy Mart`,
      description: productDescription,
      keywords: [
        productName.toLowerCase(),
        productCategory.toLowerCase(),
        "grocery",
        "fresh",
        "quality",
        "online shopping",
        "easy mart",
        "best price",
        "fast delivery"
      ],
      authors: [{ name: "Easy Mart" }],
      creator: "Easy Mart",
      publisher: "Easy Mart",
      metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
      alternates: {
        canonical: `/products/${productId}`,
      },
      openGraph: {
        title: `${productName} | ${productPrice}`,
        description: productDescription,
        url: `/products/${productId}`,
        siteName: 'Easy Mart',
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: productName,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${productName} | ${productPrice}`,
        description: productDescription,
        images: [productImage],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'product:price:amount': productPrice,
        'product:price:currency': 'PHP',
        'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
        'product:condition': 'new',
        'product:brand': 'Easy Mart',
        'product:category': productCategory,
      },
    };
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return {
      title: "Product | Easy Mart",
      description: "Browse our collection of fresh groceries and quality products at Easy Mart.",
    };
  }
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return <>{children}</>;
}
