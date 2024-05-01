export const useSfx = () => {
  const moveSfx = () => {
    const audio = new Audio("/move.wav");
    audio.play();
  };

  const captureSfx = () => {
    const audio = new Audio("/capture.wav");
    audio.play();
  };

  const checkSfx = () => {
    const audio = new Audio("/check.wav");
    audio.play();
  };

  const startSfx = () => {
    const audio = new Audio("/start.wav");
    audio.play();
  };

  return { moveSfx, captureSfx, checkSfx, startSfx };
};
