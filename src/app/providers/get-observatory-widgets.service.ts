import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://hmisportal.moh.go.tz/dhis/', 'Vary': 'Origin' })
};
@Injectable({
  providedIn: 'root'
})
export class GetObservatoryWidgetsService {

  private baseUrl: string;
  constructor(private http: HttpClient) {
    // https://hmisportal.moh.go.tz/dhis/
    this.baseUrl = '../../../api/25';
  }

  getAllWidgets(): Observable<any> {
    return new Observable(observer => {
      const url = this.baseUrl + '/dataStore/observatoryWidgets';
      console.log(url);
      this.http.get(url, httpOptions).subscribe(
        (response: any) => {
          observer.next(response);
          observer.complete();
        },
        error => {
          console.log(this._handleError(error));
          observer.error(this._handleError(error));
        }
      );
    });
  }

  getWidgetById(id): Observable<any> {
    return new Observable(observer => {
      this.http.get(this.baseUrl + '/dataStore/observatoryWidgets/' + id, httpOptions).subscribe(
        (response: any) => {
          observer.next(response);
          observer.complete();
        }, error => {
          console.log(this._handleError(error));
          observer.error(this._handleError(error));
        }
      );
    });
  }
  private _handleError(err: HttpErrorResponse) {
    let error = null;
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      error = {
        message: err.error,
        status: err.status,
        statusText: err.statusText
      };
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      error = {
        message: err.error instanceof Object ? err.error.message : err.error,
        status: err.status,
        statusText: err.statusText
      };
    }

    return error;
  }

  createWidget(dashboardItemId, widgetData) {
    return new Observable(observer => {
        this.http.post(this.baseUrl + '/dataStore/observatoryWidgets/' + dashboardItemId, widgetData, httpOptions).subscribe(
          (response: any) => {
            observer.next(response);
            observer.complete();
          },
          error => {
            console.log(this._handleError(error));
            observer.error(this._handleError(error));
          }
        );
    });
  }

  saveWidget(dashboardItemId, widgetData) {
    return new Observable(observer => {
      this.http.put(this.baseUrl + '/dataStore/observatoryWidgets/' + dashboardItemId, widgetData, httpOptions).subscribe(
        (response: any) => {
          observer.next(response);
          observer.complete();
        },
        error => {
          console.log(this._handleError(error));
          observer.error(this._handleError(error));
        }
      );
    });
  }

  getUid() {
    return new Observable(observer => {
      this.http.get(this.baseUrl + '/system/id.json?limit=1', httpOptions).subscribe(
        (response: any) => {
          observer.next(response);
          observer.complete();
        },
        error => {
          console.log(this._handleError(error));
          observer.error(this._handleError(error));
        }
      );
    });
  }

  deleteWidget(id) {
    this.http.delete(this.baseUrl + '/dataStore/observatoryWidgets/' + id);
    console.log(this.baseUrl + '/dataStore/observatoryWidgets/' + id);
  }
}
