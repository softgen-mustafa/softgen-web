"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { rightImg, watchImg } from "../utils";
// import {rightImg, watchImg}from "../../src/utils/index"
import VideoCarousel from "./VideoCarousel";
import Image from "next/image";

const Highlights = () => {
  useGSAP(() => {
    gsap.to("#title", { opacity: 1, y: 0 });
    gsap.to(".link", { opacity: 1, y: 0, duration: 1, stagger: 0.25 });
  }, []);
  return (
    <section
      id="highlights"
      className="w-screen overflow-hidden h-full common-padding bg-gray-50"
    >
      <div className="screen-max-width">
        <div className="mb-12 w-full items-end justify-between md:flex ">
          <h1 id="title" className="section-heading">
            explore us
          </h1>
          <div className="flex flex-warp items-end gap-5">
            <p className="link">
              watch the training
              <Image src={watchImg} alt="watch" className="ml-2" />
            </p>
            <p className="link">
              our feature
              <Image src={rightImg} alt="right" className="ml-2" />
            </p>
          </div>
        </div>
        <VideoCarousel />
      </div>
    </section>
  );
};

export default Highlights;
