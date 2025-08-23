import {NgModule} from '@angular/core'
import {NgIconsModule} from '@ng-icons/core';
import {
  heroArrowPathSolid,
  heroArrowsPointingOutSolid,
  heroCalendarDaysSolid,
  heroClockSolid,
  heroMoonSolid,
  heroSunSolid,
} from '@ng-icons/heroicons/solid';

import {
  heroCalendarDays,
  heroChevronDown,
  heroChevronLeft,
  heroChevronRight,
  heroEllipsisVertical,
  heroPlus,
  heroUserCircle,
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
