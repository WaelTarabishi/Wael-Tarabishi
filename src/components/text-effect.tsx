import { TypeAnimation } from "react-type-animation";

export const TextEffect = () => {
  return (
    <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        "Next.js Ninja",
        1500,
        "Full Stack Developer",
        1500,
        "Web Developer",
        1500,
      ]}
      className="text-[2rem] md:text-[40px] text-transparent bg-clip-text bg-gradient-to-r from-grad-3-start to-grad-3-end font-bold uppercase"
      speed={50}
      repeat={Infinity}
    />
  );
};
