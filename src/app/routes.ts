import { Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { AboutComponent} from "./about/about.component";
import { ContactsComponent} from "./contacts/contacts.component";
import { ForecastComponent } from "./weather/forecast/forecast.component";

export const allAppRoutes: Routes = [
  { path: '', component: WeatherComponent },
  { path: 'about', component: AboutComponent},
  { path: 'contacts', component: ContactsComponent},
  { path: 'forecast', component: ForecastComponent },
];
