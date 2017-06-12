import { CustomHttpService } from './custom-http.service';
import { GlobalLoadingService } from './global-loading.service';
import { GroupService } from './group.service';
import { PanelService } from './panel.service';

export * from './custom-http.service';
export * from './global-loading.service';
export * from './group.service';
export * from './panel.service';

export const SERVICES: Array<any> = [
  CustomHttpService,
  GlobalLoadingService,
  GroupService,
  PanelService
]