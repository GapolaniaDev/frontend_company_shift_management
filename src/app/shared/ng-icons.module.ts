import {NgModule} from '@angular/core';
import {NgIconsModule} from '@ng-icons/core';
import {
  heroArrowsPointingOutSolid,
  heroArrowPathSolid,
  heroSunSolid,
  heroCalendarDaysSolid,
  heroClockSolid,
  heroMoonSolid,
} from '@ng-icons/heroicons/solid';

@NgModule({
  imports: [
    NgIconsModule.withIcons({
      heroArrowsPointingOutSolid,
      heroArrowPathSolid,
      heroSunSolid,
      heroCalendarDaysSolid,
      heroClockSolid,
      heroMoonSolid
    })
  ],
  exports: [NgIconsModule]
})
export class SharedNgIconsModule {
}
