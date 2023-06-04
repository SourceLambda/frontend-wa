// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from 'uuid'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_API_KEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MSGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)

export function imageReference(file) {
	const uuidName = v4()
	const fileType = file.type.split('/')[1]
	
	const imageRef = ref(storage, `images/${uuidName}.${fileType}`)
	return imageRef
}

export function imageNameReference (filename) {
	const imageRef = ref(storage, filename)
	return imageRef
}

export async function uploadFile(file, imageRef) {

	try {
		await uploadBytes(imageRef, file)
		return await getDownloadURL(imageRef)
	}
	catch (err) {
		return err
	}
}

export async function deleteFile(imageRef) {
	const deleteRes = await deleteObject(imageRef)
	return deleteRes
}
