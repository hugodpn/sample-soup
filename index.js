const fs = require('fs');
const readline = require('readline');

const invertWrod = word => word.split("").reverse().join("");
const countWord = (sentence, word) => (sentence.match(new RegExp(word, "g")) || []).length;
const countWordInSentences = (word, sentences) => sentences.map(s => countWord(s, word)).reduce((a, b) => a + b, 0)

const diagonal = (array, bottomToTop, wordLength) => {
    const Ylength = array.length;
    const Xlength = array[0].length;
    const maxLength = Math.max(Xlength, Ylength);
    let temp;
    const returnArray = [];
    for (let k = 0; k <= 2 * (maxLength - 1); ++k) {
        temp = [];
        for (let y = Ylength - 1; y >= 0; --y) {
            const x = k - (bottomToTop ? Ylength - y : y);
            if (x >= 0 && x < Xlength) {
                temp.push(array[y][x]);
            }
        }
        if(temp.length > 0 && temp.length >= wordLength) {
            returnArray.push(temp.join(''));
        }
    }
    return returnArray;
}

const horizontal = (arr, wordLength) => arr[0].length >= wordLength ? arr : [];
const vertical = (arr, wordLength) => {
    if(arr.length < wordLength) return [];
    const tmp = [];
    for(let i=0,_lenX=arr[0].length; i<_lenX; i++) {
        let v = '';
        for(let j=0,_lenY=arr.length; j<_lenY; j++) {
            v += arr[j].charAt(i);
        }
        tmp.push(v);
    }
    return tmp;
}

const checkWord = (arr, word) => {
    let result = countWordInSentences(word, arr);
    result += countWordInSentences(invertWrod(word), arr);
    return result;
}

const soupCount = (matrix, word) => {
    let result = 0;
    let toCount = diagonal(matrix, false, word.length);
    result += checkWord(toCount, word);
    toCount = diagonal(matrix, true, word.length);
    result += checkWord(toCount, word);
    toCount = horizontal(matrix, word.length);
    result += checkWord(toCount, word);
    toCount = vertical(matrix, word.length);
    result += checkWord(toCount, word);
    return result;
}

const soupApp = (dataset, word) => {
    dataset.forEach(dataset => console.info(soupCount(dataset, word)));
};

// const WORD = "OIE";

// const arr1 = ["OIE", "IIX", "EXE"];
// const arr2 = ["EIOIEIOEIO"];
// const arr3 = ["EAEAE", "AIIIA", "EIOIE", "AIIIA", "EAEAE"];
// const arr4 = ["OX", "IO", "EX", "II", "OX", "IE", "EX"];
// const arr5 = ["E"];

// const DATASET = [arr1, arr2, arr3, arr4, arr5];
// soupApp(DATASET, WORD);

const app = async () => {
    
    console.info("Starting search word in soup");
    const word = process.argv[2];
    console.info(`Word to search: ${word}`);
    const fileName = process.argv[3];
    console.info(`Read dataset from [${fileName}] file.`)
    try {
        const fileStream = fs.createReadStream(fileName);

        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity
        });
        
        const dataset = [];
        for await (const line of rl) {
          dataset.push(line.split(","));
        }    

        soupApp(dataset, word);
    } catch (error) {
        console.error(error);
    }
}

app();