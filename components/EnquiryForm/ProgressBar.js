export function ProgressBar({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-3 md:mb-6 space-y-1.5 md:space-y-2">
      <div className="flex justify-between text-xs md:text-sm text-gray-400">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <div className="relative">
        <div className="h-2 md:h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span
          className={`${
            currentStep >= 1 ? "text-blue-400 font-medium" : ""
          } text-center flex-1`}
        >
          <span className="hidden sm:inline">Personal Info</span>
          <span className="sm:hidden">Personal</span>
        </span>
        <span
          className={`${
            currentStep >= 2 ? "text-blue-400 font-medium" : ""
          } text-center flex-1`}
        >
          <span className="hidden sm:inline">Games & Controllers</span>
          <span className="sm:hidden">Games</span>
        </span>
        <span
          className={`${
            currentStep >= 3 ? "text-blue-400 font-medium" : ""
          } text-center flex-1`}
        >
          <span className="hidden sm:inline">Address & Time</span>
          <span className="sm:hidden">Schedule</span>
        </span>
      </div>
    </div>
  );
}
