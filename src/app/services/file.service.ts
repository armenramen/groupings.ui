import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import UPLOAD_RES from '../../mock-data/file-upload-response.json';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly apiUrl = `${environment.apiUrl}/api/File/`;
  private readonly useMock = environment.useMock;
  private readonly fileHeader = {
    'Content-Type': 'multipart/form-data',
  }

  constructor(private http: HttpClient) { }

  uploadUserFile({ file, userId, taskGroupingId, userFileId }: any) {
    if (this.useMock) {
      return this.getMockFileUploadResponse();
    }

    const url = `${this.apiUrl}/UploadUserFile`;
    return this.http.post(url, file, {
      headers: {
        ...this.fileHeader,
        userId,
        taskGroupingId,
        userFileId,
      }
    })
  }

  saveUserFile() {

  }

  private getMockFileUploadResponse() {
    return of(UPLOAD_RES).pipe(delay(1000));
  }

}
