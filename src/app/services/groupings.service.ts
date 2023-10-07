import { Injectable } from '@angular/core';
import GROUPS from '../../mock-data/groupings.json';
import MOCK_INTERVIEWS from '../../mock-data/interviews.json';
import MOCK_PROGRESSIONS from '../../mock-data/progressions.json';
import { Observable, delay, of } from 'rxjs';
import { TaskGroupFiles } from '../utilities/models/response-models';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GroupingsService {
  readonly url = environment.apiUrl;
  readonly useMock = environment.useMock;

  constructor(private http: HttpClient) {
  }

  getGroupingList() {
    if (this.useMock) {
      return of(GROUPS).pipe(delay(600));
    }

    return of();
  }

  getGroupItems(group: any): Observable<TaskGroupFiles | any> {
    if (this.useMock) {
      return this.getMockGroupItems(group.name)
    }

    return of()
  }


  private getMockGroupItems(groupName: string) {
    let mockData = {};
    if (groupName === 'Interviews') {
      mockData = MOCK_INTERVIEWS;
    } else if (groupName === 'Progression') {
      mockData = MOCK_PROGRESSIONS;
    } else {
      mockData = {
        id: 'test',
        groupName: groupName,
        files: []
      }
    }

    return of(mockData).pipe(delay(600))
  }

}
