package servlets;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Created by Isa on 26.09.2015.
 */
public class Rules2 extends HttpServlet {
    private DB db;

    public Rules2() {
        db = new DB();
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) {
        try (PrintWriter out = res.getWriter()) {
            res.setContentType("text/html; charset=UTF-8");
            res.setCharacterEncoding("UTF-8");
            String action = req.getParameter("action");
            if(action.equals("getcategories")) {
                String category = req.getParameter("category");

                Statement stmt = db.connection.createStatement();
                ResultSet rs = stmt.executeQuery("select * from alcora.categories where description like '%" + category + "%';");
                String answer = "{ \"list\": [";
                int n = 0;
                while (rs.next()) {
                    n++;
                    String id = rs.getString("id"),
                            description = rs.getString("description");
                    answer += "{ " +
                            "\"id\": \"" + id + "\", " +
                            "\"description\": \"" + description + "\" " +
                            " },";
                }
                answer = answer.substring(0, answer.length() - 1);
                answer += "]}";
                out.println(n > 0 ? answer : "{ \"list\": \"empty\" }");
            }
            if(action.equals("getoperations")) {
                Statement stmt = db.connection.createStatement();
                ResultSet rs = stmt.executeQuery("select * from alcora.operations");
                String answer = "{ \"list\": [";
                int n = 0;
                while (rs.next()) {
                    n++;
                    String id = rs.getString("id"),
                            description = rs.getString("description"),
                            type = rs.getString("type");
                    answer += "{ " +
                            "\"id\": \"" + id + "\", " +
                            "\"description\": \"" + description + "\", " +
                            "\"type\": \"" + type + "\" " +
                            " },";
                }
                answer = answer.substring(0, answer.length() - 1);
                answer += "]}";
                System.out.println("answer: " + answer);
                out.println(n > 0 ? answer : "{ \"list\": \"empty\" }");
            }
        } catch (SQLException | IOException e) {
            e.printStackTrace();
        }
    }
}
