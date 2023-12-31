import { File, Text } from "@asyncapi/generator-react-sdk";
import { sanitizeString } from "../util/sanitizeString";
import { firstLower } from "../util/stringUtil";

export default function AppComponent({asyncapi, params}) {

  const shouldRenderAppComponent = params.onlySourceFiles === "false";

  const channels = asyncapi.channels().all();
  const services = channels.map(channel => {
    /** @type string */
    const sanitizedChannelName = sanitizeString(channel.id());
    return {
      serviceVariableName: `${firstLower(sanitizedChannelName)}Service`,
      serviceName: `${sanitizedChannelName}Service`,
      servicePath: `${sanitizedChannelName}-mqtt-service`
    }
  });

  return shouldRenderAppComponent && (
<File name="app.component.ts">
    <Text>
{`\
import { Component } from '@angular/core';
import { ClientImplementationService } from './client/implementation/client_implementation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-asyncapi-client';

  constructor(private clientImplementation: ClientImplementationService) {}
}
`}
    </Text>
</File>
  );
}