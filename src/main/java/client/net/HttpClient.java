package client.net;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class HttpClient {

	private boolean connected = false;
	private URL httpURL;
	private HttpURLConnection con;
	
	public HttpClient(String destURL) throws MalformedURLException {
		httpURL = new URL(destURL);
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
			
			disconnect();
			connect();
			return (responseCode == HttpURLConnection.HTTP_OK) ;
		}
		return false;
	}
	
	public void connect() throws IOException {
		if(!connected) {
			con = (HttpURLConnection)httpURL.openConnection();	
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
