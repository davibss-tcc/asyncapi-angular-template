import { File, Text } from "@asyncapi/generator-react-sdk"

export default function MosquittoConf() {
    const files = [];
    files.push(
<File name="mosquitto.conf">
    <Text>
{`\
# mosquitto.conf example, put this in your /etc/mosquitto/conf.d
listener 1883 0.0.0.0
listener 8080 0.0.0.0
protocol websockets
allow_anonymous true`}
    </Text>
</File>
    );
    return files;
}