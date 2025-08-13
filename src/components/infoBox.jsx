export default function InfoBox() {
  return (
    <>
      <div className="flex w-full items-center justify-center overflow-x-clip">
        <div className="border-dark44 from-dark25 shadow-dark25 fixed flex-1/2 flex-col justify-start gap-6 rounded-2xl border bg-gradient-to-b from-35% to-[#2C2C2C] p-6 shadow-lg md:w-100 2xl:w-100 2xl:p-12">
          {/* <h1>Information</h1> */}
          <p>
            © 2025 | ChaiNET FOSS Project | chainet.dev Developed and
            maintained by Pluwia | plu.moe
          </p>
        </div>
      </div>
    </>
  );
}
