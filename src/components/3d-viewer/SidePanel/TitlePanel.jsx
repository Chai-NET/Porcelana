import LogoTitle from "../../../assets/logoTitle.svg";
import { SiGithub } from "react-icons/si";
import { LuRotate3D, LuInfo } from "react-icons/lu";

export default function Title() {
  return (
    <>
      <div className="mb-3 flex items-start justify-between 2xl:mb-6">
        <div className="flex w-full items-center gap-3">
          <div className="flex">
            <LuRotate3D className="stroke-accent size-9 fill-white 2xl:size-12" />
            <p className="invisible absolute text-xs xl:visible xl:relative">
              &#169;
            </p>
          </div>
          <div className="h-9 w-[3px] rounded-full bg-zinc-400 2xl:h-12" />
          <div>
            <img
              src={LogoTitle}
              className="w-24 2xl:w-26"
              alt="Porcelana (Korean: P-Ceramic)"
            />
            <h3 className="font-jost mt-1 text-xs font-semibold text-zinc-300">
              3D model viewer
            </h3>
          </div>
        </div>
        <div className="flex w-13 gap-2 text-zinc-400 2xl:w-16">
          {/* Will replace with actual repository link */}
          <a
            rel="noreferrer"
            target="_blank"
            className="size-full"
            href="https://github.com/plwtx"
          >
            <SiGithub className="size-full" />
          </a>
          {/* Will replace with information page */}
          <a
            rel="noreferrer"
            target="_blank"
            className="size-full"
            href="https://github.com/Chai-NET"
          >
            <LuInfo className="size-full" />
          </a>
        </div>
      </div>
    </>
  );
}
