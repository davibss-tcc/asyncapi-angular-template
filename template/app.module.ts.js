import { File, Text } from "@asyncapi/generator-react-sdk";

export default function AppComponent({params}) {
  const shouldRenderAppComponent = params.onlySourceFiles === "false";

  return shouldRenderAppComponent && (
<File name="app.module.ts">
    <Text>
{`\
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent,MainpageComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
`}
    </Text>
</File>
  );
}