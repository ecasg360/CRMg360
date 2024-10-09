import { Component, OnInit, Input } from '@angular/core';
import { IContractMembers } from '@models/contractMembers';
import { IPerson } from '@models/person';

@Component({
  selector: 'app-contract-members-image',
  templateUrl: './contract-members-image.component.html',
  styleUrls: ['./contract-members-image.component.scss']
})
export class ContractMembersImageComponent implements OnInit {
  
  @Input() selectedMembersList: IPerson = <IPerson>{};

  constructor() { }

  ngOnInit() {
  }

}
