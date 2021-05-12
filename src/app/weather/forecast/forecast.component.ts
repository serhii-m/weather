import { Component, OnInit } from '@angular/core';
import { OpenWeatherService } from '../../open-weather.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
  location: string = '';
  params: any[] = [];

  constructor(private openWeatherService: OpenWeatherService) {  }

  ngOnInit(): void {
    this.location = this.openWeatherService.location;
    for (let i = 0; i < this.openWeatherService.forecastParams.length; i++) {
      this.params[i] = this.openWeatherService.forecastParams[i];
    }
  }
}





