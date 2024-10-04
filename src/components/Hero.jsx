// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { heroVideo, smallHeroVideo } from "../utils";
// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";

// const Hero = () => {

//   const router = useRouter();

//   const [videoSrc, setVideoSrc] = useState(heroVideo);

//   const handleVideoSrcSet = () => {
//     if (typeof window !== "undefined") {
//       if (window.innerWidth < 760) {
//         setVideoSrc(smallHeroVideo);
//       } else {
//         setVideoSrc(heroVideo);
//       }
//     }
//   };

//   useEffect(() => {
//     handleVideoSrcSet();

//     if (typeof window !== "undefined") {
//       window.addEventListener("resize", handleVideoSrcSet);

//       return () => {
//         window.removeEventListener("resize", handleVideoSrcSet);
//       };
//     }
//   }, []);

//   useGSAP(() => {
//     gsap.to("#hero", { opacity: 1, delay: 2 });
//     gsap.to("#cta", { opacity: 1, y: -50, delay: 2 });
//   }, []);

//   return (
//     <section className="w-full nav-height bg-white relative">
//       <div className="h-5/6 w-full flex-center flex-col">
//         <div className="md:w-10/12 w-9/12 ">
//           <video
//             className="pointer-events-none"
//             autoPlay
//             muted
//             playsInline={true}
//             key={videoSrc}
//           >
//             <source src={videoSrc} type="video/mp4" />
//           </video>
//         </div>
//       </div>

//       <div
//         id="cta"
//         className="flex flex-col items-center opacity-0 translate-y-20"
//       >
//         <a href="#highlights" className="btn">
//          Login
//         </a>
//       </div>
//     </section>
//   );
// };

// export default Hero;
"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "../utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(heroVideo);
  const router = useRouter();

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

  const handleLogin = () => {
    const token = Cookies.get("token") ?? null;
    if (token !== null && token.length > 0) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  const handleRegistration = () => {
    const token = Cookies.get("token") ?? null;
    if (token !== null && token.length > 0) {
      router.push("/dashboard");
    } else {
      router.push("/auth/register");
    }
  };

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
        <button onClick={handleLogin} className="btn">
          Login
        </button>
        <button onClick={handleRegistration} className="btn">
          Register
        </button>
      </div>
    </section>
  );
};

export default Hero;
