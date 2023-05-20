type RGB = [number, number, number];
type XYZ = [number, number, number];
type CIE = [number, number];
type WhitePoint = [number, number, number];

// Assume standard D65 white point
const D65: WhitePoint = [0.95047, 1.0, 1.08883];

export function cieToXyz([x, y]: CIE, Y = 1): XYZ {
  const X = y === 0 ? 0 : (x * Y) / y;
  const Z = y === 0 ? 0 : ((1 - x - y) * Y) / y;

  return [X, Y, Z];
}

export function xyzToRgb([X, Y, Z]: XYZ): RGB {
  const x = X / D65[0];
  const y = Y / D65[1];
  const z = Z / D65[2];

  let r = x * 3.2406 - y * 1.5372 - z * 0.4986;
  let g = -x * 0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 - y * 0.204 + z * 1.057;

  const rgb = [r, g, b].map((channel) => {
    return (
      255 *
      (channel <= 0.0031308
        ? 12.92 * channel
        : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055)
    );
  });

  return rgb as RGB;
}

export function cieToHex(cie: CIE): string {
  const xyz = cieToXyz(cie);
  const rgb = xyzToRgb(xyz);
  const hex = rgbToHex(
    rgb.map((val) => Math.max(0, Math.min(255, Math.round(val))))
  );

  return hex;
}

export function rgbToHex(rgb: number[]): string {
  let hex = rgb.map((color) => {
    let hex = Math.round(color).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  });
  return "#" + hex.join("");
}

export function hexToRgb(hex: string): RGB {
  const bigint = parseInt(hex.replace(/#/g, ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}

export function rgbToXyz([r, g, b]: RGB): XYZ {
  let rr = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  let gg = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  let bb = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  const X = rr * 0.664511 + gg * 0.154324 + bb * 0.162028;
  const Y = rr * 0.283881 + gg * 0.668433 + bb * 0.047685;
  const Z = rr * 0.000088 + gg * 0.07231 + bb * 0.986039;

  return [X, Y, Z];
}

export function xyzToCie([X, Y, Z]: XYZ): CIE {
  const sum = X + Y + Z;
  const x = sum === 0 ? 0 : X / sum;
  const y = sum === 0 ? 0 : Y / sum;

  return [x, y];
}

export function hexToCie(hex: string): CIE {
  const rgb = hexToRgb(hex);
  const normalizedRgb = rgb.map((val) => val / 255) as RGB;
  const xyz = rgbToXyz(normalizedRgb);
  const cie = xyzToCie(xyz);

  return cie;
}

export function luminance(color: number[]): number {
  return 0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2];
}

export function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isLight(rgb: [number, number, number]): boolean {
  return getRelativeLuminance(rgb) > 0.5;
}

export function hexToRgbA(hex: string, alpha: number): string {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = Number("0x" + c.join(""));
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      "," +
      alpha +
      ")"
    );
  }
  throw new Error("Bad Hex");
}
