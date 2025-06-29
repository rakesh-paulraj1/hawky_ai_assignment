import Image from "next/image";
interface Campaign2Props {
  image: string;
  catchyTitle: string;
  productDescription: string;
  keyFeatures: string[];
  companyName: string;
  productName: string;
}

export function Campaign2({ image, catchyTitle, productDescription, keyFeatures, companyName, productName }: Campaign2Props) {
  console.log("CN"+companyName,"PN"+productName,productDescription);
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-black w-full py-4 px-8 flex items-center">
        <span className="text-2xl font-bold text-[#e02b20] tracking-widest">
          {companyName}
        </span>
      </div>

      {/* Hero Section */}
      <div
        className="w-full flex flex-col items-center justify-center relative"
        style={{
          background: 'url(https://www.transparenttextures.com/patterns/brick-wall.png), #e5e5e5',
          backgroundSize: 'auto',
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl py-8 md:py-16 relative">
          {/* Bike Image */}
          <div className="flex-1 flex justify-center items-center">
          <Image 
                  width={0}
                  height={0}
                  src={image} 
                  alt="Product" 
                  className="w-full h-auto rounded-xl"
                  style={{ width: '100%', height: 'auto' }}
                />
          </div>
          {/* Product Description */}
          <div className="flex-1 flex flex-col items-center md:items-end justify-center mt-8 md:mt-0">
            <div className="bg-white bg-opacity-80 rounded-lg p-6 shadow-md text-right">
              <div className="text-lg font-medium text-gray-700 mb-1">{catchyTitle}</div>
              <div className="text-base text-gray-900 mb-2">{productDescription}</div>
              <div className="text-base text-gray-700 mb-2 font-semibold">{productName}</div>
              <ul className="list-disc ml-4 text-gray-700">
                {keyFeatures.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Book Test Ride Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Your Free Test Ride</h2>
          <p className="text-lg text-gray-700 mb-8">
            Complete the form and take one step closer to the first of many mesmerizing rides
          </p>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Tell us about your interest..."
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
} 