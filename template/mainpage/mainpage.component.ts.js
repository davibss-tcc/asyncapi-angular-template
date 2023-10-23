import { File, Text } from "@asyncapi/generator-react-sdk";
import { AsyncAPIDocument } from "@asyncapi/parser/cjs/models/v2/asyncapi";
import { sanitizeString } from "../../util/sanitizeString";

/**
 * 
 * @param {string[]} subjects 
 * @returns 
 */
function renderSubscribeToServices(subjects) {
  return subjects.map(subject => `
    this.clientImplementationService.${subject}.subscribe(
      {
        next: (res) => {
          //console.log('message received',res)
          this.receivedTopicPayload = res
        },
        error: (err) => {
          //console.log('error',err)
          this.receivedTopicPayload = undefined
        }
      }
    );
  `).join("\n\n");
}

/**
 * 
 * @param {{asyncapi: AsyncAPIDocument, params?: import("..").TemplateParameters}} _
 * @returns 
 */
export default function AppComponent({asyncapi, params}) {
  const shouldRenderAppComponent = params.onlySourceFiles === "false";

  let subjects = [];
  for (let channel of asyncapi.channels()) {
    subjects.push(`${sanitizeString(channel.id())}Subject`);
  }

  return shouldRenderAppComponent && (
<File name="mainpage.component.ts">
    <Text>
{`\
import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { ClientImplementationService, TopicMappingInterface } from '../client/implementation/client_implementation';
import { ALL_TOPICS } from '../client/services/topics';
import { BaseService } from '../client/services/base-service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})

export class MainpageComponent implements OnInit {
  
  connectedToBroker:boolean = false;
  allTopics = ALL_TOPICS;
  topicsMapping?: TopicMappingInterface[];
  selectedTopic?: string;
  selectedTopicPayload: any;
  selectedService?: BaseService<any>;

  receivedTopicPayload: any

  @ViewChild("topics") topics?: ElementRef
  @ViewChild("sendPayload") sendPayload?:ElementRef
  
  constructor(private clientImplementationService: ClientImplementationService){
      this.topicsMapping = clientImplementationService.TOPICS_MAPPING;
  }


  ngOnInit(): void {
    this.selectedTopic = this.allTopics[0];

    ${renderSubscribeToServices(subjects)}

    this.changeSelectedTopic();
    this.isConnectedToBroker();
  }

  isConnectedToBroker(){
    this.connectedToBroker  = this.clientImplementationService.areServicesConnectedToBroker()
  }

  changeSelectedTopic() {
    const selectedElement = this.topicsMapping?.find(
      (ele: TopicMappingInterface) => ele.topic === this.selectedTopic
    );
    if (selectedElement) {
      var newObj = Reflect.construct(selectedElement.topicObject, []);
      this.selectedTopicPayload = this.buildObject(Object.keys(newObj as any));
      this.selectedService = selectedElement.topicService;
      this.selectedTopicPayload.publisher_id =
        this.selectedService?.MQTT_SERVICE_OPTIONS.clientId;
      this.receivedTopicPayload = undefined;
    }
  }

  buildObject(keys:string[]){
    const result:any = {}
    keys.map(n=>n.substring(1)).forEach(k => result[k] = 'undefined')
    return result
  }

  sendMessage(){
    this.selectedTopicPayload = JSON.parse(this.sendPayload?.nativeElement.innerText)
    this.selectedService?.unsafePublish(this.selectedTopicPayload)
    //this.selectedService?.unsafePublish(this.sendPayload?.nativeElement.innerText)
  }
}
`}
    </Text>
</File>
);
}