export class Maker {
  #lightness = 0.6;
  #chroma = 0.16;
  #hue = 260;
  #opacity = 0.7;

  bittyReady() {
    this.api.trigger("update");
  }

  backgroundImage() {
    const subs = [["URL", this.url()]];
    return this.api.makeTXT(this.template("stylesheet"), subs);
  }

  base64() {
    return btoa(this.svg());
  }

  initChroma(_, el) {
    el.value = this.#chroma;
    this.api.setProp("--bg-chroma", this.#chroma);
  }

  initHue(_, el) {
    el.value = this.#hue;
    this.api.setProp("--bg-hue", this.#hue);
  }

  initLightness(_, el) {
    el.value = this.#lightness;
    this.api.setProp("--bg-lightness", this.#lightness);
  }

  initOpacity(_, el) {
    el.value = this.#opacity;
  }

  chroma(ev, _) {
    this.#chroma = ev.valueToFloat;
    this.api.setProp("--bg-chroma", this.#chroma);
  }

  hue(ev, _) {
    this.#hue = ev.valueToFloat;
    this.api.setProp("--bg-hue", this.#hue);
  }

  lightness(ev, _) {
    this.#lightness = ev.valueToFloat;
    this.api.setProp("--bg-lightness", this.#lightness);
  }

  opacity(ev, _) {
    this.#opacity = ev.valueToFloat;
    this.api.trigger("update");
  }

  update(_, el) {
    //this.api.setProp(`--texture-color`, this.#color);
    this.api.setProp(`--texture-image`, this.url());
    el.innerHTML = this.backgroundImage();
  }

  svg() {
    const subs = [
      ["OPACITY", this.#opacity],
    ];
    return this.api.makeTXT(this.template("svg"), subs);
  }

  template(name) {
    switch (name) {
      case "stylesheet":
        return `
:root {
  --bg-ligthness: LIGHTNESS;
  --bg-chroma: CHROMA;
  --bg-hue: HUE;
}

body {
  background-color: oklch(var(--bg-lightness) var(--bg-chroma) var(--bg-hue));
  background-image: URL;
}`;
      case "svg":
        return `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <filter id="noiseFilter">
    <feTurbulence type="fractalNoise" baseFrequency="3" numOctaves="2" stitchTiles="stitch" result="noise" />
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
