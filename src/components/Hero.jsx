import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "../utils";
import { useEffect, useState } from "react";

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(heroVideo);

  const handleVideoSrcSet = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 760) {
        setVideoSrc(smallHeroVideo);
      } else {
        setVideoSrc(heroVideo);
      }
    }
  };

  useEffect(() => {
    handleVideoSrcSet();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleVideoSrcSet);

      return () => {
        window.removeEventListener("resize", handleVideoSrcSet);
      };
    }
  }, []);

  useGSAP(() => {
    gsap.to("#hero", { opacity: 1, delay: 2 });
    gsap.to("#cta", { opacity: 1, y: -50, delay: 2 });
  }, []);

  return (
    <section className="w-full nav-height bg-white relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <div className="md:w-10/12 w-9/12 ">
          <video
            className="pointer-events-none"
            autoPlay
            muted
            playsInline={true}
            key={videoSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20"
      >
        <a href="#highlights" className="btn">
          for more
        </a>
      </div>
    </section>
  );
};

export default Hero;
