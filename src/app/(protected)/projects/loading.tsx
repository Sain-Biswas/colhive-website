import LoadingSpinner from "@/components/general/loading-spinner";

export default function LoadingState() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <LoadingSpinner isVisible className="size-5" />
        <p>Loading</p>
      </div>
    </main>
  );
}
