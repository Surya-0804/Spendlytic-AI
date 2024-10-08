import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="bg-gray-50 flex items-center flex-col pt-0 mt-0">
      {/* Remove margin-top */}
      <div className="flex flex-col overflow-hidden mt-0">
        {/* Remove margin-top */}
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl mb-5 font-semibold text-black dark:text-white">
                {/* Adjust margin-bottom */}
                AI-powered to manage your expenses
                <br />
                <span className="text-4xl  md:text-[6rem] text-blue-800 font-bold mt-1 leading-none ">
                  Spendlytic AI
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={`/dashboard.png`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </section>
  );
};

export default Hero;
