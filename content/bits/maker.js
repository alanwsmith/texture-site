export class Maker {
  #color = "oklch(0.6 0.12 180)";
  #opacity = 0.7;

  bittyReady() {
    this.api.trigger("update");
  }

  backgroundImage() {
    const subs = [["URL", this.url()]];
    return this.api.makeTXT(this.template("background-image"), subs);
  }

  base64() {
    return btoa(this.svg());
  }

  color(ev, _) {
    this.#color = ev.value;
    this.api.trigger("update");
  }

  initColor(_, el) {
    el.value = this.#color;
  }

  initOpacity(_, el) {
    el.value = this.#opacity;
  }

  opacity(ev, el) {
    this.#opacity = ev.valueToFloat;
    el.innerHTML = this.#opacity;
    this.api.trigger("update");
  }

  update(_, el) {
    this.api.setProp(`--texture-color`, this.#color);
    this.api.setProp(`--texture-image`, this.url());
    el.innerHTML = this.backgroundImage();
  }

  svg() {
    const subs = [["OPACITY", this.#opacity]];
    return this.api.makeTXT(this.template("svg"), subs);
  }

  template(name) {
    switch (name) {
      case "background-image":
        return `background-image: URL;`;
      case "svg":
        return `
<svg viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg">
  <filter id="noiseFilter">
    <feTurbulence type="fractalNoise" baseFrequency="4" numOctaves="2" stitchTiles="stitch" result="noise" />
    <feColorMatrix type="saturate" values="0" result="grayscale" />
    <feMerge>
      <feMergeNode in="noise" />
      <feMergeNode in="grayscale" />
    </feMerge>
  </filter>
  <rect width="100%" height="100%" opacity="OPACITY" filter="url(#noiseFilter)"/>
</svg>`;
      case "url":
        return `url(data:image/svg+xml;base64,SVG)`;
    }
  }

  url() {
    const subs = [["SVG", this.base64()]];
    return this.api.makeTXT(this.template("url"), subs);
  }
}
