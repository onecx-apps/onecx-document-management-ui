import {
  ConfigurationService,
  AppStateService,
  PortalApiConfiguration,
} from '@onecx/portal-integration-angular';
import { environment } from '../../environments/environment';
import { Configuration } from '../generated/configuration';

export function apiConfigProvider(
  configService: ConfigurationService,
  appStateService: AppStateService
) {
  return new PortalApiConfiguration(
    Configuration,
    environment.API_BASE_PATH,
    configService,
    appStateService
  );
}
