import { parse } from 'node-html-parser';
import fs from 'fs';
import path from 'path';

async function createFile(sourcePath: string, content: string | undefined) {

    const filePath = sourcePath.replace("/archive/", "/extracted-content/")

    const directoryPath = path.dirname(filePath);
    console.log(directoryPath);
    fs.mkdir(directoryPath, { recursive: true }, (err) => {});

    if (content) {
        fs.writeFile(filePath, `${content}`, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }

            console.log(`wrote ${filePath}`)
        });
    } else {
        console.error("no content");
    }
}

function parseFile(file: string) {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const root = parse(data);

        const content = root.querySelector('#main_block')?.toString();
        console.log(content);

        createFile(file, content);
    });
}

function parseDirectory(basePath: string) {
    fs.readdir(basePath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach((file: any) => {
            // You can now do something with each file, e.g., print its name
            const filePath = `${basePath}/${file}`;
            // console.log(filePath);

            // To get more details (e.g., if it's a file or a directory), use fs.stat
            fs.stat(filePath, (statErr, stats) => {
                if (statErr) {
                    console.error('Error getting file stats:', statErr);
                    return;
                }
                if (stats.isFile()) {
                    console.log(`${filePath} is a file.`);
                    parseFile(filePath);
                } else if (stats.isDirectory()) {
                    console.log(`${filePath} is a directory.`);
                    parseDirectory(filePath);
                }
            });
        });
    });
}
// const file = './archive/history/history-of-wwe-tag-title.html';
// parseFile(file);

const basePath = "./archive";
parseDirectory(basePath);
