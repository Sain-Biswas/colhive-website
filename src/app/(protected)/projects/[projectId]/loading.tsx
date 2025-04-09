import LoadingSpinner from "@/components/general/loading-spinner";

export default function SingleProjectPageLoading() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex items-center justify-center">
        <LoadingSpinner isVisible className="size-5" />
        <p>Loading</p>
      </div>
    </main>
  );
}
