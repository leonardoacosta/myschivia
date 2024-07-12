import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

export enum BlobType {
  burn,
  camp,
  event,
}

export function PresignedUrl(
  year: string,
  burnName: string,
  filename: string,
  type: BlobType,
) {
  const accountKey = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!accountKey)
    throw new Error("Azure Storage account name and key must be provided");

  // const key = new StorageSharedKeyCredential(accountName, accountKey);

  // // * This URL will be valid for 30 minutes
  // const expDate = new Date(new Date().valueOf() + 1800 * 1000);

  // // * Generate a unique file name
  // const fileNameSplit = filename.split(".");
  // const fileName = fileNameSplit[0] + "-" + uuidv4() + fileNameSplit[1];
  // const blobName = `${burnName}/${type}/${fileName}`;

  // // * Set permissions to read, write, and create to write back to Azure Blob storage
  // const containerSAS = generateBlobSASQueryParameters(
  //   {
  //     containerName: year,
  //     permissions: BlobSASPermissions.parse("racwdl"),
  //     expiresOn: expDate,
  //   },
  //   key,
  // ).toString();

  // // * Generate a SAS URL for the blob
  // const SaSURL = `https://${accountName}.blob.core.windows.net/${year}/${blobName}?${containerSAS}`;
  // console.log(`SAS URL for blob is: ${SaSURL}`);

  return "SaSURL";
}

export async function download(year: string, fileName: string) {
  try {
    const accountKey = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!accountKey)
      throw new Error("Azure Storage account name and key must be provided");

    // * Download from azure
    // const blobServiceClient =
    //   BlobServiceClient.fromConnectionString(accountKey);
    // const containerClient = blobServiceClient.getContainerClient(year);
    // const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    // return await blockBlobClient.downloadToBuffer();
    return {};
  } catch (error) {
    console.log("Error downloading file from azure", error);
  }
}
