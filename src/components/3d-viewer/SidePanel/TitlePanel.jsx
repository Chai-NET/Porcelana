import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import LogoTitle from "../../../assets/logoTitle.svg";
import InfoBox from "../../infoBox.jsx";
import { SiGithub } from "react-icons/si";
import { LuRotate3D, LuInfo } from "react-icons/lu";

export default function Title() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Outside click to close
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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
              3D model web inspector
            </h3>
          </div>
        </div>
        <div className="flex w-20 gap-2 text-zinc-400 2xl:w-24">
          <a
            rel="noreferrer"
            target="_blank"
            className="size-full"
            href="https://github.com/Chai-NET/Porcelana"
          >
            <SiGithub className="hover:text-accent hover:border-accent size-full cursor-pointer rounded-full border border-transparent p-1 transition-colors duration-600 ease-in-out" />
          </a>

          {/* Button */}
          <button onClick={() => setOpen(true)} className="size-full">
            <LuInfo className="hover:text-accent hover:border-accent size-full cursor-pointer rounded-full border border-transparent p-1 transition-colors duration-600 ease-in-out" />
          </button>
        </div>
      </div>

      {/* Modal: Portal for leaving the parent container */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Blur background */}
            <div
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            {/* Info box */}
            <div ref={boxRef} className="animate-fadeIn relative z-10">
              <InfoBox />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
