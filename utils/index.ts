import { Platform } from 'react-native';
import {
  ExternalCachesDirectoryPath,
  MainBundlePath,
  copyFileAssets,
  exists,
  mkdir,
} from 'react-native-fs';



export async function getAbsolutePath(fileName: string): Promise<string> {
  if (Platform.OS === 'android') {
    // If already an absolute path, return as-is
    if (fileName.startsWith('/')) {
      return fileName;
    }
    
    const destPath = `${ExternalCachesDirectoryPath}/${fileName}`;
    
    try {
      if (!(await exists(destPath))) {
        // Ensure directory exists for nested paths
        const dirPath = destPath.substring(0, destPath.lastIndexOf('/'));
        if (!(await exists(dirPath))) {
          await mkdir(dirPath);
        }
        
        console.log(`Copying asset: ${fileName} to ${destPath}`);
        await copyFileAssets(fileName, destPath);
        console.log(`Successfully copied: ${fileName}`);
      } else {
        console.log(`Asset already exists: ${destPath}`);
      }
      return destPath;
    } catch (error) {
      console.error(`Failed to copy asset ${fileName}:`, error);
      throw error;
    }
  }
  return `${MainBundlePath}/${fileName}`;
}