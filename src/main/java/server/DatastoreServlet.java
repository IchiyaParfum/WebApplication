package server;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;

@WebServlet(
    name = "DatastoreServlet",
    urlPatterns = {"/Datastore"}
)
public class DatastoreServlet extends HttpServlet {
	private DatastoreManager ds;
	private Json2CsvConverter json2csv;
	
	public DatastoreServlet() {
		ds = DatastoreManager.getInstance();
		json2csv = new Json2CsvConverter();
	}
	
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
	  setAccessControlHeaders(response);
	  String responseString = getResponseContent(request, response);
	  setResponseContent(response, responseString, HttpServletResponse.SC_OK);
  }
  
  private String getResponseContent(HttpServletRequest request, HttpServletResponse response){
	  	String requestedId = request.getParameter("id");
	  	String requestedRes = request.getParameter("res");
  		
	  	return getContent(request, response, requestedId, requestedRes);	
	}
  
 
  	private String getContent(HttpServletRequest request, HttpServletResponse response, String id, String res) {
  		String format = new String();
  		if(res != null) {
	  		response.setHeader("Content-disposition","attachment; filename="+ res);
	  		format = res.substring(res.lastIndexOf('.'));	//File ending
	  	}
  		if(format.equals(".csv")) {
  			return json2csv.toCsv(queryJson(id));
  		}else{
  			Gson gson = new GsonBuilder().setPrettyPrinting().create();
  			return gson.toJson(queryJson(id));
  		} 		
  	}
  	
  	private JsonArray queryJson(String id){
		if(id == null) {
			//Return sensors
			return ds.queryGSon();
		}
		//Return sensor data
		return ds.queryGSon(id);
  	}
	
	private void setResponseContent(HttpServletResponse response, String content, int status) throws IOException {
		response.setStatus(status);
		response.getWriter().write(content);
	}
		
  @Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
	  InputStreamReader is = new InputStreamReader(req.getInputStream());
	  BufferedReader br = new BufferedReader(is);

	  String line = new String();
	  String msg = new String();
	  
	  while((line = br.readLine()) != null) {
		  msg = msg + line;
	  }
	  ds.storeGSon(msg);
	}
  
  private void setAccessControlHeaders(HttpServletResponse resp) {
		resp.setHeader("Access-Control-Allow-Origin", "*");
		resp.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS, HEAD");
		resp.setHeader("Access-Control-Allow-Credentials", "true");
		resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");
}
}