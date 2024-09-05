"use client";

import { useGSAP } from "@gsap/react";
import React, { useRef } from "react";
import { animateWithGsap } from "../utils/animations";
import { explore1Img, explore2Img, exploreVideo } from "../utils";
import gsap from "gsap";
import Image from "next/image";

const Features = () => {
  const videoRef = useRef();

  useGSAP(() => {
    gsap.to("#exploreVideo", {
      scrollTrigger: {
        trigger: "#exploreVideo",
        toggleActions: "play pause reverse restart",
        start: "-10% bottom",
      },
      onComplete: () => {
        videoRef.current.play();
      },
    });

    animateWithGsap("#features_title", { y: 0, opacity: 1 });
    animateWithGsap(
      ".g_grow",
      { scale: 1, opacity: 1.5, ease: "power1" },
      { scrub: 5.5 }
    );
    animateWithGsap(".g_text", {
      y: 0,
      opacity: 1,
      ease: "power2.inOut",
      duration: 1,
    });
  }, []);

  return (
    <section className="h-full common-padding bg-gray-50 relative overflow-hidden">
      <div className="screen-max-width">
        <div className="mb-12 w-full">
          <h1 id="features_title" className="section-heading">
            Explore the full story.
          </h1>
        </div>

        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="mt-24 mb-24 pl-2 flex flex-col items-center justify-center text-center ">
            <h2 className="text-3xl lg:text-7xl font-semibold  text-black  ">
              Softgen{" "}
            </h2>
            <h2 className="text-3xl lg:text-7xl font-semibold text-black ">
              Dynamic Solutions
            </h2>
          </div>

          <div className="flex-center flex-col sm:px-10">
            <div className="relative h-[37vh]  sm:h-[75vh] md:h-[75vh] flex items-center">
              <video
                playsInline
                id="exploreVideo"
                className="w-full h-full object-cover object-center"
                preload="none"
                muted
                autoPlay
                ref={videoRef}
              >
                <source src={exploreVideo} type="video/mp4" />
              </video>
            </div>

            <div className="flex flex-col w-full relative ">
              <div className="feature-video-containerl">
                <div className="overflow-hidden flex-1 h-[47vh] sm:h-[95vh] md:h-[95vh] ">
                  <Image
                    src={explore1Img}
                    alt="titanium"
                    className="feature-video g_grow"
                  />
                </div>

                <div className="overflow-hidden flex-1 h-[37vh] sm:h-[75vh] md:h-[75vh]">
                  <Image
                    src={explore2Img}
                    alt="titanium 2"
                    className="feature-video g_grow"
                  />
                </div>
              </div>

              <div className="feature-text-container">
                <div className="flex-1 flex-center">
                  <p className="feature-text g_text">
                    Softgen is{" "}
                    <span className="text-gray">
                      web and app development company delivers innovative
                      solutions with the same precision
                    </span>
                    , and durability found in aerospace-grade titanium, setting
                    a new standard in quality and reliability
                  </p>
                </div>

                <div className="flex-1 flex-center">
                  <p className="feature-text g_text">
                    Our solutions offer ratio you’ll feel instantly.{" "}
                    <span className="text-gray">
                      unmatched efficiency, with a top strength-to-performance
                      ratio
                    </span>
                    you’ll feel instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
