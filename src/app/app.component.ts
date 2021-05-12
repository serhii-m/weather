import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather';
  langNames: string[] = ['English', 'Україньска', 'Русский'];

  constructor(
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'uk', 'ru']);
    translate.setDefaultLang('en');
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  setTheme(): void {
    if (document.body.className === "light") {
        document.body.className="dark";
      } else {
        document.body.className="light";
      }
  }
}
