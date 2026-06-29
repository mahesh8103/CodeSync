import { Link } from "react-router-dom";
import { Code2, Users, Zap, Shield } from "lucide-react";


const Landing = () => {
    return (
        
        <div className="min-h-screen bg-dark-bg text-white">

            {/* Navbar */}
            <nav className="border-b border-dark-border px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Code2 className="w-8 h-8 text-primary" />
                        <span className="text-2xl font-bold">CodeSync</span>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-gray-300 hover:text-white transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Code Together,
                        <span className="text-primary"> Build Faster</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Real-time collaborative code editor for developers.
                        Share a link, code together, run instantly.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition"
                        >
                            Start Coding Free
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3 border border-dark-border hover:border-primary rounded-lg font-semibold transition"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="px-6 py-16 bg-dark-card">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Why CodeSync?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">

                        <div className="p-6 border border-dark-border rounded-lg hover:border-primary transition">
                            <Users className="w-12 h-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Real-Time Collaboration
                            </h3>
                            <p className="text-gray-400">
                                Multiple developers can code together in shared rooms with instant sync.
                            </p>
                        </div>

                        <div className="p-6 border border-dark-border rounded-lg hover:border-primary transition">
                            <Zap className="w-12 h-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Instant Code Execution
                            </h3>
                            <p className="text-gray-400">
                                Run code in 10+ languages directly in your browser. No setup needed.
                            </p>
                        </div>

                        <div className="p-6 border border-dark-border rounded-lg hover:border-primary transition">
                            <Shield className="w-12 h-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Secure & Private
                            </h3>
                            <p className="text-gray-400">
                                Private rooms with password protection and secure authentication.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-8 border-t border-dark-border">
                <div className="max-w-7xl mx-auto text-center text-gray-400">
                    <p>© 2025 CodeSync. Built with ❤️ for developers.</p>
                </div>
            </footer>

        </div>
    );
};

export default Landing;