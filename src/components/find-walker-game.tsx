"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Footprints, MapPin, RotateCcw, X } from "lucide-react";

const rows = ["A", "B", "C"];
const columns = ["1", "2", "3"];
const walkerZone = "A3";

export function FindWalkerGame() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [guess, setGuess] = useState<string | null>(null);
  const [found, setFound] = useState(false);
  const [feedback, setFeedback] = useState("");

  function checkLocation() {
    if (!guess) return;
    if (guess === walkerZone) {
      setFound(true);
      setFeedback("You found the walker! The team has their location and can head in to help.");
    } else {
      setFeedback("Not quite. Follow the clues to work out where the walker could have ended up.");
    }
  }

  function resetGame() {
    setGuess(null);
    setFound(false);
    setFeedback("");
  }

  return (
    <section className="walker-game-section">
      <div className="site-container walker-game-launcher">
        <div className="walker-launcher-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> PUT YOUR SEARCH EYE TO THE TEST</span>
          <h2>Can you find<br />the walker?</h2>
          <p>Read the clues, scan a moorland map and choose the search area you’d check first.</p>
          <button className="button button-red" type="button" onClick={() => dialog.current?.showModal()}>
            Play Find the Walker <ArrowUpRight size={18} />
          </button>
        </div>
        <div className="walker-launcher-map" aria-hidden="true">
          <MapArtwork />
          <span className="walker-map-pin"><MapPin size={20} /></span>
          <span className="walker-map-grid-mark">A&nbsp;&nbsp; B&nbsp;&nbsp; C</span>
        </div>
      </div>

      <dialog
        className="kit-game-dialog walker-game-dialog"
        ref={dialog}
        aria-labelledby="walker-game-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="walker-game-modal">
          <header className="kit-modal-header">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> SEARCH EXERCISE · DARTMOOR
              </span>
              <h2 id="walker-game-title">Find the walker.</h2>
            </div>
            <form method="dialog">
              <button className="kit-modal-close" aria-label="Close game"><X size={21} /></button>
            </form>
          </header>

          <p className="walker-game-brief">A walker is overdue and has called for help. Use the clues to choose the map square the search team should check first.</p>

          <div className="walker-game-board">
            <aside className="walker-clues">
              <span className="walker-clues-label">FIELD NOTES</span>
              <p><span>01</span> They were last seen this morning heading East along the main footpath.</p>
              <p><span>02</span> Their last Social Media post was of them crossing a river.</p>
              <p><span>03</span> During the call they say they only turned left at junctions.</p>
              <div className="walker-north"><span>↑</span> NORTH</div>
            </aside>

            <div className="walker-map-frame" aria-label="Fictional moorland search map">
              <MapArtwork />
              <div className="walker-map-grid" role="group" aria-label="Choose a search square">
                {rows.flatMap((row) => columns.map((column) => {
                  const zone = `${row}${column}`;
                  const isSelected = guess === zone;
                  const isWalker = found && zone === walkerZone;
                  return (
                    <button
                      type="button"
                      key={zone}
                      aria-label={`Search square ${zone}${isWalker ? ", walker located here" : ""}`}
                      aria-pressed={isSelected}
                      className={`walker-zone ${isSelected ? "walker-zone-selected" : ""} ${feedback && isSelected && !found ? "walker-zone-wrong" : ""} ${isWalker ? "walker-zone-found" : ""}`}
                      onClick={() => {
                        setGuess(zone);
                        setFeedback("");
                      }}
                    >
                      <span>{zone}</span>
                      {isWalker && <Footprints size={25} aria-hidden="true" />}
                    </button>
                  );
                }))}
              </div>
              <span className="walker-map-scale">1 km</span>
            </div>
          </div>

          <div className="walker-game-result" aria-live="polite">
            <p>{feedback || (guess ? `Search square ${guess} selected. Ready to check?` : "Select a square on the map to pin your best guess.")}</p>
            <div className="kit-result-actions">
              {found ? (
                <button className="kit-reset" type="button" onClick={resetGame}><RotateCcw size={15} /> Play again</button>
              ) : (
                <button className="button button-red" type="button" onClick={checkLocation} disabled={!guess}>Check location <ArrowUpRight size={16} /></button>
              )}
            </div>
          </div>
          <p className="walker-game-note">A fictional map puzzle for fun. Real searches are planned and led by trained rescue teams.</p>
        </div>
      </dialog>
    </section>
  );
}

function MapArtwork() {
  return (
    <svg className="walker-map-artwork" viewBox="0 0 600 420" aria-hidden="true" preserveAspectRatio="none">
      <rect width="600" height="420" fill="#e3e9d8" />
      <path d="M-30 80c78-56 149-27 212-43 82-21 126-61 215-18s134 23 237-28M-35 113c80-54 152-24 216-40 81-20 123-58 211-16s132 24 243-26M-20 345c77-49 125-23 193-42 85-24 134-64 221-32s135 40 229-5M-23 379c78-48 126-21 194-40 84-23 131-61 219-29s135 39 230-6" fill="none" stroke="#b6c6a8" strokeWidth="3" />
      <path d="M-10 231c76-29 121-69 204-47s113 69 204 47 111-67 212-53M-4 253c79-28 122-65 202-44s115 65 204 44 113-64 211-50" fill="none" stroke="#8bb8bd" strokeWidth="8" />
      <path d="M-15 318C72 255 129 212 193 220 240 225 268 250 300 242 335 234 373 177 416 170" fill="none" stroke="#f8f5e8" strokeWidth="14" />
      <path d="M-15 318C72 255 129 212 193 220 240 225 268 250 300 242 335 234 373 177 416 170" fill="none" stroke="#b08e62" strokeWidth="3" strokeDasharray="7 8" />
      <path d="M193 220C185 274 214 327 257 382" fill="none" stroke="#f8f5e8" strokeWidth="14" />
      <path d="M193 220C185 274 214 327 257 382" fill="none" stroke="#b08e62" strokeWidth="3" strokeDasharray="7 8" />
      <path d="M416 170C457 132 500 83 566 38" fill="none" stroke="#f8f5e8" strokeWidth="14" />
      <path d="M416 170C457 132 500 83 566 38" fill="none" stroke="#b08e62" strokeWidth="3" strokeDasharray="7 8" />
      <path d="M416 170C476 173 536 160 610 178" fill="none" stroke="#f8f5e8" strokeWidth="14" />
      <path d="M416 170C476 173 536 160 610 178" fill="none" stroke="#b08e62" strokeWidth="3" strokeDasharray="7 8" />
      <path d="M58 75h60v40H58zM445 281h74v45h-74z" fill="#d8caaa" stroke="#a89876" strokeWidth="3" />
      <path d="M80 95h17m376 208h22" stroke="#fff" strokeWidth="4" />
    </svg>
  );
}
