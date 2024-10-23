import {getDownloadURL, getStorage, ref, uploadString} from "firebase/storage";

export class ImageUtils {

  public static  getImageUrl(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${imageFile.name}`);
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string; // Get the data URL
          await uploadString(storageRef, dataUrl, 'data_url'); // Upload the image
          const downloadURL = await getDownloadURL(storageRef); // Get the download URL
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error); // Handle FileReader error
      reader.readAsDataURL(imageFile); // Read the file as a data URL
    });
  }
}
