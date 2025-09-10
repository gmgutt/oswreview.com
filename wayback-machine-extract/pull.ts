import fs from 'fs';
import path from 'path';

async function saveFile(url: string, filePath: string) {

    const response = await fetch(url);
    if (!response.ok) {
        //throw new Error(`Response status: ${response.status}`);
        console.log(`Response status: ${response.status} for ${url}`);
    }

    const directoryPath = path.dirname(filePath);
    console.log(directoryPath);
    fs.mkdir(directoryPath, { recursive: true }, (err) => {});

    // making file end in .html
    fs.writeFile(`${filePath}.html`, await response.text(), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
    });
}

async function getData() {

    console.log("yo");

    const url = "https://web.archive.org/cdx/search/cdx?url=oswreview.com&matchType=host&limit=100000&output=json";
    try {

    //   await saveFile(url, 'myFile.txt');
  
      let result;
      fs.readFile('myFile.txt', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }
        
        process(JSON.parse(data));
      });

    } catch (error) {
      console.error(error.message);
    }
}

getData();

async function process(result: any) {
    var pages = new Map();

    for (let index = 0; index < result.length; index++) {
        const element: string = result[index];

        if (!element[0].includes("oswreview)/?hid=")) {
            const id = `${element[0]}|${element[3]}`;
            let latest = element;
            if (pages.has(id)) {
                latest = pages.get(id);
                latest = latest[1] > element[1] ? latest : element;
            }

            pages.set(id, latest);
        }
    }

    for (const page of pages) {
        
        const key = page[0];
        const value = page[1];

        if (key.includes("text/html") 
            // && key.includes("/wwe-t")
        ) {
            let url = key.replace("com,oswreview)", `https://web.archive.org/web/${value[1]}/http://oswreview.com`).replace("|text/html","");
            let filePath = key.replace("com,oswreview)","").replace("|text/html","");
            filePath = `./archive${filePath}`;

            console.log(`${url} ${filePath}`);
            await saveFile(url, filePath);
        }
        
    }

    // pages.forEach(async (value, key : string, map) => { 
    //     if (key.includes("text/html") 
    //         && key.includes("wwe-valentines")
    //     ) {
    //         let url = key.replace("com,oswreview)", `https://web.archive.org/web/${value[1]}/http://oswreview.com`).replace("|text/html","");
    //         let filePath = key.replace("com,oswreview)","").replace("|text/html","");
    //         filePath = `./archive${filePath}`;

    //         console.log(`${url} ${filePath}`);
    //         await saveFile(url, filePath);
    //     }
    // });

    console.log(pages.size);
}

//https://web.archive.org/web/20230328102355/http://oswreview.com/episodes/
