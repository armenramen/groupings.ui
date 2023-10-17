import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import UPLOAD_RES from '../../mock-data/file-upload-response.json';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly apiUrl = `${environment.apiUrl}/api/File`;
  private readonly useMock = environment.useMock;

  constructor(private http: HttpClient) { }

  getUserFile({ userId, taskGroupingId, userFileId }: any) {
    if (this.useMock) {
      return this.mockUserFile();
    }

    const url = `${this.apiUrl}/GetUserFile`;
    return this.http.get(url, {
      headers: {
        userId,
        taskGroupingId,
        userFileId,
      }
    })
  }

  uploadUserFile({ file, userId, taskGroupingId, userFileId }: any) {
    if (this.useMock) {
      return this.getMockFileUploadResponse();
    }

    const url = `${this.apiUrl}/UploadUserFile`;
    return this.http.post(url, file, {
      headers: {
        userId,
        taskGroupingId,
        userFileId: userFileId || '',
      }
    })
  }

  saveUserFile({ userId, detail, userFileId, properties }: any) {
    if (this.useMock) {
      return this.mockSaveFile();
    }

    const url = `${this.apiUrl}/SaveUserFile`;
    const body = {
      id: userFileId,
      detail,
      recommendedProperties: properties
    }
    return this.http.post(url, body, {
      headers: {
        id: userId,
        taskGroupingId: detail.userTaskGroupingId,
        userFileId: userFileId || '',
      }
    })
  }

  downloadFile({ userId, taskGroupingId, userFileId }: any) {
    if (this.useMock) {
      return of({}).pipe(delay(1000));
    }

    const url = `${this.apiUrl}/DownloadUserFile`;
    return this.http.get(url, {
      headers: {
        userId,
        taskGroupingId,
        userFileId: userFileId,
      }
    });
  }

  deleteFile({ userId, taskGroupingId, userFileId }: any) {
    if (this.useMock) {
      return of({}).pipe(delay(1000));
    }

    const url = `${this.apiUrl}/DeleteUserFile`;
    return this.http.delete(url, {
      headers: {
        userId,
        taskGroupingId,
        userFileId: userFileId,
      }
    });
  }

  private getMockFileUploadResponse() {
    return of(UPLOAD_RES).pipe(delay(1000));
  }

  private mockUserFile() {
    return of(UPLOAD_RES).pipe(delay(1000));
  }

  private mockSaveFile() {
    return of(UPLOAD_RES).pipe(delay(1000));
  }

}
