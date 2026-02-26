// Quick Firebase connection test
require('dotenv').config();
const admin = require('firebase-admin');

console.log('Testing Firebase connection...');
console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });

  const firestore = admin.firestore();

  // Set a short timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Firestore query timed out after 5s')), 5000)
  );

  const queryPromise = firestore.collection('users').limit(1).get();

  Promise.race([queryPromise, timeoutPromise])
    .then((snapshot) => {
      console.log('✅ Firebase connected successfully!');
      console.log('Users count:', snapshot.size);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Firebase connection failed:', error.message);
      process.exit(1);
    });
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  process.exit(1);
}
