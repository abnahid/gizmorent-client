import AboutGizmoRent from "./AboutGizmoRent";
import BookYourGadgets from "./BookYourGadgets";
import CategorySlider from "./CategorySlider";

import TopRented from "./TopRented";
import Testimonial from "./Testimonial";
import FAQs from "./FAQs";
import FilterBar from "./FilterBar";
import RealTimeBooking from "./RealTimeBooking";
import SimpleSlider from "./SimpleSlider";
import TopContributor from "./TopContributor";

const Home = () => {
  return (
    <div className="relative ">
      <SimpleSlider></SimpleSlider>
      <main className="space-y-10 w-11/12 mx-auto max-w-7xl">
        <FilterBar />
        <CategorySlider></CategorySlider>
        <TopRented></TopRented>
<RealTimeBooking></RealTimeBooking>
        <AboutGizmoRent></AboutGizmoRent>
        
        <TopContributor></TopContributor>
        <Testimonial></Testimonial>

        <BookYourGadgets></BookYourGadgets>
        <FAQs />
      </main>
    </div>
  );
};

export default Home;
