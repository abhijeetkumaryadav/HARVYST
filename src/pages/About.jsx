import { Link } from "react-router-dom";
import {
    FaLeaf,
    FaCheckCircle,
    FaHands,
    FaSeedling,
    FaShieldAlt,
    FaLightbulb,
    FaGlobe,
    FaRecycle,
    FaArrowRight,
    FaQuoteLeft,
    FaTree,
    FaWater,
    FaSun,
    FaHeart,
} from "react-icons/fa";

export default function About() {
    const values = [
        {
            icon: FaShieldAlt,
            title: "Quality First",
            desc: "We never compromise on quality. Every product is carefully selected and tested.",
            color: "from-emerald-500 to-green-600",
        },
        {
            icon: FaLightbulb,
            title: "Honesty & Transparency",
            desc: "We believe in open communication and transparent practices with our customers.",
            color: "from-amber-400 to-orange-500",
        },
        {
            icon: FaGlobe,
            title: "Knowledge Sharing",
            desc: "We empower our community with expert guidance and farming knowledge.",
            color: "from-blue-400 to-indigo-500",
        },
        {
            icon: FaRecycle,
            title: "Sustainability",
            desc: "We are committed to eco-friendly products and sustainable agriculture.",
            color: "from-teal-400 to-emerald-500",
        },
    ];

    const features = [
        { icon: FaLeaf, title: "100% Organic", desc: "Pure & Natural Products" },
        { icon: FaCheckCircle, title: "Trusted Quality", desc: "Carefully Tested & Verified" },
        { icon: FaHands, title: "Farmer First", desc: "Built for Farmers, By Farmers" },
        { icon: FaSeedling, title: "Better Tomorrow", desc: "Sustainable for Future Generations" },
    ];

    return (
        <div className="bg-white overflow-hidden">
            {/* ===== HERO SECTION ===== */}
            <section className="relative bg-gradient-to-br from-emerald-50 via-white to-green-50 py-20 md:py-28 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-emerald-100/70 backdrop-blur-sm px-5 py-2 rounded-full border border-emerald-200/50 mb-6">
                            <FaLeaf className="text-emerald-600 text-sm" />
                            <span className="text-sm font-medium text-emerald-800">Rooted in Nature</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
                            <span className="text-gray-800">Rooted in</span>
                            <br />
                            <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                                Nature.
                            </span>
                        </h1>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-700 mt-2">
                            Focused on <span className="text-emerald-600">You.</span>
                        </h2>

                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mt-6 leading-relaxed">
                            HARVYST is more than a store – we are a movement towards sustainable agriculture.
                            Our mission is to empower farmers, gardeners and agri-enthusiasts with premium
                            quality products, knowledge and support to grow a better tomorrow.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3.5 rounded-full font-medium shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Explore Products
                                <FaArrowRight className="text-sm" />
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-full font-medium hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-300"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURE BOXES ===== */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {features.map((item, index) => (
                            <div
                                key={index}
                                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/0 group-hover:from-emerald-50/30 group-hover:to-green-50/30 rounded-2xl transition-all duration-500" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <item.icon className="text-3xl text-emerald-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== OUR STORY ===== */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <span className="inline-block text-sm font-semibold text-emerald-600 bg-emerald-100/70 px-4 py-1.5 rounded-full mb-3">
                                Our Story
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                                From a <span className="text-emerald-600">Simple Idea</span> to a
                                <br className="hidden sm:block" /> Growing Movement
                            </h2>
                        </div>

                        <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-lg shadow-gray-100/50 border border-gray-100">
                            <FaQuoteLeft className="text-5xl text-emerald-200/60 absolute top-6 left-6" />
                            <div className="space-y-5 text-gray-600 text-lg leading-relaxed pl-6">
                                <p>
                                    HARVYST began with a simple idea – to make high-quality agricultural
                                    products accessible to everyone. We noticed the challenges farmers face
                                    in finding genuine products, expert advice and reliable support.
                                </p>
                                <p>
                                    That's why we built HARVYST – a one-stop platform that combines quality,
                                    knowledge and trust. Today, we are proud to serve thousands of farmers,
                                    gardeners and families across India, helping them grow more, naturally.
                                </p>
                            </div>
                            <div className="mt-6 flex items-center gap-3 text-emerald-700 font-medium pl-6">
                                <span className="w-10 h-0.5 bg-emerald-300" />
                                <span>— Team HARVYST</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== OUR VALUES ===== */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/40 to-transparent" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-14">
                            <span className="inline-block text-sm font-semibold text-emerald-600 bg-emerald-100/70 px-4 py-1.5 rounded-full mb-3">
                                Core Principles
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                                What <span className="text-emerald-600">Drives</span> Us
                            </h2>
                            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                                The values that guide everything we do at HARVYST.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {values.map((item, index) => (
                                <div
                                    key={index}
                                    className="group bg-gradient-to-br from-gray-50/80 to-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex items-start gap-5">
                                        <div
                                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md shadow-emerald-200/40`}
                                        >
                                            <item.icon className="text-2xl text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed mt-1">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MISSION ===== */}
            <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full border border-white/20 mb-6">
                            <FaHeart className="text-white/80 text-sm" />
                            <span className="text-sm font-medium text-white/90">Our Mission</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Growing a <span className="text-amber-200">Better</span> Tomorrow
                        </h2>

                        <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                            To empower every grower with the best products, knowledge and support
                            to grow more, naturally and sustainably.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
                            <span className="flex items-center gap-2">
                                <FaLeaf className="text-amber-200" /> 100% Natural
                            </span>
                            <span className="w-px h-5 bg-white/20" />
                            <span className="flex items-center gap-2">
                                <FaWater className="text-amber-200" /> Eco-Conscious
                            </span>
                            <span className="w-px h-5 bg-white/20" />
                            <span className="flex items-center gap-2">
                                <FaSun className="text-amber-200" /> Farmer-First
                            </span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}