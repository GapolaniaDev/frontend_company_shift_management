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

import {
  heroChevronLeft,
  heroChevronRight,
  heroPlus,
  heroCalendarDays,
  heroUserCircle,
  heroChevronDown,
  heroEllipsisVertical,
  heroXMark
} from '@ng-icons/heroicons/outline';

@NgModule({
  imports: [
    NgIconsModule.withIcons({
      heroArrowsPointingOutSolid,
      heroArrowPathSolid,
      heroSunSolid,
      heroCalendarDaysSolid,
      heroClockSolid,
      heroMoonSolid,
      // Outline icons
      heroChevronLeft,
      heroChevronRight,
      heroPlus,
      heroCalendarDays,
      heroUserCircle,
      heroChevronDown,
      heroEllipsisVertical,
      heroXMark
    })
  ],
  exports: [NgIconsModule]
})
export class SharedNgIconsModule {
}
