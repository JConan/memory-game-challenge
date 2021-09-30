import "./style.scss";

export const SoloGame = () => (
  <div>
    <span>memory</span>
    <button>menu</button>
    <ul aria-label="memory item list">
      <li aria-label="memory item">1</li>
      <li aria-label="memory item">2</li>
      <li aria-label="memory item">3</li>
      <li aria-label="memory item">4</li>
      <li aria-label="memory item">5</li>
      <li aria-label="memory item">6</li>
      <li aria-label="memory item">7</li>
      <li aria-label="memory item">8</li>
      <li aria-label="memory item">9</li>
      <li aria-label="memory item">10</li>
      <li aria-label="memory item">11</li>
      <li aria-label="memory item">12</li>
      <li aria-label="memory item">13</li>
      <li aria-label="memory item">14</li>
      <li aria-label="memory item">15</li>
      <li aria-label="memory item">16</li>
    </ul>
    <div role="timer" aria-label="time">
      <span>Time</span>
    </div>
    <div role="status" aria-label="moves">
      <span>Moves</span>
    </div>
  </div>
);