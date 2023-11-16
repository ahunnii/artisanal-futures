const OnlineIndicator = () => {
  return (
    <div className="flex basis-1/3 items-center gap-2">
      <span className="text-sm text-green-500">Online</span>
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
      </span>
    </div>
  );
};

export default OnlineIndicator;
