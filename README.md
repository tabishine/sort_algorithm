# sort_algorithm
# External Merge Sort

This program performs an external merge sort on a large file consisting of lines on a machine with limited RAM.

## Requirements

- Node.js

## Usage

1. Clone the repository or download the source code files.

2. Install dependencies by running the following command in the terminal:


3. Open the `index.js` file in a text editor.

4. Modify the `inputFilePath` variable to specify the path to your 1 TB file.

5. Modify the `outputFilePath` variable to specify the desired output file path.

6. Adjust the `availableRAM` variable if you have a different amount of available RAM (default is 500MB).

7. Save the changes.

8. Run the program by executing the following command in the terminal:


The program will start sorting the file using an external merge sort algorithm.

9. Once the sorting is complete, the sorted content will be stored in the specified output file path.

## Notes

- Make sure you have sufficient disk space to store the temporary chunk files and the final sorted file.

- The program splits the input file into smaller chunks, sorts each chunk individually, and then merges the sorted chunks into a single sorted file.

- The line count threshold for each chunk can be adjusted in the `splitFile` function in the `index.js` file.

- Temporary chunk files are created during the sorting process and are automatically cleaned up after the sorting is complete.

- If you encounter any issues or errors, please make sure you have provided the correct file paths and have enough available RAM and disk space.

- This program is optimized for sorting text files where each line represents an entry to be sorted. If your file has a different structure or format, you may need to modify the code accordingly.


