import { Component, OnDestroy, OnInit } from '@angular/core';
import { OpenWeatherService } from '../open-weather.service';
import { WindDirection } from './wind-direction';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionLike } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

declare let google: any;

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit, OnDestroy {
  weatherSearchForm: FormGroup;
  place: any = null;
  subscriptions: SubscriptionLike[] = [];
  weatherData: any;
  description: string;
  weatherIcon: string;
  temperature: number;
  feelsLike: number;
  tempIconSrc: string = 'assets/SVGs/thermometer-half.svg';
  windSpeed: number;
  windDirectIconSrc: string;
  windDirect: string;
  windIconSrc: string = 'assets/SVGs/wind.svg';
  cloudiness: number;
  humidity: number;
  static forecastData: any;
  lat: any;
  lon: any;
  params: any[] = [];
  dateArr: any[] = [];
  descriptIcons: any[] = [];
  forecastDescription: string[] = [];
  maxTemp: number[] = [];
  minTemp: number[] = [];
  forecastWindSpeed: number[] = [];
  windDirection: any[] = [];
  pressure: number[] = [];
  pops: number[] = [];
  rainVolume: string[] = [];
  snowVolume: string[] = [];
  clouds: number[] = [];
  forecastHumidity: number[] = [];
  sunriseData: any[] = [];
  sunsetData: any[] = [];

  constructor(private formBuilder: FormBuilder,
              private openWeatherService: OpenWeatherService) { }

  ngOnInit(): void {
    this.weatherSearchForm = this.formBuilder.group({
      location: [null, [Validators.required,
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ' -.,]*$/)]]
    });
  }

  ngOnDestroy(): void {
    this.openWeatherService.location = this.weatherSearchForm.value.location;
    this.openWeatherService.forecastParams = this.params;
    this.makeUnsubscriptions();
  }

  initAutocomplete(): void {
    // Create the search box and link it to the UI element.
    let input = document.getElementById('my-input-searchbox') as HTMLInputElement;
    let autocomplete = new google.maps.places.Autocomplete(input);
    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(["address_components", "name"]);
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    autocomplete.addListener('place_changed', () => {
      this.place = autocomplete.getPlace();
      this.weatherSearchForm.value.location = this.place.name;
    });
    input.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    });
  }

  onSubmit(formValue): void {
    let weatherbox=document.getElementById('weatherbox');
    this.subscriptions.push(this.openWeatherService
      .getCurrentWeather(formValue)
      .subscribe(data => {
        this.weatherData=data;
        this.description=this.weatherData['weather'][0]['description'];
        this.temperature=this.weatherData['main']['temp'];
        this.feelsLike=this.weatherData['main']['feels_like'];
        this.weatherIcon=OpenWeatherService.getIconUrl(this.weatherData['weather'][0]['icon']);
        this.windSpeed=this.weatherData['wind']['speed'];
        this.windDirect=WindDirection.setWindDirection(this.weatherData.wind.deg)[0];
        this.windDirectIconSrc=WindDirection.setWindDirection(this.weatherData.wind.deg)[1];
        this.cloudiness=this.weatherData['clouds']['all'];
        this.humidity=this.weatherData['main']['humidity'];
        this.lat=this.weatherData.coord.lat;
        this.lon=this.weatherData.coord.lon;
        weatherbox.hidden = false;
      }, (error: HttpErrorResponse) => {
        console.log(error);
        weatherbox.hidden = !!error;
        document.getElementById('noResult').hidden = false;
      }, () => {}));
  }

  knowForecast(): void {
    setTimeout(() => {
      document.getElementById('searchButton').setAttribute('disabled', 'disabled');
    }, 400);
    setTimeout(() => {
      this.subscriptions.push(this.openWeatherService
      .getForecastData(this.lat, this.lon)
      .subscribe(data => {
        WeatherComponent.forecastData = data;
        this.setParams();
        this.params = [this.dateArr, this.descriptIcons, this.forecastDescription,
      this.maxTemp, this.minTemp, this.forecastWindSpeed, this.windDirection,
      this.pressure, this.pops, this.rainVolume, this.snowVolume,
      this.clouds, this.forecastHumidity, this.sunriseData, this.sunsetData];
        document.getElementById('question').hidden = false;
      }, (error: HttpErrorResponse) => {
        console.log(error);
        document.getElementById('question').hidden = !!error;
      }, () => {
        console.log('Completed')
      }));
      document.getElementById('searchButton').hidden = true;
      document.getElementById('resetButton').hidden = false;
      }, 3000);
  }

  setParams(): void {
    for (let i = 0; i < 7; i++) {
      let options = { weekday: 'short', month: 'short', day: 'numeric' };
      if (OpenWeatherService.getLanguage(document.querySelector('.form-select')) === 'uk') {
        this.dateArr.push(new Date(
          (WeatherComponent.forecastData.daily[i].dt + WeatherComponent.forecastData.timezone_offset) * 1000)
          .toLocaleDateString('uk', options));
      } else if (OpenWeatherService.getLanguage(document.querySelector('.form-select')) === 'ru') {
        this.dateArr.push(new Date(
          (WeatherComponent.forecastData.daily[i].dt + WeatherComponent.forecastData.timezone_offset) * 1000)
          .toLocaleDateString('ru', options));
      } else {
        this.dateArr.push(new Date(
          (WeatherComponent.forecastData.daily[i].dt + WeatherComponent.forecastData.timezone_offset) * 1000)
          .toLocaleDateString('en', options));
      }
      this.descriptIcons.push(OpenWeatherService.getIconUrl(WeatherComponent.forecastData.daily[i].weather[0].icon));
      this.forecastDescription.push(WeatherComponent.forecastData.daily[i].weather[0].description);
      this.maxTemp.push(Math.round(WeatherComponent.forecastData.daily[i].temp.max));
      this.minTemp.push(Math.round(WeatherComponent.forecastData.daily[i].temp.min));
      this.forecastWindSpeed.push(Math.round(WeatherComponent.forecastData.daily[i].wind_speed));
      this.windDirection.push(WindDirection.setWindDirection(WeatherComponent.forecastData.daily[i].wind_deg));
      this.pressure.push(WeatherComponent.forecastData.daily[i].pressure);
      this.pops.push(Math.trunc(WeatherComponent.forecastData.daily[i].pop * 100));
      if (WeatherComponent.forecastData.daily[i].rain) {
        this.rainVolume.push((WeatherComponent.forecastData.daily[i].rain).toFixed(1));
      } else {
        this.rainVolume.push('0');
      }
      if (WeatherComponent.forecastData.daily[i].snow) {
        this.snowVolume.push((WeatherComponent.forecastData.daily[i].snow).toFixed(1));
      } else {
        this.snowVolume.push('0');
      }
      this.clouds.push(WeatherComponent.forecastData.daily[i].clouds);
      this.forecastHumidity.push(WeatherComponent.forecastData.daily[i].humidity);
      this.sunriseData.push(new Date(
        (WeatherComponent.forecastData.daily[i].sunrise + WeatherComponent.forecastData.timezone_offset) * 1000)
        .toUTCString().slice(17, 22));
      this.sunsetData.push(new Date(
        (WeatherComponent.forecastData.daily[i].sunset + WeatherComponent.forecastData.timezone_offset) * 1000)
        .toUTCString().slice(17, 22));
    }
  }

  makeUnsubscriptions(): void {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  clearData(): void {
    this.makeUnsubscriptions();
    this.params = [];
    this.dateArr = [];
    this.descriptIcons = [];
    this.forecastDescription = [];
    this.maxTemp = [];
    this.minTemp = [];
    this.forecastWindSpeed = [];
    this.windDirection = [];
    this.pressure = [];
    this.pops = [];
    this.rainVolume = [];
    this.snowVolume = [];
    this.clouds = [];
    this.forecastHumidity = [];
    this.sunriseData = [];
    this.sunsetData = [];
    document.getElementById('weatherbox').hidden = true;
    document.getElementById('question').hidden = true;
    document.getElementById('searchButton').hidden = false;
    document.getElementById('resetButton').hidden = true;
    document.getElementById('noResult').hidden = true;
  }
}

