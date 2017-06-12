import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GlobalLoadingService } from './global-loading.service';

@Injectable()
export class CustomHttpService {
  constructor(
    private http: Http,
    private globalLoading: GlobalLoadingService
  ) {

  }

  public get(url: string, options?: any): Promise<any> {
    return this._request('GET', url, null, options);
  }

  public post(url: string, body: any, options?: any): Promise<any> {
    return this._request('POST', url, body, options);
  }

  public put(url: string, body: any, options?: any): Promise<any> {
    return this._request('PUT', url, body, options);
  }

  public delete(url: string, options?: any): Promise<any> {
    return this._request('DELETE', url, null, options);
  }

  _buildOptions(options: any, type: any) {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    if (type !== 'GET' && type !== 'DELETE') {
      headers.append('Content-Type', 'application/json');
    }
    if (options && options.headers && typeof options.headers === 'object') {
      Object.keys(options.headers).forEach(k => {
        headers.set(k, options.headers[k]);
      });
    }
    let reqOptions = new RequestOptions({
      headers: headers
    });
    return reqOptions;
  }

  _request(type: any, url: any, body: any, options: any) {
    options = options || {};
    let p: Observable<Response>;
    switch (type) {
      case 'GET':
        p = this.http.get(url, this._buildOptions(options, 'GET'));
        break;
      case 'POST':
        p = this.http.post(url, body, this._buildOptions(options, 'POST'));
        break;
      case 'PUT':
        p = this.http.put(url, body, this._buildOptions(options, 'PUT'));
        break;
      case 'DELETE':
        p = this.http.delete(url, this._buildOptions(options, 'DELETE'));
        break;
      default:
        throw new Error('Not Supported Method');
    }
    return new Promise((resolve, reject) => {
      if (!options.disableLoading) {
        this.globalLoading.add();
      }
      p.toPromise()
        .then((res: any) => {
          if (!options.disableLoading) {
            this.globalLoading.sub();
          }
          resolve(res);
        })
        .catch((err) => {
          if (!options.disableLoading) {
            this.globalLoading.sub();
          }
          if (err.status == 0) {
            err.json = () => {
              return {
                "message": "Server is no response."
              }
            }
          }
          reject(err);
        });
    });
  }
};