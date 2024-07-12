import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

export enum BlobType {
  burn,
  camp,
  event,
}

export function PresignedUrl(
  file: File,
  year: string,
  burnName: string,
  type: BlobType,
) {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

  if (!accountName || !accountKey)
    throw new Error("Azure Storage account name and key must be provided");

  const key = new StorageSharedKeyCredential(accountName, accountKey);

  // * This URL will be valid for 30 minutes
  const expDate = new Date(new Date().valueOf() + 1800 * 1000);

  // * Generate a unique file name
  const fileNameSplit = file.name.split(".");
  const fileName = fileNameSplit[0] + "-" + uuidv4() + fileNameSplit[1];
  const blobName = `${burnName}/${type}/${fileName}`;

  // * Set permissions to read, write, and create to write back to Azure Blob storage
  const containerSAS = generateBlobSASQueryParameters(
    {
      containerName: year,
      permissions: BlobSASPermissions.parse("racwdl"),
      expiresOn: expDate,
    },
    key,
  ).toString();

  // * Generate a SAS URL for the blob
  const SaSURL = `https://${accountName}.blob.core.windows.net/${year}/${blobName}?${containerSAS}`;
  console.log(`SAS URL for blob is: ${SaSURL}`);

  return SaSURL;
}

// export async function Download(
//   file: any,
//   year: string,
//   burnName: string,
//   type: BlobType,
// ) {
//   const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
//   const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

//   if (!accountName || !accountKey)
//     throw new Error("Azure Storage account name and key must be provided");

//   const blobServiceClient = new BlobServiceClient(
//     `https://${accountName}.blob.core.windows.net`,
//     new StorageSharedKeyCredential(accountName, accountKey),
//   );
//   const containerClient = blobServiceClient.getContainerClient(year);
//   const createContainerResponse = await containerClient.createIfNotExists();

//   const blobName = "quickstart" + uuidv4() + ".txt";
//   // Get a block blob client
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//   // * Display blob name and url
//   console.log(
//     `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`,
//   );

//   const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
//   console.log(
//     `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`,
//   );
// }
