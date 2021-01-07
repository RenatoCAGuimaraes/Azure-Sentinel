import fs from "fs";
import { xml2js } from 'xml-js';
import { runCheckOverChangedFiles } from "./utils/changedFilesValidator";
import { ExitCode } from "./utils/exitCode";
import * as logger from "./utils/logger";
import { isValidLogoImage } from "./utils/LogoChecker/logoImageChecker";
import { isValidLogoImageSVGContent } from "./utils/LogoChecker/logoImageSVGChecker";
export async function IsValidLogo(FileName: string): Promise<ExitCode> {
    
  isValidLogoImage(FileName);
    const svgContent: string = fs.readFileSync(FileName, { encoding: "utf8", flag: "r" });
    console.log(svgContent)
    const object:Response = xml2js(svgContent) as Response;
    console.log(object)
    if(svgContent != "undefined")
    {
      isValidLogoImageSVGContent(svgContent)
    }
    return ExitCode.SUCCESS;
  }
   let fileTypeSuffixes = ["*.svg"];
let filePathFolderPrefixes = ["logo"];

let fileKinds = ["Modified"];
let CheckOptions = {
  onCheckFile: (filePath: string) => {
    return IsValidLogo(filePath);
  },
  onExecError: async (e: any, filePath: string) => {
    console.log(`Logo Validation Failed. File path: ${filePath}. Error message: ${e.message}`);
  },
  onFinalFailed: async () => {
    logger.logError("An error occurred, please open an issue");
  },
};

runCheckOverChangedFiles(CheckOptions, fileKinds, fileTypeSuffixes, filePathFolderPrefixes);