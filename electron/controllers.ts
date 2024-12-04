import { app } from 'electron';
import path, { sep } from 'path';
import fs from 'fs/promises';


// Запись данных в БД  
export async function writeUsersDataFs(data: any, filename: string): Promise<void> {
    try {
        const userDataDir = app.getPath('userData');
        const filePath = path.join(userDataDir, filename);
        return void await fs.writeFile(filePath, JSON.stringify(data), { encoding: 'utf-8' });
    } catch (err) {
        console.error(err);
        throw err;
    }
}


function check(pattern: string, value: string) {
    const correctPattern = pattern.split(' ').join('').toLowerCase();
    if(correctPattern === '*') {
        return true;
    }
    if(correctPattern === 'num') {
        let typeC = +value;
        if(typeC && typeC === typeC) {
            return true; 
        }
        return false;
    }
    else {
        return pattern === value
    }
}
function computeLengthStr(str: string) {
    if(str.split(' ').join('').toLowerCase() === 'num') return 1;
    return str.length;
}

export async function readFileC(file: string, separator: any) {
    
    try {
        const [startSep, endSep] = separator.split(',').map((el: string) => el.trim());
        if(!startSep || !endSep) return file.split('\n');
        return file.split('\n').filter((chunk: string) => {
            const correctChunk = chunk.split(' ').join('')
            let startChar = correctChunk.slice(0, computeLengthStr(startSep));
            let endChar = correctChunk.slice(correctChunk.length-computeLengthStr(endSep));
            if(check(startSep, startChar) && check(endSep, endChar)) {
                return true
            } else return false;
        });
    } catch (err) {
        console.error(err);
        throw err;
    }    
}