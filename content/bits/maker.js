export class Maker {
  #lightness = 0.35;
  #chroma = 0.1;
  #hue = 260;
  #opacity = 0.20;
  #svg = null;

  bittyInit() {
    this.#svg = this.template("svg");
  }

  bittyReady() {
    this.api.trigger("update");
  }

  stylesheet() {
    const subs = [
      ["LIGHTNESS", this.#lightness],
      ["CHROMA", this.#chroma],
      ["HUE", this.#hue],
      ["URL", this.url()],
    ];
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

  initSVG(_, el) {
    el.value = this.api.makeTXT(this.template("svg"));
  }

  chroma(ev, _) {
    this.#chroma = ev.valueToFloat;
    this.api.setProp("--bg-chroma", this.#chroma);
    this.api.trigger("update");
  }

  hue(ev, _) {
    this.#hue = ev.valueToFloat;
    this.api.setProp("--bg-hue", this.#hue);
    this.api.trigger("update");
  }

  lightness(ev, _) {
    this.#lightness = ev.valueToFloat;
    this.api.setProp("--bg-lightness", this.#lightness);
    this.api.trigger("update");
  }

  opacity(ev, _) {
    this.#opacity = ev.valueToFloat;
    this.api.trigger("update");
  }

  update(_, el) {
    this.api.setProp(`--texture-image`, this.url());
    el.innerHTML = this.stylesheet();
  }

  updateSVG(ev, _) {
    this.#svg = ev.value;
    this.api.trigger("update");
  }

  svg() {
    const subs = [
      ["OPACITY", this.#opacity],
    ];
    return this.api.makeTXT(this.#svg, subs);
  }

  template(name) {
    switch (name) {
      case "stylesheet":
        return `:root {
  --bg-lightness: LIGHTNESS;
  --bg-chroma: CHROMA;
  --bg-hue: HUE;
}

body {
  background-color: oklch(var(--bg-lightness) var(--bg-chroma) var(--bg-hue));
  background-size: 150px 150px;
  background-image: URL;
}`;
      case "svg":
        return `<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
  <filter id="noiseFilter">
    <feTurbulence type="fractalNoise" baseFrequency="3" numOctaves="2" result="noise" />
    <feColorMatrix type="saturate" values="0" result="grayscale" />
    <feComponentTransfer>
      <feFuncA in="grayscale" type="linear" slope="0.4" result="updated" />
    </feComponentTransfer>
    <feMerge>
      <feMergeNode in="noise" />
      <feMergeNode in="updated" />
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
