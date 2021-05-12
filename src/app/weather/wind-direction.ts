export class WindDirection {

  static setWindDirection(wd: number): string[] {
    let srcString: string;
    let windDir: string;

    if ((wd >= 0 && wd <= 22) || (wd >= 337 && wd <= 360)) {
      srcString = 'assets/SVGs/arrow-down-circle.svg';
      windDir = "N";
    } else if (wd >= 23 && wd <= 67) {
      srcString = 'assets/SVGs/arrow-down-left-circle.svg';
      windDir = "NE";
    } else if (wd >= 68 && wd <= 112) {
      srcString = 'assets/SVGs/arrow-left-circle.svg';
      windDir = "E";
    } else if (wd >= 113 && wd <= 157) {
      srcString = 'assets/SVGs/arrow-up-left-circle.svg';
      windDir = "SE";
    } else if (wd >= 158 && wd <= 202) {
      srcString = 'assets/SVGs/arrow-up-circle.svg';
      windDir = "S";
    } else if (wd >= 203 && wd <= 247) {
      srcString = 'assets/SVGs/arrow-up-right-circle.svg';
      windDir = "SW";
    } else if (wd >= 248 && wd <= 292) {
      srcString = 'assets/SVGs/arrow-right-circle.svg';
      windDir = "W";
    } else if (wd >= 293 && wd <= 336) {
      srcString = 'assets/SVGs/arrow-down-right-circle.svg';
      windDir = "NW";
    }
    return [windDir, srcString];
  }
}
