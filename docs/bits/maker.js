export class Maker {
  #color;
  #opacity;

  bittyReady() {
    console.log("asdf");
  }

  base64() {
    return btoa(this.svg());
  }

  color(ev, _) {
    this.#color = ev.value;
    this.api.trigger("outputCSS");
  }

  opacity(ev, el) {
    this.#opacity = ev.valueToFloat;
    el.innerHTML = this.#opacity;
    this.api.trigger("outputCSS");
  }

  outputCSS(_, el) {
    this.api.setProp(`--texture-color`, this.#color);
    el.innerHTML = this.url();
  }

  svg() {
    const subs = [
      ["OPACITY", this.#opacity],
    ];
    return this.api.makeTXT(this.template("svg"), subs);
  }

  template(name) {
    switch (name) {
      case "image":
        return `background-image: URL;`;
      case "svg":
        return `
<svg viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg">
  <filter id="noiseFilter">
    <feTurbulence type="fractalNoise" baseFrequency="3" numOctaves="1" stitchTiles="stitch" result="noise" />
    <feColorMatrix type="saturate" values="0" result="grayscale" />
    <feMerge>
      <feMergeNode in="noise" />
      <feMergeNode in="grayscale" />
    </feMerge>
  </filter>
  <rect width="100%" height="100%" opacity="OPACITY" filter="url(#noiseFilter)"/>
</svg>`;
      case "url":
        return `url("data:image/svg+xml;base64,SVG)`;
    }
  }

  url() {
    const subs = [
      ["SVG", this.base64()],
    ];
    return this.api.makeTXT(this.template("url"), subs);
  }
}
