import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-general',
  templateUrl: './report-general.component.html',
  styleUrls: ['./report-general.component.css'],
  animations: fuseAnimations
})
export class ReportGeneralComponent implements OnInit {

  perm: any ={};

  constructor(private route: ActivatedRoute) {
    this.perm = this.route.snapshot.data;
  }

  ngOnInit() {
  }

}
