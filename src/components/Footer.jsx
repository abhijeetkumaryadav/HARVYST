export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0B2E1B] via-[#103A24] to-[#0B2E1B] text-white">

      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* Footer Logo */}
          <div className="flex-shrink-0">
            <img
              src="/footer.png"
              alt="HARVYST"
              className="w-72 h-auto object-contain"
            />
          </div>

          {/* Right Text */}
          <div className="text-center lg:text-right">

            <h2 className="text-xl lg:text-2xl font-semibold leading-snug">
              We don't just build solutions,
            </h2>

            <p className="mt-1 text-xl lg:text-2xl font-semibold leading-snug">
              we build a{" "}
              <span className="text-green-400">
                better future
              </span>{" "}
              together.
            </p>

          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-green-900/40" />

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">

          <p className="text-sm text-gray-400">
            © 2026 HARVYST. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-400">

            <a
              href="/about"
              className="hover:text-white transition-colors duration-300"
            >
              About Us
            </a>

            {/* Only Contact Us added – Privacy, Terms, Support removed */}
            <a
              href="/contact"
              className="hover:text-white transition-colors duration-300"
            >
              Contact Us
            </a>

          </div>

        </div>
      </div>

    </footer>
  );
}