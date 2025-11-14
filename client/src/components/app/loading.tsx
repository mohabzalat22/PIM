const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="w-12 h-12 border-4 border-muted border-t-green-500 rounded-full animate-spin" />
      <p className="mt-4 text-sm font-medium text-green-600">Loading...</p>
    </div>
  );
};

export default Loading;
