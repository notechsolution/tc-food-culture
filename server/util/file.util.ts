import glob from 'glob';
import path from 'path';

export default class FileUtils {
  // target class must be defined in ES6, and export the class as default
  static loadClassesFromFiles(fileNamePattern: string) {
    const files = glob.sync(fileNamePattern);
    const loadedClasses = [];
    files.forEach((file: string) => {
      const loadedClass = require(path.resolve(process.cwd(), file));
      loadedClasses.push(loadedClass.default);
    });
    console.log(`loading files: ${JSON.stringify(files)}`);
    return loadedClasses;
  }

  static loadModelsFromFiles(fileNamePattern: string) {
    const files = glob.sync(fileNamePattern);
    const loadedClasses = [];
    files.forEach((file: string) => {
      const model = require(path.resolve(process.cwd(), file));
      if(model.name && model.schema){
        loadedClasses.push({
          name: model.name,
          schema: model.schema
        });
      }
    });
    console.log(`loading files: ${JSON.stringify(files)}`);
    return loadedClasses;
  }
}