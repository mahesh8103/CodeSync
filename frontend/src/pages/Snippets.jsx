import { useState, useEffect } from "react";
import { BookMarked, Plus, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

import { snippetAPI } from "../api/snippetAPI.js";
import Navbar from "../components/common/Navbar.jsx";
import Loader from "../components/common/Loader.jsx";
import SnippetCard from "../components/snippets/SnippetCard.jsx";
import CreateSnippetModal from "../components/snippets/CreateSnippetModal.jsx";
import ViewSnippetModal from "../components/snippets/ViewSnippetModal.jsx";
import { useSelector } from "react-redux";

const LANGUAGES = [
    "all", "javascript", "python", "java", "cpp", "c",
    "typescript", "go", "rust", "php", "ruby"
];

const Snippets = () => {
    const { user } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState("my");
    const [snippets, setSnippets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterLang, setFilterLang] = useState("all");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewingSnippet, setViewingSnippet] = useState(null);

    useEffect(() => {
        let isCancelled = false;

        const fetchSnippets = async () => {
            setLoading(true);
            try {
                let response;
                if (activeTab === "my") {
                    response = await snippetAPI.getMySnippets();
                } else {
                    const lang = filterLang === "all" ? null : filterLang;
                    response = await snippetAPI.getPublicSnippets(lang);
                }
                if (!isCancelled) {
                    setSnippets(response.data || []);
                }
            } catch (error) {
                if (!isCancelled) {
                    toast.error("Failed to fetch snippets");
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchSnippets();

        return () => {
            isCancelled = true;
        };
    }, [activeTab, filterLang]);

    const handleCreated = (newSnippet) => {
        if (activeTab === "my") {
            setSnippets((prev) => [newSnippet, ...prev]);
        }
    };

    const handleDelete = async (id) => {
        try {
            await snippetAPI.deleteSnippet(id);
            setSnippets((prev) => prev.filter((s) => s._id !== id));
            toast.success("Snippet deleted");
        } catch (error) {
            toast.error("Failed to delete snippet");
        }
    };

    const filteredSnippets = snippets.filter((s) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            s.title.toLowerCase().includes(q) ||
            s.description?.toLowerCase().includes(q) ||
            s.tags?.some((tag) => tag.toLowerCase().includes(q))
        );
    });

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <BookMarked className="w-7 h-7 text-primary" />
                            Code Snippets
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Save and share your code with the community
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition font-semibold"
                    >
                        <Plus className="w-4 h-4" />
                        New Snippet
                    </button>
                </div>

                <div className="flex gap-1 border-b border-dark-border mb-6">
                    <button
                        onClick={() => setActiveTab("my")}
                        className={`px-4 py-2 font-medium transition ${
                            activeTab === "my"
                                ? "text-primary border-b-2 border-primary"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        My Snippets
                    </button>
                    <button
                        onClick={() => setActiveTab("public")}
                        className={`px-4 py-2 font-medium transition ${
                            activeTab === "public"
                                ? "text-primary border-b-2 border-primary"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Public Feed
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, description, or tags..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                        />
                    </div>

                    {activeTab === "public" && (
                        <div className="relative">
                            <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <select
                                value={filterLang}
                                onChange={(e) => setFilterLang(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-lg focus:border-primary focus:outline-none text-white"
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang === "all" ? "All Languages" : lang}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <Loader size="lg" text="Loading snippets..." />
                    </div>
                )}

                {!loading && filteredSnippets.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-dark-border rounded-xl">
                        <BookMarked className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">
                            {search
                                ? "No snippets match your search"
                                : activeTab === "my"
                                    ? "No snippets yet"
                                    : "No public snippets available"}
                        </h3>
                        {activeTab === "my" && !search && (
                            <>
                                <p className="text-gray-500 mb-6">
                                    Save your favorite code as snippets for quick access
                                </p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-6 py-2 bg-primary hover:bg-primary-dark rounded-lg transition"
                                >
                                    Create Your First Snippet
                                </button>
                            </>
                        )}
                    </div>
                )}

                {!loading && filteredSnippets.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSnippets.map((snippet) => (
                            <SnippetCard
                                key={snippet._id}
                                snippet={snippet}
                                isOwner={snippet.createdBy?._id === user?._id}
                                onView={(s) => setViewingSnippet(s)}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateSnippetModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={handleCreated}
                />
            )}

            {viewingSnippet && (
                <ViewSnippetModal
                    snippet={viewingSnippet}
                    onClose={() => setViewingSnippet(null)}
                />
            )}
        </div>
    );
};

export default Snippets;