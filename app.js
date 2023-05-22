const fs = require('fs');
const readline = require('readline');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const inputFilePath = 'path/to/1tb/file.txt'; 
const outputFilePath = 'path/to/sorted/file.txt'; 
const availableRAM = 500 * 1024 * 1024; // Available RAM in bytes (500MB)

async function externalMergeSort(inputFilePath, outputFilePath, availableRAM) {
  // Step 1: Split the input file into smaller chunks
  const chunkPaths = await splitFile(inputFilePath, availableRAM);

  // Step 2: Sort each chunk individually
  const sortedChunks = await sortChunks(chunkPaths);

  // Step 3: Merge the sorted chunks
  await mergeChunks(sortedChunks, outputFilePath);

  console.log('File sorted successfully.');
}

async function splitFile(inputFilePath, chunkSize) {
  const readStream = fs.createReadStream(inputFilePath, { highWaterMark: chunkSize });
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  let lineCount = 0;
  let chunkIndex = 0;
  let currentChunk = [];
  const chunkPaths = [];

  for await (const line of rl) {
    currentChunk.push(line);
    lineCount++;

    if (lineCount >= 100000) { // Adjust the line count threshold as needed
      const chunkPath = `chunk_${chunkIndex}.txt`;
      await writeFileAsync(chunkPath, currentChunk.join('\n'));
      chunkPaths.push(chunkPath);

      lineCount = 0;
      chunkIndex++;
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    const chunkPath = `chunk_${chunkIndex}.txt`;
    await writeFileAsync(chunkPath, currentChunk.join('\n'));
    chunkPaths.push(chunkPath);
  }

  return chunkPaths;
}

async function sortChunks(chunkPaths) {
  const sortedChunks = [];

  for (const chunkPath of chunkPaths) {
    const lines = await readFileAsync(chunkPath, 'utf8');
    const sortedLines = lines.trim().split('\n').sort();
    const sortedChunkPath = `sorted_${chunkPath}`;
    await writeFileAsync(sortedChunkPath, sortedLines.join('\n'));
    sortedChunks.push(sortedChunkPath);
  }

  return sortedChunks;
}

async function mergeChunks(sortedChunks, outputFilePath) {
  const readStreams = sortedChunks.map(chunkPath => fs.createReadStream(chunkPath, { encoding: 'utf8' }));
  const writeStream = fs.createWriteStream(outputFilePath, { encoding: 'utf8' });

  const mergedStream = readline.createInterface({
    input: require('stream').Readable.from(readStreams).pipe(require('event-stream').concat()),
    crlfDelay: Infinity,
  });

  for await (const line of mergedStream) {
    writeStream.write(line + '\n');
  }

  writeStream.end();

  // Clean up temporary files
  for (const chunkPath of sortedChunks) {
    fs.unlinkSync(chunkPath);
  }
}

externalMergeSort(inputFilePath, outputFilePath, availableRAM);
