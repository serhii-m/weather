import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const serviceUrl1 = 'https://api.openweathermap.org/data/2.5/weather';
const serviceUrl2 = 'https://api.openweathermap.org/data/2.5/onecall';
const apiKey = 'apiKey';

@Injectable({
  providedIn: 'root'
})
export class OpenWeatherService {
  location: string;
  forecastParams: any[] = [];

  constructor(private http: HttpClient) { }

  static getLanguage(elem: any): string {
    let lang: string;
    if (elem.value === 'uk') {
      lang = 'uk';
    } else if (elem.value === 'ru') {
      lang = 'ru';
    } else {
      lang = 'en';
    }
    return lang;
  }

  getCurrentWeather(city: string){
    return this.http.get(
      serviceUrl1 + '?q=' + city + '&APPID=' + apiKey + '&units=metric' + '&lang=' + OpenWeatherService.getLanguage(document.querySelector('.form-select')),
    );
  }

  getForecastData(lat: number, lon: number) {
    return this.http.get(serviceUrl2 + '?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts' + '&APPID=' + apiKey + '&units=metric' + '&lang=' + OpenWeatherService.getLanguage(document.querySelector('.form-select')));
  }

  static getIconUrl(icon: string) {
    return 'http://openweathermap.org/img/wn/' + icon + "@2x.png"
  }
}
