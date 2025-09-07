import { Button } from "@/components/ui/button";

export const FreshnessGuaranteeCard = () => {
  return (
    <div className="bg-purple-600 rounded-xl p-6 text-white h-full flex flex-col justify-between">
      <div>
        <div className="text-sm font-medium mb-2">Freshness Guarantee</div>
        <div className="text-2xl font-bold mb-4">Weekly sold 1k+</div>
      </div>
      <Button className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-6 py-2 text-sm font-medium">
        View More →
      </Button>
    </div>
  );
};
