import { connect } from "mongoose";
import path from "node:path";

export const initMongodb = async (uri: string): Promise<number | null> => {
  try {
    const enableTls = uri.includes("mongodb://fp:");

    const { connection } = await connect(uri, {
      dbName: "bmp-punks-sepolia",
      retryWrites: false,
      connectTimeoutMS: 5000,
      ...(enableTls
        ? {
            tls: true,
            tlsCAFile: path.join(__dirname, "../../global-bundle.pem"),
            tlsAllowInvalidCertificates: true,
            tlsAllowInvalidHostnames: true,
            directConnection: true,
          }
        : {}),
    });

    return connection.readyState;
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    return null;
  }
};
