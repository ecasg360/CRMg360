import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IPerson } from '@models/person';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {

  composersList: IPerson[] = [];
  isAdmin: boolean = true;
  personId: number = 0;
  perm: any ={};

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {
    this.perm = this.route.snapshot.data;
  }

  ngOnInit() {
    this.getComposers();
  }

  getComposers() {
    return this.apiService.get(EEndpoints.Composers).subscribe(
      (response: ResponseApi<IPerson[]>) => {
        if (response.code == 100) {
          this.composersList = response.result;
        }
      }, err => console.log('http error', err)
    )
  }

}
