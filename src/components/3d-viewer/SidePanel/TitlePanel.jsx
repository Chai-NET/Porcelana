import LogoTitle from "../../../assets/logoTitle.svg";
import { SiGithub } from "react-icons/si";
import { LuRotate3D, LuInfo } from "react-icons/lu";

export default function Title() {
  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex w-full items-center gap-3">
          <div className="flex">
            <LuRotate3D className="stroke-accent size-12 fill-white" />
            <p className="text-xs">&#169;</p>
          </div>
          <div className="h-16 w-[3px] rounded-full bg-zinc-400" />
          <div>
            <img
              src={LogoTitle}
              className="w-32"
              alt="Porcelana (Korean: P-Ceramic)"
            />
            <h3 className="font-jost text-sm font-semibold text-zinc-300">
              3D model viewer
            </h3>
          </div>
        </div>
        <div className="flex w-13 gap-2 text-zinc-400">
          <SiGithub className="size-full" />
          <LuInfo className="size-full" />
        </div>
      </div>
    </>
  );
}
