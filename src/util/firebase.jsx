// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from 'uuid'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_API_KEY || "AIzaSyCiaOOXpNXb2tKwNB8KvQSwHblIcIiR3GY",
	authDomain: import.meta.env.VITE_AUTH_DOMAIN || "sourcelambda-post-st-e89b8.firebaseapp.com",
	projectId: import.meta.env.VITE_PROJECT_ID || "sourcelambda-post-st-e89b8",
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET || "sourcelambda-post-st-e89b8.appspot.com",
	messagingSenderId: import.meta.env.VITE_MSGING_SENDER_ID || "426549858423",
	appId: import.meta.env.VITE_APP_ID || "1:426549858423:web:23ff5bc10d84ff4b6b7672"
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
