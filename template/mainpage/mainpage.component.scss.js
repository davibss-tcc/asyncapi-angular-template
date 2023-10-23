import { File, Text } from "@asyncapi/generator-react-sdk";

export default function AppComponent({params}) {
  const shouldRenderAppComponent = params.onlySourceFiles === "false";

  return shouldRenderAppComponent && (
<File name="mainpage.component.scss">
    <Text>
{`\
.container{
    display: flex;
    flex-direction: column;
    width: 98vw;
    height: 98vh;

    .tools{
        display: flex;
        align-items: center;
        height: 30px;
        flex-direction: row;
        width: 100%;
        
        
        .broker{
            margin-right: 20px;
        }
        .select-topics{
            display: flex;
            width: 340px;
            margin-left: 20px;

            select{
                margin-left: 10px;
            }
        }

        
    }
    .texts{
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 440px;
        margin-top: 10px;

        .container-viewer{
            display: block;
            height: 100%;
            border: 1px solid rgb(121, 120, 120);
            border-radius: 4px;
        }
        .send-payload{
            width: 42%;
        }
        .send-button {
            display: flex;
            align-items: center;
        }
        .receive-payload {
            width: 42%;
        }
    }
}
`}
    </Text>
</File>
  );
}