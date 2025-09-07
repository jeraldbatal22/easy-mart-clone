import { Progress } from "@/components/ui/progress";

export const LoadingScreen = () => {
  window.location.href = "/"
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="bg-white rounded-2xl p-12 shadow-lg text-center max-w-md">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">EM</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-primary-500">EasyMart</span>
          </div>
        </div>
        <div className="text-lg text-gray-700 mb-6">
          We are customizing your experience
        </div>
        <div className="w-full">
          <Progress value={75} className="h-2" />
        </div>
      </div>
    </div>
  );
};
