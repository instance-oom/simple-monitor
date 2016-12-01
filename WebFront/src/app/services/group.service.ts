import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { AppConfig } from './../app.config';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GroupService {

  private dataSource = new Subject<any>();
  private groupsStream = this.dataSource.asObservable();

  private _groups: Array<any>;
  private get groups(): Array<any> {
    return this._groups;
  }
  private set groups(value: Array<any>) {
    this._groups = value || [];
    this.dataSource.next(this._groups);
  }

  constructor(private http: CustomHttpService) {
    this.reload();
  }

  public subscriber(cb: Function) {
    this.groupsStream.forEach(data => cb(data));
  }

  public get(): Promise<any> {
    let url = `${AppConfig.API_ENDPOINT}/groups`;
    return new Promise((resolve, reject) => {
      if (this.groups && this.groups.length > 0) {
        return resolve(this.groups);
      }
      this.http.get(url)
        .then(res => {
          let data = res.json();
          this.groups = data;
          resolve(this.groups);
        })
        .catch(err => {
          reject(err.text() ? err.json() : '');
        });
    });
  }

  public getById(groupId: string): Promise<any> {
    let url = `${AppConfig.API_ENDPOINT}/groups/${groupId}`;
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .then(res => {
          resolve(res.json());
        })
        .catch(err => {
          reject(err.text() ? err.json() : '');
        });
    });
  }

  public addGroup(group: any): Promise<any> {
    let url = `${AppConfig.API_ENDPOINT}/groups`;
    return new Promise((resolve, reject) => {
      this.http.post(url, group)
        .then(res => {
          resolve(res.json());
        })
        .catch(err => {
          reject(err.text() ? err.json() : '');
        });
    });
  }

  public updateGroup(groupId: string, group: any): Promise<any> {
    let url = `${AppConfig.API_ENDPOINT}/groups/${groupId}`;
    return new Promise((resolve, reject) => {
      this.http.post(url, group)
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          reject(err.text() ? err.json() : '');
        });
    });
  }

  public deleteGroup(groupId: string): Promise<any> {
    let url = `${AppConfig.API_ENDPOINT}/groups/${groupId}`;
    return new Promise((resolve, reject) => {
      this.http.delete(url)
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          reject(err.text() ? err.json() : '');
        });
    });
  }

  public reload() {
    let url = `${AppConfig.API_ENDPOINT}/groups`;
    this.http.get(url)
      .then(res => {
        let data = res.json();
        this.groups = data;
      });
  }
}