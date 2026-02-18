import { ArrowRight, BrainCircuit, FileSearch, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, to, gradient }) => (
    <Link
        to={to}
        className="group relative p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden"
    >
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${gradient}`} />
        <div className={`mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-10`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
            {title}
        </h3>
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
            {description}
        </p>
    </Link>
);

export default function Home() {
    return (
        <div className="pt-32 pb-20 container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-20 relative z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -z-10" />

                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight leading-tight">
                    Your Personal<br />AI Study Companion
                </h1>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Master any subject with ease using our intelligent tools. Generate explanations, summarize notes, and test your knowledge instantly.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/explain"
                        className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-xl shadow-white/10"
                    >
                        Start Learning <ArrowRight className="w-5 h-5" />
                    </Link>
                    <a
                        href="#features"
                        className="px-8 py-4 bg-slate-800 text-white rounded-full font-semibold hover:bg-slate-700 transition-colors border border-white/10"
                    >
                        Explore Features
                    </a>
                </div>
            </div>

            <div id="features" className="grid md:grid-cols-3 gap-6">
                <FeatureCard
                    to="/explain"
                    icon={BrainCircuit}
                    title="Smart Explanations"
                    description="Get clear, simple explanations for complex concepts tailored to your learning style."
                    gradient="from-blue-500 to-cyan-500"
                />
                <FeatureCard
                    to="/summarize"
                    icon={FileSearch}
                    title="Instant Summaries"
                    description="Turn lengthy notes and articles into concise, easy-to-digest summaries in seconds."
                    gradient="from-purple-500 to-pink-500"
                />
                <FeatureCard
                    to="/quiz"
                    icon={HelpCircle}
                    title="AI Quizzes"
                    description="Test your knowledge with automatically generated quizzes and flashcards."
                    gradient="from-orange-500 to-red-500"
                />
            </div>
        </div>
    );
}
