import { Storage } from 'aws-amplify';

export default async function getS3Bucket() {
  let returnPath;
  try {
    const wholePath = await Storage.get('');
    returnPath = wholePath.split('public/')[0];
  } catch (error) {
    console.log('Error in getS3Bucket', error);
  }
  return returnPath;
}
