const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-olive-green to-dark-green text-off-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-wheat-brown">GrainyMart</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your trusted source for premium grains and pulses. We&apos;re committed to providing the highest quality
              organic products for a healthy lifestyle.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-wheat-brown hover:text-white transition-colors duration-200" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-wheat-brown hover:text-white transition-colors duration-200" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C8.396 0 7.996.014 6.79.067 5.584.12 4.775.302 4.084.605c-.713.306-1.318.707-1.927 1.316C1.548 2.53 1.147 3.135.841 3.848.538 4.539.356 5.348.303 6.554.25 7.76.234 8.16.234 11.783c0 3.623.016 4.023.07 5.229.053 1.206.235 2.015.538 2.706.306.713.707 1.318 1.316 1.927.609.609 1.214 1.01 1.927 1.316.691.303 1.5.485 2.706.538 1.206.053 1.606.067 5.229.067 3.623 0 4.023-.014 5.229-.067 1.206-.053 2.015-.235 2.706-.538.713-.306 1.318-.707 1.927-1.316.609-.609 1.01-1.214 1.316-1.927.303-.691.485-1.5.538-2.706.053-1.206.067-1.606.067-5.229 0-3.623-.014-4.023-.067-5.229-.053-1.206-.235-2.015-.538-2.706-.306-.713-.707-1.318-1.316-1.927C20.47 1.548 19.865 1.147 19.152.841 18.461.538 17.652.356 16.446.303 15.24.25 14.84.234 11.217.234zM9.592 2.44c3.578 0 4.008.013 5.42.078 1.274.059 1.965.27 2.406.448.58.234 1.005.516 1.447.958.442.442.724.867.958 1.447.178.441.389 1.132.448 2.406.065 1.412.078 1.842.078 5.42 0 3.578-.013 4.008-.078 5.42-.059 1.274-.27 1.965-.448 2.406-.234.58-.516 1.005-.958 1.447-.442.442-.867.724-1.447.958-.441.178-1.132.389-2.406.448-1.412.065-1.842.078-5.42.078-3.578 0-4.008-.013-5.42-.078-1.274-.059-1.965-.27-2.406-.448-.58-.234-1.005-.516-1.447-.958-.442-.442-.724-.867-.958-1.447-.178-.441-.389-1.132-.448-2.406-.065-1.412-.078-1.842-.078-5.42 0-3.578.013-4.008.078-5.42.059-1.274.27-1.965.448-2.406.234-.58.516-1.005.958-1.447.442-.442.867-.724 1.447-.958.441-.178 1.132-.389 2.406-.448 1.412-.065 1.842-.078 5.42-.078zM15.568 6.84c-.795 0-1.44.645-1.44 1.44s.645 1.44 1.44 1.44 1.44-.645 1.44-1.44-.645-1.44-1.44-1.44zm-4.351 2.796c-2.486 0-4.5 2.014-4.5 4.5s2.014 4.5 4.5 4.5 4.5-2.014 4.5-4.5-2.014-4.5-4.5-4.5zm0 7.446c-1.916 0-3.474-1.558-3.474-3.474s1.558-3.474 3.474-3.474 3.474 1.558 3.474 3.474-1.558 3.474-3.474 3.474z"/>
                </svg>
              </a>
              <a href="#" className="text-wheat-brown hover:text-white transition-colors duration-200" aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-wheat-brown">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/shop" className="text-gray-300 hover:text-white transition-colors duration-200">Shop</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-wheat-brown">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="/shipping" className="text-gray-300 hover:text-white transition-colors duration-200">Shipping Info</a></li>
              <li><a href="/returns" className="text-gray-300 hover:text-white transition-colors duration-200">Returns</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-olive-green/30 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2026 GrainyMart. All rights reserved. Made with love for healthy living.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
