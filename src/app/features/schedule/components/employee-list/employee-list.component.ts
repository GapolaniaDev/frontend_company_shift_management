import {Component} from '@angular/core'
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees = [
    {
      name: 'Soph Anderson',
      hours: '0.00Hrs/$0.00',
      photo: 'https://replicate.delivery/xezq/dtSNleCKygXgBKFFo3VHR9q5X1EdnF6k2DyhsI1b8aFBPlIKA/out-0.png',
      shifts: [
        {time: '1:45am - 10:45am', person: 'Jeremy Becker'},
        {time: '2am - 10am', person: 'Adrian Abdipranoto'}
      ]
    },
    {
      name: 'Jeremy Becker',
      hours: '38.48Hrs/$967.00',
      photo: 'https://replicate.delivery/xezq/MEwkR5yamgbWIJHGjESulIaiYojU2gzsXij8J4ZHqf2BPlIKA/out-0.png',
      shifts: [
        {time: '7am - 3pm', person: 'John Dixon'},
        {time: '9am - 5pm', person: 'Abby Baker'}
      ]
    },
    {
      name: 'Lauren Rogers',
      hours: '23.60Hrs/$531.32',
      photo: 'https://replicate.delivery/xezq/9bogAG8bzOZ7Dh3CFUJpr8bjR9cVWuueUnLr3uAxVu7APlIKA/out-0.png',
      shifts: [
        {time: '9:45am - 5:45pm', person: 'Imran Chowdhury'},
        {time: '7am - 3pm', person: 'Brett Maynard'}
      ]
    },
    {
      name: 'John Dixon',
      hours: '15.60Hrs/$357.32',
      photo: 'https://replicate.delivery/xezq/IpCU3IeSVhWLDaggiAmqVNubV6XfPneXeFh1sUXTNVzN4pERB/out-0.png',
      shifts: [
        {time: '6am - 2pm', person: 'Lauren Rogers'},
        {time: '8am - 4pm', person: 'Dan Smith'}
      ]
    },
    {
      name: 'Michelle Huang',
      hours: '27.00Hrs/$621.00',
      photo: 'https://replicate.delivery/xezq/dtSNleCKygXgBKFFo3VHR9q5X1EdnF6k2DyhsI1b8aFBPlIKA/out-0.png',
      shifts: [
        {time: '7am - 3pm', person: 'Russell Noble'},
        {time: '8:30am - 3:45pm', person: 'Shauna Kenny'}
      ]
    },
    {
      name: 'Dan Smith',
      hours: '15.60Hrs/$301.32',
      photo: 'https://replicate.delivery/xezq/WVPN1zXUlYL3FFIf9T2KHyoiCG7q0UUNPCsHQUGM0enBeUioA/out-0.png',
      shifts: [
        {time: '9am - 5pm', person: 'Lauren Rogers'},
        {time: '2pm - 8pm', person: 'Soph Anderson'}
      ]
    },
    {
      name: 'Annie Carroll',
      hours: '12.00Hrs/$245.00',
      photo: 'https://replicate.delivery/xezq/iCppEfRKTfpKpU6QkV9OMKfitj50U6yLVTSvpHvtYfdR4pERB/out-0.png',
      shifts: [
        {time: '11am - 6pm', person: 'Michelle Huang'},
        {time: '1pm - 7pm', person: 'Dan Smith'},
        {}, {}, {time: '1pm - 7pm', person: 'Dan Smith'},
      ]
    },
    {
      name: 'Bentley MacDonald',
      hours: '7.10Hrs/$155.14',
      photo: 'https://replicate.delivery/xezq/tEKUEqHfUV34BanYuHdgfvzj8w6peGaMhNQvRRfo1LXE4pERB/out-0.png',
      shifts: [
        {time: '10am - 4pm', person: 'Annie Carroll'},
        {time: '12pm - 8pm', person: 'Michelle Huang'}
      ]
    }
  ];

}
