import QtQuick
import QtQuick.Layouts
import org.kde.plasma.core as PlasmaCore
import org.kde.plasma.components as PlasmaComponents
import org.kde.plasma.plasmoid
import org.kde.kirigami as Kirigami

PlasmoidItem {
    id: root

    property string responseText: "Fetching fissures..."

    function fetchFissures() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
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

    Component.onCompleted: fetchFissures()

    Timer {
        interval: 1000
        running: true
        repeat: true
        onTriggered: fetchFissures()
    }

    // Always display the compact view on panels/desktop.
    // Click to expand the fullRepresentation (the popup).
    preferredRepresentation: compactRepresentation

    compactRepresentation: PlasmaComponents.ToolButton {
        icon.name: "games-hint"
        onClicked: root.expanded = !root.expanded
    }

    fullRepresentation: Item {
        Layout.minimumWidth: Kirigami.Units.gridUnit * 20
        Layout.minimumHeight: Kirigami.Units.gridUnit * 30
        Layout.preferredWidth: 640
        Layout.preferredHeight: 480

        ColumnLayout {
            anchors.fill: parent
            spacing: Kirigami.Units.smallSpacing

            PlasmaComponents.Label {
                id: titleLabel
                Layout.fillWidth: true
                text: "Warframe Widget"
                horizontalAlignment: Text.AlignHCenter
                font.weight: Font.Bold
                padding: Kirigami.Units.mediumSpacing
            }

            PlasmaComponents.ScrollView {
                Layout.fillWidth: true
                Layout.fillHeight: true
                
                PlasmaComponents.Label {
                    text: root.responseText
                    font.family: "monospace"
                    wrapMode: Text.NoWrap
                    padding: Kirigami.Units.largeSpacing
                }
            }
        }
    }
}
