import CreateWrapForm from "@/components/create-wrap-form";

export default function CreateWrapPage() {
    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Create New Memory Wrap</h1>
                <p className="text-gray-600">Collecting memories for your 2025 wrap? Let's set it up.</p>
            </div>

            <CreateWrapForm />
        </div>
    );
}
