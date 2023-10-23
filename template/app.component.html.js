import { File, Text } from "@asyncapi/generator-react-sdk";

export default function AppComponent({asyncapi, params}) {
  const shouldRenderAppComponent = params.onlySourceFiles === "false";

  return shouldRenderAppComponent && (
<File name="app.component.html">
    <Text>
{`\
<app-mainpage></app-mainpage>
<router-outlet></router-outlet>
`}
    </Text>
</File>
  );
}