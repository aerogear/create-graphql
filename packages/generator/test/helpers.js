import fs from 'fs';

/**
 * Get the content of a file
 * @param path {string} The path of the file
 * @returns {string} The content of the file
 */
export const getFileContent = path => fs.readFileSync(path, 'utf8');
