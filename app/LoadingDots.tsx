export default function LoadingDots() {
  return (
    <div className="flex space-x-2">
      <div className="bg-zinc-500 rounded-full w-3 h-3 animate-dot1"></div>
      <div className="bg-zinc-500 rounded-full w-3 h-3 animate-dot2"></div>
      <div className="bg-zinc-500 rounded-full w-3 h-3 animate-dot3"></div>
    </div>
  );
}
