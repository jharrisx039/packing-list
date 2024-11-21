import PackingListForm from "@/components/packing-list-form";

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6 gap-2">
        <h1 className="text-xl font-semibold">New Packing List</h1>
      </div>
      <PackingListForm />
    </main>
  );
}