import { Component, OnInit } from '@angular/core';
import { EEventType } from '@enums/modules-types';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.css']
})
export class ReleasesComponent implements OnInit {

  eventType = EEventType;

  constructor() { }

  ngOnInit() {
    console.log('Entró al releases component: ', this.eventType);
  }

}
