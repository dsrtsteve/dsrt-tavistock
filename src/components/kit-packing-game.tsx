"use client";

import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  CloudRain,
  Compass,
  Flashlight,
  HeartPulse,
  Phone,
  Sandwich,
  Thermometer,
  X,
  Footprints,
  Speaker,
  Flame
} from "lucide-react";

const kit = [
  { id: "waterproof", name: "Waterproof jacket", Icon: CloudRain, essential: true },
  { id: "warm-layer", name: "Warm layer", Icon: Thermometer, essential: true },
  { id: "map", name: "Map & compass", Icon: Compass, essential: true },
  { id: "speaker", name: "Portable speaker", Icon: Speaker, essential: false },
  { id: "flip-flops", name: "Flip-flops", Icon: Footprints, essential: false },
  { id: "phone", name: "Charged phone", Icon: Phone, essential: true },
  { id: "water", name: "Food & water", Icon: Sandwich, essential: true },
  { id: "torch", name: "Head torch", Icon: Flashlight, essential: true },
  { id: "bbq", name: "Disposable BBQ", Icon: Flame, essential: false },
  { id: "first-aid", name: "First-aid kit", Icon: HeartPulse, essential: true },
];

export function KitPackingGame() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  function toggleItem(id: string) {
    setChecked(false);
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function packItem(id: string) {
    if (!kit.some((item) => item.id === id)) return;
    setChecked(false);
    setSelected((current) => current.includes(id) ? current : [...current, id]);
  }

  function checkPack() {
    setChecked(true);
  }

  const essentialsPacked = kit.filter((item) => item.essential && selected.includes(item.id)).length;
  const hasExtras = kit.some((item) => !item.essential && selected.includes(item.id));

  return (
    <section className="kit-game-section">
      <div className="site-container kit-game-launcher">
        <div className="kit-launcher-art" aria-hidden="true">
          <div className="kit-moor-sun" />
          <div className="kit-moor-ridge kit-moor-ridge-back" />
          <div className="kit-moor-ridge kit-moor-ridge-front" />
          <div className="kit-launcher-pack"><BackpackIllustration /></div>
          <span className="kit-art-spark kit-art-spark-one">✦</span>
          <span className="kit-art-spark kit-art-spark-two">✦</span>
        </div>
        <div className="kit-launcher-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> A LITTLE MOORLAND CHALLENGE</span>
          <h2>Can you pack<br />for the moor?</h2>
          <p>Pick the right kit for a day out on Dartmoor. Tap to pack, then see how you did.</p>
          <button className="button button-red kit-play-button" type="button" onClick={() => dialog.current?.showModal()}>
            Play the packing game <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      <dialog className="kit-game-dialog" ref={dialog} aria-labelledby="kit-game-title" onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close();
      }}>
        <div className="kit-game-modal">
          <header className="kit-modal-header">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> DARTMOOR DAY OUT</span>
              <h2 id="kit-game-title">Pack your rucksack.</h2>
            </div>
            <form method="dialog">
              <button className="kit-modal-close" aria-label="Close game"><X size={21} /></button>
            </form>
          </header>

          <p className="kit-game-prompt">Tap kit to add it to your pack. Choose what you think you’ll need.</p>

          <div className="kit-game-play-area">
            <div className="kit-kit-picker" role="group" aria-label="Available kit">
              {kit.map(({ id, name, Icon, essential }) => {
                const isSelected = selected.includes(id);
                return (
                  <button
                    type="button"
                    className={`kit-choice ${isSelected ? "kit-choice-selected" : ""} ${checked && essential && !isSelected ? "kit-choice-missed" : ""} ${checked && !essential && isSelected ? "kit-choice-extra" : ""}`}
                    key={id}
                    aria-pressed={isSelected}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("text/plain", id)}
                    onClick={() => toggleItem(id)}
                  >
                    <span className="kit-choice-icon"><Icon size={20} strokeWidth={1.7} /></span>
                    <span>{name}</span>
                    {isSelected && <Check className="kit-choice-check" size={14} aria-hidden="true" />}
                  </button>
                );
              })}
            </div>

            <div
              className={`kit-backpack-scene ${selected.length ? "kit-backpack-has-items" : ""}`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                packItem(event.dataTransfer.getData("text/plain"));
              }}
              role="group"
              aria-label={`Rucksack, ${selected.length} items packed`}
            >
              <div className="kit-scene-sky" />
              <div className="kit-scene-hill kit-scene-hill-back" />
              <div className="kit-scene-hill kit-scene-hill-front" />
              <div className="kit-backpack"><BackpackIllustration /></div>
              {selected.map((id, index) => {
                const item = kit.find((entry) => entry.id === id);
                if (!item) return null;
                const Icon = item.Icon;
                return <span key={id} className={`kit-packed-token kit-packed-token-${index % 5}`}><Icon size={17} aria-label={item.name} /></span>;
              })}
              <span className="kit-pack-count">{selected.length} packed</span>
            </div>
          </div>

          <div className="kit-game-result" aria-live="polite">
            {checked ? (
              <p>{essentialsPacked === 7 && !hasExtras
                ? "Nicely packed! You found all of our suggested essentials."
                : `You packed ${essentialsPacked} of 7 suggested essentials${hasExtras ? " — you can leave the extra bits behind." : ". Have another look at the items marked in red."}`}</p>
            ) : (
              <p>Think about the weather, your route and how long you’ll be out.</p>
            )}
            <div className="kit-result-actions">
              {checked && <button className="kit-reset" type="button" onClick={() => { setSelected([]); setChecked(false); }}>Empty the pack</button>}
              {!checked && <button className="button button-red" type="button" onClick={checkPack}>Check my pack <ArrowUpRight size={16} /></button>}
            </div>
          </div>

          <footer className="kit-modal-footer">
            <p>This is a game, not a definitive kit list. What you need depends on your route, weather and experience.</p>
            <a href="https://www.adventuresmart.co.uk/" target="_blank" rel="noreferrer">Plan your day with AdventureSmart <ArrowUpRight size={15} /></a>
          </footer>
        </div>
      </dialog>
    </section>
  );
}

function BackpackIllustration() {
  return (
    <svg viewBox="0 0 180 190" role="img" aria-label="Illustration of a walking rucksack">
      <path d="M61 42c1-17 12-28 29-28s28 11 29 28" fill="none" stroke="#34493d" strokeWidth="8" strokeLinecap="round" />
      <path d="M52 55c-12 5-20 18-20 36v64c0 13 10 23 23 23h70c13 0 23-10 23-23V91c0-18-8-31-20-36l-12 11H64L52 55Z" fill="#c65a43" stroke="#9d4031" strokeWidth="4" />
      <path d="M61 61c6 11 17 17 29 17s23-6 29-17" fill="none" stroke="#e88a66" strokeWidth="7" strokeLinecap="round" />
      <path d="M49 99c13-9 27-13 41-13s28 4 41 13v41H49V99Z" fill="#d87353" stroke="#9d4031" strokeWidth="4" />
      <path d="M69 91v33m42-33v33" stroke="#f2be8a" strokeWidth="5" strokeLinecap="round" />
      <rect x="82" y="123" width="16" height="17" rx="3" fill="#33483b" />
      <path d="M52 84 39 93v43l12 5m77-57 13 9v43l-12 5" fill="none" stroke="#34493d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
