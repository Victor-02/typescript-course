import Timeout from "./Timeout.js";

export default class Slide {
  container;
  elements;
  controls;
  time;
  index: number;
  slide: Element;
  timeout: Timeout | null;
  setTimeout: Timeout | null;
  paused: boolean;

  constructor(
    container: Element,
    elements: Element[],
    controls: Element,
    time: number = 5000
  ) {
    this.container = container;
    this.elements = elements;
    this.controls = controls;
    this.time = time;

    this.index = localStorage.getItem("slide-active")
      ? Number(localStorage.getItem("slide-active"))
      : 0;
    this.slide = this.elements[this.index];
    this.timeout = null;
    this.setTimeout = null;
    this.paused = false;

    this.init();
  }

  hide(element: Element) {
    element.classList.remove("active");
    if (element instanceof HTMLVideoElement) {
      element.currentTime = 0;
      element.pause();
    }
  }

  show(index: number) {
    this.index = index;
    this.slide = this.elements[this.index];
    console.log(localStorage.getItem("slide-active"));

    localStorage.setItem("slide-active", String(this.index));
    this.elements.forEach((i) => this.hide(i));
    this.slide.classList.add("active");

    this.slide instanceof HTMLVideoElement
      ? this.autoVideo(this.slide)
      : this.auto(this.time);
  }

  autoVideo(video: HTMLVideoElement) {
    video.muted = true;
    video.play();
    let clickPlay = true;
    video.addEventListener("playing", () => {
      if (clickPlay) this.auto(video.duration * 1000);
      clickPlay = false;
    });
  }

  auto(time: number) {
    this.timeout?.clear();
    this.timeout = new Timeout(() => this.next(), time);
  }

  pause() {
    this.setTimeout = new Timeout(() => {
      this.timeout?.pause();
      this.paused = true;
      if (this.slide instanceof HTMLVideoElement) this.slide.pause();
    }, 300);
  }

  continue() {
    this.setTimeout?.clear();
    if (this.paused) {
      this.paused = false;
      this.timeout?.continue();
      if (this.slide instanceof HTMLVideoElement) this.slide.play();
    }
  }

  next() {
    if (this.paused) return;
    this.index >= this.elements.length - 1 ? (this.index = 0) : this.index++;
    this.show(this.index);
  }
  prev() {
    this.index <= 0 ? (this.index = this.elements.length - 1) : this.index--;
    this.show(this.index);
  }

  private addControls() {
    const nextButton = document.createElement("button");
    const prevButton = document.createElement("button");
    this.controls.appendChild(prevButton);
    this.controls.appendChild(nextButton);
    this.controls.addEventListener("pointerdown", () => this.pause());
    this.controls.addEventListener("pointerup", () => this.continue());

    nextButton.innerHTML = "Próximo Slide";
    prevButton.innerHTML = "Slide Anterior";

    nextButton.addEventListener("pointerup", () => this.next());
    prevButton.addEventListener("pointerup", () => this.prev());
  }

  private init() {
    this.show(this.index);
    this.addControls();
  }
}
