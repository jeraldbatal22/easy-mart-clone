"use client";

import { Footer, Header } from "../../_components";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Star,
  BadgeCheck,
  // ShoppingCart,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { LoadingSkeleton } from "@/components/common/LoadingSpinner";
import { AddToCartButton } from "@/components/common/product/add-to-cart-button";
import { useCart } from "@/lib/hooks/useCart";

type UIProduct = {
  id: string;
  name: string;
  image: string;
  price: string;
  originalPrice?: string;
  unit: string;
  stock: string;
  description?: string;
};

const fallbackImage = "/assets/images/product/product-1.png";

const ProductViewPage = () => {
  const params = useParams<{ id: string }>();
  const productId = useMemo(() => String(params?.id ?? ""), [params]);

  const [product, setProduct] = useState<UIProduct | null>(null);
  const [related, setRelated] = useState<UIProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [images, setImages] = useState<string[]>([]);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const {
    // addItemToCart,
    // incrementQuantity,
    // decrementQuantity,
    // getItemQuantity,
    isItemInCart,
    items,
  } = useCart();
  console.log(items)

  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        if (!productId) throw new Error("Missing product id");

        // Fetch single product by id
        const res = await fetch(`/api/product/${productId}`);
        const json = await res.json();
        if (!res.ok || !json?.success)
          throw new Error(json?.error || "Failed to fetch product");

        const p = json?.data ?? null;
        const toUi = (p: any): UIProduct => ({
          ...p,
          id: String(p?.id || p?._id || ""),
          name: String(p?.name || "Unnamed product"),
          image: String(p?.image || fallbackImage),
          originalPrice:
            typeof p?.originalPrice === "number"
              ? `Php ${p.originalPrice.toFixed(2)}`
              : p?.originalPrice
              ? String(p.originalPrice)
              : undefined,
          unit: String(p?.unit || "each"),
          stock: p.stock,
          description: String(p?.description || ""),
        });
        console.log(json);
        if (!isCancelled) {
          const ui = p ? toUi(p) : null;
          setProduct(ui);
          const gallery = [ui?.image];
          setImages(gallery as any);

          // Fetch related products by same grocery category, if available
          if (p?.groceryCategory) {
            const relRes = await fetch(
              `/api/product?groceryCategory=${encodeURIComponent(
                p.groceryCategory
              )}&limit=12&page=1`
            );
            const relJson = await relRes.json();
            if (relRes.ok && relJson?.success && Array.isArray(relJson.data)) {
              const relatedItems = relJson.data
                .filter(
                  (rp: any) => String(rp.id || rp._id) !== String(p.id || p._id)
                )
                .slice(0, 6)
                .map(toUi);
              setRelated(relatedItems);
            } else {
              setRelated([]);
            }
          } else {
            setRelated([]);
          }
        }
      } catch (err: any) {
        if (!isCancelled) setError(err?.message || "Something went wrong");
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [productId]);

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity((q) => q + 1);
  console.log(product);
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/" className="hover:text-primary-600">
                Products
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-800 truncate max-w-[60vw] sm:max-w-none">
              {product?.name || "Product"}
            </li>
          </ol>
        </nav>

        {isLoading ? (
          <div className="space-y-6">
            <LoadingSkeleton lines={1} columns={2} itemClassName="h-96" />
            <LoadingSkeleton lines={1} columns={2} itemClassName="h-32" />
            <LoadingSkeleton lines={1} columns={3} itemClassName="h-32" />
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
            {error}
          </div>
        ) : !product ? (
          <div className="flex items-center justify-center py-24 text-gray-500">
            Product not found.
          </div>
        ) : (
          <div className="space-y-12">
            {/* Top: Gallery + Summary */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gallery */}
              <div className=" flex flex-col bg-gray-50 rounded-2xl border border-gray-100 p-4 sm:p-6 items-center justify-center">
                <div className="relative w-full h-72 xs:h-80 sm:h-60">
                  <Image
                    src={
                      images[activeImageIdx] || product.image || fallbackImage
                    }
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                {/* Thumbnails */}
                <div className="w-full mt-4 flex items-center justify-center gap-3">
                  {images.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative h-14 w-14 rounded-lg border ${
                        activeImageIdx === idx
                          ? "border-primary-500 ring-2 ring-primary-200"
                          : "border-gray-200"
                      } bg-white overflow-hidden`}
                      aria-label={`Image ${idx + 1}`}
                    >
                      <Image
                        src={src}
                        alt={`thumb-${idx}`}
                        fill
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Badges */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 text-xs">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200 px-2.5 py-1 text-xs">
                    Best Seller
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {product.name}
                </h1>

                {/* Ratings */}
                <div className="flex items-center gap-2 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-gray-600">4.0 (128 reviews)</span>
                </div>

                <div className="flex items-center gap-3">
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price}
                  </span>
                </div>

                <div className="text-sm text-gray-600">{product.unit}</div>
                {product.stock && (
                  <div className="text-sm font-medium text-primary-600">
                    {product.stock}
                  </div>
                )}

                {/* Quantity + CTA */}
                <div className="flex items-center gap-4 pt-2">
                  {!isItemInCart(product.id) ? (
                    <>
                      <div className="inline-flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button
                          type="button"
                          onClick={handleDecrease}
                          className="px-3 py-2 text-gray-700 hover:bg-gray-50"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <div className="px-4 py-2 min-w-10 text-center text-gray-900">
                          {quantity}
                        </div>
                        <button
                          type="button"
                          onClick={handleIncrease}
                          className="px-3 py-2 text-gray-700 hover:bg-gray-50"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <AddToCartButton
                        productId={product.id}
                        productName={product.name}
                        price={Number(product.price)}
                        originalPrice={Number(product.originalPrice || 0)}
                        unit={product.unit}
                        image={product.image}
                        stock={Number(product.stock)}
                        size="sm"
                        className="text-xs"
                        quantityProps={quantity}
                      />
                    </>
                  ) : (
                    <span className="text-gray-600">Already In Cart</span>
                  )}

                  {/* <Button className="rounded-full px-6 bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Add To Cart
                  </Button> */}
                </div>

                {/* About Product */}
                <div className="mt-1 border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-gray-900">
                      About Product
                    </div>
                    <Link
                      href="#"
                      className="text-xs text-gray-600 hover:text-primary-600 inline-flex items-center gap-1"
                    >
                      View More <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-700">
                      <BadgeCheck className="h-4 w-4 text-primary-600" /> Best
                      Seller Product
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <ShieldCheck className="h-4 w-4 text-primary-600" /> 100%
                      satisfaction guarantee
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Customer Reviews + Reviews */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Reviews histogram */}
              <div className="space-y-3 lg:col-span-1">
                <h2 className="text-sm font-semibold text-gray-900">
                  Customer Reviews
                </h2>
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <div className="text-xs text-gray-600 mb-4">
                    Average rating: 4.5 (5391)
                  </div>
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-3 py-1">
                      <span className="w-4 text-xs text-gray-600">{stars}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500"
                          style={{ width: `${stars * 16}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-xs text-gray-600">
                        4.28K
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews list */}
              <div className="space-y-3 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Reviews
                  </h2>
                  <button className="text-xs text-gray-600 hover:text-primary-600 inline-flex items-center gap-1">
                    Recent <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-5">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="border-b last:border-none border-gray-100 pb-4 last:pb-0"
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        Perfect Combination!!
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`h-3.5 w-3.5 ${
                              j < 4
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-xs leading-5 text-gray-700">
                        This review was collected as part of a promotion[...]
                        Great product!! See the attached photos from my last
                        purchase!
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Highlights + Nutrition + Specs */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Highlights */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Highlights
                </h2>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6">
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li>Fresh and carefully sourced ingredients</li>
                    <li>Quality checked and sealed for safety</li>
                    <li>Perfect for daily meals and snacks</li>
                    <li>Great value for money</li>
                  </ul>
                </div>
              </div>

              {/* Nutrition */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Nutrition
                </h2>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Calories</span>
                      <span className="font-medium">210</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Protein</span>
                      <span className="font-medium">5g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carbs</span>
                      <span className="font-medium">36g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fat</span>
                      <span className="font-medium">6g</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Specifications
                </h2>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6">
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Brand</span>
                      <span className="font-medium">Easy Mart</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-medium">1 kg</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Origin</span>
                      <span className="font-medium">Local</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Shelf Life</span>
                      <span className="font-medium">7 days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Collapsible sections */}
            <section className="space-y-2">
              <details
                open
                className="group border border-gray-100 rounded-2xl p-4"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm font-semibold text-gray-900">
                    Details
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </details>
              <details className="group border border-gray-100 rounded-2xl p-4">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm font-semibold text-gray-900">
                    Conservation and storage
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-gray-700">
                  Keep refrigerated. Consume within 3 days after opening.
                </p>
              </details>
              <details className="group border border-gray-100 rounded-2xl p-4">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm font-semibold text-gray-900">
                    Ingredients
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-gray-700">
                  Ingredients list will appear here.
                </p>
              </details>
            </section>

            {/* Related products */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recommendations
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {related.map((p) => (
                  <a
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full h-28 xs:h-32 sm:h-36 bg-primary-50 rounded-xl flex items-center justify-center mb-2 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 640px) 50vw, 200px"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
                        {p.name}
                      </div>
                      <div className="flex items-center gap-2">
                        {p.originalPrice && (
                          <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                            {p.originalPrice}
                          </span>
                        )}
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">
                          {p.price}
                        </span>
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500">
                        {p.unit}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Customer reviews
                </h2>
                <span className="text-sm text-gray-600">
                  4.0 average • 128 reviews
                </span>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-gray-100 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        <div className="text-sm font-medium text-gray-900">
                          User {i}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`h-4 w-4 ${
                              j < 4
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                      Great quality and quick delivery. Will order again!
                    </p>
                  </div>
                ))}
              </div>

              <div className="border border-gray-100 rounded-2xl p-4 sm:p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">
                  Write a review
                </h3>
                <form className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your name"
                    />
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Email (optional)"
                    />
                  </div>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24 resize-y focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Share your thoughts…"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-gray-300" />
                      ))}
                    </div>
                    <Button type="button" className="rounded-full">
                      Submit review
                    </Button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductViewPage;
