import { KEYBINDS } from "../config/keybinds";

const KeybindsPanel = () => (
  <div className="border-dark44 from-dark25/95 animate-fadeIn absolute top-full right-0 z-50 mt-2 w-64 origin-top-right rounded-lg border bg-gradient-to-b to-[#2C2C2C]/95 p-3 shadow-lg backdrop-blur-3xl">
    <h3 className="font-jost mb-3 text-sm font-semibold">Keybinds</h3>

    <ul className="flex flex-col gap-2">
      {KEYBINDS.map(({ keys, action }) => (
        <li
          key={keys}
          className="flex items-center justify-between gap-3 text-xs"
        >
          <kbd className="border-dark44 bg-dark30 font-jost rounded border px-1.5 py-0.5 text-zinc-300">
            {keys}
          </kbd>
          <span className="font-jost text-right text-gray-400">{action}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default KeybindsPanel;
