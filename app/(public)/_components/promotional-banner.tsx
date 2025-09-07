import { Button } from "@/components/ui/button";
import { ProductCard } from "../../../components/common/product/product-card";

interface PromotionalBannerProps {
  offer: string;
  title: string;
  tags?: string[];
  showMetrics?: boolean;
  showOrderButton?: boolean;
  products: Array<{
    id: string;
    name: string;
    image: string;
    price: string;
    originalPrice?: string;
    unit: string;
    stock: string;
    isVerified?: boolean;
  }>;
}

export const PromotionalBanner = ({
  products,
  offer,
  title,
  tags = [],
  showMetrics = false,
  showOrderButton = false,
}: PromotionalBannerProps) => {
  return (
    <section className="py-8">
      <div className="flex flex-col lg:flex-row gap-5 px-4 sm:px-6 lg:px-8">
        {/* Product Cards */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products?.slice(0, 3).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        {/* Banner Content */}
        <div className="w-full lg:w-1/3 rounded-2xl p-6 sm:p-8 text-center flex flex-col justify-center items-center bg-gray-50 mt-6 lg:mt-0">
          <div className="text-primary-600 text-sm font-medium mb-2">
            {offer}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{title}</h2>

          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {showMetrics && (
            <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-8 space-y-4 sm:space-y-0 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">1k+</div>
                <div className="text-sm text-gray-600">Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">20</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">30%</div>
                <div className="text-sm text-gray-600">Up to offers</div>
              </div>
            </div>
          )}

          {showOrderButton && (
            <Button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full text-lg font-medium w-full sm:w-auto">
              Order Now &gt;
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
