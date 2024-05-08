"use client";
import Image from "next/image";
import Particle from "./particle";
import { TextEffect } from "./text-effect";
import Second from "../../public/second.jpg";

const Hero = () => {
  return (
    <div className="lg:h-[92.9vh] h-[120vh]  bg-[url('/banner.jpg')] bg-cover bg-center relative flex items-center justify-center ">
      <Particle />
      <div className="w-[80%] grid-cols-1 mx-auto grid lg:grid-cols-2 lg:gap-48 h-full gap-10 items-center justify-center text-center md:text-start">
        <div className="lg:mt-0 mt-20">
          <h1 className="text-[36px] md:text-[48px] text-white font-bold">
            HI, I&apos;M{" "}
            <span className="text-transparent  bg-clip-text bg-gradient-to-r from-grad-1-start to-grad-1-end">
              Wael
            </span>
          </h1>
          <TextEffect />
          <p className="text-zinc-500 text-[20px]">
            I&apos;m a 22-year-old web developer from Syria, specializing in
            Next.js and React. Passionate about crafting engaging and intuitive
            user experiences. Let&apos;s create something awesome together!
            <span role="img" aria-label="Rocket">
              🚀
            </span>
          </p>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="lg:w-[400px] lg:h-[400px] w-[250px] h-[250px] flex justify-center relative rounded-full overflow-hidden">
            <Image
              src={Second}
              alt="Personal Photo"
              layout="fill"
              objectFit="cover"
              className="rounded-full "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
