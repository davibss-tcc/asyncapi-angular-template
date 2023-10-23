import { File, Text } from "@asyncapi/generator-react-sdk";

export default function AppComponent({params}) {
  const shouldRenderAppComponent = params.onlySourceFiles === "false";

  return shouldRenderAppComponent && (
<File name="mainpage.component.html">
    <Text>
{`\
<div class="container">
    <div class="tools">
        <div class="broker">
            <label>Connected to broker: </label>
            <label>{{connectedToBroker}}</label>
        </div>
        <div class="select-topics">
            <label>Select one topic:</label>
            <select #topics 
                [(ngModel)]="selectedTopic"
                (change)="changeSelectedTopic()">
                <option *ngFor="let topic of allTopics">{{topic}}</option>
            </select>
        </div>
        
        
    </div>
    <div class="texts">
        <div class="send-payload">
            <label>Payload to send:</label>
            <div class="container-viewer">
                <pre #sendPayload contenteditable="true">{{this.selectedTopicPayload | json}}</pre>
            </div>
        </div>
        <div class="send-button">
            <button (click)="sendMessage()">Send message</button>
        </div>
        <div class="receive-payload">
            <label>Received payload:</label>
            <div class="container-viewer">
                <pre>{{this.receivedTopicPayload | json}}</pre>
            </div>
        </div>
    </div>
</div>
`}
    </Text>
</File>
  );
}