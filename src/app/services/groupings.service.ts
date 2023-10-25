import { Injectable } from '@angular/core';
import GROUPS from '../../mock-data/groupings.json';
import GROUPS_WITH_PROPS from '../../mock-data/groupings copy.json';
import MOCK_INTERVIEWS from '../../mock-data/interviews.json';
import MOCK_PROGRESSIONS from '../../mock-data/progressions.json';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { TaskGroupFiles } from '../utilities/models/response-models';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GroupingsService {
  readonly apiUrl = `${environment.apiUrl}/api/TaskGrouping`;
  readonly reportUrl = `${environment.apiUrl}/api/Report`;
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
    }).pipe(catchError(this.logError))

  }

  getGroupItems(userId: string, taskGroupingId: string): Observable<TaskGroupFiles | any> {
    if (this.useMock) {
      return this.getMockGroupItems(taskGroupingId)
    }

    const url = `${this.apiUrl}/GetTaskGroupingFiles`;
    return this.http.get(url, {
      headers: {
        userId,
        taskGroupingId
      }
    }).pipe(catchError(this.logError))
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
    }).pipe(catchError(this.logError))
  }

  saveGroup(userId: string, group: any) {
    if (this.useMock) {
      return this.mockSaveGroup(group);
    }

    const url = `${this.apiUrl}/SaveTaskGrouping`;
    return this.http.post(url, group, {
      headers: {
        userId,
        taskGroupingId: group.taskGroupingId || ''
      }
    }).pipe(catchError(this.logError))
  }

  downloadReport(userId: string, taskGroupingId: string) {
    const url = `${this.reportUrl}/GenerateReport`
    return this.http.get(url, {
      headers: {
        userId,
        taskGroupingId,
      },
      responseType: 'arraybuffer',
      observe: 'response'
    }).pipe(tap((response: any) => {
      const blob = new Blob([response.body], { type: response.headers.get('content-type') });
      const fileName = response.headers.get('Content-Disposition')
        .split(';')
        .find((e: string) => e.includes('filename='))
        .replace('filename=', '');
      const anchorElement = document.createElement('a');
      const file = new File([blob], fileName, { type: response.headers.get('content-type') });
      const url = window.URL.createObjectURL(file);

      anchorElement.href = url;
      anchorElement.download = fileName;
      anchorElement.click();
      window.URL.revokeObjectURL(url);
    }));
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

  private logError(err: any) {
    console.log(err)
    return of(err);
  }

}
