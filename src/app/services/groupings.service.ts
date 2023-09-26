import { Injectable } from '@angular/core';
import GROUPS from '../../mock-data/groupings.json';
import INTERVIEWS from '../../mock-data/interviews.json';
import { Observable, delay, of } from 'rxjs';
import { GroupItemResponse } from '../utilities/models/response-models';



@Injectable({
  providedIn: 'root'
})
export class GroupingsService {
  constructor() { }

  getGroupingList() {
    return of(GROUPS);
  }

  getGroupItems(group: any): Observable<GroupItemResponse> {
    const response: GroupItemResponse = {
      groupName: INTERVIEWS.groupName,
      items: INTERVIEWS.items
    }
    if (group.name === 'Interviews') {
      return of(response).pipe(delay(600))
    }

    return of({
      groupName: group.name,
      items: []
    });
  }

}
