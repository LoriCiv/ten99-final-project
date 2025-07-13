import * as functions from "firebase-functions";

interface ShareRequestData {
  recipientEmail: string;
  fileData: {
    title: string;
    sharedNotes: string;
  };
}

export const shareJobFile = functions.https.onCall(
  async (data: ShareRequestData, context) => {
    // This check confirms to TypeScript that context.auth exists.
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
      );
    }

    // Assigning the auth object to a new constant also helps TypeScript.
    const auth = context.auth;
    const { recipientEmail, fileData } = data;

    functions.logger.info(`User ${auth.uid} is sharing a file.`);
    functions.logger.info(`Recipient Email: ${recipientEmail}`);
    functions.logger.info("File Data:", fileData);

    return {
      success: true,
      message: `File has been successfully shared with ${recipientEmail}`,
    };
  },
);