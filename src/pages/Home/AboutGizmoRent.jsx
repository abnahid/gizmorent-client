

const AboutGizmoRent = () => {
  const steps = [
    {
      title: "Browse & Choose",
      description: "Explore a wide range of gadgets including laptops, projectors, and more — all available for flexible rent.",
      image: "https://i.ibb.co.com/BHjjZGtW/smiling-artist-holding-red-speech-bubble-advertising-text-messages-cardboard-studio-pink-background.jpg",
    },
    {
      title: "Rent with Ease",
      description: "Select your gadget, choose the rental duration, and get it delivered straight to your door hassle-free.",
      image: "https://i.ibb.co.com/7tB2SSV3/portrait-happy-delivery-man-uniform-bicycle-near-modern-house-with-yellow-backpack.jpg",
    },
    {
      title: "Use & Return",
      description: "Enjoy high-performance gadgets for work or entertainment, then return when you're done. Simple and affordable.",
      image: "https://i.ibb.co.com/pvVFTCX6/happy-deliveryman-standing-near-customer-with-tablet-professional-postman-red-uniform-holding-boxes.jpg", 
    }
    
  ];

  return (
    <section className="text-center max-sm:mt-[150px]  pt-4 ">
      <h2 className="text-Primary font-semibold tracking-wide">HOW IT WORKS</h2>
      <h1 className="text-Primary text-3xl sm:text-4xl font-bold mt-2">
       Scroll Details, Submit Order for Rent & Get your Desires
      </h1>
      <p className="text-gray-600 mt-3 max-w-xl mx-auto">
        From your home you can choose gadgets & get through Home Delivery.
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            <h3 className="text-xl text-Primary font-bold mt-4">{step.title}</h3>
            <p className="text-gray-600 mt-2">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutGizmoRent;