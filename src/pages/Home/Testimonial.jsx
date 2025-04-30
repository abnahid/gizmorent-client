import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";
import useAxiosPublic from '../../Hooks/useAxiosPublic';

const Testimonial = () => {
    const [reviews, setReviews] = useState([]);
    const axiosPublic = useAxiosPublic();
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axiosPublic.get('/websitereview');
                const shuffled = res.data.sort(() => 0.5 - Math.random());
                setReviews(shuffled);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            }
        };

        fetchReviews();
    }, [axiosPublic]);

    return (
        <section className="py-8 bg-white relative my-14 rounded-lg ">
            <div className="container mx-auto px-10">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-Primary">
                        {reviews.length}+ Clients Love Exposure
                    </h2>
                </div>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                        swiper.navigation.init();
                        swiper.navigation.update();
                    }}
                    autoplay={{
                        delay: 8000,
                        disableOnInteraction: false,
                    }}
                    loop={reviews.length > 1}
                    spaceBetween={30}
                    className="mySwiper"
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review._id}>
                            <div className="rounded-lg shadow-lg flex flex-col md:flex-row  items-center">
                                {/* Left - Photo */}
                                {/* <div className="w-full flex justify-center  "> */}
                                <img
                                    src={review.photo}
                                    alt={review.name}
                                    className="rounded-lg w-[350px] h-[250px]  object-cover"
                                />
                                {/* </div> */}

                                {/* Right - Content */}
                                <div className="w-full md:w-1/2 pl-0 md:pl-8 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-sky-800 mb-4">“{review.name}”</h3>
                                    <div className="flex justify-center md:justify-start mb-4">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar
                                                key={index}
                                                className={`mr-1 text-xl ${index < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="divider"></div>
                                    <p className="text-gray-600 mb-6">
                                        {review.comment.length > 150
                                            ? review.comment.slice(0, 150) + '...'
                                            : review.comment
                                        }
                                        {" "}
                                        <span className="text-sky-600 font-semibold hover:underline cursor-pointer">
                                            Read More
                                        </span>
                                    </p>

                                    <div>
                                        {/* <h4 className="text-lg font-bold text-gray-800">{review.name}</h4> */}
                                        {review.timestamp && (
                                            <p className="text-gray-500 text-sm">
                                                {new Date(review.timestamp).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom navigation buttons */}
                <div className="absolute bottom-7 right-8 md:bottom-11 md:left-[600px]  flex z-20">
                    <div ref={prevRef} className="bg-Primary hover:bg-Secondary p-2 rounded-full shadow-md cursor-pointer mr-4">
                        <FaArrowLeft className="text-white text-md" />
                    </div>
                    <div ref={nextRef} className="bg-Primary hover:bg-Secondary p-2 rounded-full shadow-md cursor-pointer">
                        <FaArrowRight className="text-white text-md" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonial;