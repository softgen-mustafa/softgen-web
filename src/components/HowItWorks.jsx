"use client";

import React, { useRef } from 'react'
import { chipImg, frameImg, frameVideo } from '../utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import { animateWithGsap } from '../utils/animations';
import Image from 'next/image';

const HowItWorks = () => {
  const videoRef = useRef();

  useGSAP(() => {
    gsap.from('#chip', {
      scrollTrigger: {
        trigger: '#chip',
        start: '20% bottom'
      },
      opacity: 0,
      scale: 2,
      duration: 2,
      ease: 'power2.inOut'
    })

    animateWithGsap('.g_fadeIn', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    })
  }, []);

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <div id="chip" className="flex-center w-full my-20">
          <Image src={chipImg} alt="chip" width={180} height={180} />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="hiw-title">
            Softgen
            <br />a powerhouse for <br /> development.
          </h2>

          <p className="hiw-subtitle">
           
             Our most innovative design to date.  

          </p>
        </div>

        <div className="mt-10 md:mt-20 mb-14">
          <div className="relative h-50 flex-center">
            <div className="overflow-hidden">
              <Image
                src={frameImg}
                alt="frame"
                className=" bg-transparent relative z-10  "
                
              />
            </div>
            <div className="hiw-video sm:rounded-[56px] ">
                <video className="pointer-events-none" playsInline preload="none" muted autoPlay ref={videoRef}>
                  <source src={frameVideo} type="video/mp4"   />
                </video>
              </div>
          </div>
          <p className="text-black font-semibold text-center mt-3">web: dashboard </p>
          </div>

          <div className="hiw-text-container">
                <div className="flex flex-1 justify-center flex-col">
                  <p className="hiw-text g_fadeIn">
                  Our  innovation sets a new benchmark for{' '}
                    <span className="text-black">
                     performance, offering unprecedented graphics 
                    </span>.
                  </p>

                  <p className="hiw-text g_fadeIn">
                   power that elevates our web and app development projects with superior  {' '}
                    <span className="text-black">
                     speed, efficiency, and visual excellence.
                    </span>
                    
                  </p>
                </div>
              

              <div className="flex-1 flex justify-center flex-col g_fadeIn">
                <p className="hiw-text">New</p>
                <p className="hiw-bigtext ">BIZZ-opp</p>
                <p className="hiw-text">available in  app and web </p>
              </div>
              </div>
            </div>
    </section>
  )
}

export default HowItWorks