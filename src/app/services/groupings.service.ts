import { Injectable } from '@angular/core';
import GROUPS from '../../mock-data/groupings.json';
import GROUPS_WITH_PROPS from '../../mock-data/groupings copy.json';
import MOCK_INTERVIEWS from '../../mock-data/interviews.json';
import MOCK_PROGRESSIONS from '../../mock-data/progressions.json';
import { Observable, delay, of } from 'rxjs';
import { TaskGroupFiles } from '../utilities/models/response-models';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { group } from '@angular/animations';


@Injectable({
  providedIn: 'root'
})
export class GroupingsService {
  readonly apiUrl = `${environment.apiUrl}/api/TaskGrouping`;
  readonly useMock = environment.useMock;

  constructor(private http: HttpClient) {
  }

  getGroupingList(userId: string) {

    if (this.useMock) {
      return of(GROUPS).pipe(delay(600));
    }

    const url = `${this.apiUrl}/GetTaskGrouping`;
    return this.http.get(url, {
      headers: { userId }
    })

  }

  getGroupItems(userId: string, taskGroupingId: string): Observable<TaskGroupFiles | any> {
    if (this.useMock) {
      return this.getMockGroupItems(taskGroupingId)
    }

    // return of()
    const url = `${this.apiUrl}/GetTaskGroupingFiles`;
    return this.http.get(url, {
      headers: {
        userId,
        taskGroupingId
      }
    })
  }

  getGroupListWithProps(userId: string) {
    if (this.useMock) {
      return this.mockGroupDetail();
    }

    const url = `${this.apiUrl}/GetTaskGroupingInfos`;
    return this.http.get(url, {
      headers: {
        userId
      }
    })
  }

  updateGroup(userId: string, group: any) {
    if (this.useMock) {
      return this.mockSaveGroup(group);
    }

    const url = `${this.apiUrl}/SaveTaskGroupingProperty`;
    return this.http.post(url, group, {
      headers: {
        userId,
        taskGroupingId: group.id
      }
    })
  }


  private getMockGroupItems(groupId: string) {
    let mockData = {};
    if (groupId === 'Interviews') {
      mockData = MOCK_INTERVIEWS;
    } else if (groupId === 'Progression') {
      mockData = MOCK_PROGRESSIONS;
    } else {
      mockData = {
        id: 'test',
        groupName: 'Test',
        files: []
      }
    }

    return of(mockData).pipe(delay(600))
  }

  private mockGroupDetail() {
    return of(GROUPS_WITH_PROPS);
  }

  private mockSaveGroup(group: any) {
    return of(group).pipe(delay(600));
  }

}
