let rosesFountainBgm: HTMLAudioElement | null = null;
let didAttachEndedHandler = false;

export function getRosesFountainBgm() {
  if (!rosesFountainBgm) {
    rosesFountainBgm = new Audio("/rosesfountain.mp3");
    rosesFountainBgm.preload = "auto";
    rosesFountainBgm.loop = true;
    rosesFountainBgm.volume = 0.9;
  }

  if (rosesFountainBgm && !didAttachEndedHandler) {
    // Extra safety: some environments still behave oddly with loop.
    rosesFountainBgm.addEventListener("ended", () => {
      const a = rosesFountainBgm;
      if (!a) return;
      try {
        a.currentTime = 0;
      } catch {
        // ignore
      }
      void a.play().catch(() => {
        // ignore autoplay restrictions
      });
    });
    didAttachEndedHandler = true;
  }

  return rosesFountainBgm;
}

