import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { AppConfig } from './../app.config';

@Injectable()
export class PanelService {

  constructor(private http: CustomHttpService) {

  }  

  public getById(panelId: string): Promise<any> {
    let url = `${AppConfig.API_ENDPOINT}/panels/${panelId}`;
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

  public addPanel(panel: any): Promise<any> {
    let url = `${AppConfig.API_ENDPOINT}/panels`;
    return new Promise((resolve, reject) => {
      this.http.post(url, panel)
        .then(res => {
          resolve(res.json());
        })
        .catch(err => {
          reject(err.text() ? err.json() : '');
        });
    });
  }

  public updatePanel(panelId: string, panel: any): Promise<any> {
    let url = `${AppConfig.API_ENDPOINT}/panels/${panelId}`;
    return new Promise((resolve, reject) => {
      this.http.post(url, panel)
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          reject(err.text() ? err.json() : '');
        });
    });
  }

  public deletePanel(panelId: string): Promise<any> {
    let url = `${AppConfig.API_ENDPOINT}/panels/${panelId}`;
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
}