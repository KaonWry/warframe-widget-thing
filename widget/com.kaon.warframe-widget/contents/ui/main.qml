import QtQuick
import org.kde.plasma.components as PlasmaComponents
import org.kde.plasma.plasmoid
// import QtQuick.Layouts

PlasmoidItem {
    id: root
    preferredRepresentation: FullRepresentation

    //OR using Plasma units (preferred)
    // width: units.gridUnit * 20
    // height: units.gridUnit * 30

    width: 400
    height: 600

    // Layout.minimumWidth: 400
    // Layout.minimumHeight: 600
    // Layout.preferredWidth: 400
    // Layout.preferredHeight: 600

    property string responseText: "Fetching fissures..."

    function fetchFissures() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Prettify the JSON for easier reading as plaintext
                    try {
                        let data = JSON.parse(xhr.responseText);
                        responseText = JSON.stringify(data, null, 4);
                    } catch (e) {
                        responseText = xhr.responseText;
                    }
                } else {
                    responseText = "Error: " + xhr.status + "\n" + xhr.responseText;
                }
            }
        }
        xhr.open("GET", "http://localhost:8000/fissures");
        xhr.send();
    }

    // Fetch data when the widget is loaded
    Component.onCompleted: fetchFissures()

    // Refresh every 60 seconds
    Timer {
        interval: 1000
        running: true
        repeat: true
        onTriggered: fetchFissures()
    }

    // ScrollView allows you to see the full output if it exceeds widget size
    PlasmaComponents.ScrollView {
        anchors.fill: parent
        
        PlasmaComponents.Label {
            text: root.responseText
            font.family: "monospace"
            wrapMode: Text.NoWrap
        }
    }
}
