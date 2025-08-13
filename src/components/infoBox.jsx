import LogoTitle from "../assets/logoTitle.svg";
import ChaiNET_logo from "../assets/ChaiNET_logo.svg";
import { SiGithub, SiLinkedin, SiBluesky, SiInstagram } from "react-icons/si";

export default function InfoBox() {
  return (
    <>
      <div className="relative flex w-full items-center justify-center overflow-x-clip">
        <div className="border-dark44 font-jost from-dark25/45 shadow-dark25 fixed w-dvw flex-1/2 flex-col justify-start gap-6 rounded-2xl border bg-gradient-to-b from-35% to-[#2C2C2C]/65 p-12 shadow-lg backdrop-blur-2xl md:w-170">
          <p className="py-3 text-start text-lg leading-6 text-zinc-50">
            A free, open-source web application for uploading and viewing 3D
            models in your browser. Allowing you to upload your .glb formatted
            models and view them in various render modes. Get details such as
            triangle and vertice count, texture and material details.
          </p>

          <div className="mx-auto h-[1px] w-1/3 border-b-3 border-dotted border-white/15" />

          {/* About: */}
          <p className="py-3 text-start text-sm text-zinc-100">
            <span className="text-dark25 bg-white/55 px-3 font-semibold">
              Note:
            </span>{" "}
            Although now is a part of the ChaiNET FOSS Project, the app was made
            as a tool that was needed for myself. Later I decided to refresh the
            UI and publish it. Hence the application might not be as polished
            and have bugs. If you want to report any bug or give a suggestion,
            please reach me from my socials indicated below or add an issue from
            GitHub repository.
          </p>

          {/* Terms and Conditions: */}
          {/* <p className="text-justify text-xs">
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the "Software"), to deal in the Software without restriction,
            including without limitation the rights to use, copy, modify, merge,
            publish, distribute, sublicense, and/or sell copies of the Software,
            and to permit persons to whom the Software is furnished to do so,
            subject to the conditions detailed on GitHub repository at
            (https://github.com/Chai-NET/Porcelana).
          </p> */}
          <div className="flex h-full items-center justify-between py-3">
            <div className="w-2/5">
              <img
                src={LogoTitle}
                className="w-40"
                alt="Porcelana (Korean: P-Ceramic)"
              />
              <h3 className="font-jost mt-1 text-xs font-semibold text-zinc-300 2xl:text-base">
                3D model web inspector
              </h3>
            </div>
            <div className="h-12 w-[1px] bg-zinc-50" />
            <a
              rel="noreferrer"
              target="_blank"
              href="https://github.com/Chai-NET"
              className="flex w-1/2 cursor-pointer items-end rounded-2xl border border-transparent p-3 transition-colors duration-500 ease-in-out hover:border-white/35 hover:text-white"
            >
              <img src={ChaiNET_logo} className="w-20" alt="ChaiNET logo" />
              <div className="mb-2">
                <h3 className="font-jost text-xl font-semibold">
                  ChaiNET <span className="text-xs">©</span>
                </h3>
                <p className="w-50 text-sm">
                  The application is part of the <br /> 2025 | ChaiNET FOSS
                  Project.
                </p>
              </div>
            </a>
          </div>

          <div className="mx-auto h-[1px] w-full bg-zinc-300" />

          {/* Contacts: plu.moe */}
          {/* Socials: Github, Website(ChaiNET) */}
          <div className="mt-2 flex items-end justify-between px-1">
            <p className="text-start text-sm">
              © 2025 | ChaiNET FOSS Project | chainet.dev
              <br />
              <span className="text-dark25 bg-white/75 px-1 pr-3 text-start text-sm font-semibold">
                Developed & maintained by Pluwia ad Astra* | plu.moe
              </span>
            </p>
            <div className="flex gap-3 text-xl">
              <a
                rel="noreferrer"
                target="_blank"
                className="hover:text-accent cursor-pointer"
                href="https://github.com/plwtx"
              >
                <SiGithub />
              </a>
              <a
                rel="noreferrer"
                target="_blank"
                className="hover:text-accent cursor-pointer"
                href="https://www.linkedin.com/in/plwtx/"
              >
                <SiLinkedin />
              </a>
              <a
                rel="noreferrer"
                target="_blank"
                className="hover:text-accent cursor-pointer"
                href="https://bsky.app/profile/plu.moe"
              >
                <SiBluesky />
              </a>
              <a
                rel="noreferrer"
                target="_blank"
                className="hover:text-accent cursor-pointer"
                href="https://www.instagram.com/plwtx/"
              >
                <SiInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
