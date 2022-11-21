import * as React from "react";
import {useLocation} from "react-router";
import {useState} from "react";
import Cookies from "universal-cookie";
import './Results.css';
import ImageGallery from "react-image-gallery";
import {extractImageSource} from "../components/util";
import Button from '@mui/material/Button';
import {ThemeProvider} from "@mui/material";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import {darkTheme} from "../components/themes";


function Results() {
    const cookies = new Cookies();
    const {state} = useLocation(); //stores information from previous page
    const [images,] = useState(state.response.images ?? cookies.get('automatedclassification-session-images'));

    // Takes image's data and remaps it into an array based on the pieces of data we want in the CSV
    function remapImageData(data) {

        let remappedData = [];

        // currently don't get the passed in labels for each region, so the regions in the csv are just numbered
        for (let i = 0; i < data.className.length; i++) {

            for (let j = 0; j < data.className[i].length; j++) {
                let cur = data.className[i][j];

                // if you change the headers being used (variable in generateRawCSV), this line also needs to be changed
                remappedData.push([data.imageName, i, cur.x, cur.y,
                    cur.area, cur.minAngleDegrees, cur.maxAngleDegrees, cur.minDiameter,cur.maxDiameter]);
            }
        }

        return remappedData;
    }

// organizes all the data into a string to prepare for exporting
    function generateRawCsv(headers, data) {
        let csvFile = '';

        // add the headers to the top of the file, with a new line
        csvFile += headers.join(',') + "\n\n";

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                csvFile += data[i][j].join(',') + "\n";
            }
        }
        return csvFile;
    }


    function downloadCSV(filename, unprocessedData) {
        // These are the headers for the csv
        // currently all of them are here and in order based on what the images array returns
        // should be: ["imageName", "className", "x", "y", "area", "minAngle", "maxAngle", "minDiameter", "maxDiameter"]
        let headers = [];


        headers = headers.concat(Object.keys(unprocessedData[0]));
        headers = headers.concat(Object.keys(unprocessedData[0].className[0][0]));

        // console.log(headers);

        let data = unprocessedData.map(imageData => remapImageData(imageData));
        let fileString = generateRawCsv(headers, data);

        // create a hidden element to easily download the file
        let hiddenElement = document.createElement("a");

        hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(fileString);
        hiddenElement.target = "_blank";
        hiddenElement.download = filename + ".csv";

        hiddenElement.click();
        alert("CSV File Downloaded Successfully");
    }

    async function processRequest() {
            await axios.get(`${apiUrlSelect()}/api/v1/getCSV`, processAspects).then((resp) => {
                console.log(resp.body);
            });
    }


    return (
        <body>
            <ThemeProvider theme={darkTheme}>
                <ResponsiveAppBar>
                </ResponsiveAppBar>
            </ThemeProvider>
            <div id="root" className="results-container">
            </div>
            <ImageGallery items={images.map((item) => {
                const imageSource = extractImageSource(item.imageName)
            return {
                original: imageSource,
                description: item.imageName,
                thumbnail: imageSource,
                }
            })} showBullets={true}
            />
            <section className="results">
                <h1 className="results-border">
                    <Button
                        style={{
                            borderRadius: 35,
                            backgroundColor: "#FFFFFF",
                            color: "#282424",
                            padding: "18px 36px",
                            fontSize: "18px"
                        }}
                        type="Submit"
                        variant="contained"
                        onClick={() => downloadCSV("resultssssss", images)}
                        >
                        Export CSV
                    </Button>
                    <Button
                        style={{
                            borderRadius: 35,
                            backgroundColor: "#FFFFFF",
                            color: "#282424",
                            padding: "18px 36px",
                            fontSize: "18px"
                        }}
                        onClick={() => processRequest()}
                        >
                        Export CSV
                    </Button>
                </h1>
            </section>
        </body>
    )
}

export default Results;

