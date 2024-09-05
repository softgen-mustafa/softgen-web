// import React from 'react'
import { footerLinks } from '../constants'

const Footer = () => {
  return (
    <footer className="py-5 sm:px-10 px-5">
      <div className="screen-max-width">
        <div>
          <p className="font-semibold text-black text-xs">
            More ways to Find : {' '}
            <a href='#' className="underline text-blue">
              playstore  {' '}
            </a>
            or {' '}
            <a href='#'className="underline text-blue">
            other retailer
            </a>{''}
            near you.
          </p>
          <a href='tel:92235 50508'  className="font-semibold text-black text-xs">
            Or call 92235 50508
          </a>
        </div>

        <div className="bg-neutral-700 my-5 h-[1px] w-full" />

        <div className="flex md:flex-row flex-col md:items-center justify-between">
          <p className="font-semibold text-black text-xs">Copright @ 2024 softgen. All rights reserved.</p>
          <div className="flex">
            {footerLinks.map((link, i) => (
              <a href='#'  key={link}  className="font-semibold text-black text-xs">
                {link}{' '}
                {i !== footerLinks.length - 1 && (
                  <span className="mx-2"> | </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer