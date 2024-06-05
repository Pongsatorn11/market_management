import RNFetchBlob from 'rn-fetch-blob';
import {URL_SERVER} from '../constant';

export const downloadFile = async (
  path: string,
  filename: string = `${Date.now()}.pdf`,
) => {
  try {
    const url = `${URL_SERVER}/uploads?file=${path}`;
    await RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: filename,
        description: 'Downloading file',
        path: RNFetchBlob.fs.dirs.DownloadDir + `/${filename}`,
      },
    }).fetch('GET', url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};
