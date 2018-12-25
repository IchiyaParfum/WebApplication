package client.net;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

public class HttpsClient {

	private boolean connected = false;
	private URL httpsURL;
	private HttpsURLConnection con;
	
	public HttpsClient(String destURL) throws MalformedURLException {
		httpsURL = new URL(destURL);
	}
	
	public boolean post(String data) throws IOException {
		if(isConnected()) {
			con.setRequestMethod("POST");

			// For POST only - START
			con.setDoOutput(true);
			OutputStream os = con.getOutputStream();
			os.write(data.getBytes());
			os.flush();
			os.close();
			// For POST only - END

			int responseCode = con.getResponseCode();
			printResponse();
			return (responseCode == HttpURLConnection.HTTP_OK);
		}
		return false;
	}
	public void printResponse() {
		try {
			BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String line = new String();
			while((line = br.readLine()) != null) {
				System.out.println(line);
			}
			con.getInputStream().close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void connect() throws IOException {
		if(!connected) {
			con = (HttpsURLConnection)httpsURL.openConnection();	
			connected = true;
		}
			
	}
	
	public void disconnect() {
		if(connected || con != null) {
			con.disconnect();
			connected = false;
		}
	}
	
	public boolean isConnected() {
		return connected;
	}
	
}
