import Image from "next/image";
interface Campaign3Props {
  image: string;
  catchyTitle: string;
  productDescription: string;
  keyFeatures: string[];
  companyName: string;
  productName: string;
}

export function Campaign3({ image, catchyTitle, productDescription, keyFeatures, companyName, productName }: Campaign3Props) {
  console.log("CN"+companyName,"PN"+productName,productDescription);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{companyName}</h1>
                <p className="text-pink-200 text-sm">Next-Level Marketing</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <a href="tel:+1-555-0123" className="text-white hover:text-pink-300 transition-colors duration-200 font-medium">
                📞 +1 (555) 0123
              </a>
              <a href="mailto:info@marketingpro.com" className="text-white hover:text-pink-300 transition-colors duration-200 font-medium">
                ✉️ info@marketingpro.com
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
                  🚀 REVOLUTIONARY
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                  {catchyTitle}
                </h1>
                <p className="text-xl text-pink-100 leading-relaxed max-w-lg">
                  {productDescription}
                </p>
                <div className="text-lg font-semibold text-pink-200">{productName}</div>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                      <span className="text-white font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-6">
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105">
                  🚀 Get Started Now
                </button>
                <button className="border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                  Learn More
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
              <Image 
                  width={0}
                  height={0}
                  src={image} 
                  alt="Product" 
                  className="w-full h-auto rounded-xl"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-black/20 backdrop-blur-sm py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl text-pink-100">Join thousands of successful businesses that trust MarketingPro.</p>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-white mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-white mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-bold text-white mb-3">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none"
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-white mb-3">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none resize-none"
                placeholder="Tell us about your project..."
              ></textarea>
            </div>
            <div className="text-center pt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105"
              >
                🚀 Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-pink-200">&copy; 2024 MarketingPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 